import puppeteer from "puppeteer";
import path from "path";
import fs from "fs-extra";
import sharp from "sharp";
import convertXML from "xml-js";
import { create } from "xmlbuilder2";
import { setTimeout as delay } from "node:timers/promises";
import knex from "../../knex";
import {
    API_ORIGIN,
    PLACEHOLDER_IMAGE_PATH,
    PUBLIC_DIR,
    gpxImagePath,
    rangeImagePath,
    tourGpxPath,
} from "../assetPaths";
import crypto from "crypto";
import logger from "../logger";
import { isCutoffReached } from "../timeCutoff";

// Error image detection - stores hashes of known error images (London, 502, white, etc.)
// To add a new error image: just add the filename to ERROR_IMAGE_FILES
const ERROR_IMAGE_FILES = ["error-london.webp", "error-502.webp", "error-white.webp"];
const errorImageHashes = new Set();

// Constants for batch update queue
const BATCH_SIZE = 500; // Updates are batched every 500 images
const MAX_RETRIES = 3; // Maximum number of retry attempts on DB errors
const RETRY_DELAY_MS = 30000; // Delay between retries (30 seconds)

// Batch update queue for efficient DB updates
const updateQueue = [];
let drainPromise = null; // Serialises flush calls

const createImageHash = async (imageInput) => {
    try {
        const imageBuffer = await sharp(imageInput).toBuffer();
        const hash = crypto.createHash("sha256").update(imageBuffer).digest("hex");
        return hash;
    } catch (e) {
        logger.error("Error creating image hash:", e);
        return null;
    }
};

// Initialize error image hashes from error-images/ directory (same folder as this file)
const initErrorImageHashes = async () => {
    if (errorImageHashes.size > 0) return; // Already initialized

    for (const filename of ERROR_IMAGE_FILES) {
        const imagePath = path.join(__dirname, "error-images", filename);
        if (fs.existsSync(imagePath)) {
            const hash = await createImageHash(imagePath);
            if (hash) {
                errorImageHashes.add(hash);
                logger.info(`Image hash created for ${filename}: ${hash.substring(0, 16)}...`);
            }
        } else {
            logger.warn(`Error reference image not found: ${imagePath}`);
        }
    }
};

// Check if an image matches any known error image
const isErrorImage = async (imageInput) => {
    if (errorImageHashes.size === 0) {
        logger.error("Error image hashes not initialized.");
        return false;
    }

    try {
        const hash = await createImageHash(imageInput);
        return errorImageHashes.has(hash);
    } catch (e) {
        logger.error("Error checking image:", e);
        return false;
    }
};

const minimal_args = [
    "--autoplay-policy=user-gesture-required",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-breakpad",
    "--disable-client-side-phishing-detection",
    "--disable-component-update",
    "--disable-default-apps",
    "--disable-dev-shm-usage",
    "--disable-domain-reliability",
    "--disable-extensions",
    "--disable-features=AudioServiceOutOfProcess",
    "--disable-hang-monitor",
    "--disable-ipc-flooding-protection",
    "--disable-notifications",
    "--disable-offer-store-unmasked-wallet-cards",
    "--disable-popup-blocking",
    "--disable-print-preview",
    "--disable-prompt-on-repost",
    "--disable-renderer-backgrounding",
    "--disable-setuid-sandbox",
    "--disable-speech-api",
    "--disable-sync",
    "--hide-scrollbars",
    "--ignore-gpu-blacklist",
    "--metrics-recording-only",
    "--mute-audio",
    "--no-default-browser-check",
    "--no-first-run",
    "--no-pings",
    "--no-sandbox",
    "--no-zygote",
    "--password-store=basic",
    "--use-gl=swiftshader",
    "--use-mock-keychain",
];

// Note: Tile pre-warming functions have been moved to scripts/prewarm_tiles.py
// Run the Python script before image generation to pre-warm tiles on the tile server.

/**
 * Führt ein Batch-UPDATE für eine Liste von Updates aus
 * @param {Array} updates - Liste von { tourId, imageUrl, force }
 * @param {boolean} isForce - Ob image_url auch überschrieben werden soll wenn nicht NULL
 * @param {number} retryCount - Aktueller Retry-Versuch
 */
