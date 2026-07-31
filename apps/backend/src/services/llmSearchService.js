import { GoogleGenAI } from "@google/genai";
import cacheService from "./cache.js";
import crypto from "crypto";
import logger from "../utils/logger.js";

/**
 * LLM Search Service
 *
 * Translates natural language tour queries into the structured filter format
 * understood by getMatchingTourIds / listWrapper.
 *
 * The LLM returns `city_query` (a raw place name). The search route then
 * geocodes it via Diana API + GeoJSON to resolve the actual city_slug.
 *
 * Environment variables:
 *   GEMINI_API_KEY  – required, Google AI API key
 *   GEMINI_MODEL    – optional, model identifier (default: gemini-3.1-flash-lite)
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

// Tour types as stored in the database (city2tour_flat.type column)
const KNOWN_TOUR_TYPES = [
    "Wandern",
    "Schneeschuh",
    "Skitour",
    "Langlaufen",
    "Bike & Hike",
    "Klettern",
    "Klettersteig",
    "Rodeln",
    "Weitwandern",
    "Trailrunning",
    "Hochtour",
];

const SUPPORTED_LANGUAGES = ["de", "en", "fr", "it", "sl"];

// Supported countries (for validation)
const KNOWN_COUNTRIES = ["AT", "CH", "DE", "FR", "IT", "LI", "SI"];

/**
 * System instruction that defines the output schema via prompt.
 *
 * NOTE: The LLM returns `city_query` (raw place name). The server then
 * geocodes it via Diana API + GeoJSON to get the actual city_slug.
 * The LLM does NOT need to know the list of valid city slugs.
 */
const SYSTEM_INSTRUCTION = `You are a search query parser for Zuugle, an outdoor tour search platform in the Alps.
Your task: Extract structured search parameters from a natural language query about hiking, skiing, climbing, and other mountain tours.

You MUST respond with a JSON object (and nothing else) matching this schema:

{
  "clarification": "optional follow-up question",
  "language": "de",
  "search": "string or null",
  "search_type": "term or hut or peak",
  "city_query": "place name for geocoding",
  "city_country": "AT, DE, CH, FR, IT, SI, or LI",
  "geolocation": true/false,
  "filter": {
    "singleDayTour": boolean,
    "multipleDayTour": boolean,
    "summerSeason": boolean,
    "winterSeason": boolean,
    "traverse": boolean,
    "minAscent": number (meters),
    "maxAscent": number (meters),
    "minDescent": number (meters),
    "maxDescent": number (meters),
    "minDistance": number (km),
    "maxDistance": number (km),
    "minTransportDuration": number (hours, decimal),
    "maxTransportDuration": number (hours, decimal),
    "types": ["Wandern", ...],
    "difficulties": [1, 2, 3],
    "ranges": ["range name", ...],
    "languages": ["de", ...],
    "providers": ["provider", ...]
  }
}

CITY / DEPARTURE LOCATION — THIS IS THE MOST IMPORTANT FIELD:
The user's departure location determines which tours are shown. You MUST identify where the user starts.

Supported countries: Austria (AT), Germany (DE), Switzerland (CH), France (FR), Italy (IT), Slovenia (SI), Liechtenstein (LI).

City rules:
- "city_query": The place name the user mentions as their departure point. Extract it as a CLEAN place name suitable for geocoding. Strip any prefix words like "von", "ab", "aus", "from", "de". Examples:
  "von Hinternaßwald" → "Hinternaßwald"
  "ab Wien" → "Wien"
  "starting from Munich" → "München"
  "aus dem Raum Graz" → "Graz"
  "Steiermark" → "Steiermark"
  "Tirol" → "Tirol"
- "city_country": The 2-letter country code if you can identify the country. E.g. "AT" for Austria, "DE" for Germany.
- If NO departure location is mentioned, set "clarification" asking: "Von welcher Stadt oder Region aus möchtest du starten?"
- CRITICAL: Do NOT infer the departure from the tour DESTINATION. "wanderung schneeberg" mentions a destination, NOT a departure city. Always ask via clarification.
- If the previous context already contains "resolved_city", the departure is already known — do NOT ask again and do NOT set city_query.

Other field rules:
- "language": REQUIRED. Detect from the query. One of: "de", "en", "fr", "it", "sl". Default "de".
- "search": Free text keyword (tour name, mountain, region). Null if purely filter-based.
- "search_type": Almost always "term" (default, full-text search). ONLY use "hut" if the user explicitly says words like "Hütte", "hut", "rifugio", "refuge". ONLY use "peak" if the user explicitly says "Gipfel", "Gipfeltour", "summit", "peak". A mountain name alone (e.g. "Schneeberg", "Rax") does NOT make it "peak" — that is still "term".
- "geolocation": true if user says "in meiner Nähe" / "near me". Otherwise omit.
- "filter.types": Valid values ONLY: ${JSON.stringify(KNOWN_TOUR_TYPES)}.
  Mappings: "Schneeschuhwanderung"/"Schneeschuhtour" → "Schneeschuh", "Klettertour" → "Klettern", "Langlauftour" → "Langlaufen", "Rodeltour" → "Rodeln", "Weitwanderung"/"Fernwandern" → "Weitwandern", "Radtour"/"Mountainbike" → "Bike & Hike", "Wanderung"/"hiking" → "Wandern", "Bergsteigen" → "Hochtour".
- "filter.difficulties": Numbers only. 1=easy/leicht, 2=medium/mittel, 3=hard/schwer.
- Transport duration in HOURS (decimal), not minutes.
- "filter.ranges": Mountain range names if mentioned.
- "filter.languages": Tour text language filter (e.g. "deutschsprachige Touren" → ["de"]).
- "filter.providers": Only if user names a specific data source.

Clarification:
- Set "clarification" when the departure location is unknown, OR the query is too vague.
- Still extract whatever you can — "clarification" is IN ADDITION to parsed fields, not instead of.
- Ask in the same language as the user's query.
- Do NOT set clarification if a departure location is already known (from city_query or resolved_city in context).

Conversation:
- When previous search context is provided, MERGE the new input with it.
- Only OVERRIDE fields the user explicitly changes in their new message.
- KEEP all unchanged fields from the previous context.
- If the context contains "resolved_city", the departure is already resolved — keep it unless the user explicitly wants to change it.
- Example: previous = {city_query: "Wien", search: "Schneeberg", filter: {types: ["Wandern"]}}, new input = "aber leicht" → result = {city_query: "Wien", search: "Schneeberg", filter: {types: ["Wandern"], difficulties: [1]}}.

IMPORTANT: Only include fields the user explicitly or implicitly mentions. Omit all others entirely (do not set to null).
Respond with ONLY the JSON object.`;

