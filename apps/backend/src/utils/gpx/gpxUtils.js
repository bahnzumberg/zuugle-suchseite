import puppeteer from "puppeteer";
import path from "path";
import fs from "fs-extra";
import sharp from "sharp";
import convertXML from "xml-js";
import { create } from "xmlbuilder2";
import { setTimeout as delay } from "node:timers/promises";
import knex from "../../knex";
import { getHost } from "../utils";
import crypto from "crypto";
import logger from "../logger";

// Error image detection - stores hashes of known error images (London, 502, white, etc.)
// To add a new error image: just add the filename to ERROR_IMAGE_FILES
const ERROR_IMAGE_FILES = ["error-london.webp", "error-502.webp", "error-white.webp"];
const errorImageHashes = new Set();

// Konstanten für Batch-Update-Queue
const BATCH_SIZE = 500; // Updates werden alle 500 Bilder gebatcht
const MAX_RETRIES = 3; // Maximale Anzahl Wiederholungsversuche bei DB-Fehlern
const RETRY_DELAY_MS = 30000; // Wartezeit zwischen Retries (30 Sekunden)

// Batch-Update-Queue für effiziente DB-Updates
const updateQueue = [];
let flushPromise = null; // Verhindert parallele Flush-Aufrufe

const createImageHash = async (imagePath) => {
    try {
        const imageBuffer = await sharp(imagePath).toBuffer();
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
const isErrorImage = async (imagePath) => {
    if (errorImageHashes.size === 0) {
        logger.error("Error image hashes not initialized.");
        return false;
    }

    try {
        const hash = await createImageHash(imagePath);
        return errorImageHashes.has(hash);
    } catch (e) {
        logger.error("Error checking image:", e);
        return false;
    }
};

const minimal_args = [
    "--autoplay-policy=user-gesture-required",
    "--disable-background-networking",
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
 * Fügt ein Update zur Queue hinzu und flusht automatisch bei BATCH_SIZE
 * @param {number} tourId - Tour ID
 * @param {string} imageUrl - Bild-URL
 * @param {boolean} force - Überschreiben auch wenn nicht NULL
 */
const queueDbUpdate = (tourId, imageUrl, force = false) => {
    if (!tourId || !imageUrl || imageUrl.length === 0) return;

    // URL normalisieren für lokale Entwicklung
    let normalizedUrl = imageUrl;
    if (imageUrl.substring(0, 4) !== "http") {
        if (process.env.NODE_ENV !== "production") {
            normalizedUrl = getHost("") + imageUrl;
        }
    }

    updateQueue.push({ tourId, imageUrl: normalizedUrl, force });

    // Automatisch flushen wenn BATCH_SIZE erreicht
    if (updateQueue.length >= BATCH_SIZE) {
        flushUpdateQueue();
    }
};

/**
 * Flusht die Update-Queue und führt Batch-UPDATE aus
 * @param {number} retryCount - Aktueller Retry-Versuch
 */
const flushUpdateQueue = async (retryCount = 0) => {
    if (updateQueue.length === 0) return;

    // Verhindere parallele Flush-Aufrufe
    if (flushPromise && retryCount === 0) {
        await flushPromise;
    }

    const batch = updateQueue.splice(0, Math.min(updateQueue.length, BATCH_SIZE));
    if (batch.length === 0) return;

    // Trenne force und non-force Updates
    const forceUpdates = batch.filter((u) => u.force);
    const normalUpdates = batch.filter((u) => !u.force);

    const executeUpdate = async (updates, isForce) => {
        if (updates.length === 0) return;

        try {
            // Baue CASE-Statement für Batch-Update
            const caseStatements = updates
                .map(
                    ({ tourId, imageUrl }) =>
                        `WHEN ${tourId} THEN '${imageUrl.replace(/'/g, "''")}'`,
                )
                .join(" ");
            const ids = updates.map((u) => u.tourId).join(",");

            // city2tour_flat wird via Database-Trigger aktualisiert
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
                // Zurück in Queue für Retry
                updateQueue.unshift(...updates);
                return flushUpdateQueue(retryCount + 1);
            } else {
                logger.error(`Batch update failed after ${MAX_RETRIES} retries:`, e);
                // Bei totalem Fehlschlag: Einzelne Updates als Fallback
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
                        logger.error(
                            `Individual update failed for tour ${tourId}:`,
                            individualError,
                        );
                    }
                }
            }
        }
    };

    flushPromise = (async () => {
        await executeUpdate(forceUpdates, true);
        await executeUpdate(normalUpdates, false);
    })();

    await flushPromise;
    flushPromise = null;
};

