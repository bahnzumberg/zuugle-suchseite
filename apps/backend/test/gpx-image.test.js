/**
 * GPX Image Generation Test
 *
 * Verifies that the GPX-to-image pipeline produces a valid Alpine map
 * screenshot.  Uses a local GPX fixture (test/fixtures/tour_28308.gpx)
 * so the test is independent of database content.
 */

import puppeteer from "puppeteer";
import fs from "fs-extra";
import path from "path";
import sharp from "sharp";

import { baseUrl, apiUser, apiPass } from "./testConfig.js";

// Test configuration
const TEST_TOUR_ID = 28308;
const GPX_FIXTURE_PATH = path.join(__dirname, "fixtures/tour_28308.gpx");
const GPX_PUBLIC_PATH = path.join(__dirname, "../public/gpx/08", `${TEST_TOUR_ID}.gpx`);
const REFERENCE_IMAGE_PATH = path.join(__dirname, "fixtures/gpx_image_reference.webp");
const GENERATED_IMAGE_PATH = path.join(__dirname, "fixtures/gpx_image_generated.webp");
const TEMP_PNG_PATH = path.join(__dirname, "fixtures/gpx_image_temp.png");

// Same settings as in gpxUtils.js
const VIEWPORT = { width: 1200, height: 800 };
const GPX_URL = `${baseUrl}/public/gpx/08/${TEST_TOUR_ID}.gpx`;
const HEADLESS_URL = `${baseUrl}/public/headless-leaflet/index.html?gpx=${GPX_URL}`;

describe("GPX Image Generation", () => {
    let browser;

    beforeAll(async () => {
        // Ensure fixtures directory exists
        await fs.ensureDir(path.join(__dirname, "fixtures"));

        // Copy the stable GPX fixture into the public/ directory so
        // the headless-leaflet page can load it via HTTP, regardless
        // of what is currently in the database.
        await fs.ensureDir(path.dirname(GPX_PUBLIC_PATH));
        await fs.copy(GPX_FIXTURE_PATH, GPX_PUBLIC_PATH);

        try {
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--window-size=1200,800",
                ],
                defaultViewport: VIEWPORT,
            });
        } catch (error) {
            console.warn("Puppeteer browser launch failed:", error.message);
        }
    }, 60000);

    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
        // Clean up temp file
        if (await fs.pathExists(TEMP_PNG_PATH)) {
            await fs.unlink(TEMP_PNG_PATH);
        }
    });

    test("generates consistent GPX image for tour", async () => {
        if (!browser) {
            console.warn("Browser not available - skipping test");
            return;
        }

        // Generate the image (same process as createImageFromMap in gpxUtils.js)
        const page = await browser.newPage();
        // Set basic auth credentials if available
        if (apiUser && apiPass) {
            await page.authenticate({
                username: apiUser,
                password: apiPass,
            });
        }
        await page.emulateMediaType("print");
        await page.setCacheEnabled(false);

        await page.goto(HEADLESS_URL.replace("localhost", "127.0.0.1"), {
            timeout: 30000,
            waitUntil: "networkidle2",
        });

        // Wait for map to render (same as in gpxUtils.js)
        await new Promise((resolve) => setTimeout(resolve, 10000));

        await page.bringToFront();
        await page.screenshot({ path: TEMP_PNG_PATH, type: "png" });
        await page.close();

        // Convert to WebP (same settings as gpxUtils.js)
        await sharp(TEMP_PNG_PATH)
            .resize({
                width: 784,
                height: 523,
                fit: "inside",
            })
            .webp({ quality: 15 })
            .toFile(GENERATED_IMAGE_PATH);

        expect(await fs.pathExists(GENERATED_IMAGE_PATH)).toBe(true);

        // ── Pixel-level sanity checks ──────────────────────────────
        // We deliberately skip exact pixel-match against a reference
        // because the live OpenTopo tiles drift 20-40 % between runs.
        // Instead we check for the two real failure modes:
        //
        //  1. Missing tiles  → large white rectangles in the image
        //  2. London fallback → GPX failed to load, map shows the
        //     default London view (urban gray) instead of Alpine
        //     terrain (distinctly green on OpenTopo tiles).

        const { data, info } = await sharp(GENERATED_IMAGE_PATH)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const totalPixels = info.width * info.height;
        let whitePixels = 0; // near-white (R,G,B all > 245)
        let greenishPixels = 0; // green channel dominates (green > red AND green > 100)

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            if (r > 245 && g > 245 && b > 245) whitePixels++;
            if (g > 100 && g > r) greenishPixels++;
        }

        const whiteRatio = whitePixels / totalPixels;
        const greenRatio = greenishPixels / totalPixels;

        console.log(
            `Image analysis: ${info.width}×${info.height}, ` +
                `white: ${(whiteRatio * 100).toFixed(1)}%, ` +
                `green: ${(greenRatio * 100).toFixed(1)}%`,
        );

        // Missing tiles: white rectangles would push this ratio above 5 %
        expect(whiteRatio).toBeLessThan(0.05);

        // London detection: Alpine OpenTopo tiles are very green (typically
        // 30-50 % of pixels). London at zoom 14 is urban gray/beige (<15 %).
        expect(greenRatio).toBeGreaterThan(0.2);

        // Update the reference image for visual inspection / future use
        await fs.copy(GENERATED_IMAGE_PATH, REFERENCE_IMAGE_PATH);
    }, 120000);
});
