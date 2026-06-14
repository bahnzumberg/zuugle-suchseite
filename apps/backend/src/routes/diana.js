import express from "express";
import logger from "../utils/logger";
import cacheService from "../services/cache.js";
import {
    getDianaToken,
    proxyGet,
    proxyPost,
    findCityByCoordinates,
    preloadGeoJson,
} from "../services/dianaService";

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
 * GET /api/diana/token
 *
 * Returns an OAuth2 access token from the Diana API.
 * The token is cached server-side; credentials never reach the frontend.
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
 * GET /api/diana/address-autocomplete
 *
 * Proxies the Diana /address-autocomplete endpoint and enriches each
 * result with city information from local GeoJSON files.
 * Results outside the Alpine bounding box are filtered out.
 * The top 5 enriched results are cached in Valkey (24 h TTL).
 *
 * Query params: q, limit, hint_lat, hint_lon, lang, global_search
 * (same as Diana API, see Diana_API_Docs.md)
 */
router.get("/address-autocomplete", async (req, res) => {
    const q = req.query.q;
    if (!q || typeof q !== "string" || q.length < 1) {
        return res.status(400).json({
            success: false,
            error: "Query parameter 'q' is required",
        });
    }

    try {
        // Build cache key from the client's original params
        const clientQueryString = filterParams(req.query, AUTOCOMPLETE_PARAMS);
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
 * GET /api/diana/connections
 *
 * Proxies the Diana /connections endpoint.
 * Initial searches (without pagination cursors) are cached in Valkey for 24 h.
 * Cache key: tour coordinates + user start location + date.
 */
router.get("/connections", async (req, res) => {
    try {
        const queryString = filterParams(req.query, CONNECTIONS_PARAMS);

        // Determine if this is a scroll/pagination request
        const isScrollRequest = CONNECTIONS_SCROLL_PARAMS.some(
            (p) => req.query[p] && typeof req.query[p] === "string",
        );

        // Build cache key from the fields that uniquely identify a trip search
        const cacheKey = isScrollRequest
            ? null
            : `diana:connections:${req.query.activity_start_location || ""}:${req.query.activity_end_location || ""}:${req.query.user_start_location || ""}:${req.query.date || ""}`;

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
 * POST /api/diana/generate-ticketshop-link
 *
 * Proxies the Diana /generate-ticketshop-link endpoint.
 * Body: { connection_elements: [...], segment_index?: number }
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
 * POST /api/diana/share
 *
 * Proxies the Diana /share/ endpoint to create a shareable journey link.
 * Body is forwarded as-is (validated by Diana).
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
 * GET /api/diana/share/:hashKey
 *
 * Proxies the Diana /share/<uuid>/ endpoint to retrieve a shared journey.
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
