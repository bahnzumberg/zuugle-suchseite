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
    cutoffHour?: number;
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

interface WeatherRowWithLoadId extends WeatherRow {
    load_id: number;
}

interface LastLoadInfo {
    load_id: number;
    timestamp?: string;
}

function readLastLoad(lastLoadPath: string): LastLoadInfo | null {
    if (!fs.existsSync(lastLoadPath)) {
        return null;
    }
    try {
        const raw = fs.readFileSync(lastLoadPath, "utf-8");
        const data = JSON.parse(raw);
        if (data && typeof data.load_id === "number") {
            return {
                load_id: data.load_id,
                timestamp: typeof data.timestamp === "string" ? data.timestamp : data.updated_at,
            };
        }
        return null;
    } catch (err) {
        logger.warn(
            `[WeatherOverlay] Could not parse ${lastLoadPath}, treating as first run:`,
            err,
        );
        return null;
    }
}

async function writeLastLoad(
    lastLoadPath: string,
    loadId: number,
    timestamp: string,
): Promise<void> {
    const content = JSON.stringify(
        {
            load_id: loadId,
            timestamp,
        },
        null,
        2,
    );
    await writeWeatherFile(lastLoadPath, content);
}

/**
 * First run: queries available data from overlay_weather_daily using max(load_id).
 */
async function fetchCurrentWeatherData(
    todayStr: string,
    allDates: boolean,
): Promise<{ rows: WeatherRowWithLoadId[]; maxLoadId: number | null }> {
    try {
        const maxRes = await knex.raw("SELECT max(load_id) as load_id FROM overlay_weather_daily;");
        const maxLoadId = maxRes.rows[0]?.load_id;
        if (maxLoadId == null) {
            return { rows: [], maxLoadId: null };
        }

        let query = `
            SELECT 
                max(load_id) as load_id,
                weather_date::text as weather_date,
                lat::float as lat,
                lon::float as lon,
                weather_score_min::float as weather_score_min
            FROM overlay_weather_daily 
            WHERE load_id = ?
        `;
        const params: (number | string)[] = [maxLoadId];
        if (!allDates) {
            query += " AND weather_date >= ?::date";
            params.push(todayStr);
        }
        query += `
            GROUP BY weather_date, lat, lon, weather_score_min
            ORDER BY weather_date ASC, lat DESC, lon ASC;
        `;

        const res = await knex.raw(query, params);
        return { rows: res.rows || [], maxLoadId };
    } catch (err) {
        if ((err as { code?: string }).code === UNDEFINED_TABLE) {
            throw err;
        }
        logger.error("[WeatherOverlay] Error querying overlay_weather_daily:", err);
        return { rows: [], maxLoadId: null };
    }
}

/**
 * Subsequent runs: checks if new data with load_id > lastLoadId exists.
 */
async function fetchNewWeatherData(
    lastLoadId: number,
    todayStr: string,
    allDates: boolean,
): Promise<{ rows: WeatherRowWithLoadId[]; maxLoadId: number | null }> {
    try {
        let query = `
            SELECT 
                max(load_id) as load_id,
                weather_date::text as weather_date,
                lat::float as lat,
                lon::float as lon,
                weather_score_min::float as weather_score_min
            FROM overlay_weather_daily 
            WHERE load_id > ?
        `;
        const params: (number | string)[] = [lastLoadId];
        if (!allDates) {
            query += " AND weather_date >= ?::date";
            params.push(todayStr);
        }
        query += `
            GROUP BY weather_date, lat, lon, weather_score_min
            ORDER BY weather_date ASC, lat DESC, lon ASC;
        `;

        const res = await knex.raw(query, params);
        const rows: WeatherRowWithLoadId[] = res.rows || [];
        let maxLoadId: number | null = null;
        if (rows.length > 0) {
            maxLoadId = Math.max(...rows.map((r) => r.load_id));
        }
        return { rows, maxLoadId };
    } catch (err) {
        if ((err as { code?: string }).code === UNDEFINED_TABLE) {
            throw err;
        }
        logger.error("[WeatherOverlay] Error querying overlay_weather_daily:", err);
        return { rows: [], maxLoadId: null };
    }
}

