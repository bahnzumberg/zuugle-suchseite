import express from "express";
import { parseSearchQuery } from "../services/llmSearchService.js";
import { resolveCityFromText } from "../services/dianaService.js";
import { getMatchingTourIds } from "./tours.js";
import logger from "../utils/logger.js";

const router = express.Router();

/**
 * @swagger
 * /api/search:
 *   post:
 *     summary: LLM-powered natural language tour search
 *     description: >
 *       Accepts a natural language query, interprets it via an LLM into structured
 *       filters. When the LLM returns a city_query, it's geocoded via Diana API
 *       + GeoJSON to resolve the actual city_slug. Supports conversational follow-ups
 *       and multi-candidate city disambiguation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 description: Natural language search query
 *               page:
 *                 type: integer
 *                 default: 1
 *               previousInterpretation:
 *                 type: object
 *                 description: Previous LLM interpretation for conversational follow-ups
 *               selectedCity:
 *                 type: object
 *                 description: User-selected city from a disambiguation list
 *                 properties:
 *                   city_slug:
 *                     type: string
 *                   city_name:
 *                     type: string
 *                   country_code:
 *                     type: string
 *     responses:
 *       200:
 *         description: Tour results, clarification, or city disambiguation options.
 *       400:
 *         description: Missing or invalid parameters.
 *       500:
 *         description: Service error.
 */
router.post("/", async (req, res) => {
    const { query, previousInterpretation, selectedCity } = req.body;

    // Validate required parameters
    if (!query || typeof query !== "string" || query.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: "Missing or empty 'query' parameter",
        });
    }

    // ─── Path A: User selected a city from the disambiguation list ───
    if (selectedCity && previousInterpretation) {
        const interpretation = {
            ...previousInterpretation,
            city_slug: selectedCity.city_slug,
            city_country: selectedCity.country_code,
            resolved_city: {
                city_slug: selectedCity.city_slug,
                city_name: selectedCity.city_name,
                country_code: selectedCity.country_code,
            },
        };
        delete interpretation.clarification;
        delete interpretation.city_query; // No longer needed

        return await searchWithInterpretation(interpretation, req.body, res);
    }

    // ─── Path B: Normal flow — always through LLM ───
    let llmResult;
    try {
        llmResult = await parseSearchQuery(query.trim(), previousInterpretation || null);
    } catch (error) {
        logger.error("LLM search failed:", error.message);
        return res.status(500).json({
            success: false,
            error: "Failed to interpret search query",
            details: process.env.NODE_ENV !== "production" ? error.message : undefined,
        });
    }

    const { raw: rawLlm, validated: interpretation } = llmResult;

    // If there's a clarification and no resolved city, return early
    if (
        interpretation.clarification &&
        !interpretation.city_query &&
        !previousInterpretation?.resolved_city
    ) {
        return res.status(200).json({
            success: true,
            tourIds: [],
            tourIdsCount: 0,
            tld: interpretation.city_country || null,
            city: null,
            domain: null,
            language: interpretation.language || "de",
            poisCount: 0,
            clarification: interpretation.clarification,
            llm_raw: rawLlm,
            llm_interpretation: interpretation,
            syntheticReq: null,
        });
    }

    // ─── City resolution: LLM returned city_query → Diana + GeoJSON ───

    // If the city was already resolved in previous turns, reuse it
    if (previousInterpretation?.resolved_city && !interpretation.city_query) {
        const rc = previousInterpretation.resolved_city;
        interpretation.city_slug = rc.city_slug;
        interpretation.city_country = rc.country_code;
        interpretation.resolved_city = rc;

        return await searchWithInterpretation(interpretation, req.body, res, rawLlm);
    }

    // If the LLM provided a city_query, resolve it
    if (interpretation.city_query) {
        logger.info(`Resolving city_query via Diana: "${interpretation.city_query}"`);

        const { resolved, candidates } = await resolveCityFromText(interpretation.city_query);

        if (resolved && candidates.length === 1) {
            // Single match — inject city and search
            interpretation.city_slug = candidates[0].city_slug;
            interpretation.city_country = candidates[0].country_code;
            interpretation.resolved_city = {
                city_slug: candidates[0].city_slug,
                city_name: candidates[0].city_name,
                country_code: candidates[0].country_code,
            };
            delete interpretation.clarification;

            return await searchWithInterpretation(interpretation, req.body, res, rawLlm);
        }

        if (candidates.length > 1) {
            // Multiple matches — return options for user to pick
            return res.status(200).json({
                success: true,
                tourIds: [],
                tourIdsCount: 0,
                tld: null,
                city: null,
                domain: null,
                language: interpretation.language || "de",
                poisCount: 0,
                clarification: "Meinst du …?",
                cityOptions: candidates,
                llm_raw: rawLlm,
                llm_interpretation: interpretation,
                syntheticReq: null,
            });
        }

        // 0 candidates — Diana couldn't resolve
        logger.warn(`Diana city resolve found no matches for "${interpretation.city_query}"`);
        return res.status(200).json({
            success: true,
            tourIds: [],
            tourIdsCount: 0,
            tld: null,
            city: null,
            domain: null,
            language: interpretation.language || "de",
            poisCount: 0,
            clarification: `"${interpretation.city_query}" konnte keiner Stadt zugeordnet werden. Bitte nenne eine größere Stadt in deiner Nähe.`,
            llm_raw: rawLlm,
            llm_interpretation: interpretation,
            syntheticReq: null,
        });
    }

    // No city at all — ask for it
    return res.status(200).json({
        success: true,
        tourIds: [],
        tourIdsCount: 0,
        tld: interpretation.city_country || null,
        city: null,
        domain: null,
        language: interpretation.language || "de",
        poisCount: 0,
        clarification:
            interpretation.clarification ||
            "Von welcher Stadt oder Region aus möchtest du starten?",
        llm_raw: rawLlm,
        llm_interpretation: interpretation,
        syntheticReq: null,
    });
});

