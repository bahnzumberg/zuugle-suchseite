#!/usr/bin/node
import {
    writeKPIs,
    truncateAll,
    restoreDump,
    copyDump,
    populateCity2TourFlat,
    refreshSearchSuggestions,
    generateSitemaps,
} from "./sync.js";
import cacheService from "../services/cache.js";
import logger from "../utils/logger";

logger.info("Copy dump to container");
copyDump("zuugle_postgresql.dump", "/tmp/zuugle_postgresql.dump")
    .then(() => {
        logger.info("Truncate tables");
        truncateAll().then(() => {
            logger.info("Restore from database dump (this will take a while)");
            restoreDump().then(() => {
                logger.info("Write KPIs");
                writeKPIs().then(() => {
                    logger.info("Populate city2tour_flat");
                    populateCity2TourFlat().then(() => {
                        logger.info("Refresh search suggestions");
                        refreshSearchSuggestions().then(() => {
                            logger.info("Generate Sitemaps");
                            generateSitemaps().then(async () => {
                                logger.info("Flushing cache...");
                                await cacheService.flush();
                                logger.info("Cache flushed. Database ready!");
                                process.exit();
                            });
                        });
                    });
                });
            });
        });
    })
    .catch((err) => {
        logger.error("Error during sync:", err);
        process.exit(1);
    });
