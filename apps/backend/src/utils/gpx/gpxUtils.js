import puppeteer from "puppeteer";
import path from "path";
import fs from "fs-extra";
import sharp from "sharp";
import convertXML from "xml-js";
import { create } from "xmlbuilder2";
import moment from "moment";
import { setTimeout as delay } from "node:timers/promises";
import knex from "../../knex";
import { getHost } from "../utils";
import crypto from "crypto";

// Global variable to store the hash of the London reference image.
let londonReferenceHash = null;
let error502ReferenceHash = null;

// Konstanten und globale Warteschlangen für die Parallelisierung
const MAX_PARALLEL_DB_UPDATES = 5;
const activeDbUpdates = []; // Warteschlange für Datenbank-Updates

const createLondonReferenceHash = async (imagePath) => {
    try {
        const imageBuffer = await sharp(imagePath).toBuffer();
        const hash = crypto.createHash("sha256").update(imageBuffer).digest("hex");
        return hash;
    } catch (e) {
        console.error("Error creating London reference hash:", e);
        return null;
    }
};

// New helper function to check if an image is the London placeholder.
const isImageLondon = async (imagePath) => {
    if (!londonReferenceHash) {
        console.error("London reference hash is not available.");
        return false;
    }

    try {
        const imageBuffer = await sharp(imagePath).toBuffer();
        const hash = crypto.createHash("sha256").update(imageBuffer).digest("hex");

        // Simple comparison of the SHA-256 hash.
        if (hash === londonReferenceHash || hash === error502ReferenceHash) {
            return true;
        }
    } catch (e) {
        console.error("Error checking image:", e);
    }

    return false;
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

// ============================================================================
// Tile Pre-Warming Functions
// ============================================================================

// Map dimensions used by headless-leaflet (from gpxUtils createImageFromMap viewport)
const MAP_WIDTH = 1200;
const MAP_HEIGHT = 800;
const TILE_SERVER_API = "https://tile.bahnzumberg.at/api/check-tiles";
const TILE_CHECK_BATCH_SIZE = 1000;

/**
 * Calculate bounding box from GPX data for a tour
 */
const calculateBoundingBox = async (tourId) => {
    try {
        const result = await knex.raw(`
            SELECT MIN(lat) as min_lat, MAX(lat) as max_lat,
                   MIN(lon) as min_lon, MAX(lon) as max_lon
            FROM gpx WHERE hashed_url = (SELECT hashed_url FROM tour WHERE id = ${tourId})
        `);
        if (result.rows && result.rows.length > 0) {
            return result.rows[0];
        }
    } catch (e) {
        console.error(`Error calculating bounding box for tour ${tourId}:`, e);
    }
    return null;
};

/**
 * Convert longitude to tile X coordinate
 */
const lonToTileX = (lon, zoom) => {
    return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
};

/**
 * Convert latitude to tile Y coordinate
 */
const latToTileY = (lat, zoom) => {
    const latRad = (lat * Math.PI) / 180;
    return Math.floor(
        ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * Math.pow(2, zoom),
    );
};

/**
 * Calculate zoom level that fitBounds would use (matching Leaflet behavior)
 * Based on 1200x800 viewport with 15% padding
 */
const calculateZoomLevel = (bounds) => {
    if (!bounds || !bounds.min_lat || !bounds.max_lat || !bounds.min_lon || !bounds.max_lon) {
        return 14; // Default fallback
    }

    // Find the highest zoom level that fits the bounds in 1200x800 viewport
    for (let z = 17; z >= 1; z--) {
        const tilesX = lonToTileX(bounds.max_lon, z) - lonToTileX(bounds.min_lon, z) + 1;
        const tilesY = latToTileY(bounds.min_lat, z) - latToTileY(bounds.max_lat, z) + 1;

        if (tilesX * 256 <= MAP_WIDTH && tilesY * 256 <= MAP_HEIGHT) {
            return z;
        }
    }
    return 10; // Minimum reasonable zoom
};

/**
 * Get all tile coordinates for a bounding box at a given zoom level
 */
const getTilesForBounds = (bounds, zoom) => {
    if (!bounds || !bounds.min_lat) return [];

    const tiles = [];
    const minX = lonToTileX(bounds.min_lon, zoom);
    const maxX = lonToTileX(bounds.max_lon, zoom);
    const minY = latToTileY(bounds.max_lat, zoom); // Note: Y is inverted
    const maxY = latToTileY(bounds.min_lat, zoom);

    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            tiles.push(`${zoom}/${x}/${y}`);
        }
    }
    return tiles;
};