const executeUpdate = async (updates, isForce, retryCount = 0) => {
    if (updates.length === 0) return;

    try {
        // Build CASE statement for batch update
        const caseStatements = updates
            .map(({ tourId, imageUrl }) => `WHEN ${tourId} THEN '${imageUrl.replace(/'/g, "''")}'`)
            .join(" ");
        const ids = updates.map((u) => u.tourId).join(",");

        // city2tour_flat is updated via database trigger
        if (isForce) {
            await knex.raw(`
                UPDATE tour 
                SET image_url = CASE id ${caseStatements} END 
                WHERE id IN (${ids});
            `);
        } else {
            await knex.raw(`
                UPDATE tour 
                SET image_url = CASE id ${caseStatements} END 
                WHERE id IN (${ids}) AND image_url IS NULL;
            `);
        }

        logger.info(`Batch update: ${updates.length} tours updated (force=${isForce})`);
    } catch (e) {
        if (retryCount < MAX_RETRIES) {
            logger.warn(
                `Batch update failed, retrying in ${RETRY_DELAY_MS / 1000}s... (attempt ${retryCount + 1}/${MAX_RETRIES})`,
            );
            await delay(RETRY_DELAY_MS);
            return executeUpdate(updates, isForce, retryCount + 1);
        } else {
            logger.error(`Batch update failed after ${MAX_RETRIES} retries:`, e);
            // On total failure: fall back to individual updates
            logger.info(`Falling back to individual updates for ${updates.length} tours...`);
            for (const { tourId, imageUrl, force } of updates) {
                try {
                    if (force) {
                        await knex.raw(
                            `UPDATE tour SET image_url='${imageUrl.replace(/'/g, "''")}' WHERE id=${tourId};`,
                        );
                    } else {
                        await knex.raw(
                            `UPDATE tour SET image_url='${imageUrl.replace(/'/g, "''")}' WHERE id=${tourId} AND image_url IS NULL;`,
                        );
                    }
                } catch (individualError) {
                    logger.error(`Individual update failed for tour ${tourId}:`, individualError);
                }
            }
        }
    }
};

/**
 * Adds an update to the queue and flushes automatically when BATCH_SIZE is reached.
 * @param {number} tourId - Tour ID
 * @param {string} imageUrl - Image URL
 * @param {boolean} force - Overwrite even if not NULL
 */
const queueDbUpdate = (tourId, imageUrl, force = false) => {
    if (!tourId || !imageUrl || imageUrl.length === 0) return;

    updateQueue.push({ tourId, imageUrl, force });

    // Automatically flush when BATCH_SIZE is reached
    if (updateQueue.length >= BATCH_SIZE) {
        flushUpdateQueue();
    }
};

/**
 * Flushes the update queue strictly serially and executes batch UPDATEs.
 */
const flushUpdateQueue = async () => {
    if (drainPromise) return drainPromise;

    drainPromise = (async () => {
        try {
            while (updateQueue.length > 0) {
                const batch = updateQueue.splice(0, Math.min(updateQueue.length, BATCH_SIZE));
                if (batch.length === 0) break;

                // Separate force and non-force updates
                const forceUpdates = batch.filter((u) => u.force);
                const normalUpdates = batch.filter((u) => !u.force);

                if (forceUpdates.length > 0) {
                    await executeUpdate(forceUpdates, true);
                }
                if (normalUpdates.length > 0) {
                    await executeUpdate(normalUpdates, false);
                }
            }
        } finally {
            drainPromise = null;
        }
    })();

    return drainPromise;
};

/**
 * Flushes all remaining updates at the end of processing and waits until
 * all database operations have completed.
 */
const flushAllPendingUpdates = async () => {
    while (updateQueue.length > 0 || drainPromise) {
        if (drainPromise) {
            await drainPromise;
        } else if (updateQueue.length > 0) {
            await flushUpdateQueue();
        }
    }
    logger.info("All pending DB updates flushed.");
};

// Legacy function for compatibility (internally redirects to the queue)
const dispatchDbUpdate = (tourId, imageUrl, force) => {
    queueDbUpdate(tourId, imageUrl, force);
};

// Helper function for error handling and placeholder assignment
const handleImagePlaceholder = async (tourId) => {
    try {
        const result = await knex.raw(`SELECT range_slug FROM tour AS t WHERE t.id=${tourId}`);
        const rangeSlug = result.rows && result.rows.length > 0 ? result.rows[0].range_slug : null;

        if (rangeSlug) {
            logger.info(`Found range_slug "${rangeSlug}", setting specific image URL.`);
            await dispatchDbUpdate(tourId, rangeImagePath(rangeSlug), true);
        } else {
            logger.info("No range_slug found, setting generic placeholder.");
            await dispatchDbUpdate(tourId, PLACEHOLDER_IMAGE_PATH, true);
        }
    } catch (e) {
        logger.error("Error in handleImagePlaceholder:", e);
        await dispatchDbUpdate(tourId, PLACEHOLDER_IMAGE_PATH, true);
    }
};