/**
 * Flusht alle verbleibenden Updates am Ende der Verarbeitung
 */
const flushAllPendingUpdates = async () => {
    while (updateQueue.length > 0) {
        await flushUpdateQueue();
    }
    logger.info("All pending DB updates flushed.");
};

// Legacy-Funktion für Kompatibilität (wird intern auf Queue umgeleitet)
const dispatchDbUpdate = (tourId, imageUrl, force) => {
    queueDbUpdate(tourId, imageUrl, force);
};

// Neue Hilfsfunktion für die Fehlerbehandlung und Platzhaltersetzung
const handleImagePlaceholder = async (tourId, useCDN) => {
    try {
        const result = await knex.raw(`SELECT range_slug FROM tour AS t WHERE t.id=${tourId}`);
        const rangeSlug = result.rows && result.rows.length > 0 ? result.rows[0].range_slug : null;

        if (rangeSlug) {
            const imageUrl = `/public/range-image/${rangeSlug}.webp`;
            logger.info(`Found range_slug "${rangeSlug}", setting specific image URL.`);
            await dispatchDbUpdate(
                tourId,
                useCDN ? `https://cdn.zuugle.at/range-image/${rangeSlug}.webp` : imageUrl,
                true,
            );
        } else {
            logger.info("No range_slug found, setting generic placeholder.");
            await dispatchDbUpdate(
                tourId,
                useCDN
                    ? "https://cdn.zuugle.at/img/train_placeholder.webp"
                    : "/app_static/img/train_placeholder.webp",
                true,
            );
        }
    } catch (e) {
        logger.error("Error in handleImagePlaceholder:", e);
        await dispatchDbUpdate(
            tourId,
            useCDN
                ? "https://cdn.zuugle.at/img/train_placeholder.webp"
                : "/app_static/img/train_placeholder.webp",
            true,
        );
    }
};

