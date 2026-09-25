import fs from "fs";
import path from "path";
import knex from "../knex";
import logger from "../utils/logger";
import { PUBLIC_DIR } from "../utils/assetPaths";
import {
    buildGridFromRows,
    interpolateGridToRgba,
    computeAlpsMaskGrid,
    saveRgbaAsWebp,
    writeWeatherFile,
    formatDayLabel,
    cleanupOldWeatherOverlays,
    GRID_CONFIG,
    WeatherDay,
    WeatherMetadata,
    WeatherRow,
} from "../utils/weatherOverlayService";

export interface SyncWeatherOverlayOptions {
    wait?: boolean;
    intervalMs?: number;
    timeoutMs?: number;
    weatherDir?: string;
    allDates?: boolean;
}

function getTodayString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Postgres code for "relation does not exist".
const UNDEFINED_TABLE = "42P01";

/**
 * Checks if overlay_weather_daily has the required 4 forecast days and full 32,500 rows.
 *
 * Fails fast on a missing relation; any other query error is treated as
 * "not complete yet" so the wait loop below just retries on its next interval.
 */
async function isTableFullyLoaded(
    todayStr: string,
    allDates = false,
): Promise<{
    isComplete: boolean;
    dayCount: number;
    totalRows: number;
    minDate: string;
    maxDate: string;
}> {
    let query = knex("overlay_weather_daily").select(
        knex.raw("COUNT(DISTINCT weather_date::text) as day_count"),
        knex.raw("COUNT(*) as total_rows"),
        knex.raw("MIN(weather_date::text) as min_date"),
        knex.raw("MAX(weather_date::text) as max_date"),
    );

    if (!allDates) {
        query = query.whereRaw("weather_date >= ?::date", [todayStr]);
    }

    let result;
    try {
        result = await query;
    } catch (err) {
        if ((err as { code?: string }).code === UNDEFINED_TABLE) {
            throw err;
        }
        logger.error("[WeatherOverlay] Error querying overlay_weather_daily status:", err);
        return { isComplete: false, dayCount: 0, totalRows: 0, minDate: "", maxDate: "" };
    }
    const row = result[0] || {};
    const dayCount = parseInt(row.day_count, 10) || 0;
    const totalRows = parseInt(row.total_rows, 10) || 0;
    const minDate = row.min_date ? row.min_date.slice(0, 10) : "";
    const maxDate = row.max_date ? row.max_date.slice(0, 10) : "";

    // Complete if: at least 4 days, at least 32,500 data points (4 * 8125), and min date is today or later
    const isComplete = dayCount >= 4 && totalRows >= 32500 && (allDates || minDate >= todayStr);

    return { isComplete, dayCount, totalRows, minDate, maxDate };
}

/**
 * Main job function to synchronize weather overlays:
 * 1. Immediate cleanup of expired overlays (< today)
 * 2. If wait=true, polls overlay_weather_daily until complete
 * 3. Bilinear interpolation & WebP generation
 * 4. Writes weather_metadata.json
 */
