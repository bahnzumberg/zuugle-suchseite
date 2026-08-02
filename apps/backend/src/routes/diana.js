import express from "express";
import logger from "../utils/logger";
import cacheService from "../services/cache.js";
import {
    getDianaToken,
    proxyGet,
    proxyPost,
    findCityByCoordinates,
    preloadGeoJson,
    mapLanguage,
    localTimeToUtc,
} from "../services/dianaService";
import { DIANA_ACTIVITY_TIMES } from "../utils/dianaConfig.js";

const router = express.Router();

// Preload GeoJSON files into memory on module init
preloadGeoJson();

// ─── Input validation helpers ────────────────────────────────────

/** Allowed query parameter names for address-autocomplete */
const AUTOCOMPLETE_PARAMS = new Set([
    "q",
    "limit",
    "hint_lat",
    "hint_lon",
    "lang",
    "global_search",
]);

/** Allowed query parameter names for connections */
const CONNECTIONS_PARAMS = new Set([
    "user_start_location",
    "user_start_location_type",
    "user_start_location_display_name",
    "activity_name",
    "activity_start_location",
    "activity_start_location_type",
    "activity_end_location",
    "activity_end_location_type",
    "activity_earliest_start_time",
    "activity_latest_start_time",
    "activity_earliest_end_time",
    "activity_latest_end_time",
    "activity_duration_minutes",
    "activity_duration_days",
    "activity_start_location_display_name",
    "activity_end_location_display_name",
    "activity_start_time_label",
    "activity_end_time_label",
    "date",
    "lang",
    "timezone",
    "id",
    "use_flex",
    "to_connections_before",
    "to_connections_after",
    "from_connections_before",
    "from_connections_after",
]);

/**
 * Filter and forward only allowed query params to Diana.
 * Prevents injection of unexpected parameters.
 */
function filterParams(queryObj, allowedSet) {
    const filtered = new URLSearchParams();
    for (const [key, value] of Object.entries(queryObj)) {
        if (allowedSet.has(key) && typeof value === "string") {
            filtered.set(key, value);
        }
    }
    return filtered.toString();
}

// ─── GET /api/diana/token ────────────────────────────────────────

/**
 * @swagger
 * /api/diana/token:
 *   get:
 *     summary: Get Diana API access token
 *     description: Returns an OAuth2 access token for the Diana routing API. Token is cached server-side; credentials never reach the frontend.
 *     responses:
 *       200:
 *         description: Access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 access_token:
 *                   type: string
 *                 expires_in:
 *                   type: integer
 *       502:
 *         description: Diana API unreachable.
 *       503:
 *         description: Diana credentials not configured.
 */
router.get("/token", async (_req, res) => {
    try {
        const tokenData = await getDianaToken();
        res.status(200).json({
            success: true,
            access_token: tokenData.access_token,
            expires_in: tokenData.expires_in || 1800,
        });
    } catch (error) {
        logger.error("Diana token error:", error.message);
        const status = error.message.includes("missing") ? 503 : 502;
        res.status(status).json({
            success: false,
            error: error.message,
        });
    }
});

// ─── GET /api/diana/address-autocomplete ─────────────────────────

/** Bounding box for the Alpine region (only results within are kept) */
const ALPINE_BOUNDS = { lonMin: 4, lonMax: 18, latMin: 43, latMax: 50 };

/** Max results returned to the frontend */
const AUTOCOMPLETE_CLIENT_LIMIT = 5;

/** Results fetched from Diana (over-fetch to compensate for filtering) */
const AUTOCOMPLETE_DIANA_LIMIT = 7;

/**
 * @swagger
 * /api/diana/address-autocomplete:
 *   get:
 *     summary: Address autocomplete (Diana proxy)
 *     description: Proxies the Diana address-autocomplete endpoint. Results are filtered to the Alpine bounding box and enriched with Zuugle city data. Cached 24h.
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Address search query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: hint_lat
 *         schema:
 *           type: number
 *       - in: query
 *         name: hint_lon
 *         schema:
 *           type: number
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: GeoJSON FeatureCollection with enriched Zuugle city properties.
 *       400:
 *         description: Missing query parameter.
 *       502:
 *         description: Diana API error.
 */