// Neue Hilfsfunktion für die Bildgenerierung
// Returns: 'success' | 'error_image' | 'failed'
const processAndCreateImage = async (tourId, lastTwoChars, browser, useCDN, dir_go_up, url) => {
    let dirPath = path.join(__dirname, dir_go_up, "public/gpx-image/" + lastTwoChars + "/");
    let filePath = path.join(dirPath, tourId + "_gpx.png");
    let filePathSmallWebp = path.join(dirPath, tourId + "_gpx_small.webp");
    const MAX_GENERATION_TIME = 300000;

    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }

        const generationPromise = createImageFromMap(
            browser,
            filePath,
            url + lastTwoChars + "/" + tourId + ".gpx",
            100,
        );
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error("Image generation timeout")), MAX_GENERATION_TIME);
        });

        await Promise.race([generationPromise, timeoutPromise]);

        if (fs.existsSync(filePath)) {
            try {
                await sharp(filePath)
                    .resize({
                        width: 784,
                        height: 523,
                        fit: "inside",
                    })
                    .webp({ quality: 15 })
                    .toFile(filePathSmallWebp);
            } catch (e) {
                logger.warn(`gpxUtils.sharp.resize error for tour ${tourId}: ${e.message}`);
                // Try to delete corrupt source file
                try {
                    if (await fs.pathExists(filePath)) {
                        await fs.unlink(filePath);
                    }
                } catch {
                    // ignore
                }
                return "error_image"; // Trigger retry
            }

            if (fs.existsSync(filePathSmallWebp)) {
                try {
                    await fs.unlink(filePath);
                } catch {
                    // ignore ENOENT
                }
                const isError = await isErrorImage(filePathSmallWebp);
                if (isError) {
                    logger.info(`Detected error image for tour ${tourId} - will retry later.`);
                    try {
                        await fs.unlink(filePathSmallWebp);
                    } catch {
                        // ignore ENOENT
                    }
                    return "error_image"; // Don't set placeholder yet - allow retry
                } else {
                    logger.debug("Gpx image small file created:", filePathSmallWebp);
                    if (useCDN) {
                        dispatchDbUpdate(
                            tourId,
                            "https://cdn.zuugle.at/gpx-image/" +
                                lastTwoChars +
                                "/" +
                                tourId +
                                "_gpx_small.webp",
                            true,
                        );
                    } else {
                        dispatchDbUpdate(
                            tourId,
                            "/public/gpx-image/" + lastTwoChars + "/" + tourId + "_gpx_small.webp",
                            true,
                        );
                    }
                    return "success";
                }
            } else {
                logger.warn("NO gpx image small file created for tour", tourId);
                handleImagePlaceholder(tourId, useCDN);
                return "failed";
            }
        } else {
            logger.warn("NO image file created:", filePath);
            handleImagePlaceholder(tourId, useCDN);
            return "failed";
        }
    } catch (e) {
        if (e.message === "Image generation timeout") {
            logger.error(`Timeout for image generation for ID ${tourId}:`, e.message);
        } else {
            logger.error(`Error in processAndCreateImage for ID ${tourId}:`, e);
        }

        handleImagePlaceholder(tourId, useCDN);
        return "failed";
    }
};

// Neue Funktion zur Überprüfung und Neuerstellung alter Bilder
const cleanAndRecreateOldImages = async (dir_go_up) => {
    let idsToRecreate = [];
    const allToursWithImages = await knex.raw(
        `SELECT id FROM tour WHERE image_url NOT LIKE 'https://cdn.bahn-zum-berg.at%';`,
    );
    const thirtyDaysInMs = 259200000; //TODO: this is temporarily set to 3 days, set back to 30 days when all images have been updated

    for (const row of allToursWithImages.rows) {
        const id = row.id;
        const lastTwoChars = last_two_characters(id);
        const filePath = path.join(
            __dirname,
            dir_go_up,
            "public/gpx-image/",
            lastTwoChars,
            id + "_gpx_small.webp",
        );

        try {
            const stats = await fs.promises.stat(filePath);
            const isOlderThan30Days = Date.now() - stats.mtimeMs > thirtyDaysInMs;
            const shouldBeDeleted = Math.random() < 0.1;

            if (isOlderThan30Days && shouldBeDeleted) {
                logger.info(`Deleting old image for tour ID ${id}.`);
                await fs.promises.unlink(filePath);
                idsToRecreate.push(id);
            }
        } catch (e) {
            if (e.code === "ENOENT") {
                logger.info(`Image for tour ID ${id} not found on disk. Adding to recreate list.`);
                idsToRecreate.push(id);
            } else {
                logger.error(`Error checking file for ID ${id}:`, e);
            }
        }
    }

    if (idsToRecreate.length > 0) {
        logger.info(
            `Found ${idsToRecreate.length} images to recreate. Restarting image generation process...`,
        );
        await createImagesFromMap(idsToRecreate, true); // Übergibt das Flag 'true' um keine weitere Rekursion zuzulassen
    } else {
        logger.info(`No old images found to recreate.`);
    }
};