/**
 * Check tile availability via tile server API (with automatic batching)
 */
const checkTilesAvailability = async (tiles) => {
    if (!tiles || tiles.length === 0) {
        return new Set();
    }

    const allMissing = new Set();

    // Split into batches
    for (let i = 0; i < tiles.length; i += TILE_CHECK_BATCH_SIZE) {
        const batch = tiles.slice(i, i + TILE_CHECK_BATCH_SIZE);
        try {
            const response = await fetch(TILE_SERVER_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tiles: batch }),
            });
            const data = await response.json();
            if (data.missing && Array.isArray(data.missing)) {
                data.missing.forEach((t) => allMissing.add(t));
            }
        } catch (e) {
            console.error(`Error checking tiles batch ${i / TILE_CHECK_BATCH_SIZE + 1}:`, e);
            // On API error, assume all tiles in batch are missing (conservative approach)
            batch.forEach((t) => allMissing.add(t));
        }
    }

    return allMissing;
};

// ============================================================================
// End Tile Pre-Warming Functions
// ============================================================================

const setTourImageURL = async (tour_id, image_url, force = false) => {
    if (tour_id) {
        if (image_url.length > 0) {
            if (image_url.substring(0, 4) !== "http") {
                image_url = getHost("") + image_url;
            }

            try {
                if (force) {
                    await knex.raw(`UPDATE tour SET image_url='${image_url}' WHERE id=${tour_id};`);
                    await knex.raw(
                        `UPDATE city2tour_flat SET image_url='${image_url}' WHERE id=${tour_id};`,
                    );
                } else {
                    await knex.raw(
                        `UPDATE tour SET image_url='${image_url}' WHERE id=${tour_id} AND image_url IS NULL;`,
                    );
                    await knex.raw(
                        `UPDATE city2tour_flat SET image_url='${image_url}' WHERE id=${tour_id} AND image_url IS NULL;`,
                    );
                }
            } catch (e) {
                console.error(`Error in setTourImageURL with tour_id=${tour_id}: `, e);
            }
        }
    }
};

// Hilfsfunktion, um auf einen freien Slot zu warten
const waitForFreeSlot = async (queue, maxConcurrency) => {
    while (queue.length >= maxConcurrency) {
        await delay(50);
    }
};

const dispatchDbUpdate = async (tourId, imageUrl, force) => {
    await waitForFreeSlot(activeDbUpdates, MAX_PARALLEL_DB_UPDATES);
    const updatePromise = setTourImageURL(tourId, imageUrl, force);
    activeDbUpdates.push(updatePromise);
    updatePromise.finally(() => {
        const index = activeDbUpdates.indexOf(updatePromise);
        if (index > -1) {
            activeDbUpdates.splice(index, 1);
        }
    });
    return updatePromise;
};

// Neue Hilfsfunktion für die Fehlerbehandlung und Platzhaltersetzung
const handleImagePlaceholder = async (tourId, useCDN) => {
    try {
        const result = await knex.raw(`SELECT range_slug FROM tour AS t WHERE t.id=${tourId}`);
        const rangeSlug = result.rows && result.rows.length > 0 ? result.rows[0].range_slug : null;

        if (rangeSlug) {
            const imageUrl = `/public/range-image/${rangeSlug}.webp`;
            console.log(
                moment().format("YYYY-MM-DD HH:mm:ss"),
                ` Found range_slug "${rangeSlug}", setting specific image URL.`,
            );
            await dispatchDbUpdate(
                tourId,
                useCDN ? `https://cdn.zuugle.at/range-image/${rangeSlug}.webp` : imageUrl,
                true,
            );
        } else {
            console.log(
                moment().format("YYYY-MM-DD HH:mm:ss"),
                " No range_slug found, setting generic placeholder.",
            );
            await dispatchDbUpdate(
                tourId,
                useCDN
                    ? "https://cdn.zuugle.at/img/train_placeholder.webp"
                    : "/app_static/img/train_placeholder.webp",
                true,
            );
        }
    } catch (e) {
        console.error("Error in handleImagePlaceholder:", e);
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
                console.error("gpxUtils.sharp.resize error: ", e);
            }

            if (fs.existsSync(filePathSmallWebp)) {
                await fs.unlink(filePath);
                const isLondonImage = await isImageLondon(filePathSmallWebp);

                if (isLondonImage) {
                    console.log(
                        moment().format("YYYY-MM-DD HH:mm:ss"),
                        " Detected London placeholder, replacing with standard image.",
                    );
                    await fs.unlink(filePathSmallWebp);
                    handleImagePlaceholder(tourId, useCDN);
                } else {
                    console.log(
                        moment().format("YYYY-MM-DD HH:mm:ss"),
                        " Gpx image small file created: " + filePathSmallWebp,
                    );
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
                }
            } else {
                console.log(
                    moment().format("YYYY-MM-DD HH:mm:ss"),
                    " NO gpx image small file created, replacing with standard image.",
                );
                handleImagePlaceholder(tourId, useCDN);
            }
        } else {
            console.log(
                moment().format("YYYY-MM-DD HH:mm:ss"),
                " NO image file created: " + filePath,
            );
            handleImagePlaceholder(tourId, useCDN);
        }
    } catch (e) {
        if (e.message === "Image generation timeout") {
            console.error(
                moment().format("YYYY-MM-DD HH:mm:ss"),
                `Timeout for image generation for ID ${tourId}: ${e.message}`,
            );
        } else {
            console.error(`Error in processAndCreateImage for ID ${tourId}:`, e);
        }

        handleImagePlaceholder(tourId, useCDN);
    }
};