// Helper function for image generation
// Returns: 'success' | 'error_image' | 'failed'
const processAndCreateImage = async (tourId, pageOrBrowser, url) => {
    const filePathSmallWebp = path.join(PUBLIC_DIR, gpxImagePath(tourId));
    const dirPath = path.dirname(filePathSmallWebp);
    const MAX_GENERATION_TIME = 300000;

    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // In-memory screenshot (Ad 1D): no temporary PNG on disk
        const generationPromise = createImageFromMap(
            pageOrBrowser,
            null,
            url + tourGpxPath(tourId),
        );
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error("Image generation timeout")), MAX_GENERATION_TIME);
        });

        const pngBuffer = await Promise.race([generationPromise, timeoutPromise]);

        if (pngBuffer && Buffer.isBuffer(pngBuffer)) {
            let webpBuffer;
            try {
                webpBuffer = await sharp(pngBuffer)
                    .resize({
                        width: 784,
                        height: 523,
                        fit: "inside",
                    })
                    .webp({ quality: 15 })
                    .toBuffer();
            } catch (e) {
                logger.warn(`gpxUtils.sharp.resize error for tour ${tourId}: ${e.message}`);
                return "error_image"; // Trigger retry
            }

            const isError = await isErrorImage(webpBuffer);
            if (isError) {
                logger.info(`Detected error image for tour ${tourId} - will retry later.`);
                return "error_image"; // Don't set placeholder yet - allow retry
            } else {
                await fs.promises.writeFile(filePathSmallWebp, webpBuffer);
                logger.debug("Gpx image small file created:", filePathSmallWebp);
                dispatchDbUpdate(tourId, gpxImagePath(tourId), true);
                return "success";
            }
        } else {
            logger.warn("NO image buffer created for tour", tourId);
            await handleImagePlaceholder(tourId);
            return "failed";
        }
    } catch (e) {
        if (e.message === "Image generation timeout") {
            logger.error(`Timeout for image generation for ID ${tourId}:`, e.message);
        } else {
            logger.error(`Error in processAndCreateImage for ID ${tourId}:`, e);
        }

        await handleImagePlaceholder(tourId);
        return "failed";
    }
};

/**
 * Regenerates a single GPX file from database data (gpx + tracks tables).
 * Combines totour track, main GPX track, and fromtour track into one file.
 * @param {string|number} id - Tour ID
 * @param {string} hashedUrl - Hashed URL of the tour
 * @param {string} title - Tour title
 * @returns {Promise<string|null>} Path to created file, or null on failure
 */
