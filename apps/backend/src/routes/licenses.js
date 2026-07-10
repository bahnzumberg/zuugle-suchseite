import express from "express";
import cacheService from "../services/cache.js";
import logger from "../utils/logger";

const router = express.Router();

const CACHE_KEY = "licenses:gtfs";
const LICENSE_URL = "https://gtfs-license.zuugle-services.net/license.json";

/**
 * @swagger
 * /api/licenses:
 *   get:
 *     summary: Get GTFS timetable license data
 *     description: Returns license/source information for all GTFS timetable feeds. Data is cached for 24 hours.
 *     responses:
 *       200:
 *         description: License data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 licenses:
 *                   type: array
 *                   items:
 *                     type: object
 *       502:
 *         description: Failed to fetch upstream license data.
 */
router.get("/", async (_req, res) => {
    try {
        // Try cache first
        const cached = await cacheService.get(CACHE_KEY);
        if (cached) {
            return res.status(200).json(cached);
        }

        // Fetch from upstream
        const response = await fetch(LICENSE_URL);
        if (!response.ok) {
            logger.error(`License fetch failed: HTTP ${response.status}`);
            return res.status(502).json({
                success: false,
                message: "Failed to fetch license data from upstream",
            });
        }

        const licenses = await response.json();

        // Validate that we got an array
        if (!Array.isArray(licenses)) {
            logger.error("License data is not an array");
            return res.status(502).json({
                success: false,
                message: "Unexpected license data format",
            });
        }

        const responseData = { success: true, licenses };

        // Cache for 24h (86400 seconds, matches config.cache.ttl)
        await cacheService.set(CACHE_KEY, responseData, 86400);

        return res.status(200).json(responseData);
    } catch (err) {
        logger.error("License endpoint error:", err.message);
        return res.status(502).json({
            success: false,
            message: "Failed to fetch license data",
        });
    }
});

export default router;