/**
 * Generates a cache key for an LLM query.
 * @param {string} query - The natural language query.
 * @param {object|null} previousInterpretation - Previous search context (for conversational search).
 * @returns {string} The cache key.
 */
const generateCacheKey = (query, previousInterpretation = null) => {
    const normalized = query.toLowerCase().trim();
    const contextStr = previousInterpretation ? JSON.stringify(previousInterpretation) : "";
    const hash = crypto
        .createHash("sha256")
        .update(normalized + contextStr)
        .digest("hex");
    return `llm:search:${hash}`;
};

/**
 * Validates and sanitizes the LLM output against the known schema.
 * @param {object} parsed - The raw LLM JSON response.
 * @returns {object} Validated and cleaned interpretation.
 */
const validateInterpretation = (parsed) => {
    const result = {
        language: SUPPORTED_LANGUAGES.includes(parsed.language) ? parsed.language : "de",
    };

    // Top-level string fields
    if (typeof parsed.search === "string" && parsed.search.trim()) {
        result.search = parsed.search.trim();
    }
    if (["term", "hut", "peak"].includes(parsed.search_type)) {
        result.search_type = parsed.search_type;
    }
    // city_query: pass through as-is (Diana + GeoJSON will resolve it)
    if (typeof parsed.city_query === "string" && parsed.city_query.trim()) {
        result.city_query = parsed.city_query.trim();
    }
    // city_country: validate against known countries
    if (typeof parsed.city_country === "string") {
        const cc = parsed.city_country.trim().toUpperCase();
        if (KNOWN_COUNTRIES.includes(cc)) {
            result.city_country = cc;
        }
    }
    if (parsed.geolocation === true) {
        result.geolocation = true;
    }
    if (typeof parsed.clarification === "string" && parsed.clarification.trim()) {
        result.clarification = parsed.clarification.trim();
    }

    // Filter object
    const f = parsed.filter;
    if (f && typeof f === "object") {
        const filter = {};

        // Booleans
        for (const field of [
            "singleDayTour",
            "multipleDayTour",
            "summerSeason",
            "winterSeason",
            "traverse",
        ]) {
            if (typeof f[field] === "boolean") {
                filter[field] = f[field];
            }
        }

        // Numbers (non-negative)
        for (const field of [
            "minAscent",
            "maxAscent",
            "minDescent",
            "maxDescent",
            "minDistance",
            "maxDistance",
            "minTransportDuration",
            "maxTransportDuration",
        ]) {
            if (typeof f[field] === "number" && f[field] >= 0 && Number.isFinite(f[field])) {
                filter[field] = f[field];
            }
        }

        // Types (must be from the known list)
        if (Array.isArray(f.types)) {
            const valid = f.types.filter((t) => KNOWN_TOUR_TYPES.includes(t));
            if (valid.length > 0) filter.types = valid;
        }

        // Difficulties (accept numbers 1-3 or string labels)
        if (Array.isArray(f.difficulties)) {
            const difficultyMap = {
                leicht: 1,
                mittel: 2,
                schwer: 3,
                easy: 1,
                medium: 2,
                moderate: 2,
                hard: 3,
                difficult: 3,
                facile: 1,
                moyen: 2,
                difficile: 3,
            };
            const mapped = f.difficulties.map((d) => {
                if (typeof d === "number" && [1, 2, 3].includes(d)) return d;
                if (typeof d === "string") return difficultyMap[d.toLowerCase()] ?? null;
                return null;
            });
            const valid = [...new Set(mapped.filter((d) => d !== null))];
            if (valid.length > 0) filter.difficulties = valid;
        }

        // Ranges (free-form strings)
        if (Array.isArray(f.ranges)) {
            const valid = f.ranges.filter((r) => typeof r === "string" && r.trim());
            if (valid.length > 0) filter.ranges = valid;
        }

        // Languages
        if (Array.isArray(f.languages)) {
            const valid = f.languages.filter((l) => SUPPORTED_LANGUAGES.includes(l));
            if (valid.length > 0) filter.languages = valid;
        }

        // Providers (free-form strings)
        if (Array.isArray(f.providers)) {
            const valid = f.providers.filter((p) => typeof p === "string" && p.trim());
            if (valid.length > 0) filter.providers = valid;
        }

        if (Object.keys(filter).length > 0) {
            result.filter = filter;
        }
    }

    return result;
};

