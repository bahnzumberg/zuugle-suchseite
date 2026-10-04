#!/usr/bin/node
import {
    writeKPIs,
    fixTours,
    syncCities,
    syncTours,
    populateCity2TourFlat,
    refreshSearchSuggestions,
    generateSitemaps,
} from "./sync.js";
import cacheService from "../services/cache.js";
import logger from "../utils/logger";

// Guard: import-data-prod is only intended for the native PROD host.
// Compose-managed environments (local, DEV, UAT) set COMPOSE_PROJECT_NAME;
// PROD leaves it unset.
const composeName = process.env.COMPOSE_PROJECT_NAME;
if (composeName) {
    logger.error(
        `COMPOSE_PROJECT_NAME is set to "${composeName}" — this is not a PROD environment.\n` +
            `  On local/DEV/UAT use "npm run import-data" instead, which downloads and\n` +
            `  restores the production dump into the Docker-managed database.`,
    );
    process.exit(1);
}

async function main() {
    logger.info("FULL LOAD");

    logger.info("START SYNC TOURS");
    const toursSwapped = await syncTours();
    if (toursSwapped) {
        logger.info("DONE SYNC TOURS");
    } else {
        logger.warn("SKIPPED SYNC TOURS (kept previous day tours)");
    }

    logger.info("START SYNC CITIES");
    await syncCities();
    logger.info("DONE SYNC CITIES");

    logger.info("START FIX TOURS");
    await fixTours();
    logger.info("DONE FIX TOURS");

    logger.info("START WRITE KPIs");
    await writeKPIs();
    logger.info("DONE WRITING KPIs");

    logger.info("START POPULATE city2tour_flat");
    await populateCity2TourFlat();
    logger.info("DONE POPULATE city2tour_flat");

    logger.info("START REFRESH SEARCH SUGGESTIONS");
    await refreshSearchSuggestions();
    logger.info("DONE REFRESH SEARCH SUGGESTIONS");

    logger.info("START GENERATE SITEMAPS");
    await generateSitemaps();
    logger.info("DONE GENERATE SITEMAPS");

    // Log cache statistics before flushing
    const stats = await cacheService.getStats();
    if (stats) {
        const total = stats.hits + stats.misses;
        const hitRate = total > 0 ? ((stats.hits / total) * 100).toFixed(1) : 0;
        logger.info(
            `CACHE STATS (previous day): hits=${stats.hits}, misses=${stats.misses}, hit_rate=${hitRate}%`,
        );
    } else {
        logger.info("CACHE STATS: unavailable");
    }

    await cacheService.flush();
    logger.info("CACHE FLUSHED");

    process.exit(0);
}

main().catch((err) => {
    logger.error("FULL LOAD PROD FAILED with error:", err);
    process.exit(1);
});