export const regenerateGpxFile = async (id, hashedUrl, title) => {
    const filePathName = path.join(PUBLIC_DIR, tourGpxPath(id));
    const dirPath = path.dirname(filePathName);

    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const result = await knex.raw(
            `
            WITH routing_keys AS (
                -- Finde die häufigsten Keys für Vor- und Nachlauf
                SELECT
                    totour_track_key,
                    fromtour_track_key
                FROM fahrplan
                WHERE hashed_url = ?
                GROUP BY totour_track_key, fromtour_track_key
                ORDER BY count(*) DESC
                LIMIT 1
            ),
            combined_tracks AS (
                -- Vorlauf (totour)
                SELECT 
                    NULL::text AS provider,
                    ? AS hashed_url,
                    1 AS part_order,
                    track_point_sequence AS original_seq,
                    track_point_lat AS lat,
                    track_point_lon AS lon,
                    track_point_elevation AS ele
                FROM tracks
                JOIN routing_keys rk ON tracks.track_key = rk.totour_track_key

                UNION ALL

                -- Der eigentliche Haupt-Track
                SELECT 
                    provider,
                    hashed_url,
                    2 AS part_order,
                    waypoint AS original_seq,
                    lat,
                    lon,
                    ele
                FROM gpx 
                WHERE hashed_url = ?

                UNION ALL

                -- Nachlauf (fromtour)
                SELECT 
                    NULL::text AS provider,
                    ? AS hashed_url,
                    3 AS part_order,
                    track_point_sequence AS original_seq,
                    track_point_lat AS lat,
                    track_point_lon AS lon,
                    track_point_elevation AS ele
                FROM tracks
                JOIN routing_keys rk ON tracks.track_key = rk.fromtour_track_key
            )
            -- Finale Ausgabe mit sauberer Neu-Nummerierung (1 bis n)
            SELECT 
                provider,
                hashed_url,
                ROW_NUMBER() OVER (ORDER BY part_order, original_seq) AS waypoint,
                lat,
                lon,
                ele
            FROM combined_tracks
            ORDER BY waypoint;
            `,
            [hashedUrl, hashedUrl, hashedUrl, hashedUrl],
        );

        const waypoints = result.rows;
        if (waypoints && waypoints.length > 0) {
            const root = create({ version: "1.0" })
                .ele("gpx", {
                    version: "1.1",
                    xmlns: "http://www.topografix.com/GPX/1/1",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                })
                .ele("trk")
                .ele("name")
                .txt(title)
                .up()
                .ele("trkseg");

            waypoints.forEach((wp) => {
                root.ele("trkpt", { lat: wp.lat, lon: wp.lon }).ele("ele").txt(wp.ele);
            });

            const xml = root.end({ prettyPrint: true });
            if (xml) {
                fs.writeFileSync(filePathName, xml);
            }
            return filePathName;
        }
        return null;
    } catch (err) {
        logger.error(`Error in regenerateGpxFile for tour ${id}:`, err);
        return null;
    }
};

// Check and recreate old images (including associated GPX files).
// If the gpx_changed_regenerate table exists and has entries, only those
// specific tours are regenerated. Otherwise a random 10 % sample of
// images older than 30 days is selected.
const cleanAndRecreateOldImages = async () => {
    let idsToRecreate = [];

    // 1. Check whether gpx_changed_regenerate exists and has entries.
    // This table is part of the ETL job and exists only on production.
    let changedTours = [];
    try {
        const tableCheck = await knex.raw(
            `SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_name = 'gpx_changed_regenerate'
            );`,
        );
        if (tableCheck.rows[0].exists) {
            const result = await knex.raw(
                `SELECT t.id, t.hashed_url, t.title
                 FROM gpx_changed_regenerate AS g
                 INNER JOIN tour AS t ON g.hashed_url = t.hashed_url
                 GROUP BY t.id, t.hashed_url, t.title;`,
            );
            changedTours = result.rows;
        }
    } catch (err) {
        logger.error("Error checking gpx_changed_regenerate table:", err);
    }

    if (changedTours.length > 0) {
        // 2a. Targeted regeneration of tours flagged in gpx_changed_regenerate
        logger.info(
            `Found ${changedTours.length} tours to regenerate from gpx_changed_regenerate table.`,
        );
        for (const row of changedTours) {
            const id = row.id;
            const filePath = path.join(PUBLIC_DIR, gpxImagePath(id));

            // Delete existing image if present
            try {
                await fs.promises.unlink(filePath);
            } catch (e) {
                if (e.code !== "ENOENT") {
                    logger.error(`Error deleting image for tour ID ${id}:`, e);
                }
            }

            // Delete associated GPX file and regenerate from DB
            // so that the new image is based on current data
            const gpxFilePath = path.join(PUBLIC_DIR, tourGpxPath(id));
            try {
                await fs.promises.unlink(gpxFilePath);
                logger.info(`Deleted GPX file for tour ID ${id}.`);
            } catch (gpxErr) {
                if (gpxErr.code !== "ENOENT") {
                    logger.error(`Error deleting GPX file for tour ID ${id}:`, gpxErr);
                }
            }
            await regenerateGpxFile(id, row.hashed_url, row.title);

            idsToRecreate.push(id);
        }
    } else {
        // 2b. Fallback: random 10 % selection from images older than 30 days
        const allToursWithImages = await knex.raw(
            `SELECT id, hashed_url, title FROM tour WHERE image_url NOT LIKE 'https://cdn.bahn-zum-berg.at%';`,
        );
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

        for (const row of allToursWithImages.rows) {
            const id = row.id;
            const filePath = path.join(PUBLIC_DIR, gpxImagePath(id));

            try {
                const stats = await fs.promises.stat(filePath);
                const isOlderThan30Days = Date.now() - stats.mtimeMs > thirtyDaysInMs;
                const shouldBeDeleted = Math.random() < 0.1;

                if (isOlderThan30Days && shouldBeDeleted) {
                    // logger.info(`Deleting old image for tour ID ${id}.`);
                    await fs.promises.unlink(filePath);

                    // Delete associated GPX file and regenerate from DB
                    // so that the new image is based on current data
                    const gpxFilePath = path.join(PUBLIC_DIR, tourGpxPath(id));
                    try {
                        await fs.promises.unlink(gpxFilePath);
                        logger.info(`Deleted GPX file for tour ID ${id}.`);
                    } catch (gpxErr) {
                        if (gpxErr.code !== "ENOENT") {
                            logger.error(`Error deleting GPX file for tour ID ${id}:`, gpxErr);
                        }
                    }
                    await regenerateGpxFile(id, row.hashed_url, row.title);

                    idsToRecreate.push(id);
                }
            } catch (e) {
                if (e.code === "ENOENT") {
                    logger.info(
                        `Image for tour ID ${id} not found on disk. Adding to recreate list.`,
                    );
                    idsToRecreate.push(id);
                } else {
                    logger.error(`Error checking file for ID ${id}:`, e);
                }
            }
        }
    }

    if (idsToRecreate.length > 0) {
        logger.info(
            `Found ${idsToRecreate.length} images to recreate. Restarting image generation process...`,
        );
        await createImagesFromMap(idsToRecreate, true); // Pass 'true' to prevent further recursion
    } else {
        logger.info(`No old images found to recreate.`);
    }
};