/**
 * Calls Gemini to parse a natural language tour search query into
 * structured filter parameters. Supports conversational follow-ups.
 *
 * @param {string} query - The natural language search query.
 * @param {object|null} previousInterpretation - Previous validated interpretation for conversation context.
 * @returns {Promise<{raw: object, validated: object}>} The raw and validated search parameters.
 * @throws {Error} If the API key is missing, the LLM call fails, or the response is invalid.
 */
const parseSearchQuery = async (query, previousInterpretation = null) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    if (!query || typeof query !== "string" || query.trim().length === 0) {
        throw new Error("Search query must be a non-empty string");
    }

    // Check cache first (includes previous context in key)
    const cacheKey = generateCacheKey(query, previousInterpretation);
    const cached = await cacheService.get(cacheKey);
    if (cached) {
        logger.info("LLM search cache hit for query:", query);
        return cached;
    }

    // Build user message — include previous context if conversational
    let userMessage = query.trim();
    if (previousInterpretation && typeof previousInterpretation === "object") {
        userMessage =
            `Previous search context (merge with new input, keep unchanged fields):\n` +
            `${JSON.stringify(previousInterpretation)}\n\n` +
            `New user input: ${query.trim()}`;
    }

    // Initialize Google GenAI client
    const ai = new GoogleGenAI({ apiKey });

    let response;
    let lastError;

    // Retry once on transient errors
    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            response = await ai.models.generateContent({
                model: GEMINI_MODEL,
                config: {
                    responseMimeType: "application/json",
                    systemInstruction: SYSTEM_INSTRUCTION,
                },
                contents: [
                    {
                        role: "user",
                        parts: [{ text: userMessage }],
                    },
                ],
            });
            break;
        } catch (e) {
            lastError = e;
            logger.warn(`Gemini API attempt ${attempt + 1} failed:`, e.message);

            const status = e.status || e.httpStatusCode;
            if (status && status !== 429 && status < 500) {
                throw e;
            }

            if (attempt === 0) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
    }

    if (!response) {
        throw lastError || new Error("Gemini request failed after retries");
    }

    const text = response.text;
    if (!text) {
        throw new Error("Gemini returned empty response");
    }

    let raw;
    try {
        raw = JSON.parse(text);
    } catch {
        logger.error("Gemini returned invalid JSON:", text.slice(0, 500));
        throw new Error("Gemini returned invalid JSON response");
    }

    const validated = validateInterpretation(raw);
    const result = { raw, validated };

    // Cache the result for 24 hours
    cacheService.set(cacheKey, result, 86400);

    logger.info("LLM search parsed query:", query, "→", JSON.stringify(validated));

    return result;
};

export default { parseSearchQuery };
export { parseSearchQuery, KNOWN_TOUR_TYPES };
