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
            if (image_url.substring(0,4) !== 'http') {
                image_url = getHost('') + image_url;
            }

            try {
                await knex.raw(`UPDATE tour SET image_url='${image_url}' WHERE id=${tour_id} AND image_url IS NULL;`)
                // console.log(`UPDATE tour SET image_url='${image_url}' WHERE id=${tour_id} AND image_url IS NULL;`)
            }
            catch(e) {
                console.error(`Error in setTourImageURL with tour_id=${tour_id}: `, e)
            }
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
 
            const chunkSize = 2;
            for (let i = 0; i < ids.length; i += chunkSize) {
                // If the generation of the images is taking too long, it should stop at 23:00 in the evening
                const now = new Date();
                const currentHour = now.getHours();
                if (currentHour >= 23) {
                    break;
                }

                const chunk = ids.slice(i, i + chunkSize);
                await Promise.all(chunk.map(ch => new Promise(async resolve => {
                    let dirPath = path.join(__dirname, dir_go_up, "public/gpx-image/"+last_two_characters(ch)+"/")
                    if (!fs.existsSync(dirPath)){ 
                        fs.mkdirSync(dirPath);
                    }
                    
                    let filePath = path.join(dirPath, ch+"_gpx.png");
                    let filePathSmallWebp = path.join(dirPath, ch+"_gpx_small.webp");

                    if (!!filePathSmallWebp && !!!fs.existsSync(filePathSmallWebp)) {
                        await createImageFromMap(browser, filePath, url + last_two_characters(ch) + "/" + ch + ".gpx", 100);

                        if (fs.existsSync(filePath)){
                            try {
                                await sharp(filePath).resize({
                                    width: 784, // 392,
                                    height: 523, // 261,
                                    fit: "inside"
                                    }).webp({quality: 15}) // Change to WebP format
                                    .toFile(filePathSmallWebp);
                            }
                            catch(e) {
                                console.error("gpxUtils.sharp.resize error: ",e)
                            }

                            if (fs.existsSync(filePathSmallWebp)){
                                try {
                                    // console.log(moment().format('HH:mm:ss'), ' Gpx image small file created: ' + filePathSmallWebp);
                                    await fs.unlink(filePath);
                                } catch(e){
                                    console.error("gpxUtils error - nothing to delete: ",e);
                                }

                                try {
                                    // Now we want to insert the correct image_url into table tour
                                    // await setTourImageURL(ch, '/public/gpx-image/'+last_two_characters(ch)+'/'+ch+'_gpx_small.jpg');
                                    await setTourImageURL(ch, '/public/gpx-image/'+last_two_characters(ch)+'/'+ch+'_gpx_small.webp');
                                } catch(e){
                                    console.error("gpxUtils error: ",e);
                                }
                            }
                            else {
                                console.log(moment().format('HH:mm:ss'), ' Gpx image small file NOT created: ' + filePathSmallWebp);

                                // In this case we set '/app_static/img/train_placeholder.webp'
                                await setTourImageURL(ch, '/app_static/img/train_placeholder.webp');
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
                        // await setTourImageURL(ch, '/public/gpx-image/'+last_two_characters(ch)+'/'+ch+'_gpx_small.jpg');
                        await setTourImageURL(ch, '/public/gpx-image/'+last_two_characters(ch)+'/'+ch+'_gpx_small.webp');
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
                await page.screenshot({ path: filePath, type: 'png' });
                // await page.screenshot({path: filePath, type: "jpeg", quality: picquality});
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