export const createImagesFromMap = async (ids, isRecursiveCall = false) => {
    const isProd = process.env.NODE_ENV == "production";

    // Every environment renders its own map from its own tracks: UAT and DEV run
    // with NODE_ENV=production too, so a "prod" host here made both of them
    // screenshot www.zuugle.at. See utils/assetPaths.ts.
    const url = `${API_ORIGIN}/public/headless-leaflet/index.html?gpx=${API_ORIGIN}/public`;

    // Initialize error image hashes (London, 502, white, etc.)
    await initErrorImageHashes();

    if (ids) {
        let browser;
        try {
            // Puppeteer v24+ automatically manages Chrome downloads, no need to
            // specify executablePath.
            browser = await puppeteer.launch({
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--window-size=1200,800",
                    ...minimal_args,
                ],
                protocolTimeout: 240000,
                defaultViewport: { width: 1200, height: 800 },
            });

            const idsForUpdate = [];
            const idsForCreation = [];

            // Dispatcher-Phase: Asynchrone Aufteilung der IDs
            logger.info(`Starting dispatcher to classify ${ids.length} IDs...`);
            const classificationPromises = ids.map(async (tourID) => {
                let filePathSmallWebp = path.join(PUBLIC_DIR, gpxImagePath(tourID));
                try {
                    await fs.promises.stat(filePathSmallWebp);
                    idsForUpdate.push(tourID);
                } catch (e) {
                    if (e.code === "ENOENT") {
                        idsForCreation.push(tourID);
                    } else {
                        logger.error(`Error checking file for ID ${tourID}:`, e);
                        // Behandeln Sie andere Dateisystemfehler
                        idsForUpdate.push(tourID); // Update-Pfad als Fallback
                    }
                }
            });
            await Promise.all(classificationPromises);
            logger.info(
                `Dispatcher finished. Found ${idsForUpdate.length} IDs for update and ${idsForCreation.length} IDs for creation.`,
            );

            // Abarbeitungs-Phase: Startet die beiden Prozesse parallel
            await Promise.all([
                // Prozess 1: Datenbank-Updates parallel abarbeiten
                (async () => {
                    for (const tourID of idsForUpdate) {
                        dispatchDbUpdate(tourID, gpxImagePath(tourID), false);
                        if (updateQueue.length >= BATCH_SIZE) {
                            await flushUpdateQueue();
                        }
                    }
                    // Flush alle gepufferten Updates
                    await flushAllPendingUpdates();
                })(),

                // Prozess 2: Bildgenerierung (ohne Tile Pre-Warming)
                // Tile pre-warming is now handled by a separate Python script (scripts/prewarm_tiles.py)
                // Prozess 2: Bildgenerierung mit Worker-Pool langlebiger Tabs (Ad 2B)
                (async () => {
                    const PARALLEL_LIMIT = isProd ? 5 : 2;
                    const workerCount = Math.min(PARALLEL_LIMIT, idsForCreation.length);

                    logger.info(
                        `Starting image generation for ${idsForCreation.length} tours (workers: ${workerCount})...`,
                    );

                    if (workerCount === 0) {
                        logger.info("All image creations finished.");
                        return;
                    }

                    // Helper zum Erstellen und Konfigurieren eines Worker-Tabs
                    const createWorkerPage = async () => {
                        const page = await browser.newPage();
                        await page.emulateMediaType("print");
                        await page.setCacheEnabled(true); // Ad 1B: Browser-Cache aktiv
                        return page;
                    };

                    const pages = await Promise.all(
                        Array.from({ length: workerCount }, () => createWorkerPage()),
                    );

                    let currentIndex = 0;
                    let stopProcessing = false;
                    const errorImageTours = [];
                    let successCount = 0;

                    const runWorker = async (page, workerIdx) => {
                        if (workerIdx > 0) {
                            await delay(workerIdx * 200);
                        }

                        while (currentIndex < idsForCreation.length) {
                            if (stopProcessing) break;

                            if (isCutoffReached()) {
                                if (!stopProcessing) {
                                    logger.info(
                                        "Stopping image creation due to time cutoff (23:00).",
                                    );
                                    stopProcessing = true;
                                }
                                break;
                            }

                            const tourID = idsForCreation[currentIndex++];

                            let result;
                            try {
                                if (page.isClosed()) {
                                    logger.warn(
                                        `Worker ${workerIdx} page was closed, recreating for tour ${tourID}...`,
                                    );
                                    page = await createWorkerPage();
                                }
                                result = await processAndCreateImage(tourID, page, url);
                            } catch (pageErr) {
                                logger.error(
                                    `Worker ${workerIdx} error processing tour ${tourID}:`,
                                    pageErr,
                                );
                                result = "failed";
                            }

                            if (result === "error_image") {
                                errorImageTours.push(tourID);
                            } else if (result === "success") {
                                successCount++;
                                if (successCount % 100 === 0) {
                                    logger.info(
                                        `Progress: ${successCount}/${idsForCreation.length} images generated.`,
                                    );
                                }
                            }
                        }
                    };

                    try {
                        await Promise.all(pages.map((page, idx) => runWorker(page, idx)));

                        logger.info(
                            `Main image generation finished. ${errorImageTours.length} tours had error images.`,
                        );

                        // Retry loop for tours that had error images (Ad 4: 10s wait instead of 60s)
                        if (errorImageTours.length > 0 && !stopProcessing) {
                            logger.info(
                                `Waiting 10 seconds before retrying ${errorImageTours.length} failed tours...`,
                            );
                            await delay(10000);

                            logger.info(`Starting retry for ${errorImageTours.length} tours...`);

                            let retryIndex = 0;
                            const runRetryWorker = async (page) => {
                                while (retryIndex < errorImageTours.length) {
                                    if (stopProcessing || isCutoffReached()) {
                                        stopProcessing = true;
                                        break;
                                    }

                                    const tourID = errorImageTours[retryIndex++];
                                    let result;
                                    try {
                                        if (page.isClosed()) {
                                            page = await createWorkerPage();
                                        }
                                        result = await processAndCreateImage(tourID, page, url);
                                    } catch (retryErr) {
                                        logger.error(
                                            `Error in retry for tour ${tourID}:`,
                                            retryErr,
                                        );
                                        result = "failed";
                                    }

                                    if (result === "error_image") {
                                        logger.info(
                                            `Tour ${tourID} still failed after retry - setting placeholder.`,
                                        );
                                        await handleImagePlaceholder(tourID);
                                    }
                                }
                            };

                            await Promise.all(pages.map((page, idx) => runRetryWorker(page, idx)));
                            logger.info("Retry loop finished.");
                        }
                    } finally {
                        await Promise.all(pages.map((p) => p.close().catch(() => {})));
                    }

                    logger.info("All image creations finished.");
                })(),
            ]);

            // Finales Flush der Update-Queue (falls noch Updates ausstehen)
            await flushAllPendingUpdates();
        } catch (err) {
            logger.error("Error in createImagesFromMap:", err.message);
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }

    // Run the "clean and recreate" function only once at the end of the main process.
    // Only run when: not recursive AND before 23:00
    if (!isRecursiveCall) {
        if (!isCutoffReached()) {
            logger.info(`Starting final check for old images...`);
            await cleanAndRecreateOldImages();
            logger.info(`Final image check and recreation finished.`);
        } else {
            logger.info("Skipping cleanAndRecreateOldImages due to time cutoff (23:00).");
        }
    }
};

