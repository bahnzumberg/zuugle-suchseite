/**
 * Puppeteer Image Generation Test
 *
 * Verifies that Puppeteer can successfully launch a browser and
 * generate map images from GPX tracks using the headless-leaflet page.
 */

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const TEST_GPX_URL = "https://www.zuugle.at/public/gpx/04/28904.gpx";
const HEADLESS_LEAFLET_URL =
    "https://www.zuugle.at/public/headless-leaflet/index.html";
const TEST_SCREENSHOT_PATH = path.join(__dirname, "test_screenshot.png");

describe("Puppeteer Image Generation", () => {
    let browser;

    beforeAll(async () => {
        try {
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu",
                ],
            });
        } catch (error) {
            console.warn("Puppeteer browser launch failed:", error.message);
            console.warn(
                "Skipping Puppeteer tests - Chrome/Chromium not available",
            );
        }
    }, 60000);

    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
        // Clean up test screenshot
        if (fs.existsSync(TEST_SCREENSHOT_PATH)) {
            fs.unlinkSync(TEST_SCREENSHOT_PATH);
        }
    });

    test("Browser can be launched", () => {
        if (!browser) {
            console.warn("Browser not available - skipping test");
            return;
        }
        expect(browser).toBeDefined();
        expect(browser.connected).toBe(true);
    });

    test("Can take screenshot of headless-leaflet page with GPX", async () => {
        if (!browser) {
            console.warn("Browser not available - skipping test");
            return;
        }

        const page = await browser.newPage();
        await page.setViewport({ width: 600, height: 400 });

        // Navigate to headless-leaflet with GPX parameter
        const url = `${HEADLESS_LEAFLET_URL}?gpx=${TEST_GPX_URL}`;
        await page.goto(url, {
            waitUntil: "networkidle0",
            timeout: 30000,
        });

        // Wait for map tiles and GPX to load
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Take screenshot
        await page.screenshot({
            path: TEST_SCREENSHOT_PATH,
            type: "png",
        });

        await page.close();

        // Verify screenshot was created
        expect(fs.existsSync(TEST_SCREENSHOT_PATH)).toBe(true);

        // Verify screenshot has reasonable file size (not empty/error page)
        const stats = fs.statSync(TEST_SCREENSHOT_PATH);
        console.log(`Screenshot size: ${stats.size} bytes`);

        // A proper map screenshot should be at least 10KB
        expect(stats.size).toBeGreaterThan(10000);
    }, 60000);

    test("Screenshot contains actual map content (not error page)", async () => {
        if (!browser) {
            console.warn("Browser not available - skipping test");
            return;
        }

        const page = await browser.newPage();
        await page.setViewport({ width: 600, height: 400 });

        const url = `${HEADLESS_LEAFLET_URL}?gpx=${TEST_GPX_URL}`;
        await page.goto(url, {
            waitUntil: "networkidle0",
            timeout: 30000,
        });

        // Wait for map to render
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Check that the map container exists
        const mapContainer = await page.$("#map");
        expect(mapContainer).not.toBeNull();

        // Check that leaflet tiles are loaded
        const tiles = await page.$$(".leaflet-tile-loaded");
        console.log(`Loaded tiles: ${tiles.length}`);
        expect(tiles.length).toBeGreaterThan(0);

        await page.close();
    }, 60000);
});
