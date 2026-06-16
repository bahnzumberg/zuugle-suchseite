/**
 * GPX Image Generation Test
 *
 * This test verifies that the GPX image generation produces consistent results.
 * It generates an image for a known tour and compares it with a reference image.
 */

import puppeteer from "puppeteer";
import fs from "fs-extra";
import path from "path";
import sharp from "sharp";
import pixelmatch from "pixelmatch";
import { baseUrl, apiUser, apiPass } from "./testConfig.js";

// Test configuration
const TEST_TOUR_ID = 28308;
const REFERENCE_IMAGE_PATH = path.join(__dirname, "fixtures/gpx_image_reference.webp");
const GENERATED_IMAGE_PATH = path.join(__dirname, "fixtures/gpx_image_generated.webp");
const TEMP_PNG_PATH = path.join(__dirname, "fixtures/gpx_image_temp.png");

// Same settings as in gpxUtils.js
const VIEWPORT = { width: 1200, height: 800 };
const GPX_URL = `${baseUrl}/public/gpx/08/${TEST_TOUR_ID}.gpx`;
const HEADLESS_URL = `${baseUrl}/public/headless-leaflet/index.html?gpx=${GPX_URL}`;

// Maximum fraction of pixels allowed to differ (2%). Tolerates minor tile
// server updates and sub-pixel anti-aliasing variation while still catching
// meaningful layout or colour regressions.
const MAX_DIFF_RATIO = 0.02;

describe("GPX Image Generation", () => {
    let browser;

    beforeAll(async () => {
        // Ensure fixtures directory exists
        await fs.ensureDir(path.join(__dirname, "fixtures"));

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

        // Check if reference image exists
        const referenceExists = await fs.pathExists(REFERENCE_IMAGE_PATH);
        if (!referenceExists) {
            console.log("Reference image does not exist. Creating it now...");
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

        // Verify generated image exists
        expect(await fs.pathExists(GENERATED_IMAGE_PATH)).toBe(true);

        if (!referenceExists) {
            // First run: create reference image
            await fs.copy(GENERATED_IMAGE_PATH, REFERENCE_IMAGE_PATH);
            console.log(`Reference image created at: ${REFERENCE_IMAGE_PATH}`);
            console.log("Run the test again to verify consistency.");
            return;
        }

        // Compare with reference image using pixel-level diff.
        // Both images are decoded to raw RGBA at the reference dimensions so
        // minor WebP re-encode differences don't affect the comparison.
        const refImage = await sharp(REFERENCE_IMAGE_PATH)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });
        const { width, height } = refImage.info;
        const genImage = await sharp(GENERATED_IMAGE_PATH)
            .resize(width, height)
            .ensureAlpha()
            .raw()
            .toBuffer();

        const diffPixels = pixelmatch(genImage, refImage.data, null, width, height, {
            threshold: 0.1,
        });
        const diffRatio = diffPixels / (width * height);

        console.log(
            `Pixel diff: ${diffPixels} / ${width * height} (${(diffRatio * 100).toFixed(2)}%)`,
        );

        expect(diffRatio).toBeLessThan(MAX_DIFF_RATIO);
    }, 120000);
});