export const createImageFromMap = async (pageOrBrowser, filePath, url) => {
    let page;
    let shouldClose = false;
    try {
        if (pageOrBrowser && typeof pageOrBrowser.newPage === "function") {
            page = await pageOrBrowser.newPage();
            shouldClose = true;
            await page.emulateMediaType("print");
            await page.setCacheEnabled(true);
        } else {
            page = pageOrBrowser;
        }

        if (page) {
            await page.bringToFront();
            const safeUrl = url.replaceAll("localhost", "127.0.0.1");
            await page.goto(safeUrl, {
                timeout: 30000,
                waitUntil: "load",
            });

            // Ad 1A: Warte auf Event vom headless Leaflet (__MAP_READY__)
            try {
                await page.waitForFunction(
                    "window.__MAP_READY__ === true || window.__MAP_ERROR__ === true",
                    { timeout: 25000 },
                );
            } catch {
                logger.warn(`Wait for map ready timed out on ${safeUrl}`);
            }

            // Sicherheitsabstand von 100ms
            await delay(100);

            const screenshotOpts = { type: "png" };
            if (filePath) {
                screenshotOpts.path = filePath;
            }
            const result = await page.screenshot(screenshotOpts);
            return result;
        }
        return null;
    } catch (err) {
        logger.error("Error in createImageFromMap:", err.message);
        return null;
    } finally {
        if (shouldClose && page) {
            await page.close().catch(() => {});
        }
    }
};

