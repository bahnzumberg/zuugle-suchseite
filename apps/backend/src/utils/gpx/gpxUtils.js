const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs-extra');
let sharp = require('sharp');
const convertXML = require('xml-js');
const { create } = require('xmlbuilder2');
import moment from "moment";
import {setTimeout} from "node:timers/promises";
import knex from "../../knex";
import {getHost} from "../utils";
import crypto from 'crypto';

// Global variable to store the hash of the London reference image.
let londonReferenceHash = null;
let error502ReferenceHash = null;

// Konstanten und globale Warteschlangen für die Parallelisierung
const MAX_PARALLEL_DB_UPDATES = 5;
const activeDbUpdates = []; // Warteschlange für Datenbank-Updates

const createLondonReferenceHash = async (imagePath) => {
    try {
        const imageBuffer = await sharp(imagePath).toBuffer();
        const hash = crypto.createHash('sha256').update(imageBuffer).digest('hex');
        return hash;
    } catch (e) {
        console.error("Error creating London reference hash:", e);
        return null;
    }
}

// New helper function to check if an image is the London placeholder.
const isImageLondon = async (imagePath) => {
    if (!londonReferenceHash) {
        console.error("London reference hash is not available.");
        return false;
    }

    try {
        const imageBuffer = await sharp(imagePath).toBuffer();
        const hash = crypto.createHash('sha256').update(imageBuffer).digest('hex');

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
    '--autoplay-policy=user-gesture-required',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-setuid-sandbox',
    '--disable-speech-api',
    '--disable-sync',
    '--hide-scrollbars',
    '--ignore-gpu-blacklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--no-pings',
    '--no-sandbox',
    '--no-zygote',
    '--password-store=basic',
    '--use-gl=swiftshader',
    '--use-mock-keychain',
];


const setTourImageURL = async (tour_id, image_url, force=false) => {
    if (!!tour_id) {
        if (image_url.length > 0) {
            if (image_url.substring(0,4) !== 'http') {
                image_url = getHost('') + image_url;
            }

            try {
                if (force) {
                    await knex.raw(`UPDATE tour SET image_url='${image_url}' WHERE id=${tour_id};`)
                }
                else {
                    await knex.raw(`UPDATE tour SET image_url='${image_url}' WHERE id=${tour_id} AND image_url IS NULL;`)
                }
            }
            catch(e) {
                console.error(`Error in setTourImageURL with tour_id=${tour_id}: `, e)
            }
        }
    }
}

// Hilfsfunktion, um auf einen freien Slot zu warten
const waitForFreeSlot = async (queue, maxConcurrency) => {
    while (queue.length >= maxConcurrency) {
        await new Promise(resolve => setTimeout(resolve, 50));
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
const handleImagePlaceholder = async (tourId, isProd) => {
    try {
        const result = await knex.raw(`SELECT range_slug FROM tour AS t WHERE t.id=${tourId}`);
        const rangeSlug = (result.rows && result.rows.length > 0) ? result.rows[0].range_slug : null;

        if (rangeSlug) {
            const imageUrl = `/public/range-image/${rangeSlug}.webp`;
            console.log(moment().format('HH:mm:ss'), ` Found range_slug "${rangeSlug}", setting specific image URL.`);
            await dispatchDbUpdate(tourId, isProd ? `https://cdn.zuugle.at/range-image/${rangeSlug}.webp` : imageUrl, true);
        } else {
            console.log(moment().format('HH:mm:ss'), ' No range_slug found, setting generic placeholder.');
            await dispatchDbUpdate(tourId, isProd ? 'https://cdn.zuugle.at/img/train_placeholder.webp' : '/app_static/img/train_placeholder.webp', true);
        }
    } catch (e) {
        console.error("Error in handleImagePlaceholder:", e);
        await dispatchDbUpdate(tourId, isProd ? 'https://cdn.zuugle.at/img/train_placeholder.webp' : '/app_static/img/train_placeholder.webp', true);
    }
};


// Neue Hilfsfunktion für die Bildgenerierung
const processAndCreateImage = async (ch, lastTwoChars, browser, isProd, dir_go_up, url) => {
    let dirPath = path.join(__dirname, dir_go_up, "public/gpx-image/" + lastTwoChars + "/");
    let filePath = path.join(dirPath, ch + "_gpx.png");
    let filePathSmallWebp = path.join(dirPath, ch + "_gpx_small.webp");
    const MAX_GENERATION_TIME = 300000; // Timeout in milliseconds (5 minutes)

    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }

        const generationPromise = createImageFromMap(browser, filePath, url + lastTwoChars + "/" + ch + ".gpx", 100);
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error('Image generation timeout')), MAX_GENERATION_TIME);
        });

        await Promise.race([generationPromise, timeoutPromise]);
        
        if (fs.existsSync(filePath)) {
            try {
                await sharp(filePath).resize({
                    width: 784,
                    height: 523,
                    fit: "inside"
                }).webp({quality: 15}).toFile(filePathSmallWebp);
            } catch (e) {
                console.error("gpxUtils.sharp.resize error: ", e);
            }

            if (fs.existsSync(filePathSmallWebp)) {
                await fs.unlink(filePath);
                const isLondonImage = await isImageLondon(filePathSmallWebp);

                if (isLondonImage) {
                    console.log(moment().format('HH:mm:ss'), ' Detected London placeholder, replacing with standard image.');
                    await fs.unlink(filePathSmallWebp);
                    handleImagePlaceholder(ch, isProd);
                } else {
                    console.log(moment().format('HH:mm:ss'), ' Gpx image small file created: ' + filePathSmallWebp);
                    if (isProd) {
                        dispatchDbUpdate(ch, 'https://cdn.zuugle.at/gpx-image/' + lastTwoChars + '/' + ch + '_gpx_small.webp', true);
                    } else {
                        dispatchDbUpdate(ch, '/public/gpx-image/' + lastTwoChars + '/' + ch + '_gpx_small.webp', true);
                    }
                }
            } else {
                console.log(moment().format('HH:mm:ss'), ' NO gpx image small file created, replacing with standard image.');
                handleImagePlaceholder(ch, isProd);
            }
        } else {
            console.log(moment().format('HH:mm:ss'), ' NO image file created: ' + filePath);
            handleImagePlaceholder(ch, isProd);
        }
    } catch (e) {
        if (e.message === 'Image generation timeout') {
            console.error(moment().format('HH:mm:ss'), `Timeout for image generation for ID ${ch}: ${e.message}`);
        } else {
            console.error(`Error in processAndCreateImage for ID ${ch}:`, e);
        }
        
        // Führt die Fehlerbehandlung aus und springt zum nächsten Bild
        handleImagePlaceholder(ch, isProd);
    }
};