export async function syncWeatherOverlays(
    options: SyncWeatherOverlayOptions = {},
): Promise<boolean> {
    const todayStr = getTodayString();
    const weatherDir = options.weatherDir || path.join(PUBLIC_DIR, "weather");
    const intervalMs = options.intervalMs ?? 120_000; // 120 seconds default
    const timeoutMs = options.timeoutMs ?? 2 * 60 * 60 * 1000; // 2 hours default
    const wait = options.wait ?? false;
    const allDates = options.allDates ?? false;

    logger.info(`[WeatherOverlay] === START SYNC WEATHER OVERLAYS (today: ${todayStr}) ===`);

    // --- STEP 1: SOFORT-CLEANUP ---
    // "Die alten Overlays müssen sofort beim Start des Skripts gelöscht werden - unabhängig von allem anderen. Ungültig, ist ungültig."
    const deletedCount = await cleanupOldWeatherOverlays(weatherDir, todayStr);
    logger.info(
        `[WeatherOverlay] Immediate cleanup finished: ${deletedCount} expired overlay(s) removed.`,
    );

    // --- STEP 2: PRÜFUNG / WARTESCHLEIFE ---
    const startTime = Date.now();
    let initialCheck = await isTableFullyLoaded(todayStr, allDates);

    if (!initialCheck.isComplete && wait) {
        logger.info(
            `[WeatherOverlay] Table not fully loaded yet (days: ${initialCheck.dayCount}, rows: ${initialCheck.totalRows}, minDate: ${initialCheck.minDate}). Waiting (polling every ${Math.round(intervalMs / 1000)}s)...`,
        );

        while (!initialCheck.isComplete) {
            if (Date.now() - startTime >= timeoutMs) {
                logger.error(
                    `[WeatherOverlay] Timeout reached (${Math.round(timeoutMs / 60000)}m). Table overlay_weather_daily was not fully populated.`,
                );
                return false;
            }

            await new Promise((resolve) => setTimeout(resolve, intervalMs));
            initialCheck = await isTableFullyLoaded(todayStr, allDates);
            logger.info(
                `[WeatherOverlay] Polling status: days=${initialCheck.dayCount}, rows=${initialCheck.totalRows}, minDate=${initialCheck.minDate}, complete=${initialCheck.isComplete}`,
            );
        }
    }

    if (!initialCheck.isComplete && !wait) {
        logger.warn(
            `[WeatherOverlay] Table overlay_weather_daily has incomplete data (days: ${initialCheck.dayCount}, rows: ${initialCheck.totalRows}, minDate: ${initialCheck.minDate}). Proceeding with available data anyway.`,
        );
    }

    // --- STEP 3: DATEN ABFRAGEN ---
    logger.info(`[WeatherOverlay] Fetching weather rows from overlay_weather_daily...`);

    let daysQuery = knex("overlay_weather_daily")
        .select(knex.raw("DISTINCT weather_date::text as weather_date"))
        .orderBy(knex.raw("weather_date::text"), "asc")
        .limit(4);

    if (!allDates) {
        daysQuery = daysQuery.whereRaw("weather_date >= ?::date", [todayStr]);
    }

    const dayRows = await daysQuery;
    const availableDates = dayRows.map((r: { weather_date: string }) =>
        String(r.weather_date).slice(0, 10),
    );

    if (availableDates.length === 0) {
        logger.warn("[WeatherOverlay] No weather dates available to generate overlays.");
        return false;
    }

    logger.info(
        `[WeatherOverlay] Generating overlays for ${availableDates.length} date(s): ${availableDates.join(", ")}`,
    );

    const fullRows: WeatherRow[] = await knex("overlay_weather_daily")
        .select(
            knex.raw("weather_date::text as weather_date"),
            knex.raw("lat::float as lat"),
            knex.raw("lon::float as lon"),
            knex.raw("weather_score_min::float as weather_score_min"),
        )
        .whereRaw("weather_date::text = ANY(?)", [availableDates])
        .orderBy([
            { column: knex.raw("weather_date::text"), order: "asc" },
            { column: "lat", order: "desc" },
            { column: "lon", order: "asc" },
        ]);

    // Group rows by weather_date (YYYY-MM-DD)
    const rowsByDate = new Map<string, WeatherRow[]>();
    for (const r of fullRows) {
        const d = r.weather_date.slice(0, 10);
        let list = rowsByDate.get(d);
        if (!list) {
            list = [];
            rowsByDate.set(d, list);
        }
        list.push(r);
    }

    // --- STEP 4: BILDER GENERIEREN ---
    const weatherDaysMetadata: WeatherDay[] = [];
    const t0 = Date.now();
    const alpsMask = computeAlpsMaskGrid();

    for (const dateStr of availableDates) {
        const dateRows = rowsByDate.get(dateStr) || [];
        const { weekday, label } = formatDayLabel(dateStr, todayStr);
        const fileName = `weather_overlay_${dateStr}.webp`;
        const targetPath = path.join(weatherDir, fileName);

        logger.info(
            `[WeatherOverlay] Processing ${dateStr} (${label}, ${dateRows.length} data points)...`,
        );

        const grid = buildGridFromRows(dateRows);
        const rgba = interpolateGridToRgba(grid, alpsMask);
        await saveRgbaAsWebp(rgba, targetPath);

        const stats = fs.statSync(targetPath);
        const sizeKb = Math.round(stats.size / 1024);
        logger.info(`[WeatherOverlay] Saved: ${targetPath} (${sizeKb} KB)`);

        weatherDaysMetadata.push({
            date: dateStr,
            weekday,
            label,
            file: fileName,
        });
    }

    const elapsedSec = ((Date.now() - t0) / 1000).toFixed(2);
    logger.info(`[WeatherOverlay] Rendered ${availableDates.length} overlays in ${elapsedSec}s.`);

    // --- STEP 5: METADATEN-DATEI SCHREIBEN ---
    const metadata: WeatherMetadata = {
        version: "1.0",
        generated_at: new Date().toISOString(),
        bounds: [
            [GRID_CONFIG.boundsLatMin, GRID_CONFIG.boundsLonMin],
            [GRID_CONFIG.boundsLatMax, GRID_CONFIG.boundsLonMax],
        ],
        minZoom: 1,
        maxZoom: 12,
        days: weatherDaysMetadata,
        legend: [
            { score: 0, color: "#3b0f70", label: "Gefährlich" },
            { score: 50, color: "#f07d1a", label: "Mäßig" },
            { score: 100, color: "#2f9e44", label: "Ausgezeichnet" },
        ],
    };

    const metadataPath = path.join(weatherDir, "weather_metadata.json");
    await writeWeatherFile(metadataPath, JSON.stringify(metadata, null, 2));
    logger.info(`[WeatherOverlay] Wrote metadata: ${metadataPath}`);
    logger.info(`[WeatherOverlay] === COMPLETED WEATHER OVERLAYS SYNC ===`);

    return true;
}

// CLI entry point when executed directly via node / tsx
if (
    require.main === module ||
    (typeof process !== "undefined" &&
        process.argv[1] &&
        process.argv[1].endsWith("generateWeatherOverlay.ts"))
) {
    const args = process.argv.slice(2);
    const wait = args.includes("--wait");
    const allDates = args.includes("--all-dates");

    let intervalMs = 120_000;
    const intervalArg = args.find((a) => a.startsWith("--interval="));
    if (intervalArg) {
        intervalMs = parseInt(intervalArg.split("=")[1], 10) * 1000;
    }

    syncWeatherOverlays({ wait, allDates, intervalMs })
        .then((success) => {
            knex.destroy();
            process.exit(success ? 0 : 1);
        })
        .catch((err) => {
            logger.error("[WeatherOverlay] Fatal error:", err);
            knex.destroy();
            process.exit(1);
        });
}