router.get("/address-autocomplete", async (req, res) => {
    const q = req.query.q;
    if (!q || typeof q !== "string" || q.length < 1) {
        return res.status(400).json({
            success: false,
            error: "Query parameter 'q' is required",
        });
    }

    // Express req.query is immutable via getter — work on a mutable copy
    const query = { ...req.query };

    // Normalize language code for Diana API
    if (query.lang) {
        query.lang = mapLanguage(query.lang);
    }

    try {
        // Build cache key from the client's original params
        const clientQueryString = filterParams(query, AUTOCOMPLETE_PARAMS);
        const cacheKey = `diana:autocomplete:${clientQueryString}`;
        const cached = await cacheService.get(cacheKey);
        if (cached) {
            return res.status(200).json(cached);
        }

        // Override limit: fetch more from Diana to compensate for geo-filtering
        const dianaParams = new URLSearchParams(clientQueryString);
        dianaParams.set("limit", String(AUTOCOMPLETE_DIANA_LIMIT));
        const result = await proxyGet("/address-autocomplete", dianaParams.toString());

        if (result.status !== 200) {
            return res.status(result.status).json(result.body);
        }

        const data = result.body;
        let features = Array.isArray(data) ? data : data?.features || [];

        // Filter out results outside the Alpine bounding box
        features = features.filter((feature) => {
            const coords = feature?.geometry?.coordinates;
            if (!coords) return false;
            const lon = coords[0];
            const lat = coords[1];
            return (
                lon >= ALPINE_BOUNDS.lonMin &&
                lon <= ALPINE_BOUNDS.lonMax &&
                lat >= ALPINE_BOUNDS.latMin &&
                lat <= ALPINE_BOUNDS.latMax
            );
        });

        // Keep only the best results up to the client limit
        features = features.slice(0, AUTOCOMPLETE_CLIENT_LIMIT);

        // Enrich each feature with city lookup
        for (const feature of features) {
            const coords = feature?.geometry?.coordinates;
            const countryCode = feature?.properties?.countrycode;

            if (coords && countryCode) {
                const lon = coords[0];
                const lat = coords[1];
                const cityInfo = findCityByCoordinates(lat, lon, countryCode);

                feature.zuugle_properties = cityInfo
                    ? {
                          city_slug: cityInfo.city_slug,
                          city_name: cityInfo.city_name,
                          country_code: cityInfo.country_code,
                      }
                    : null;
            } else {
                feature.zuugle_properties = null;
            }
        }

        // Update the response data with the filtered features
        if (Array.isArray(data)) {
            // Response was a plain array
            const responseData = features;
            cacheService.set(cacheKey, responseData, 24 * 60 * 60);
            return res.status(200).json(responseData);
        }
        // Response was a GeoJSON FeatureCollection
        data.features = features;
        cacheService.set(cacheKey, data, 24 * 60 * 60);
        res.status(200).json(data);
    } catch (error) {
        logger.error("Diana autocomplete proxy error:", error.message);
        res.status(502).json({
            success: false,
            error: "Failed to fetch autocomplete results",
        });
    }
});

// ─── GET /api/diana/connections ──────────────────────────────────

/** Pagination cursor params — requests containing these skip the cache */
const CONNECTIONS_SCROLL_PARAMS = [
    "to_connections_before",
    "to_connections_after",
    "from_connections_before",
    "from_connections_after",
];

/**
 * @swagger
 * /api/diana/connections:
 *   get:
 *     summary: Get public transport connections (Diana proxy)
 *     description: Proxies the Diana connections endpoint. Returns outbound and return connections for a tour. Initial requests are cached 24h; pagination requests bypass the cache.
 *     parameters:
 *       - in: query
 *         name: user_start_location
 *         schema:
 *           type: string
 *         description: User's starting coordinates (lon,lat)
 *       - in: query
 *         name: activity_start_location
 *         schema:
 *           type: string
 *         description: Tour start coordinates
 *       - in: query
 *         name: activity_end_location
 *         schema:
 *           type: string
 *         description: Tour end coordinates
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Travel date (YYYY-MM-DD)
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Connection results from Diana.
 *       502:
 *         description: Diana API error.
 */
