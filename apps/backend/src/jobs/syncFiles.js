#!/usr/bin/node
import { syncConnectionGPX, syncGPX, syncGPXImage } from "./sync";
import { syncWeatherOverlays } from "./generateWeatherOverlay";
import cacheService from "../services/cache.js";
import logger from "../utils/logger";

logger.info("START SYNC FILES PIPELINE");

async function run() {
    // Weather overlays run in parallel because they only depend on newest_weather_daily,
    // not on the GPX generation pipeline.
    const weatherPromise = (async () => {
        try {
            logger.info("START GENERATING WEATHER OVERLAYS");
            await syncWeatherOverlays({ wait: true });
            logger.info("END GENERATING WEATHER OVERLAYS");
        } catch (err) {
            logger.error("NON-FATAL: Error during weather overlay generation:", err);
        }
    })();

    // Main GPX & tour asset pipeline (must run sequentially)
    const gpxPipelinePromise = (async () => {
        logger.info("START CREATE GPX FILES");
        await syncGPX();
        logger.info("END CREATE GPX FILES");

        logger.info("START CREATE GPX ANREISE/ABREISE FILES");
        await syncConnectionGPX("dev");
        logger.info("END CREATE GPX ANREISE/ABREISE FILES");

        logger.info("START CREATE GPX IMAGE FILES");
        await syncGPXImage();
        logger.info("END CREATE GPX IMAGE FILES");
    })();

    // The cache holds GPX pipeline results, not overlays, so the flush waits
    // only on that pipeline.
    await gpxPipelinePromise;

    logger.info("FLUSHING CACHE...");
    await cacheService.flush();
    logger.info("CACHE FLUSHED.");

    await weatherPromise;
    process.exit(0);
}

run().catch((err) => {
    logger.error("FATAL ERROR IN syncFiles:", err);
    process.exit(1);
});
