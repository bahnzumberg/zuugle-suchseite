import express from "express";
import logger from "../utils/logger";
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

/**
 * GET /api/diana/address-autocomplete
 *
 * Proxies the Diana /address-autocomplete endpoint and enriches each
 * result with city information from local GeoJSON files.
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
        const queryString = filterParams(req.query, AUTOCOMPLETE_PARAMS);
        const result = await proxyGet("/address-autocomplete", queryString);

        if (result.status !== 200) {
            return res.status(result.status).json(result.body);
        }

        // Enrich each feature with city lookup
        const data = result.body;
        const features = Array.isArray(data) ? data : data?.features || [];

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

/**
 * GET /api/diana/connections
 *
 * Proxies the Diana /connections endpoint.
 * All query params are forwarded (filtered to known params).
 */
router.get("/connections", async (req, res) => {
    try {
        const queryString = filterParams(req.query, CONNECTIONS_PARAMS);
        const result = await proxyGet("/connections", queryString);
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