export const createImagesFromMap = async (ids) => {
    let addParam = {};
    let url = "";
    let dir_go_up = "";
    let isProd = false;
    if (process.env.NODE_ENV == "production") {
        isProd = true;
    }

    // This should be done only once when the function is first called.
    if (!londonReferenceHash) {
        if(isProd){ 
            dir_go_up = "../../"; 
        }
        else {
            dir_go_up = "../../../";
        }

        const londonImagePath = path.join(__dirname, dir_go_up, 'public/london.webp');
        if (fs.existsSync(londonImagePath)) {
            londonReferenceHash = await createLondonReferenceHash(londonImagePath);
            console.log("London reference hash created:", londonReferenceHash);
        } else {
            console.error("London reference image not found:", londonImagePath);
        }

        const error502ImagePath = path.join(__dirname, dir_go_up, 'public/502-error.webp');
        if (fs.existsSync(error502ImagePath)) {
            error502ReferenceHash = await createLondonReferenceHash(error502ImagePath);
            console.log("502 reference hash created:", error502ReferenceHash);
        } else {
            console.error("502-error reference image not found:", error502ReferenceHash);
        }
    }

    if(!!ids){
        let browser;
        try {
            if(isProd){ 
                dir_go_up = "../../"; 
                url = "https://www.zuugle.at/public/headless-leaflet/index.html?gpx=https://www.zuugle.at/public/gpx/";
                addParam.executablePath = path.resolve(__dirname,'../../node_modules/puppeteer/.local-chromium/linux-1022525/chrome-linux/chrome')
            }
            else {
                dir_go_up = "../../../";
                url = "http://localhost:8080/public/headless-leaflet/index.html?gpx=http://localhost:8080/public/gpx/";
            }

            browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1200,800', ...minimal_args],
                protocolTimeout: 240000,
                defaultViewport: {width: 1200, height: 800},
                ...addParam
            });
 
            const idsForUpdate = [];
            const idsForCreation = [];

            // Dispatcher-Phase: Asynchrone Aufteilung der IDs
            console.log(moment().format('HH:mm:ss'), `Starting dispatcher to classify ${ids.length} IDs...`);
            const classificationPromises = ids.map(async (ch) => {
                let lastTwoChars = last_two_characters(ch);
                let dirPath = path.join(__dirname, dir_go_up, "public/gpx-image/"+lastTwoChars+"/");
                let filePathSmallWebp = path.join(dirPath, ch+"_gpx_small.webp");
                try {
                    await fs.promises.stat(filePathSmallWebp);
                    idsForUpdate.push(ch);
                } catch(e) {
                    if (e.code === 'ENOENT') {
                        idsForCreation.push(ch);
                    } else {
                        console.error(`Error checking file for ID ${ch}:`, e);
                        // Behandeln Sie andere Dateisystemfehler
                        idsForUpdate.push(ch); // Update-Pfad als Fallback
                    }
                }
            });
            await Promise.all(classificationPromises);
            console.log(moment().format('HH:mm:ss'), `Dispatcher finished. Found ${idsForUpdate.length} IDs for update and ${idsForCreation.length} IDs for creation.`);

            // Abarbeitungs-Phase: Startet die beiden Prozesse parallel
            await Promise.all([
                // Prozess 1: Datenbank-Updates parallel abarbeiten
                (async () => {
                    for (const ch of idsForUpdate) {
                        let lastTwoChars = last_two_characters(ch);
                        if (isProd) {
                            dispatchDbUpdate(ch, 'https://cdn.zuugle.at/gpx-image/' + lastTwoChars + '/' + ch + '_gpx_small.webp', false);
                        } else {
                            dispatchDbUpdate(ch, '/public/gpx-image/' + lastTwoChars + '/' + ch + '_gpx_small.webp', false);
                        }
                    }
                    while (activeDbUpdates.length > 0) {
                        await new Promise(resolve => setTimeout(resolve, 50));
                    }
                    console.log(moment().format('HH:mm:ss'), 'All database updates finished.');
                })(),

                // Prozess 2: Bildgenerierung seriell abarbeiten
                (async () => {
                    for (const ch of idsForCreation) {
                        const now = new Date();
                        const currentHour = now.getHours();
                        if (currentHour >= 20) {
                            console.log(moment().format('HH:mm:ss'), 'Stopping image creation due to time limit.');
                            break;
                        }
                        let lastTwoChars = last_two_characters(ch);
                        await processAndCreateImage(ch, lastTwoChars, browser, isProd, dir_go_up, url);
                    }
                    console.log(moment().format('HH:mm:ss'), 'All image creations finished.');
                })()
            ]);

        } catch (err) {
            console.log("Error in createImagesFromMap --> ",err.message);
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
}