export const createImagesFromMap = async (ids, isRecursiveCall = false) => {
    let addParam = {};
    let url = "";
    let isProd = false;
    if (process.env.NODE_ENV == "production") {
        isProd = true;
    }

    // useCDN is true only if: isProd=true AND (USE_CDN is not set OR USE_CDN="true")
    // useCDN is false if: isProd=false OR USE_CDN="false"
    const useCDN = isProd && process.env.USE_CDN !== "false";
    logger.info("USE_CDN:", useCDN);

    // We need to distingiush between local development and production (like) server environment
    let dir_go_up = "";
    if (process.env.NODE_ENV == "production") {
        dir_go_up = "../../";
    } else {
        dir_go_up = "../../../";
    }

    // Initialize error image hashes (London, 502, white, etc.)
    await initErrorImageHashes();

    if (ids) {
        let browser;
        try {
            if (isProd) {
                url =
                    // TODO: shouldn't that depend on the current environment? I.e. dev/uat/prod?
                    "https://www.zuugle.at/public/headless-leaflet/index.html?gpx=https://www.zuugle.at/public/gpx/";
                // Puppeteer v24+ automatically manages Chrome downloads, no need to specify executablePath
            } else {
                url =
                    "http://localhost:8080/public/headless-leaflet/index.html?gpx=http://localhost:8080/public/gpx/";
            }

            browser = await puppeteer.launch({
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--window-size=1200,800",
                    ...minimal_args,
                ],
                protocolTimeout: 240000,
                defaultViewport: { width: 1200, height: 800 },
                ...addParam,
            });

            const idsForUpdate = [];
            const idsForCreation = [];

            // Dispatcher-Phase: Asynchrone Aufteilung der IDs
            logger.info(`Starting dispatcher to classify ${ids.length} IDs...`);
            const classificationPromises = ids.map(async (tourID) => {
                let lastTwoChars = last_two_characters(tourID);
                let dirPath = path.join(
                    __dirname,
                    dir_go_up,
                    "public/gpx-image/" + lastTwoChars + "/",
                );
                let filePathSmallWebp = path.join(dirPath, tourID + "_gpx_small.webp");
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
                        let lastTwoChars = last_two_characters(tourID);
                        if (useCDN) {
                            dispatchDbUpdate(
                                tourID,
                                "https://cdn.zuugle.at/gpx-image/" +
                                    lastTwoChars +
                                    "/" +
                                    tourID +
                                    "_gpx_small.webp",
                                false,
                            );
                        } else {
                            dispatchDbUpdate(
                                tourID,
                                "/public/gpx-image/" +
                                    lastTwoChars +
                                    "/" +
                                    tourID +
                                    "_gpx_small.webp",
                                false,
                            );
                        }
                    }
                    // Flush alle gepufferten Updates
                    await flushAllPendingUpdates();
                })(),

                // Prozess 2: Bildgenerierung (ohne Tile Pre-Warming)
                // Tile pre-warming is now handled by a separate Python script (scripts/prewarm_tiles.py)
                (async () => {
                    const PARALLEL_LIMIT = isProd ? 5 : 2;

                    logger.info(`Starting image generation for ${idsForCreation.length} tours...`);

                    // Simple parallel processing without tile checking
                    async function asyncPool(poolLimit, array, iteratorFn) {
                        const ret = [];
                        const executing = [];
                        for (const item of array) {
                            const p = Promise.resolve().then(() => iteratorFn(item, array));
                            ret.push(p);

                            if (poolLimit <= array.length) {
                                const e = p.then(() => executing.splice(executing.indexOf(e), 1));
                                executing.push(e);
                                if (executing.length >= poolLimit) {
                                    await Promise.race(executing);
                                }
                            }
                        }
                        return Promise.all(ret);
                    }

                    let stopProcessing = false;
                    const errorImageTours = []; // Tours that generated error images
                    let successCount = 0; // Counter for successfully generated images

                    // Main processing loop
                    await asyncPool(PARALLEL_LIMIT, idsForCreation, async (tourID) => {
                        if (stopProcessing) return;

                        // Check time limit
                        const currentHour = new Date().getHours();
                        if (currentHour >= 23) {
                            if (!stopProcessing) {
                                logger.info("Stopping image creation due to time limit (23:00).");
                                stopProcessing = true;
                            }
                            return;
                        }

                        // Small jitter to avoid thundering herd
                        const jitter = Math.floor(Math.random() * 1000);
                        await new Promise((resolve) => setTimeout(resolve, jitter));

                        let lastTwoChars = last_two_characters(tourID);
                        const result = await processAndCreateImage(
                            tourID,
                            lastTwoChars,
                            browser,
                            useCDN,
                            dir_go_up,
                            url,
                        );

                        if (result === "error_image") {
                            errorImageTours.push(tourID);
                        } else if (result === "success") {
                            successCount++;
                            if (successCount % 1000 === 0) {
                                logger.info(
                                    `Progress: ${successCount} images successfully generated.`,
                                );
                            }
                        }
                    });

                    logger.info(
                        `Main image generation finished. ${errorImageTours.length} tours had error images.`,
                    );

                    // Retry loop for tours that had error images
                    if (errorImageTours.length > 0 && !stopProcessing) {
                        logger.info(
                            `Waiting 60 seconds before retrying ${errorImageTours.length} failed tours...`,
                        );
                        await new Promise((resolve) => setTimeout(resolve, 60000));

                        logger.info(`Starting retry for ${errorImageTours.length} tours...`);

                        await asyncPool(PARALLEL_LIMIT, errorImageTours, async (tourID) => {
                            if (stopProcessing) return;

                            const currentHour = new Date().getHours();
                            if (currentHour >= 23) {
                                stopProcessing = true;
                                return;
                            }

                            const jitter = Math.floor(Math.random() * 1000);
                            await new Promise((resolve) => setTimeout(resolve, jitter));

                            let lastTwoChars = last_two_characters(tourID);
                            const result = await processAndCreateImage(
                                tourID,
                                lastTwoChars,
                                browser,
                                useCDN,
                                dir_go_up,
                                url,
                            );

                            // If still error_image after retry, set placeholder
                            if (result === "error_image") {
                                logger.info(
                                    `Tour ${tourID} still failed after retry - setting placeholder.`,
                                );
                                handleImagePlaceholder(tourID, useCDN);
                            }
                        });

                        logger.info("Retry loop finished.");
                    }

                    logger.info("All image creations finished.");
                })(),
            ]);

            // Track if there were pending tours (for final cleanup decision)
            // This is a simplified check - in practice pendingTours from the async block
            // would need to be communicated differently, but time check is the main gate

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

    // Die "clean and recreate" Funktion nur einmal am Ende des Hauptprozesses ausführen
    // Nur ausführen wenn: nicht rekursiv UND vor 23:00
    if (!isRecursiveCall) {
        const currentHour = new Date().getHours();

        if (currentHour < 23) {
            logger.info(`Starting final check for old images...`);
            await cleanAndRecreateOldImages(dir_go_up);
            logger.info(`Final image check and recreation finished.`);
        } else {
            logger.info("Skipping cleanAndRecreateOldImages due to time limit (23:00+).");
        }

        // Note: Tile pre-warming is now handled by a separate Python script (scripts/prewarm_tiles.py)
        // Run it before image generation with: python3 scripts/prewarm_tiles.py
    }
};

export const createImageFromMap = async (browser, filePath, url) => {
    try {
        if (filePath) {
            const page = await browser.newPage();
            if (page) {
                await page.emulateMediaType("print");
                await page.setCacheEnabled(false);
                const safeUrl = url.replace("localhost", "127.0.0.1");
                await page.goto(safeUrl, {
                    timeout: 30000,
                    waitUntil: "networkidle2",
                });
                await delay(10000);
                await page.bringToFront();
                await page.screenshot({ path: filePath, type: "png" });
                await page.close();
            }
        }
    } catch (err) {
        logger.error("Error in createImageFromMap, could not generate:", filePath);
        logger.error("Error message:", err.message);
    }
};

export function last_two_characters(original) {
    if (original) {
        const new_string = "" + original;

        if (new_string.length >= 2) {
            return new_string.substring(new_string.length - 2).toString();
        } else if (new_string.length == 1) {
            return "0" + new_string;
        } else {
            return "00";
        }
    } else {
        return "00";
    }
}

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