router.get("/connections", async (req, res) => {
    try {
        // Express req.query returns a fresh parsed object via getter — direct
        // property assignments are silently discarded. Work on a mutable copy.
        const query = { ...req.query };

        // Determine date and timezone for UTC conversion of default time windows
        const date =
            typeof query.date === "string" && query.date
                ? query.date
                : new Date().toISOString().substring(0, 10);

        // Inject default activity time windows if not provided by the client
        if (!query.activity_earliest_start_time) {
            query.activity_earliest_start_time = localTimeToUtc(
                DIANA_ACTIVITY_TIMES.earliest_start_time,
                date,
            );
        }
        if (!query.activity_latest_start_time) {
            query.activity_latest_start_time = localTimeToUtc(
                DIANA_ACTIVITY_TIMES.latest_start_time,
                date,
            );
        }
        if (!query.activity_earliest_end_time) {
            query.activity_earliest_end_time = localTimeToUtc(
                DIANA_ACTIVITY_TIMES.earliest_end_time,
                date,
            );
        }
        if (!query.activity_latest_end_time) {
            query.activity_latest_end_time = localTimeToUtc(
                DIANA_ACTIVITY_TIMES.latest_end_time,
                date,
            );
        }

        // Normalize language code for Diana API
        if (query.lang) {
            query.lang = mapLanguage(query.lang);
        }

        const queryString = filterParams(query, CONNECTIONS_PARAMS);

        // Determine if this is a scroll/pagination request
        const isScrollRequest = CONNECTIONS_SCROLL_PARAMS.some(
            (p) => query[p] && typeof query[p] === "string",
        );

        // Build cache key from the fields that uniquely identify a trip search
        const cacheKey = isScrollRequest
            ? null
            : `diana:connections:${query.activity_start_location || ""}:${query.activity_end_location || ""}:${query.user_start_location || ""}:${query.date || ""}`;

        // Check Valkey cache (only for initial, non-scroll requests)
        if (cacheKey) {
            const cached = await cacheService.get(cacheKey);
            if (cached) {
                return res.status(200).json(cached);
            }
        }

        const result = await proxyGet("/connections", queryString);

        // Cache successful initial responses for 24 hours
        if (cacheKey && result.status === 200) {
            cacheService.set(cacheKey, result.body, 24 * 60 * 60);
        }

        res.status(result.status).json(result.body);
    } catch (error) {
        logger.error("Diana connections proxy error:", error.message);
        res.status(502).json({
            success: false,
            error: "Failed to fetch connections",
        });
    }
});

// ─── POST /api/diana/generate-ticketshop-link ────────────────────

/**
 * @swagger
 * /api/diana/generate-ticketshop-link:
 *   post:
 *     summary: Generate ticket shop link (Diana proxy)
 *     description: Proxies the Diana ticketshop-link endpoint to generate a booking URL for a selected connection.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - connection_elements
 *             properties:
 *               connection_elements:
 *                 type: array
 *                 items:
 *                   type: object
 *               segment_index:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Ticketshop link.
 *       400:
 *         description: Missing connection_elements.
 *       502:
 *         description: Diana API error.
 */
router.post("/generate-ticketshop-link", async (req, res) => {
    const { connection_elements, segment_index } = req.body || {};

    if (!Array.isArray(connection_elements)) {
        return res.status(400).json({
            success: false,
            error: "'connection_elements' array is required",
        });
    }

    try {
        const payload = { connection_elements };
        if (segment_index !== undefined) {
            payload.segment_index = segment_index;
        }

        const result = await proxyPost("/generate-ticketshop-link", payload);
        res.status(result.status).json(result.body);
    } catch (error) {
        logger.error("Diana ticketshop proxy error:", error.message);
        res.status(502).json({
            success: false,
            error: "Failed to generate ticketshop link",
        });
    }
});

// ─── POST /api/diana/share ───────────────────────────────────────

/**
 * @swagger
 * /api/diana/share:
 *   post:
 *     summary: Create a shareable journey link (Diana proxy)
 *     description: Proxies the Diana /share/ endpoint. The request body is forwarded as-is and validated by Diana.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Share link created.
 *       400:
 *         description: Missing request body.
 *       502:
 *         description: Diana API error.
 */
router.post("/share", async (req, res) => {
    if (!req.body || typeof req.body !== "object") {
        return res.status(400).json({
            success: false,
            error: "Request body is required",
        });
    }

    try {
        const result = await proxyPost("/share/", req.body);
        res.status(result.status).json(result.body);
    } catch (error) {
        logger.error("Diana share proxy error:", error.message);
        res.status(502).json({
            success: false,
            error: "Failed to create share link",
        });
    }
});

// ─── GET /api/diana/share/:hashKey ───────────────────────────────

/**
 * @swagger
 * /api/diana/share/{hashKey}:
 *   get:
 *     summary: Retrieve a shared journey (Diana proxy)
 *     description: Proxies the Diana /share/<uuid>/ endpoint to retrieve journey details for a previously shared link.
 *     parameters:
 *       - in: path
 *         name: hashKey
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the shared journey
 *     responses:
 *       200:
 *         description: Shared journey data.
 *       400:
 *         description: Invalid UUID format.
 *       502:
 *         description: Diana API error.
 */
router.get("/share/:hashKey", async (req, res) => {
    const { hashKey } = req.params;

    // Validate UUID format to prevent path traversal
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(hashKey)) {
        return res.status(400).json({
            success: false,
            error: "Invalid share hash format",
        });
    }

    try {
        const result = await proxyGet(`/share/${hashKey}/`, "");
        res.status(result.status).json(result.body);
    } catch (error) {
        logger.error("Diana share retrieve proxy error:", error.message);
        res.status(502).json({
            success: false,
            error: "Failed to retrieve shared journey",
        });
    }
});

export default router;