/**
 * Shared helper: given a validated interpretation with city_slug, run getMatchingTourIds.
 */
async function searchWithInterpretation(interpretation, reqBody, res, rawLlm = null) {
    const { page, map, ranges, currLanguage } = reqBody;
    const cityCountry = interpretation.city_country || null;
    const domain = cityCountry ? `www.zuugle.${cityCountry.toLowerCase()}` : "www.zuugle.at";
    const detectedLanguage = interpretation.language || currLanguage || "de";

    const syntheticReq = {
        query: {
            domain,
            page: page || 1,
            map: map || false,
            ranges: ranges || false,
            currLanguage: detectedLanguage,
            search: interpretation.search || undefined,
            search_type: interpretation.search_type || undefined,
            city: interpretation.city_slug || undefined,
        },
        body: {
            filter:
                interpretation.filter && Object.keys(interpretation.filter).length > 0
                    ? interpretation.filter
                    : undefined,
            geolocation:
                interpretation.geolocation && reqBody.geolocation ? reqBody.geolocation : undefined,
        },
    };

    let matchResult;
    try {
        matchResult = await getMatchingTourIds(syntheticReq);
    } catch (error) {
        logger.error("getMatchingTourIds failed in search route:", error.message);
        return res.status(500).json({
            success: false,
            error: "Tour matching failed",
            details: process.env.NODE_ENV !== "production" ? error.message : undefined,
        });
    }

    return res.status(200).json({
        success: true,
        tourIds: matchResult.tourIds ?? [],
        tourIdsCount: matchResult.tourIds?.length ?? 0,
        tld: matchResult.tld,
        city: matchResult.city,
        domain,
        language: matchResult.language,
        poisCount: matchResult.pois?.length ?? 0,
        clarification: interpretation.clarification || null,
        llm_raw: rawLlm,
        llm_interpretation: interpretation,
        syntheticReq: {
            query: syntheticReq.query,
            bodyFilter: syntheticReq.body.filter,
        },
    });
}

export default router;
