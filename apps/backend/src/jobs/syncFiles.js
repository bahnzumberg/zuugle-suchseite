#!/usr/bin/node
import { syncGPX, syncGPXImage } from "./sync";
import { syncWeatherOverlays } from "./generateWeatherOverlay";
import cacheService from "../services/cache.js";
import logger from "../utils/logger";
import { isCutoffReached } from "../utils/timeCutoff";

logger.info("START SYNC FILES PIPELINE");

async function run() {
    if (isCutoffReached()) {
        logger.info("Time cutoff (23:00) is already active. Exiting syncFiles gracefully.");
        process.exit(0);
    }

    // Weather overlays run in parallel because they only depend on overlay_weather_daily,
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

        if (isCutoffReached()) {
            logger.info(
                "Time cutoff (23:00) reached. Stopping GPX pipeline gracefully before GPX images.",
            );
            return;
        }

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

    // Wait for weather overlays (if still running and not past cutoff)
    await Promise.race([
        weatherPromise,
        new Promise((resolve) => {
            const interval = setInterval(() => {
                if (isCutoffReached()) {
                    clearInterval(interval);
                    logger.info(
                        "Time cutoff (23:00) reached. Not waiting further for weather overlays.",
                    );
                    resolve(undefined);
                }
            }, 1000);
            weatherPromise.finally(() => clearInterval(interval));
        }),
    ]);

    if (isCutoffReached()) {
        logger.info("SYNC FILES PIPELINE STOPPED GRACEFULLY DUE TO TIME CUTOFF (23:00).");
    } else {
        logger.info("SYNC FILES PIPELINE COMPLETED SUCCESSFULLY.");
    }
    process.exit(0);
}

run().catch((err) => {
    logger.error("FATAL ERROR IN syncFiles:", err);
    process.exit(1);
});