// Pre-warm tiles for images older than 30 days (they will be deleted soon)
const preWarmOldImageTiles = async (dir_go_up) => {
    const thirtyDaysInMs = 2592000000;
    const allTiles = new Set();

    console.log(
        moment().format("YYYY-MM-DD HH:mm:ss"),
        "Pre-warming tiles for images older than 30 days...",
    );

    const allTours = await knex.raw(
        `SELECT id FROM tour WHERE image_url NOT LIKE 'https://cdn.bahn-zum-berg.at%';`,
    );

    for (const row of allTours.rows) {
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

            if (isOlderThan30Days) {
                // Calculate tiles for this tour
                const bounds = await calculateBoundingBox(id);
                if (bounds && bounds.min_lat) {
                    const zoom = calculateZoomLevel(bounds);
                    const tiles = getTilesForBounds(bounds, zoom);
                    tiles.forEach((t) => allTiles.add(t));
                }
            }
        } catch (e) {
            // File doesn't exist - we need the tiles for when the image gets generated
            if (e.code === "ENOENT") {
                const bounds = await calculateBoundingBox(id);
                if (bounds && bounds.min_lat) {
                    const zoom = calculateZoomLevel(bounds);
                    const tiles = getTilesForBounds(bounds, zoom);
                    tiles.forEach((t) => allTiles.add(t));
                }
            }
        }
    }

    if (allTiles.size > 0) {
        console.log(
            moment().format("YYYY-MM-DD HH:mm:ss"),
            `Sending ${allTiles.size} tiles from old images to tile server for pre-warming...`,
        );
        // Just call the API to queue the tiles - we don't care about the response
        await checkTilesAvailability([...allTiles]);
        console.log(moment().format("YYYY-MM-DD HH:mm:ss"), "Pre-warming request sent.");
    } else {
        console.log(moment().format("YYYY-MM-DD HH:mm:ss"), "No old images found for pre-warming.");
    }
};

// Neue Funktion zur Überprüfung und Neuerstellung alter Bilder
const cleanAndRecreateOldImages = async (dir_go_up) => {
    let idsToRecreate = [];
    const allToursWithImages = await knex.raw(
        `SELECT id FROM tour WHERE image_url NOT LIKE 'https://cdn.bahn-zum-berg.at%';`,
    );
    const thirtyDaysInMs = 2592000000;

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
                console.log(
                    moment().format("YYYY-MM-DD HH:mm:ss"),
                    `Deleting old image for tour ID ${id}.`,
                );
                await fs.promises.unlink(filePath);
                idsToRecreate.push(id);
            }
        } catch (e) {
            if (e.code === "ENOENT") {
                console.log(
                    moment().format("YYYY-MM-DD HH:mm:ss"),
                    `Image for tour ID ${id} not found on disk. Adding to recreate list.`,
                );
                idsToRecreate.push(id);
            } else {
                console.error(`Error checking file for ID ${id}: `, e);
            }
        }
    }

    if (idsToRecreate.length > 0) {
        console.log(
            moment().format("YYYY-MM-DD HH:mm:ss"),
            `Found ${idsToRecreate.length} images to recreate. Restarting image generation process...`,
        );
        await createImagesFromMap(idsToRecreate, true); // Übergibt das Flag 'true' um keine weitere Rekursion zuzulassen
    } else {
        console.log(moment().format("YYYY-MM-DD HH:mm:ss"), `No old images found to recreate.`);
    }
};

