#!/usr/bin/node
import { syncConnectionGPX, syncGPX, syncGPXImage, copyRangeImage } from "./sync";
import cacheService from "../services/cache.js";
import logger from "../utils/logger";

logger.info("START CREATE GPX FILES");
syncGPX().then(() => {
    logger.info("END CREATE GPX FILES");
    logger.info("START CREATE GPX ANREISE/ABREISE FILES");
    syncConnectionGPX("dev").then(() => {
        logger.info("END CREATE GPX ANREISE/ABREISE FILES");
        logger.info("START CREATE GPX IMAGE FILES");
        syncGPXImage().then(() => {
            logger.info("END CREATE GPX IMAGE FILES");
            logger.info("START COPYING RANGE IMAGE FILES");
            copyRangeImage().then(async () => {
                logger.info("FLUSHING CACHE...");
                await cacheService.flush();
                logger.info("CACHE FLUSHED.");
                process.exit();
            });
        });
    });
});
