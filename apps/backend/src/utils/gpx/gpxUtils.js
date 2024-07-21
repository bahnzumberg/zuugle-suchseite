const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs-extra');
let sharp = require('sharp');
const convertXML = require('xml-js');
const { create } = require('xmlbuilder2');
import moment from "moment";
import {setTimeout} from "node:timers/promises";
import knex from "../../knex";

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


const setTourImageURL = async (tour_id, image_url) => {
    if (!!tour_id) {
        if (image_url.length > 0) {
            await knex.raw(`UPDATE tour SET image_url='${image_url}' WHERE id=${tour_id} AND image_url IS NULL;`)
            // console.log(`UPDATE tour SET image_url='${image_url}' WHERE id=${tour_id} AND image_url IS NULL;`)
        }
    }
}

export const createImagesFromMap = async (ids) => {
    if(!!ids){
        let browser;
        try {
            let addParam = {};
            let url = "";
            let dir_go_up = "";
            if(process.env.NODE_ENV == "production"){ 
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
 
            const chunkSize = 3;
            for (let i = 0; i < ids.length; i += chunkSize) {
                const chunk = ids.slice(i, i + chunkSize);
                await Promise.all(chunk.map(ch => new Promise(async resolve => {
                    let dirPath = path.join(__dirname, dir_go_up, "public/gpx-image/"+last_two_characters(ch)+"/")
                    if (!fs.existsSync(dirPath)){ 
                        fs.mkdirSync(dirPath);
                    }
                    
                    let filePath = path.join(dirPath, ch+"_gpx.jpg");
                    let filePathSmall = path.join(dirPath, ch+"_gpx_small.jpg");

                    if (!!filePathSmall && !!!fs.existsSync(filePathSmall)) {
                        console.log(moment().format('HH:mm:ss'), ` Calling createImageFromMap for tour.id=${ch} to create ${filePath}`);
                        let hashed_url_sql = `SELECT hashed_url FROM tour WHERE id=CAST(${ch} AS INTEGER);`
                        let hashed_url_query = await knex.raw(hashed_url_sql);
                        let hashed_url = hashed_url_query.rows[0].hashed_url;

                        await createImageFromMap(browser, filePath, url + last_two_characters(hashed_url) + "/" + hashed_url + ".gpx", 80);

                        if (fs.existsSync(filePath)){
                            try {
                                await sharp(filePath).resize({
                                    width: 600,
                                    height: 400,
                                    fit: "inside"
                                }).jpeg({quality: 30}).toFile(filePathSmall);

                                if (fs.existsSync(filePathSmall)){
                                    console.log(moment().format('HH:mm:ss'), ' Gpx image small file created: ' + filePathSmall);
                                    await fs.unlink(filePath);

                                    // Now we want to insert the correct image_url into table tour
                                    await setTourImageURL(ch, '/public/gpx-image/'+last_two_characters(ch)+'/'+ch+'_gpx_small.jpg');
                                }
                                else {
                                    console.log(moment().format('HH:mm:ss'), ' Gpx image small file NOT created: ' + filePathSmall);

                                    // In this case we set '/app_static/img/train_placeholder.webp'
                                    await setTourImageURL(ch, '/app_static/img/train_placeholder.webp');
                                }

                            } catch(e){
                                if(process.env.NODE_ENV !== "production"){
                                    console.error("gpxUtils error :",e);
                                }
                            }
                        }
                        else {
                            console.log(moment().format('HH:mm:ss'), ' NO image file created: ' + filePath);
                            
                            // In this case we set '/app_static/img/train_placeholder.webp'
                            await setTourImageURL(ch, '/app_static/img/train_placeholder.webp');
                        } 
                    }
                    else {
                        // The gpx_small.jpg already exists and doesn't have to be regenerated.   
                        await setTourImageURL(ch, '/public/gpx-image/'+last_two_characters(ch)+'/'+ch+'_gpx_small.jpg');
                    }
                    
                    resolve();
                })));
            }
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
                await page.screenshot({path: filePath, type: "jpeg", quality: picquality});
                await page.close();
                // console.log("Created "+filePath)
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

export const createSingleImageFromMap = async (providerhashedUrl, fromTourTrackKey, toTourTrackKey, template = "index.html", fileNamePostfix = "", addBaseGpx = true) => {
    let browser = null;
    try {

        let LEAFLET_BASE =  process.env.NODE_ENV === "production" ?     `https://www.zuugle.at/public/headless-leaflet/${template}` 
        :                                                               `http://localhost:8080/public/headless-leaflet/${template}`;

        let BASE_GPX_URL =  process.env.NODE_ENV === "production" ?     "https://www.zuugle.at/public/gpx/" 
        :                                                                "http://localhost:8080/public/gpx/";

        let BASE_GPX_TRACK_URL = process.env.NODE_ENV === "production" ? "https://www.zuugle.at/public/gpx-track/" 
        :                                                                "http://localhost:8080/public/gpx-track/";

        let url = "";

        url = LEAFLET_BASE + (!!addBaseGpx ? "?gpx=" + BASE_GPX_URL + last_two_characters(providerhashedUrl) + "/" + providerhashedUrl + ".gpx" : "");

        if(!!fromTourTrackKey){
            url = url + (!!addBaseGpx ? "&" : "?") + "gpx1=" + BASE_GPX_TRACK_URL + "fromtour/" + last_two_characters(fromTourTrackKey) + "/" + fromTourTrackKey + ".gpx";
        }
        if(!!toTourTrackKey){
            url = url + (!!addBaseGpx ? "&" : "?") + "gpx2=" + BASE_GPX_TRACK_URL + "totour/" + last_two_characters(toTourTrackKey) + "/" + toTourTrackKey + ".gpx";
        }

        let addParam = {};
        if(process.env.NODE_ENV == "production"){
            addParam.executablePath = path.resolve(__dirname,'../../node_modules/puppeteer/.local-chromium/linux-1022525/chrome-linux/chrome')
        }

        let filePath = undefined;
        let baseFilePath = "public/gpx-image-with-track/"+last_two_characters(providerhashedUrl)+"/"+providerhashedUrl+ "_"+ getValidUndefinedFileName(toTourTrackKey) + "_" + getValidUndefinedFileName(fromTourTrackKey) + fileNamePostfix +"_gpx.jpg";
        if(process.env.NODE_ENV == "production"){
            filePath = path.join(__dirname, "../../", baseFilePath);
        } else {
            filePath = path.join(__dirname, "../../../", baseFilePath);
        }

        if (!!filePath && !!fs.existsSync(filePath)) {
            return baseFilePath;
        }

        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1200,800', ...minimal_args],
            defaultViewport: {width: 1200, height: 800},
            ...addParam
        });

        if(!!filePath){
            const page = await browser.newPage();

            await page.emulateMediaType('print');
            await page.setCacheEnabled(false);
            await page.goto(url, { timeout: 1000000, waitUntil: 'networkidle0' });
            // await page.waitForTimeout(20);
            await setTimeout(20);
            await page.bringToFront();
            await page.screenshot({path: filePath, type: "jpeg", quality: 90});
            await page.close();
            return baseFilePath;
        }

    } catch (err) {
        console.log('createSingleImageFromMap error: ', err);
        console.log(err.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

const getValidUndefinedFileName = (entry) => {
    if(!!entry){
        return entry;
    } else {
        return "unknown"
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