export const createImagesFromMap = async (ids, isRecursiveCall = false) => {
    let addParam = {};
    let url = "";
    let isProd = false;
    if (process.env.NODE_ENV == "production") {
        isProd = true;
    }

    console.log("USE_CDN: ", process.env.USE_CDN);
    console.log("NODE_ENV: ", process.env.NODE_ENV);
    // useCDN is true only if: isProd=true AND (USE_CDN is not set OR USE_CDN="true")
    // useCDN is false if: isProd=false OR USE_CDN="false"
    const useCDN = isProd && process.env.USE_CDN !== "false";
    console.log("USE_CDN: ", useCDN);

    // We need to distingiush between local development and production (like) server environment
    let dir_go_up = "";
    if (process.env.NODE_ENV == "production") {
        dir_go_up = "../../";
    } else {
        dir_go_up = "../../../";
    }

    // This should be done only once when the function is first called.
    if (!londonReferenceHash) {
        const londonImagePath = path.join(__dirname, dir_go_up, "public/london.webp");
        if (fs.existsSync(londonImagePath)) {
            londonReferenceHash = await createLondonReferenceHash(londonImagePath);
            console.log("London reference hash created:", londonReferenceHash);
        } else {
            console.error("London reference image not found:", londonImagePath);
        }

        const error502ImagePath = path.join(__dirname, dir_go_up, "public/502-error.webp");
        if (fs.existsSync(error502ImagePath)) {
            error502ReferenceHash = await createLondonReferenceHash(error502ImagePath);
            console.log("502 reference hash created:", error502ReferenceHash);
        } else {
            console.error("502-error reference image not found:", error502ReferenceHash);
        }
    }

    if (ids) {
        let browser;
        try {
            if (isProd) {
                url =
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
            console.log(
                moment().format("YYYY-MM-DD HH:mm:ss"),
                `Starting dispatcher to classify ${ids.length} IDs...`,
            );
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
                        console.error(`Error checking file for ID ${tourID}:`, e);
                        // Behandeln Sie andere Dateisystemfehler
                        idsForUpdate.push(tourID); // Update-Pfad als Fallback
                    }
                }
            });
            await Promise.all(classificationPromises);
            console.log(
                moment().format("YYYY-MM-DD HH:mm:ss"),
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
                    while (activeDbUpdates.length > 0) {
                        await new Promise((resolve) => setTimeout(resolve, 50));
                    }
                    console.log(
                        moment().format("YYYY-MM-DD HH:mm:ss"),
                        "All database updates finished.",
                    );
                })(),

                // Prozess 2: Bildgenerierung mit Tile Pre-Warming
                (async () => {
                    const PARALLEL_LIMIT = 5;
                    const RETRY_INTERVAL_MS = 600000; // 10 minutes

                    console.log(
                        moment().format("YYYY-MM-DD HH:mm:ss"),
                        `Starting tile pre-warming check for ${idsForCreation.length} tours...`,
                    );

                    // Phase 1: Calculate tiles for all tours
                    const tourTileMap = new Map(); // Tour-ID -> Set of tiles
                    const allTiles = new Set();

                    for (const tourId of idsForCreation) {
                        const bounds = await calculateBoundingBox(tourId);
                        if (bounds && bounds.min_lat) {
                            const zoom = calculateZoomLevel(bounds);
                            const tiles = getTilesForBounds(bounds, zoom);
                            tourTileMap.set(tourId, new Set(tiles));
                            tiles.forEach((t) => allTiles.add(t));
                        } else {
                            // No GPX data, will use placeholder
                            tourTileMap.set(tourId, new Set());
                        }
                    }

                    console.log(
                        moment().format("YYYY-MM-DD HH:mm:ss"),
                        `Calculated ${allTiles.size} distinct tiles for ${idsForCreation.length} tours.`,
                    );

                    // Phase 2: Check tile availability
                    let missingTiles = await checkTilesAvailability([...allTiles]);
                    console.log(
                        moment().format("YYYY-MM-DD HH:mm:ss"),
                        `Tile check result: ${missingTiles.size} tiles missing.`,
                    );

                    // Phase 3: Process with retry loop
                    let pendingTours = [...idsForCreation];
                    let stopProcessing = false;

                    // Custom Concurrency Helper
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

                    while (pendingTours.length > 0 && !stopProcessing) {
                        // Check time limit
                        const now = new Date();
                        if (now.getHours() >= 23) {
                            console.log(
                                moment().format("YYYY-MM-DD HH:mm:ss"),
                                "Stopping tile pre-warming due to time limit (23:00).",
                            );
                            stopProcessing = true;
                            break;
                        }

                        // Find tours with all tiles available
                        const readyTours = pendingTours.filter((tourId) => {
                            const tiles = tourTileMap.get(tourId);
                            if (!tiles || tiles.size === 0) return true; // No tiles needed (placeholder case)
                            return [...tiles].every((t) => !missingTiles.has(t));
                        });

                        if (readyTours.length > 0) {
                            console.log(
                                moment().format("YYYY-MM-DD HH:mm:ss"),
                                `Processing ${readyTours.length} tours with available tiles...`,
                            );

                            await asyncPool(PARALLEL_LIMIT, readyTours, async (tourID) => {
                                if (stopProcessing) return;

                                const currentHour = new Date().getHours();
                                if (currentHour >= 23) {
                                    if (!stopProcessing) {
                                        console.log(
                                            moment().format("YYYY-MM-DD HH:mm:ss"),
                                            "Stopping image creation due to time limit.",
                                        );
                                        stopProcessing = true;
                                    }
                                    return;
                                }

                                const jitter = Math.floor(Math.random() * 1000);
                                await new Promise((resolve) => setTimeout(resolve, jitter));

                                let lastTwoChars = last_two_characters(tourID);
                                await processAndCreateImage(
                                    tourID,
                                    lastTwoChars,
                                    browser,
                                    useCDN,
                                    dir_go_up,
                                    url,
                                );
                            });

                            // Remove processed tours
                            pendingTours = pendingTours.filter((id) => !readyTours.includes(id));
                        }

                        // If there are still pending tours, wait and retry
                        if (pendingTours.length > 0 && !stopProcessing) {
                            console.log(
                                moment().format("YYYY-MM-DD HH:mm:ss"),
                                `Waiting 10 minutes for ${pendingTours.length} tours with missing tiles...`,
                            );
                            await delay(RETRY_INTERVAL_MS);

                            // Re-check tiles for remaining tours
                            const remainingTiles = new Set();
                            pendingTours.forEach((id) => {
                                tourTileMap.get(id)?.forEach((t) => remainingTiles.add(t));
                            });
                            missingTiles = await checkTilesAvailability([...remainingTiles]);
                            console.log(
                                moment().format("YYYY-MM-DD HH:mm:ss"),
                                `Re-check result: ${missingTiles.size} tiles still missing.`,
                            );
                        }
                    }

                    console.log(
                        moment().format("YYYY-MM-DD HH:mm:ss"),
                        "All image creations finished.",
                    );
                })(),
            ]);

            // Track if there were pending tours (for final cleanup decision)
            // This is a simplified check - in practice pendingTours from the async block
            // would need to be communicated differently, but time check is the main gate
        } catch (err) {
            console.log("Error in createImagesFromMap --> ", err.message);
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
            console.log(
                moment().format("YYYY-MM-DD HH:mm:ss"),
                `Starting final check for old images...`,
            );
            await cleanAndRecreateOldImages(dir_go_up);
            console.log(
                moment().format("YYYY-MM-DD HH:mm:ss"),
                `Final image check and recreation finished.`,
            );
        } else {
            console.log(
                moment().format("YYYY-MM-DD HH:mm:ss"),
                "Skipping cleanAndRecreateOldImages due to time limit (23:00+).",
            );
        }

        // Always pre-warm tiles for old images as the very last step
        await preWarmOldImageTiles(dir_go_up);
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
        console.log("Error in createImageFromMap error: Could not generate ", filePath);
        console.log("Errormessage:", err.message);
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
        console.error(e);
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
        console.error(e);
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
        console.error(
            `Error obtaining tours within radius ${radius} from lat=${lat} and lon=${lon}: `,
            e,
        );
        return null;
    }
}
