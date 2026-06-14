import { existsSync, readFileSync } from "fs";
import path from "path";
import logger from "../utils/logger";

// ─── Diana API config ────────────────────────────────────────────
const DIANA_API_BASE = "https://api.zuugle-services.net";
const DIANA_TOKEN_URL = `${DIANA_API_BASE}/o/token/`;

// Lazy-loaded credentials
let CLIENT_ID, CLIENT_SECRET;
let configLoaded = false;

async function loadCredentials() {
    if (configLoaded) return true;
    const configPath = path.resolve(__dirname, "../diana-config.js");
    if (!existsSync(configPath)) return false;
    try {
        ({ CLIENT_ID, CLIENT_SECRET } = await import("../diana-config.js"));
        configLoaded = true;
        return true;
    } catch {
        return false;
    }
}

// ─── Token caching ───────────────────────────────────────────────
let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Fetches and caches a Diana OAuth2 access token.
 * Token is cached for 50 minutes (valid for 60).
 * @returns {{ access_token: string, expires_in: number }}
 */
export async function getDianaToken() {
    const ok = await loadCredentials();
    if (!ok || !CLIENT_ID || !CLIENT_SECRET) {
        throw new Error(
            "Diana credentials missing. Rename diana-config.js.example to diana-config.js?",
        );
    }

    const now = Date.now();
    if (cachedToken && now < tokenExpiresAt) {
        return cachedToken;
    }

    const body = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
    });

    const response = await fetch(DIANA_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        logger.error(`Diana token request failed. HTTP ${response.status}. Response: ${errorText}`);
        throw new Error(`Diana token request failed: ${response.status}`);
    }

    const tokenData = await response.json();
    if (!tokenData.access_token) {
        logger.error("Diana token response missing access_token:", tokenData);
        throw new Error("Invalid token response from Diana API");
    }

    // Cache for 50 minutes
    cachedToken = tokenData;
    tokenExpiresAt = now + 50 * 60 * 1000;

    return tokenData;
}

// ─── Proxy helpers ───────────────────────────────────────────────

/**
 * Forward a GET request to the Diana API.
 * @param {string} path - e.g. "/address-autocomplete"
 * @param {string} queryString - pre-built query string
 * @returns {Promise<{ status: number, body: any }>}
 */
export async function proxyGet(path, queryString) {
    const tokenData = await getDianaToken();
    const url = `${DIANA_API_BASE}${path}${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const body = await response.json().catch(() => null);
    return { status: response.status, body };
}

/**
 * Forward a POST request to the Diana API.
 * @param {string} path - e.g. "/generate-ticketshop-link"
 * @param {any} payload - JSON body
 * @returns {Promise<{ status: number, body: any }>}
 */
export async function proxyPost(path, payload) {
    const tokenData = await getDianaToken();
    const url = `${DIANA_API_BASE}${path}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const body = await response.json().catch(() => null);
    return { status: response.status, body };
}

// ─── GeoJSON City Lookup ─────────────────────────────────────────

const GEOJSON_DIR = path.resolve(__dirname, "../utils/country-geojson");

// In-memory cache: { "AT": FeatureCollection, "DE": ... }
const geoJsonCache = {};

/**
 * Load a country's GeoJSON file into the in-memory cache.
 * Returns the parsed FeatureCollection or null.
 * @param {string} countryCode - e.g. "AT", "SI"
 */
function loadGeoJson(countryCode) {
    const code = countryCode.toUpperCase();
    if (geoJsonCache[code]) return geoJsonCache[code];

    const filePath = path.join(GEOJSON_DIR, `${code}.geojson`);
    if (!existsSync(filePath)) {
        logger.warn(`GeoJSON file not found for country: ${code}`);
        return null;
    }

    try {
        const raw = readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(raw);
        geoJsonCache[code] = parsed;
        logger.info(`Loaded GeoJSON for ${code} (${parsed.features?.length || 0} features)`);
        return parsed;
    } catch (err) {
        logger.error(`Failed to parse GeoJSON for ${code}:`, err.message);
        return null;
    }
}

/**
 * Preload all available GeoJSON files at startup.
 * Called once from the route initialization.
 */
export function preloadGeoJson() {
    const supportedCountries = ["AT", "CH", "DE", "FR", "IT", "SI"];
    for (const code of supportedCountries) {
        loadGeoJson(code);
    }
    logger.info(`GeoJSON preload complete: ${Object.keys(geoJsonCache).length} countries loaded`);
}

/**
 * Ray-casting algorithm for point-in-polygon test.
 * Works with simple polygon rings (array of [lon, lat] pairs).
 * @param {number} lat
 * @param {number} lon
 * @param {number[][]} ring - array of [lon, lat] coordinate pairs
 * @returns {boolean}
 */
function pointInRing(lat, lon, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const xi = ring[i][1],
            yi = ring[i][0]; // lat, lon
        const xj = ring[j][1],
            yj = ring[j][0];

        const intersect = yi > lon !== yj > lon && lat < ((xj - xi) * (lon - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }
    return inside;
}

/**
 * Check if a point is inside a GeoJSON geometry (Polygon or MultiPolygon).
 * Handles holes (inner rings) correctly.
 * @param {number} lat
 * @param {number} lon
 * @param {object} geometry - GeoJSON geometry object
 * @returns {boolean}
 */
function pointInGeometry(lat, lon, geometry) {
    if (geometry.type === "Polygon") {
        // First ring is outer boundary, rest are holes
        const outer = geometry.coordinates[0];
        if (!pointInRing(lat, lon, outer)) return false;
        // Check holes: if inside a hole, point is outside
        for (let h = 1; h < geometry.coordinates.length; h++) {
            if (pointInRing(lat, lon, geometry.coordinates[h])) return false;
        }
        return true;
    }

    if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
            const outer = polygon[0];
            if (!pointInRing(lat, lon, outer)) continue;
            // Check holes
            let inHole = false;
            for (let h = 1; h < polygon.length; h++) {
                if (pointInRing(lat, lon, polygon[h])) {
                    inHole = true;
                    break;
                }
            }
            if (!inHole) return true;
        }
        return false;
    }

    return false;
}

/**
 * Find the city for a given coordinate using the country-specific GeoJSON file.
 *
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} countryCode - 2-letter country code (e.g. "AT", "SI")
 * @returns {{ city_slug: string, city_name: string, country_code: string } | null}
 */
export function findCityByCoordinates(lat, lon, countryCode) {
    if (!countryCode) return null;

    const code = countryCode.toUpperCase();
    const geoJson = geoJsonCache[code] || loadGeoJson(code);
    if (!geoJson || !geoJson.features) return null;

    for (const feature of geoJson.features) {
        if (pointInGeometry(lat, lon, feature.geometry)) {
            return {
                city_slug: feature.properties.city_slug,
                city_name: feature.properties.city_name,
                country_code: feature.properties.country_code,
            };
        }
    }

    // Coordinate not found in any city polygon – edge case
    // See: https://github.com/bahnzumberg/zuugle-api/issues/429
    return null;
}
