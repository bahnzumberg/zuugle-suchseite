import fs from "fs";
import path from "path";
import knex from "../knex";
import logger from "../utils/logger";
import { PUBLIC_DIR } from "../utils/assetPaths";
import {
    buildGridFromRows,
    interpolateGridToRgba,
    computeDataPresenceMask,
    saveRgbaAsWebp,
    writeWeatherFile,
    cleanupOldWeatherOverlays,
    GRID_CONFIG,
    WeatherDay,
    WeatherMetadata,
    WeatherRow,
} from "../utils/weatherOverlayService";

export interface SyncWeatherOverlayOptions {
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

interface WeatherRowWithLoadId extends WeatherRow {
    load_id: number;
}

interface WeatherSyncState {
    load_id: number;
    timestamp?: string;
}

async function readSyncState(): Promise<WeatherSyncState | null> {
    try {
        const res = await knex.raw(
            "SELECT weather_load_id, weather_synced_at FROM sync_state WHERE id = 1;",
        );
        const row = res.rows?.[0];
        if (!row || row.weather_load_id == null) {
            return null;
        }
        return {
            load_id: Number(row.weather_load_id),
            timestamp: row.weather_synced_at
                ? new Date(row.weather_synced_at).toISOString()
                : undefined,
        };
    } catch (err) {
        if ((err as { code?: string }).code === UNDEFINED_TABLE) {
            return null;
        }
        logger.error("[WeatherOverlay] Error querying sync_state:", err);
        return null;
    }
}

async function writeSyncState(loadId: number, timestamp: string): Promise<void> {
    await knex.raw(
        `INSERT INTO sync_state (id, weather_load_id, weather_synced_at)
         VALUES (1, ?, ?::timestamptz)
         ON CONFLICT (id) DO UPDATE
            SET weather_load_id = EXCLUDED.weather_load_id,
                weather_synced_at = EXCLUDED.weather_synced_at;`,
        [loadId, timestamp],
    );
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

    for (const dateStr of availableDates) {
        const dateRows = rowsByDate.get(dateStr) || [];
        const fileName = `weather_overlay_${dateStr}.webp`;
        const targetPath = path.join(weatherDir, fileName);

        logger.info(`[WeatherOverlay] Processing ${dateStr} (${dateRows.length} data points)...`);

        const grid = buildGridFromRows(dateRows);
        const presenceMask = computeDataPresenceMask(grid);
        const rgba = interpolateGridToRgba(grid, presenceMask);
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
 * 2. Check sync_state table
 *    - Not present / empty: first run, generate with available data and write sync_state
 *    - Present: query WHERE load_id > lastLoadId
 * 3. Generate overlays and write weather_metadata.json (with matching generated_at)
 * 4. Update sync_state after successful generation (with matching timestamp)
 */
export async function syncWeatherOverlays(
    options: SyncWeatherOverlayOptions = {},
): Promise<boolean> {
    const todayStr = getTodayString();
    const weatherDir = options.weatherDir || path.join(PUBLIC_DIR, "weather");
    const allDates = options.allDates ?? false;

    logger.info(`[WeatherOverlay] === START SYNC WEATHER OVERLAYS (today: ${todayStr}) ===`);

    // --- STEP 1: SOFORT-CLEANUP ---
    const deletedCount = await cleanupOldWeatherOverlays(weatherDir, todayStr);
    logger.info(
        `[WeatherOverlay] Immediate cleanup finished: ${deletedCount} expired overlay(s) removed.`,
    );

    // --- STEP 2: PRÜFUNG SYNC_STATE ---
    const syncState = await readSyncState();

    if (syncState === null) {
        // Erster Lauf: Kein Eintrag in sync_state vorhanden
        logger.info(
            `[WeatherOverlay] No sync_state found. Running first load with available data...`,
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
                await writeSyncState(maxLoadId, timestamp);
                logger.info(
                    `[WeatherOverlay] Wrote sync_state with load_id ${maxLoadId} (timestamp: ${timestamp}).`,
                );
                logger.info(`[WeatherOverlay] === COMPLETED WEATHER OVERLAYS SYNC ===`);
                return true;
            } else {
                logger.error(`[WeatherOverlay] Error generating overlays. sync_state not updated.`);
                return false;
            }
        } catch (err) {
            logger.error(`[WeatherOverlay] Failed to generate overlays:`, err);
            return false;
        }
    }

    // Folgelauf: sync_state existiert bereits
    const lastLoadId = syncState.load_id;
    logger.info(
        `[WeatherOverlay] Existing sync_state found (load_id: ${lastLoadId}, timestamp: ${syncState.timestamp || "none"}). Checking for newer data...`,
    );

    const checkResult = await fetchNewWeatherData(lastLoadId, todayStr, allDates);

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
            await writeSyncState(newLoadId, timestamp);
            logger.info(
                `[WeatherOverlay] Successfully updated sync_state to load_id ${newLoadId} (timestamp: ${timestamp}).`,
            );
            logger.info(`[WeatherOverlay] === COMPLETED WEATHER OVERLAYS SYNC ===`);
            return true;
        } else {
            logger.error(`[WeatherOverlay] Overlay generation failed. sync_state was NOT updated.`);
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
    const allDates = args.includes("--all-dates");

    syncWeatherOverlays({ allDates })
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
