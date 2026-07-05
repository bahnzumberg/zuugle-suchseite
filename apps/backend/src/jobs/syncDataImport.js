#!/usr/bin/node
// Populate the local/DEV/UAT database from the nightly production dump.
// Downloads the dump, then restores + post-processes it over the DB connection.
// The restore transport (compose container vs native pg_restore) is auto-detected
// in sync.js, so this one command works locally, in the dev container, and on the
// DEV/UAT servers without any host-specific setup.
import { createWriteStream } from "fs";
import { get } from "https";
import {
    writeKPIs,
    truncateAll,
    restoreDump,
    populateCity2TourFlat,
    refreshSearchSuggestions,
    generateSitemaps,
} from "./sync.js";
import cacheService from "../services/cache.js";
import logger from "../utils/logger";

const DUMP_URL = "https://uat-dump.zuugle.at/zuugle_postgresql.dump";
const DUMP_FILE = "zuugle_postgresql.dump";

function download(url) {
    return new Promise((resolve, reject) => {
        logger.info(`Downloading ${url}...`);
        get(url, (response) => {
            const { statusCode } = response;
            if (statusCode === 301 || statusCode === 302) {
                response.resume();
                download(response.headers.location).then(resolve, reject);
                return;
            }
            if (statusCode !== 200) {
                response.resume();
                reject(new Error(`Download failed with status: ${statusCode}`));
                return;
            }
            const file = createWriteStream(DUMP_FILE);
            response.pipe(file);
            file.on("finish", () => file.close(() => resolve(undefined)));
            file.on("error", reject);
        }).on("error", reject);
    });
}

async function main() {
    await download(DUMP_URL);
    logger.info(`Downloaded ${DUMP_FILE}`);

    logger.info("Truncate tables");
    await truncateAll();
    logger.info("Restore from database dump (this will take a while)");
    await restoreDump();
    logger.info("Write KPIs");
    await writeKPIs();
    logger.info("Populate city2tour_flat");
    await populateCity2TourFlat();
    logger.info("Refresh search suggestions");
    await refreshSearchSuggestions();
    logger.info("Generate Sitemaps");
    await generateSitemaps();
    logger.info("Flushing cache...");
    await cacheService.flush();
    logger.info("Cache flushed. Database ready!");
    process.exit(0);
}

main().catch((err) => {
    logger.error("Error during import:", err);
    process.exit(1);
});