export const mergeGpxFilesToOne = async (fileMain, fileAnreise, fileAbreise) => {
    let trackAnreise = await getSequenceFromFile(fileAnreise);
    let trackAbreise = await getSequenceFromFile(fileAbreise);
    try {
        if (fileMain) {
            const fileContent = await fs.readFile(fileMain, "utf-8");
            let json = convertXML.xml2js(fileContent);
            if (json && json.elements.length > 0 && json.elements[0].elements) {
                if (!!trackAnreise && trackAnreise.elements) {
                    json.elements[0].elements.splice(0, 0, trackAnreise);
                }
                if (!!trackAbreise && trackAbreise.elements) {
                    json.elements[0].elements.push(trackAbreise);
                }
            }
            const doc = create(convertXML.js2xml(json));
            return doc.end({ prettyPrint: true });
        }
    } catch (e) {
        logger.error(e);
    }

    return null;
};

const getSequenceFromFile = async (file) => {
    try {
        const fileContent = await fs.readFile(file, "utf-8");
        if (fileContent) {
            const jsObj = convertXML.xml2js(fileContent);
            if (!!jsObj && jsObj.elements.length > 0 && jsObj.elements[0].elements.length > 0) {
                const found = jsObj.elements[0].elements[0];
                return found;
            }
        }
    } catch (e) {
        logger.error(e);
    }
    return null;
};

/**
 * Get all distinct hashed_url values that have at least one GPX point
 * within `radius` metres of the supplied latitude/longitude.
 *
 * @param {number} lat    – latitude of the centre point (decimal degrees)
 * @param {number} lon    – longitude of the centre point (decimal degrees)
 * @param {number} radius – search radius in metres (e.g. 100)
 * @returns {Promise<string[]> | Promise<null>} array of hashed_url strings
 */
export async function hashedUrlsFromPoi(lat, lon, radius) {
    try {
        const sql = `
            SELECT DISTINCT hashed_url
            FROM gpx as g
            WHERE earth_box(ll_to_earth(:lat, :lon), :radius) @> ll_to_earth(g.lat, g.lon)
                AND earth_distance(
                ll_to_earth(g.lat, g.lon),
                ll_to_earth(:lat, :lon)
              ) <= :radius;
            `;
        const result = await knex.raw(sql, { lat, lon, radius });
        if (!result) return [];
        const rows = (function (res) {
            if (!res) return [];
            if (Array.isArray(res)) return res[0] || [];
            return res.rows || [];
        })(result);
        return rows.map((r) => r.hashed_url);
    } catch (e) {
        logger.error(
            `Error obtaining tours within radius ${radius} from lat=${lat} and lon=${lon}:`,
            e,
        );
        return null;
    }
}