export const createImageFromMap = async (browser, filePath,  url, picquality) => {
    try {
        if(!!filePath){
            const page = await browser.newPage();
            if (!!page) {
                await page.emulateMediaType('print'); 
                await page.setCacheEnabled(false);
                await page.goto(url, { timeout: 30000, waitUntil: 'networkidle0' }); 
                await setTimeout(10000);
                await page.bringToFront();
                await page.screenshot({ path: filePath, type: 'png' });
                await page.close();
            }
        }
    } catch (err) {
        console.log('Error in createImageFromMap error: Could not generate ',filePath)
        console.log('Errormessage:', err.message);
    }
}

export function last_two_characters(h_url) {
    if (!!h_url) {
        const hashed_url = "" + h_url;

        if (hashed_url.length >= 2) {
            return hashed_url.substring(hashed_url.length - 2).toString();
        }
        else if (hashed_url.length == 1) {
            return "0" + hashed_url;
        }
        else {
            return "00";    
        }
    }
    else {
        return "00";
    }
}


export const mergeGpxFilesToOne = async (fileMain, fileAnreise, fileAbreise) => {
    let trackAnreise = await getSequenceFromFile(fileAnreise);
    let trackAbreise = await getSequenceFromFile(fileAbreise);
    try {
        if(!!fileMain){
            const fileContent = await fs.readFile(fileMain, 'utf-8');
            let json = convertXML.xml2js(fileContent);
            if(json && json.elements.length > 0 && json.elements[0].elements){
                if(!!trackAnreise && trackAnreise.elements){
                    json.elements[0].elements.splice(0, 0, trackAnreise );
                }
                if(!!trackAbreise && trackAbreise.elements){
                    json.elements[0].elements.push(trackAbreise);
                }
            }
            const doc = create(convertXML.js2xml(json));
            return doc.end({prettyPrint: true});
        }
    } catch(e){
        console.error(e);
    }

    return null;
}

const getSequenceFromFile = async (file) => {
    try {
        const fileContent = await fs.readFile(file, 'utf-8');
        if(!!fileContent){
            const jsObj = convertXML.xml2js(fileContent);
            if(!!jsObj && jsObj.elements.length > 0 && jsObj.elements[0].elements.length > 0){
                const found = jsObj.elements[0].elements[0];   
                return found;
            }
        }
    } catch(e){
        console.error(e);
    }
    return null;
}