async function generateOverlaysFromRows(
    rows: WeatherRowWithLoadId[],
    weatherDir: string,
    todayStr: string,
    timestamp: string,
): Promise<boolean> {
    if (rows.length === 0) {
        logger.warn("[WeatherOverlay] No weather rows available to generate overlays.");
        return false;
    }

    const rowsByDate = new Map<string, WeatherRow[]>();
    for (const r of rows) {
        const d = r.weather_date.slice(0, 10);
        let list = rowsByDate.get(d);
        if (!list) {
            list = [];
            rowsByDate.set(d, list);
        }
        list.push(r);
    }

    const availableDates = Array.from(rowsByDate.keys()).sort();
    if (availableDates.length === 0) {
        logger.warn("[WeatherOverlay] No weather dates available to generate overlays.");
        return false;
    }

    logger.info(
        `[WeatherOverlay] Generating overlays for ${availableDates.length} date(s): ${availableDates.join(", ")}`,
    );

    const weatherDaysMetadata: WeatherDay[] = [];
    const t0 = Date.now();
    const alpsMask = computeAlpsMaskGrid();

    for (const dateStr of availableDates) {
        const dateRows = rowsByDate.get(dateStr) || [];
        const fileName = `weather_overlay_${dateStr}.webp`;
        const targetPath = path.join(weatherDir, fileName);

        logger.info(`[WeatherOverlay] Processing ${dateStr} (${dateRows.length} data points)...`);

        const grid = buildGridFromRows(dateRows);
        const rgba = interpolateGridToRgba(grid, alpsMask);
        await saveRgbaAsWebp(rgba, targetPath);

        const stats = fs.statSync(targetPath);
        const sizeKb = Math.round(stats.size / 1024);
        logger.info(`[WeatherOverlay] Saved: ${targetPath} (${sizeKb} KB)`);

        weatherDaysMetadata.push({
            date: dateStr,
            file: fileName,
        });
    }

    const elapsedSec = ((Date.now() - t0) / 1000).toFixed(2);
    logger.info(`[WeatherOverlay] Rendered ${availableDates.length} overlays in ${elapsedSec}s.`);

    // Metadaten-Datei schreiben
    const metadata: WeatherMetadata = {
        version: "1.0",
        generated_at: timestamp,
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

    return true;
}

/**
 * Main job function to synchronize weather overlays:
 * 1. Immediate cleanup of expired overlays (< today)
 * 2. Check last-load.json
 *    - Not present: first run, generate with available data and write last-load.json
 *    - Present: query WHERE load_id > lastLoadId, poll every 6 minutes until 13:00
 * 3. Generate overlays and write weather_metadata.json (with matching generated_at)
 * 4. Update last-load.json after successful generation (with matching timestamp)
 */
export async function syncWeatherOverlays(
    options: SyncWeatherOverlayOptions = {},
): Promise<boolean> {
    const todayStr = getTodayString();
    const weatherDir = options.weatherDir || path.join(PUBLIC_DIR, "weather");
    const intervalMs = options.intervalMs ?? 6 * 60 * 1000; // 6 minutes default
    const wait = options.wait ?? false;
    const allDates = options.allDates ?? false;
    const cutoffHour = options.cutoffHour ?? 13;
    const lastLoadPath = path.join(weatherDir, "last-load.json");

    logger.info(`[WeatherOverlay] === START SYNC WEATHER OVERLAYS (today: ${todayStr}) ===`);

    // --- STEP 1: SOFORT-CLEANUP ---
    const deletedCount = await cleanupOldWeatherOverlays(weatherDir, todayStr);
    logger.info(
        `[WeatherOverlay] Immediate cleanup finished: ${deletedCount} expired overlay(s) removed.`,
    );

    // --- STEP 2: PRÜFUNG LAST-LOAD.JSON ---
    const lastLoad = readLastLoad(lastLoadPath);

    if (lastLoad === null) {
        // Erster Lauf: Datei last-load.json existiert nicht (oder ungültig)
        logger.info(
            `[WeatherOverlay] No valid last-load.json found. Running first load with available data...`,
        );

        const { rows, maxLoadId } = await fetchCurrentWeatherData(todayStr, allDates);
        if (rows.length === 0 || maxLoadId == null) {
            logger.warn("[WeatherOverlay] No weather data found in overlay_weather_daily.");
            return false;
        }

        const timestamp = new Date().toISOString();
        try {
            const success = await generateOverlaysFromRows(rows, weatherDir, todayStr, timestamp);
            if (success) {
                await writeLastLoad(lastLoadPath, maxLoadId, timestamp);
                logger.info(
                    `[WeatherOverlay] Wrote ${lastLoadPath} with load_id ${maxLoadId} (timestamp: ${timestamp}).`,
                );
                logger.info(`[WeatherOverlay] === COMPLETED WEATHER OVERLAYS SYNC ===`);
                return true;
            } else {
                logger.error(
                    `[WeatherOverlay] Error generating overlays. last-load.json not created.`,
                );
                return false;
            }
        } catch (err) {
            logger.error(`[WeatherOverlay] Failed to generate overlays:`, err);
            return false;
        }
    }

    // Folgelauf: last-load.json existiert bereits
    const lastLoadId = lastLoad.load_id;
    logger.info(
        `[WeatherOverlay] Existing last-load.json found (load_id: ${lastLoadId}, timestamp: ${lastLoad.timestamp || "none"}). Checking for newer data...`,
    );

    // Initial check
    let checkResult = await fetchNewWeatherData(lastLoadId, todayStr, allDates);

    if (checkResult.rows.length === 0 && wait) {
        const isPastCutoff = () => new Date().getHours() >= cutoffHour;

        if (isPastCutoff()) {
            logger.info(
                `[WeatherOverlay] Current time is past ${cutoffHour}:00 and no new data available (last load_id: ${lastLoadId}). Exiting.`,
            );
            return true;
        }

        // Warteschleife alle 6 Minuten bis nach 13:00 oder bis neue Daten da sind
        // Während des Wartens KEINE Konsolenmeldungen!
        while (!isPastCutoff()) {
            await new Promise((resolve) => setTimeout(resolve, intervalMs));

            if (isPastCutoff()) {
                break;
            }

            // Silent poll: keine Bash-Meldung ausgeben
            checkResult = await fetchNewWeatherData(lastLoadId, todayStr, allDates);
            if (checkResult.rows.length > 0) {
                break;
            }
        }
    }

    if (checkResult.rows.length === 0) {
        logger.info(
            `[WeatherOverlay] No new weather data found (current load_id: ${lastLoadId}). Existing overlays remain unchanged.`,
        );
        return true;
    }

    // Neue Daten vorhanden: Overlays generieren
    const newLoadId = checkResult.maxLoadId;
    logger.info(
        `[WeatherOverlay] Found new weather data with load_id ${newLoadId} (${checkResult.rows.length} rows). Generating overlays...`,
    );

    const timestamp = new Date().toISOString();
    try {
        const success = await generateOverlaysFromRows(
            checkResult.rows,
            weatherDir,
            todayStr,
            timestamp,
        );
        if (success && newLoadId != null) {
            await writeLastLoad(lastLoadPath, newLoadId, timestamp);
            logger.info(
                `[WeatherOverlay] Successfully updated ${lastLoadPath} to load_id ${newLoadId} (timestamp: ${timestamp}).`,
            );
            logger.info(`[WeatherOverlay] === COMPLETED WEATHER OVERLAYS SYNC ===`);
            return true;
        } else {
            logger.error(
                `[WeatherOverlay] Overlay generation failed. last-load.json was NOT updated.`,
            );
            return false;
        }
    } catch (err) {
        logger.error(`[WeatherOverlay] Failed to generate overlays:`, err);
        return false;
    }
}

// CLI entry point when executed directly via node / tsx
if (
    require.main === module ||
    (typeof process !== "undefined" &&
        process.argv[1] &&
        (process.argv[1].endsWith("generateWeatherOverlay.ts") ||
            process.argv[1].endsWith("generateWeatherOverlay.js")))
) {
    const args = process.argv.slice(2);
    const wait = args.includes("--wait");
    const allDates = args.includes("--all-dates");

    let intervalMs = 6 * 60 * 1000;
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
