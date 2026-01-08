import express from "express";
let router = express.Router();
import knex from "../knex";
import cacheService from "../services/cache.js";
import crypto from "crypto";
import { mergeGpxFilesToOne, last_two_characters, hashedUrlsFromPoi } from "../utils/gpx/gpxUtils";
import moment from "moment";
import { getHost, replaceFilePath, get_domain_country, isNumber } from "../utils/utils";
import { minutesFromMoment } from "../utils/utils";
import { convertDifficulty } from "../utils/utils";
import logger from "../utils/logger";

import fs from "fs";
import path from "path";
import momenttz from "moment-timezone";

/**
 * Generates a unique cache key based on a prefix and an object (usually query parameters).
 * @param {string} prefix - The prefix for the cache key (e.g., 'tours:list').
 * @param {object} obj - The object to stringify and append to the key.
 * @returns {string} The generated cache key.
 */
const generateKey = (prefix, obj) => {
    const str = JSON.stringify(obj, Object.keys(obj).sort());
    const hash = crypto.createHash("sha256").update(str).digest("hex");
    return `${prefix}:${hash}`;
};

/**
 * Replaces SQL placeholders (?) with escaped values for safe SQL string generation.
 * @param {string} sql - SQL string with ? placeholders.
 * @param {array} bindings - Array of values to bind.
 * @returns {string} SQL string with values safely interpolated.
 */
const bindValues = (sql, bindings) => {
    let index = 0;
    const result = sql.replace(/\?/g, () => {
        if (index >= bindings.length) {
            throw new Error("Not enough bindings for SQL placeholders");
        }
        const value = bindings[index++];

        // Escape the value based on type
        if (value === null || value === undefined) {
            return "NULL";
        } else if (typeof value === "string") {
            // Escape single quotes by doubling them (SQL standard)
            return `'${value.replace(/'/g, "''")}'`;
        } else if (typeof value === "number") {
            return String(value);
        } else if (typeof value === "boolean") {
            return value ? "true" : "false";
        } else {
            // For objects/arrays, convert to JSON string and escape
            return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
        }
    });

    // Normalize whitespace: replace multiple spaces/newlines with a single space
    return result.replace(/\s+/g, " ").trim();
};

/**
 * Logs search phrases to the database asynchronously (fire & forget).
 * @param {string} search - The search term.
 * @param {number} resultCount - Number of results found.
 * @param {string} citySlug - City slug.
 * @param {string} language - Menu language.
 * @param {string} domain - Domain for country detection.
 */
const logSearchPhrase = async (search, resultCount, citySlug, language, domain) => {
    if (!citySlug || citySlug.length === 0) {
        citySlug = "no_city_selected";
    }
    try {
        if (!search || search.trim().length === 0 || !citySlug || resultCount <= 1) {
            return;
        }

        // To remove for sure blank spaces at the start and end of the search term
        const searchparam = search
            .toString()
            .replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
            .toLowerCase();
        await knex("logsearchphrase").insert({
            phrase: searchparam,
            num_results: resultCount,
            city_slug: citySlug,
            menu_lang: language,
            country_code: get_domain_country(domain),
        });
    } catch (e) {
        logger.error("error inserting into logsearchphrase: ", e);
    }
};

router.get("/", (req, res) => listWrapper(req, res));
router.get("/filter", (req, res) => filterWrapper(req, res));
router.get("/provider/:provider", (req, res) => providerWrapper(req, res));

router.get("/total", (req, res) => totalWrapper(req, res));
router.get("/:id/connections-extended", (req, res) => connectionsExtendedWrapper(req, res));
router.get("/:id/gpx", (req, res) => tourGpxWrapper(req, res));
router.get("/:id/:city", (req, res) => getWrapper(req, res));

/**
 * Checks if the requested provider matches the valid provider for a tour and returns the
 * GPX download permission status.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const providerWrapper = async (req, res) => {
    const provider = req.params.provider;
    const approved = await knex("provider")
        .select("allow_gpx_download")
        .where({ provider: provider })
        .first();
    if (approved) {
        res.status(200).json({
            success: true,
            allow_gpx_download: approved.allow_gpx_download,
        });
    } else {
        res.status(404).json({ success: false, message: "Provider not found" });
    }
};

/**
 * Retrieves the embedding for a given text, checks the cache first.
 * @param {string} text - The text to generate an embedding for.
 * @returns {Promise<string>} The embedding vector as string.
 */
const getCachedEmbedding = async (text) => {
    try {
        const textLower = text.toLowerCase();
        const cacheKey = generateKey("embedding", { text: textLower });
        const cached = await cacheService.get(cacheKey);

        if (cached) {
            return cached;
        }

        const result = await knex.raw("SELECT get_embedding(?) as embedding", [textLower]);
        if (result && result.rows && result.rows.length > 0) {
            const embedding = result.rows[0].embedding;
            // Cache for 30 days (effectively static)
            cacheService.set(cacheKey, embedding, 30 * 24 * 60 * 60);
            return embedding;
        }
    } catch (e) {
        logger.error("Error getting embedding:", e);
    }
    return null;
};

/**
 * Retrieves total statistics (KPIs) for the tours, connections, ranges, cities, and providers.
 * If a city is specified in the query, the stats are filtered for that city.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const totalWrapper = async (req, res) => {
    const city = req.query.city;
    const domain = req.query.domain;
    const tld = get_domain_country(domain).toUpperCase();

    const cacheKey = `tours:total:${city || "all"}:${tld}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }

    const total = await knex.raw(
        `SELECT 
                                tours.value as tours,
                                COALESCE(tours_city.value, 0) AS tours_city,
                                COALESCE(tours_country.value, tours.value, 0) AS tours_country,
                                conn.value as connections,
                                ranges.value AS ranges,
                                cities.value AS cities,
                                provider.value AS provider 
                                FROM kpi AS tours 
                                LEFT OUTER JOIN kpi AS tours_city 
                                ON tours_city.name= ?
                                LEFT OUTER JOIN kpi AS tours_country 
                                ON tours_country.name= ?
                                LEFT OUTER JOIN kpi AS conn 
                                ON conn.name='total_connections' 
                                LEFT OUTER JOIN kpi AS ranges 
                                ON ranges.name='total_ranges' 
                                LEFT OUTER JOIN kpi AS cities 
                                ON cities.name='total_cities' 
                                LEFT OUTER JOIN kpi AS provider ON provider.name='total_provider' 
                                WHERE tours.name='total_tours';`,
        [`total_tours_${city}`, `total_tours_${tld}`],
    );

    const responseData = {
        success: true,
        total_tours: total.rows[0]["tours"],
        tours_city: total.rows[0]["tours_city"],
        tours_country: total.rows[0]["tours_country"],
        total_connections: total.rows[0]["connections"],
        total_ranges: total.rows[0]["ranges"],
        total_cities: total.rows[0]["cities"],
        total_provider: total.rows[0]["provider"],
    };
    cacheService.set(cacheKey, responseData);
    res.status(200).json(responseData);
};

/**
 * Fetches the details of a specific tour by its ID.
 * Includes connection information, validation status, and checks for active/inactive related tours.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const getWrapper = async (req, res) => {
    const city = req.query.city ? req.query.city : req.params.city ? req.params.city : null;
    const id = parseInt(req.params.id, 10);
    const domain = req.query.domain;

    const cacheKey = generateKey("tours:get", { id, city, domain });
    const cached = await cacheService.get(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }

    const tld = get_domain_country(domain);

    if (isNaN(id)) {
        res.status(400).json({ success: false, message: "Invalid tour ID" });
        return;
    }

    if (!id) {
        res.status(404).json({ success: false });
        return;
    }

    let new_search_where_city = `AND t.stop_selector='y' `;
    let bindings = [tld];

    if (!!city && city.length > 0 && city != "no-city") {
        new_search_where_city = `AND t.city_slug=? `;
        bindings.push(city);
    }

    // Add id bindings for the first part of UNION
    bindings.push(id);
    // Add id binding for the second part of UNION
    bindings.push(id);

    // Safe to interpolate tld directly in SQL: it comes from get_domain_country() which returns only controlled values (AT/CH/DE/IT/FR/SL), not user input
    const sql = `SELECT 
                id, 
                url, 
                provider, 
                hashed_url, 
                description, 
                image_url, 
                ascent, 
                descent, 
                difficulty, 
                difficulty_orig, 
                duration, 
                distance, 
                title, 
                type, 
                number_of_days, 
                traverse, 
                country, 
                state, 
                range_slug, 
                range, 
                season, 
                month_order, 
                quality_rating, 
                max_ele,
                min_connection_duration,
                min_connection_no_of_transfers,
                ROUND(avg_total_tour_duration*100/25)*25/100 as avg_total_tour_duration,
                valid_tour
                FROM ( 
                SELECT t.id, t.url, t.provider, t.hashed_url, tour.description, tour.image_url, tour.ascent,
                tour.descent, tour.difficulty, tour.difficulty_orig , tour.duration, tour.distance, tour.title, tour.type,
                tour.number_of_days, tour.traverse, tour.country, tour.state, tour.range_slug, tour.range, tour.season,
                tour.month_order, tour.quality_rating, tour.max_ele,
                1 AS valid_tour,
                t.min_connection_duration,
                t.min_connection_no_of_transfers,
                t.avg_total_tour_duration
                FROM city2tour_flat as t
                INNER JOIN tour as tour ON tour.id=t.id
                WHERE t.reachable_from_country=?
                ${new_search_where_city}
                AND t.id=?
                UNION 
                SELECT tour_inactive.id, tour_inactive.url, tour_inactive.provider, tour_inactive.hashed_url, tour_inactive.description, tour_inactive.image_url, tour_inactive.ascent, 
                tour_inactive.descent, tour_inactive.difficulty, tour_inactive.difficulty_orig , tour_inactive.duration, tour_inactive.distance, tour_inactive.title, tour_inactive.type, 
                tour_inactive.number_of_days, tour_inactive.traverse, tour_inactive.country, tour_inactive.state, tour_inactive.range_slug, tour_inactive.range, 
                'g' as season, 0 as month_order, 0 as quality_rating, 
                0 as max_ele, 
                0 AS valid_tour,
                0 as min_connection_duration,
                0 as min_connection_no_of_transfers,
                0 as avg_total_tour_duration
                FROM tour_inactive WHERE tour_inactive.id=?
                ORDER BY valid_tour DESC LIMIT 1) as a`;

    const sql3_bindings = [tld, id];
    // Safe to interpolate tld directly in SQL: it comes from get_domain_country() which returns only controlled values (AT/CH/DE/IT/FR/SL), not user input
    const sql3 = `SELECT 
                id, 
                url, 
                provider, 
                hashed_url, 
                description, 
                image_url, 
                ascent, 
                descent, 
                difficulty, 
                difficulty_orig, 
                duration, 
                distance, 
                title, 
                type, 
                number_of_days, 
                traverse, 
                country, 
                state, 
                range_slug, 
                range, 
                season, 
                month_order, 
                quality_rating, 
                max_ele,
                min_connection_duration,
                min_connection_no_of_transfers,
                ROUND(avg_total_tour_duration*100/25)*25/100 as avg_total_tour_duration,
                valid_tour
                FROM ( 
                SELECT t.id, t.url, t.provider, t.hashed_url, tour.description, tour.image_url, tour.ascent,
                tour.descent, tour.difficulty, tour.difficulty_orig , tour.duration, tour.distance, tour.title, tour.type,
                tour.number_of_days, tour.traverse, tour.country, tour.state, tour.range_slug, tour.range, tour.season,
                tour.month_order, tour.quality_rating, tour.max_ele,
                2 AS valid_tour,
                t.min_connection_duration,
                t.min_connection_no_of_transfers,
                t.avg_total_tour_duration
                FROM city2tour_flat as t
                INNER JOIN tour as tour ON tour.id=t.id 
                WHERE t.reachable_from_country=?
                AND t.id=?
                ORDER BY valid_tour DESC LIMIT 1) as a`;

    try {
        let entry2 = await knex.raw(sql, bindings);
        let entry = entry2.rows[0];

        if (!entry) {
            // If above sql is empty, it might be, that the selected city has no working connection to the tour
            // So the query checks the active tours without city and returns 2 as valid_tour
            entry2 = await knex.raw(sql3, sql3_bindings);
            entry = entry2.rows[0];

            if (!entry) {
                res.status(404).json({
                    success: false,
                    message: "Tour not found",
                });
                return;
            }
        }

        // The function prepareTourEntry will remove the column hashed_url, so it is not send to frontend
        entry = await prepareTourEntry(entry, city, domain, true);
        const responseData = { success: true, tour: entry };
        cacheService.set(cacheKey, responseData);
        res.status(200).json(responseData);
    } catch (error) {
        logger.error("Error in getWrapper for tour", id, ":", error);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error,
        });
    }
};

/**
 * Main search endpoint. Lists tours based on various filters such as search term, city, range,
 * range_slug, statistics (KPIs), and more. Supports pagination and caching.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const listWrapper = async (req, res) => {
    const showRanges = !!req.query.ranges;
    const page = req.query.page || 1;
    const map = req.query.map;
    const bounds = req.query.bounds;

    const search = req.query.search;
    const currLanguage = req.query.currLanguage ? req.query.currLanguage : "de"; // this is the menue language the user selected
    const city = req.query.city;
    const range = req.query.range;
    const state = req.query.state;
    const country = req.query.country;
    const type = req.query.type;
    const domain = req.query.domain;
    const tld = get_domain_country(domain).toUpperCase();
    const provider = req.query.provider;
    const language = req.query.language; // this referres to the column in table tour: The tour description is in which language
    const filter = req.query.filter;
    const poi = req.query.poi;

    const parsedBounds = bounds ? JSON.parse(bounds) : null;
    // Round coordinates to 4 decimal places (~11m precision) to improve cache hit rate
    const coordinatesNorthEast = parsedBounds
        ? {
              lat: Math.ceil(parsedBounds.north * 1000) / 1000,
              lng: Math.ceil(parsedBounds.east * 1000) / 1000,
          }
        : null;
    const coordinatesSouthWest = parsedBounds
        ? {
              lat: Math.floor(parsedBounds.south * 1000) / 1000,
              lng: Math.floor(parsedBounds.west * 1000) / 1000,
          }
        : null;

    const parsedPoi = poi ? JSON.parse(poi) : null;

    let new_search_where_searchterm = ``;
    let new_search_order_searchterm = ``;
    let new_search_where_country = ``;
    let new_search_where_state = ``;
    let new_search_where_range = ``;
    let new_search_where_type = ``;
    let new_search_where_provider = ``;
    let new_search_where_map = ``;
    let new_search_where_language = ``;
    let bindings = [];
    let order_bindings = [];
    let new_filter_where_singleDayTour = ``;
    let new_filter_where_multipleDayTour = ``;
    let new_filter_where_summerSeason = ``;
    let new_filter_where_winterSeason = ``;
    let new_filter_where_traverse = ``;
    let new_filter_where_Ascent = ``;
    let new_filter_where_Descent = ``;
    let new_filter_where_TransportDuration = ``;
    let new_filter_where_Distance = ``;
    let new_filter_where_ranges = ``;
    let new_filter_where_types = ``;
    let new_filter_where_languages = ``;
    let new_filter_where_difficulties = ``;
    let new_filter_where_providers = ``;
    let new_filter_where_poi = ``;

    let filter_string = filter;
    let filterJSON = undefined;
    try {
        if (filter_string) {
            filterJSON = JSON.parse(filter_string);
        }
    } catch (error) {
        filterJSON = undefined;
        logger.info("Error parsing filter JSON: ", error);
    }

    const defaultFilter = {
        singleDayTour: true,
        multipleDayTour: true,
        summerSeason: true,
        winterSeason: true,
        traverse: false,
    };

    // merge with filterJSON
    filterJSON = {
        ...defaultFilter,
        ...filterJSON,
    };

    if (typeof filterJSON !== "undefined" && filter_string != `{ ignore_filter: 'true' }`) {
        if (filterJSON["singleDayTour"] && !filterJSON["multipleDayTour"]) {
            new_filter_where_singleDayTour = `AND t.number_of_days=1 `;
        }

        if (!filterJSON["singleDayTour"] && filterJSON["multipleDayTour"]) {
            new_filter_where_multipleDayTour = `AND t.number_of_days>=2 `;
        }

        if (filterJSON["summerSeason"] && !filterJSON["winterSeason"]) {
            new_filter_where_summerSeason = `AND (t.season='s' OR t.season='g') `;
        }

        if (!filterJSON["summerSeason"] && filterJSON["winterSeason"]) {
            new_filter_where_winterSeason = `AND (t.season='w' OR t.season='g') `;
        }

        if (filterJSON["traverse"]) {
            new_filter_where_traverse = `AND t.traverse=1 `;
        }

        if (isNumber(filterJSON["minAscent"]) && filterJSON["minAscent"] >= 0) {
            new_filter_where_Ascent += `AND t.ascent >= ${filterJSON["minAscent"]} `;
        }

        if (isNumber(filterJSON["maxAscent"]) && filterJSON["maxAscent"] >= 0) {
            new_filter_where_Ascent += `AND t.ascent <= ${filterJSON["maxAscent"]} `;
        }

        if (isNumber(filterJSON["minDescent"]) && filterJSON["minDescent"] >= 0) {
            new_filter_where_Descent += `AND t.descent >= ${filterJSON["minDescent"]} `;
        }

        if (isNumber(filterJSON["maxDescent"]) && filterJSON["maxDescent"] >= 0) {
            new_filter_where_Descent += `AND t.descent <= ${filterJSON["maxDescent"]} `;
        }

        if (
            isNumber(filterJSON["minTransportDuration"]) &&
            filterJSON["minTransportDuration"] >= 0
        ) {
            new_filter_where_TransportDuration += `AND t.min_connection_duration >= ${filterJSON["minTransportDuration"] * 60} `;
        }

        if (
            isNumber(filterJSON["maxTransportDuration"]) &&
            filterJSON["maxTransportDuration"] >= 0
        ) {
            new_filter_where_TransportDuration += `AND t.min_connection_duration <= ${filterJSON["maxTransportDuration"] * 60} `;
        }

        if (isNumber(filterJSON["minDistance"]) && filterJSON["minDistance"] > 0) {
            new_filter_where_Distance += `AND t.distance >= ${filterJSON["minDistance"]} `;
        }

        if (isNumber(filterJSON["maxDistance"]) && filterJSON["maxDistance"] > 0) {
            new_filter_where_Distance += `AND t.distance <= ${filterJSON["maxDistance"]} `;
        }

        if (filterJSON["ranges"]) {
            new_filter_where_ranges = `AND t.range IN ${JSON.stringify(filterJSON["ranges"]).replace("[", "(").replace("]", ")").replaceAll('"', "'")} `;

            if (new_filter_where_ranges === "AND t.range IN () ;") {
                new_filter_where_ranges = ``;
            }
        }

        if (filterJSON["types"]) {
            new_filter_where_types = `AND t.type IN ${JSON.stringify(filterJSON["types"]).replace("[", "(").replace("]", ")").replaceAll('"', "'")} `;

            if (new_filter_where_types === "AND t.type IN () ;") {
                new_filter_where_types = ``;
            }
        }

        if (filterJSON["languages"]) {
            new_filter_where_languages = `AND t.text_lang IN ${JSON.stringify(filterJSON["languages"]).replace("[", "(").replace("]", ")").replaceAll('"', "'")} `;

            if (new_filter_where_languages === "AND t.text_lang IN () ;") {
                new_filter_where_languages = ``;
            }
        }

        if (filterJSON["difficulties"]) {
            new_filter_where_difficulties = `AND t.difficulty IN ${JSON.stringify(filterJSON["difficulties"]).replace("[", "(").replace("]", ")").replaceAll('"', "'")} `;

            if (new_filter_where_difficulties === "AND t.difficulty IN () ;") {
                new_filter_where_difficulties = ``;
            }
        }

        if (filterJSON["providers"]) {
            new_filter_where_providers = `AND t.provider IN ${JSON.stringify(filterJSON["providers"]).replace("[", "(").replace("]", ")").replaceAll('"', "'")} `;

            if (new_filter_where_providers === "AND t.provider IN () ;") {
                new_filter_where_providers = ``;
            }
        }
    }

    if (typeof search === "string" && search.trim() !== "") {
        let postgresql_language_code = "german";

        if (currLanguage == "sl") {
            postgresql_language_code = "simple";
        } else if (currLanguage == "fr") {
            postgresql_language_code = "french";
        } else if (currLanguage == "it") {
            postgresql_language_code = "italian";
        } else if (currLanguage == "en") {
            postgresql_language_code = "english";
        }

        // If there is more than one search term, the AI is superior,
        // if there is only a single word, the standard websearch of PostgreSQL ist better.
        let is_one_search_term = search.trim().split(/\s+/).length === 1;
        if (!is_one_search_term) {
            const embedding = await getCachedEmbedding(`query: ${search}`);
            if (embedding) {
                new_search_where_searchterm = `AND ai_search_column <-> ? < 0.6 `;
                bindings.push(embedding);
                new_search_order_searchterm = `ai_search_column <-> ? ASC, `;
                order_bindings.push(embedding);
                // logger.info("AI search")
            } else {
                // embedding not found, fallback to websearch - even though the search term consists of more than one word
                is_one_search_term = true;
            }
        }

        if (is_one_search_term) {
            // search consists of a single word and fallback for AI search
            new_search_where_searchterm = `AND t.search_column @@ websearch_to_tsquery(?, ?) `;
            bindings.push(postgresql_language_code, search);
            new_search_order_searchterm = `COALESCE(ts_rank(COALESCE(t.search_column, ''), COALESCE(websearch_to_tsquery(?, ?), '')), 0) DESC, `;
            order_bindings.push(postgresql_language_code, search);
            // logger.info("Websearch")
        }
    }

    if (!!range && range.length > 0) {
        new_search_where_range = `AND range=? `;
        bindings.push(range);
    }

    if (!!state && state.length > 0) {
        new_search_where_state = `AND state=? `;
        bindings.push(state);
    }

    if (!!country && country.length > 0) {
        new_search_where_country = `AND country=? `;
        bindings.push(country);
    }

    if (!!type && type.length > 0) {
        new_search_where_type = `AND type=? `;
        bindings.push(type);
    }

    if (!!provider && provider.length > 0) {
        new_search_where_provider = `AND t.provider=? `;
        bindings.push(provider);
    }

    if (!!language && language.length > 0) {
        new_search_where_language = `AND text_lang=?  `;
        bindings.push(language);
    }

    if (parsedPoi && parsedPoi.lat && parsedPoi.lng) {
        const radius = parsedPoi.radius ? parsedPoi.radius : 5000;
        const hashed_urls = await hashedUrlsFromPoi(parsedPoi.lat, parsedPoi.lng, radius);
        if (hashed_urls === null) {
            new_filter_where_poi = ``;
        } else if (hashed_urls.length !== 0) {
            new_filter_where_poi = `AND t.hashed_url IN ${JSON.stringify(hashed_urls).replace("[", "(").replace("]", ")").replaceAll('"', "'")} `;
        } else {
            new_filter_where_poi = `AND t.hashed_url IN ('null') ;`;
        }
    }

    //filters the tours by coordinates
    //FE sends coordinate bounds which the user sees on the map --> tours that are within these coordinates are returned
    if (!!coordinatesNorthEast && !!coordinatesSouthWest) {
        const latNE = coordinatesNorthEast.lat.toString();
        const lngNE = coordinatesNorthEast.lng.toString();
        const latSW = coordinatesSouthWest.lat.toString();
        const lngSW = coordinatesSouthWest.lng.toString();

        new_search_where_map = `AND t.connection_arrival_stop_lon between (?)::numeric and (?)::numeric AND t.connection_arrival_stop_lat between (?)::numeric AND (?)::numeric `;
        bindings.push(lngSW, lngNE, latSW, latNE);
    }

    const global_where_condition = `${new_search_where_searchterm}
                                    ${new_search_where_range}
                                    ${new_search_where_state}
                                    ${new_search_where_country}
                                    ${new_search_where_type}
                                    ${new_search_where_provider}
                                    ${new_search_where_language}
                                    ${new_search_where_map}
                                    ${new_filter_where_singleDayTour}
                                    ${new_filter_where_multipleDayTour}
                                    ${new_filter_where_summerSeason}
                                    ${new_filter_where_winterSeason}
                                    ${new_filter_where_traverse}
                                    ${new_filter_where_Ascent}
                                    ${new_filter_where_Descent}
                                    ${new_filter_where_TransportDuration}
                                    ${new_filter_where_Distance}
                                    ${new_filter_where_ranges}
                                    ${new_filter_where_types}
                                    ${new_filter_where_languages}
                                    ${new_filter_where_difficulties}
                                    ${new_filter_where_providers}
                                    ${new_filter_where_poi}`;

    // Create a version with actual values for cache key generation
    const global_where_condition_bound = bindValues(global_where_condition, bindings);
    const new_search_order_searchterm_bound = bindValues(
        new_search_order_searchterm,
        order_bindings,
    );
    const where_city_bound =
        city && city.length > 0
            ? `AND t.city_slug='${city.replace(/'/g, "''")}'`
            : `AND t.stop_selector='y'`;

    // Generate List of IDs, which is hopefully already in Valkey, so it should be really fast
    let cachedTourIds = [];
    const cacheKeyIds = generateKey("tours:ids", {
        tld,
        city,
        condition: global_where_condition_bound,
    });
    const cachedIds = await cacheService.get(cacheKeyIds);
    if (cachedIds) {
        cachedTourIds = cachedIds;
        // logger.info("Cache hit: Tour IDs were not queried from database. key=" + cacheKeyIds);
        // logger.info("global_where_condition_bound=" + JSON.stringify(global_where_condition_bound));
    } else {
        // Safe to interpolate tld directly: it comes from get_domain_country() which returns only controlled values (AT/CH/DE/IT/FR/SL), not user input
        const tour_ids_sql = `SELECT 
                            t.id
                            FROM city2tour_flat as t
                            WHERE t.reachable_from_country='${tld}'
                            ${where_city_bound}
                            ${global_where_condition_bound}
                            ORDER BY 
                            CASE WHEN t.text_lang='${language}' THEN 1 ELSE 0 END DESC,
                            ${new_search_order_searchterm_bound}
                            t.month_order ASC, 
                            t.number_of_days ASC,
                            CASE WHEN t.ascent BETWEEN 600 AND 1200 THEN 0 ELSE 1 END ASC, 
                            TRUNC(t.min_connection_no_of_transfers*t.min_connection_no_of_transfers/2) ASC,
                            TRUNC(t.min_connection_duration / 30, 0) ASC, 
                            t.traverse DESC, 
                            t.quality_rating DESC,
                            FLOOR(t.duration) ASC,
                            MOD(t.id, CAST(EXTRACT(DAY FROM CURRENT_DATE) AS INTEGER)) ASC;`;
        const tour_ids = await knex.raw(tour_ids_sql);
        cachedTourIds = tour_ids.rows.map((row) => row.id);
        cacheService.set(cacheKeyIds, cachedTourIds);
        // logger.info("Cache miss: Tour IDs were queried from database");
    }

    // ****************************************************************
    // GET THE COUNT
    // ****************************************************************
    const tour_count = cachedTourIds.length;

    // Safety check: if no tour IDs cached, return empty result
    if (tour_count === 0) {
        // logger.info("No cached tour IDs - returning empty result");
        const responseData = {
            success: true,
            tours: [],
            total: 0,
            page: page,
            ranges: [],
            markers: [],
        };
        return res.status(200).json(responseData);
    }

    // Get only the 9 tour IDs for the current page (cachedTourIds is already sorted)
    const startIndex = 9 * (page - 1);
    const endIndex = startIndex + 9;
    const pagedTourIds = cachedTourIds.slice(startIndex, endIndex);

    // Early return if pagination exceeds available results (e.g., page 2 when only 8 results exist)
    if (pagedTourIds.length === 0) {
        const responseData = {
            success: true,
            tours: [],
            total: tour_count,
            page: page,
            ranges: [],
            markers: [],
        };
        return res.status(200).json(responseData);
    }

    const new_search_sql = `SELECT 
                        t.id, 
                        t.provider, 
                        t.provider_name,
                        -- t.hashed_url, 
                        t.url, 
                        t.title, 
                        t.image_url,
                        -- t.type, 
                        -- t.country, 
                        -- t.state, 
                        -- t.range_slug, 
                        t.range, 
                        -- t.text_lang, 
                        -- t.difficulty_orig,
                        -- t.season,
                        -- t.max_ele,
                        -- t.connection_arrival_stop_lon,
                        -- t.connection_arrival_stop_lat,
                        t.min_connection_duration,
                        t.min_connection_no_of_transfers, 
                        ROUND(t.avg_total_tour_duration*100/25)*25/100 as avg_total_tour_duration,
                        t.ascent, 
                        -- t.descent, 
                        -- t.difficulty, 
                        -- t.duration, 
                        -- t.distance, 
                        -- t.traverse, 
                        -- t.quality_rating,
                        -- t.month_order,
                        t.number_of_days
                        FROM city2tour_flat AS t 
                        WHERE t.reachable_from_country='${tld}'
                        ${where_city_bound}
                        AND t.id IN (${pagedTourIds.join(", ")});`;

    // logger.info("new_search_sql: ", new_search_sql);

    let result_sql = null;
    let result = [];
    try {
        result_sql = await knex.raw(new_search_sql); // fire the DB call here
        if (result_sql && result_sql.rows) {
            result = result_sql.rows;
        } else {
            // logger.info("knex.raw(new_search_sql): result or result.rows is null or undefined.");
        }
    } catch (error) {
        logger.info("Error firing new_search_sql:", error);
    }

    // ****************************************************************
    // CALLING DATABASE FOR MARKERS
    // ****************************************************************
    let markers_result = ""; //markers-related : to return map markers positions from database
    let markers_array = []; // markers-related : to be filled by either cases(with or without "search included")

    if (map === "true" || map === true) {
        try {
            // markers-related / searchIncluded
            const markers_sql = `SELECT 
                            t.tour_id as id, 
                            t.connection_arrival_stop_lat as lat,
                            t.connection_arrival_stop_lon as lon
                            FROM city2tour AS t 
                            WHERE t.reachable_from_country='${tld}'
                            AND t.tour_id IN (${cachedTourIds.join(", ")})
                            ${where_city_bound}
                            AND t.connection_arrival_stop_lat IS NOT NULL 
                            AND t.connection_arrival_stop_lon IS NOT NULL;`;
            markers_result = await knex.raw(markers_sql); // fire the DB call here

            // logger.info("markers_result: ", markers_result);
            // markers-related
            if (!!markers_result && !!markers_result.rows) {
                markers_array = markers_result.rows; // This is to be passed to the response below
            } else {
                logger.info("markers_result is null or undefined");
            }
        } catch (error) {
            logger.info("tours.js: error retrieving markers_result:" + error);
        }
    }

    // Log search phrase on first page only (fire & forget - don't wait for result)
    if (page === 1 && search && req.query.city) {
        logSearchPhrase(search, tour_count, req.query.city, currLanguage, domain);
    }

    /** add ranges to result */
    // This code prepares the response to a HTTP request.
    // The ranges array is populated with data about the tours ranges. The showRanges variable is a
    // boolean that is passed in the request to determine whether to return the ranges or not.
    // If showRanges is true, then the code queries the database to get a list of the distinct ranges
    // and their image urls. It then loops through the results to create an array of range objects
    // containing the range name and the corresponding image URL. The code then queries the database
    // to get all states of each range and adds them to the states array of each range object.
    let ranges = [];
    let range_result = undefined;

    if (showRanges) {
        const cachedKeyRanges = generateKey("tours:ranges", { tld, city });
        const cachedRanges = await cacheService.get(cachedKeyRanges);
        if (cachedRanges) {
            ranges = cachedRanges;
            // logger.info("Cache hit: Tour ranges were not queried from database");
        } else {
            const months = [
                "jan",
                "feb",
                "mar",
                "apr",
                "may",
                "jun",
                "jul",
                "aug",
                "sep",
                "oct",
                "nov",
                "dec",
            ];
            const shortMonth = months[new Date().getMonth()];
            const range_sql = `SELECT
                                t.range_slug,
                                t.range,
                                CONCAT('https://cdn.zuugle.at/range-image/', t.range_slug, '.webp') as image_url,
                                SUM(1.0/(t.min_connection_no_of_transfers+1)) AS attract
                                FROM city2tour_flat AS t
                                INNER JOIN tour AS tour ON tour.id=t.id
                                WHERE t.reachable_from_country='${tld}'
                                ${where_city_bound}
                                AND tour.${shortMonth}='true'
                                AND t.range_slug IS NOT NULL
                                AND t.range IS NOT NULL
                                GROUP BY 1, 2, 3
                                ORDER BY SUM(1.0/(t.min_connection_no_of_transfers+1)) DESC, t.range_slug ASC
                                LIMIT 10`;

            range_result = await knex.raw(range_sql);
            // logger.info("range_sql: ", range_sql)

            if (!!range_result && !!range_result.rows) {
                ranges = range_result.rows;
            }
            cacheService.set(cachedKeyRanges, ranges);
        }
    }

    //describe:
    // The result array contains the list of tours returned from the database after executing the main query.
    // This array is already looped through to transform each tour entry with additional data and metadata
    // using the prepareTourEntry function. Finally, a JSON response is returned with success set to true,
    // the tours array, the total count of tours returned by the main query, the current page, and the
    // ranges array (if showRanges is true).

    const responseData = {
        success: true,
        tours: result,
        total: tour_count,
        page: page,
        ranges: ranges,
        markers: markers_array,
    };
    res.status(200).json(responseData);
}; // end of listWrapper

/**
 * Returns available filter options (types, ranges, providers, min/max values) that match
 * the current search criteria (search term, city, domain).
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const filterWrapper = async (req, res) => {
    const cacheKey = generateKey("tours:filter", req.query);
    const cached = await cacheService.get(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }

    const search = req.query.search;
    const city = req.query.city;
    const domain = req.query.domain;
    const currLanguage = req.query.currLanguage; // gets the menu language (selected by visitor)

    // Where Condition is only depending on country, city and search term(s)

    let kpis = [];
    let types = [];
    let text = [];
    let ranges = [];
    let providers = [];
    let tld = get_domain_country(domain).toUpperCase();
    let where_city = ` AND t.stop_selector='y' `;
    let new_search_where_searchterm = "";
    let bindings = [tld];

    if (!!city && city.length > 0) {
        where_city = ` AND t.city_slug=? `;
        bindings.push(city);
    }

    if (!!search && !!search.length > 0) {
        let postgresql_language_code = "german";

        if (currLanguage == "sl") {
            postgresql_language_code = "simple";
        } else if (currLanguage == "fr") {
            postgresql_language_code = "french";
        } else if (currLanguage == "it") {
            postgresql_language_code = "italian";
        } else if (currLanguage == "en") {
            postgresql_language_code = "english";
        }

        new_search_where_searchterm = `AND t.search_column @@ websearch_to_tsquery(?, ?) `;
        bindings.push(postgresql_language_code, search);
    }

    // Use a random string to avoid SQL injection via city name in table name
    const randomSuffix = crypto.randomBytes(6).toString("hex");
    const temp_table = `temp_${tld}_${Date.now()}_${randomSuffix}`;

    let temporary_sql = `CREATE TEMP TABLE ${temp_table} AS
                    SELECT 
                    t.type,
                    t.text_lang,
                    t.range,
                    t.range_slug,
                    t.provider,
                    t.number_of_days,
                    t.season,
                    t.traverse,
                    min(t.ascent) AS min_ascent,
                    max(t.ascent) AS max_ascent,
                    min(t.descent) AS min_descent,
                    max(t.descent) AS max_descent,
                    min(t.distance) AS min_distance,
                    max(t.distance) AS max_distance,
                    min(t.min_connection_duration) AS min_connection_duration,
                    max(t.max_connection_duration) AS max_connection_duration
                    FROM city2tour_flat AS t 
                    WHERE t.reachable_from_country=?
                    ${where_city}
                    ${new_search_where_searchterm}
                    GROUP BY
                    t.type,
                    t.text_lang,
                    t.range,
                    t.range_slug,
                    t.provider,
                    t.number_of_days,
                    t.season,
                    t.traverse;`;
    await knex.raw(temporary_sql, bindings);

    await knex.raw(`CREATE INDEX idx_type ON ${temp_table} (type);`);
    await knex.raw(`CREATE INDEX idx_lang ON ${temp_table} (text_lang);`);
    await knex.raw(`CREATE INDEX idx_range ON ${temp_table} (range, range_slug);`);
    await knex.raw(`CREATE INDEX idx_provider ON ${temp_table} (provider);`);

    let kpi_sql = `SELECT 
                CASE WHEN SUM(CASE WHEN t.number_of_days=1 THEN 1 ELSE 0 END) > 0 THEN TRUE ELSE FALSE END AS isSingleDayTourPossible,
                CASE WHEN SUM(CASE WHEN t.number_of_days=2 THEN 1 ELSE 0 END) > 0 THEN TRUE ELSE FALSE END AS isMultipleDayTourPossible,
                CASE WHEN SUM(CASE WHEN t.season='s' OR t.season='n' THEN 1 ELSE 0 END) > 0 THEN TRUE ELSE FALSE END AS isSummerTourPossible,
                CASE WHEN SUM(CASE WHEN t.season='w' OR t.season='n' THEN 1 ELSE 0 END) > 0 THEN TRUE ELSE FALSE END AS isWinterTourPossible,
                CASE WHEN MAX(t.max_ascent) > 3000 THEN 3000 ELSE MAX(t.max_ascent) END AS maxAscent,
                MIN(t.min_ascent) AS minAscent,
                CASE WHEN MAX(t.max_descent) > 3000 THEN 3000 ELSE MAX(t.max_descent) END AS maxDescent,
                MIN(t.min_descent) AS minDescent,
                CASE WHEN MAX(t.max_distance) > 80 THEN 80.0 ELSE MAX(t.max_distance) END AS maxDistance,
                MIN(t.min_distance) AS minDistance,
                CASE WHEN SUM(t.traverse) > 0 THEN TRUE ELSE FALSE END AS isTraversePossible,
                MIN(t.min_connection_duration/60) AS minTransportDuration,
                MAX(t.max_connection_duration/60) AS maxTransportDuration
                FROM ${temp_table} t;`;
    // logger.info("kpi_sql: ", kpi_sql)

    let kpi_result = await knex.raw(kpi_sql);
    if (!!kpi_result && !!kpi_result.rows) {
        kpis = kpi_result.rows;
    }

    let _isSingleDayTourPossible;
    let _isMultipleDayTourPossible;
    let _isSummerTourPossible;
    let _isWinterTourPossible;
    let _maxAscent;
    let _minAscent;
    let _maxDescent;
    let _minDescent;
    let _maxDistance;
    let _minDistance;
    let _isTraversePossible;
    let _minTransportDuration;
    let _maxTransportDuration;

    for (const element of kpis) {
        _isSingleDayTourPossible = element.issingledaytourpossible;
        _isMultipleDayTourPossible = element.ismultipledaytourpossible;
        _isSummerTourPossible = element.issummertourpossible;
        _isWinterTourPossible = element.iswintertourpossible;
        _maxAscent = element.maxascent;
        _minAscent = element.minascent;
        _maxDescent = element.maxdescent;
        _minDescent = element.mindescent;
        _maxDistance = parseFloat(element.maxdistance);
        _minDistance = parseFloat(element.mindistance);
        _isTraversePossible = element.istraversepossible;
        _minTransportDuration = parseFloat(element.mintransportduration);
        _maxTransportDuration = parseFloat(element.maxtransportduration);
    }

    let types_sql = `SELECT 
                    t.type
                    FROM ${temp_table} as t
                    GROUP BY t.type
                    ORDER BY t.type;`;

    let types_result = await knex.raw(types_sql);
    if (!!types_result && !!types_result.rows) {
        types = types_result.rows;
    }
    // logger.info("types / Sportarten: ", types)

    let text_sql = `SELECT 
                    t.text_lang
                    FROM ${temp_table} as t
                    GROUP BY t.text_lang
                    ORDER BY t.text_lang;`;

    let text_result = await knex.raw(text_sql);
    if (!!text_result && !!text_result.rows) {
        text = text_result.rows;
    }
    // logger.info("text_lang: ", text)

    let range_sql = `SELECT 
                    t.range
                    FROM ${temp_table} as t                       
                    WHERE t.range_slug IS NOT NULL 
                    GROUP BY t.range
                    ORDER BY t.range;`;

    let range_result = await knex.raw(range_sql);
    if (!!range_result && !!range_result.rows) {
        ranges = range_result.rows;
    }
    // logger.info("ranges: ", ranges)

    let provider_sql = `SELECT 
                    t.provider,
                    p.provider_name
                    FROM ${temp_table} as t                       
                    INNER JOIN provider as p 
                    ON t.provider=p.provider
                    GROUP BY t.provider, p.provider_name
                    ORDER BY t.provider;`;

    let provider_result = await knex.raw(provider_sql);
    if (!!provider_result && !!provider_result.rows) {
        providers = provider_result.rows;
    }

    let filterresult = {
        types: types.map((typeObj) => typeObj.type),
        ranges: ranges.map((rangesObj) => rangesObj.range),
        providers: providers.map((providerObj) => providerObj.provider),
        isSingleDayTourPossible: _isSingleDayTourPossible,
        isMultipleDayTourPossible: _isMultipleDayTourPossible,
        isSummerTourPossible: _isSummerTourPossible,
        isWinterTourPossible: _isWinterTourPossible,
        maxAscent: _maxAscent,
        minAscent: _minAscent,
        maxDescent: _maxDescent,
        minDescent: _minDescent,
        maxDistance: _maxDistance,
        minDistance: _minDistance,
        isTraversePossible: _isTraversePossible,
        minTransportDuration: _minTransportDuration,
        maxTransportDuration: _maxTransportDuration,
        languages: text.map((textObj) => textObj.text_lang),
    };
    // logger.info("filterresult: ", filterresult)

    try {
        await knex.raw(`DROP TABLE ${temp_table};`);
    } catch (err) {
        logger.info("Drop temp table failed: ", err);
    }

    const responseData = {
        success: true,
        filter: filterresult,
        providers: providers,
    };
    cacheService.set(cacheKey, responseData);
    res.status(200).json(responseData);
}; // end of filterWrapper

/**
 * Retrieves detailed public transport connection schedules (outbound and return) for a specific tour and city.
 * Returns connections for the next 7 days.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const connectionsExtendedWrapper = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const city = req.query.city ? req.query.city : req.params.city ? req.params.city : null;
    const domain = req.query.domain;

    if (isNaN(id) || !city) {
        res.status(404).json({ success: false });
        return;
    }

    let connections = [];
    const fahrplan_sql = `SELECT 
                          f.calendar_date,
                          f.connection_departure_datetime,
                          f.connection_arrival_datetime,
                          f.connection_duration,
                          f.connection_no_of_transfers,
                          f.connection_returns_trips_back,
                          f.return_departure_datetime,
                          f.return_duration,
                          f.return_no_of_transfers,
                          f.return_arrival_datetime,
                          f.totour_track_duration,
                          f.fromtour_track_duration,
                          f.connection_description_json,
                          f.return_description_json,
                          f.totour_track_key,
                          f.fromtour_track_key
                          FROM tour as t
                          INNER JOIN fahrplan as f
                          ON f.hashed_url=t.hashed_url
                          WHERE t.id=?
                          AND f.city_slug=?
                          ORDER BY return_row ASC;`;
    const fahrplan_result = await knex.raw(fahrplan_sql, [id, city]);

    if (!!fahrplan_result && !!fahrplan_result.rows) {
        connections = fahrplan_result.rows.map((connection) => {
            connection.connection_departure_datetime = momenttz(
                connection.connection_departure_datetime,
            )
                .tz("Europe/Berlin")
                .format();
            connection.connection_arrival_datetime = momenttz(
                connection.connection_arrival_datetime,
            )
                .tz("Europe/Berlin")
                .format();
            connection.return_departure_datetime = momenttz(connection.return_departure_datetime)
                .tz("Europe/Berlin")
                .format();
            return connection;
        });
    }

    const today = moment().set("hour", 0).set("minute", 0).set("second", 0);
    let end = moment().add(7, "day");

    let result = [];

    while (today.isBefore(end)) {
        const byWeekday = connections.filter(
            (conn) => moment(conn.calendar_date).format("DD.MM.YYYY") == today.format("DD.MM.YYYY"),
        );
        const duplicatesRemoved = [];

        byWeekday.forEach((t) => {
            let e = { ...t };
            e.connection_duration_minutes = minutesFromMoment(
                moment(e.connection_duration, "HH:mm:ss"),
            );
            e.return_duration_minutes = minutesFromMoment(moment(e.return_duration, "HH:mm:ss"));

            if (!duplicatesRemoved.find((tt) => compareConnections(e, tt))) {
                e.gpx_file = `${getHost(domain)}/public/gpx-track/totour/${last_two_characters(e.totour_track_key)}/${e.totour_track_key}.gpx`;
                duplicatesRemoved.push(e);
            }
        });

        result.push({
            date: today.format(),
            connections: duplicatesRemoved,
            returns: getReturnConnectionsByConnection(connections, domain, today),
        });
        today.add(1, "day");
    }

    //handle last value
    if (result && result.length > 0) {
        if (
            !!result[result.length - 1] &&
            (!result[result.length - 1].connections ||
                result[result.length - 1].connections.length == 0)
        ) {
            result = result.slice(0, -1);
        }
    }

    res.status(200).json({ success: true, result: result });
};

/**
 * Helper function to filter and map return connections that match the date of the outbound connection.
 * @param {Array} connections - List of all available connections.
 * @param {string} domain - The domain to generate GPX links for.
 * @param {Moment} today - The specific date to filter for.
 * @returns {Array} List of unique return connections for the given date.
 */
const getReturnConnectionsByConnection = (connections, domain, today) => {
    let _connections = [];
    let _duplicatesRemoved = [];

    _connections = connections.filter(
        (conn) => moment(conn.calendar_date).format("DD.MM.YYYY") == today.format("DD.MM.YYYY"),
    );

    //filter and map
    _connections.forEach((t) => {
        let e = { ...t };
        e.connection_duration_minutes = minutesFromMoment(
            moment(e.connection_duration, "HH:mm:ss"),
        );
        e.return_duration_minutes = minutesFromMoment(moment(e.return_duration, "HH:mm:ss"));

        if (!_duplicatesRemoved.find((tt) => compareConnectionReturns(e, tt))) {
            e.gpx_file = `${getHost(domain)}/public/gpx-track/fromtour/${last_two_characters(e.fromtour_track_key)}/${e.fromtour_track_key}.gpx`;
            _duplicatesRemoved.push(e);
        }
    });
    return _duplicatesRemoved;
};

/**
 * Helper function to compare two connection objects to check if they represent the same trip
 * (based on departure and arrival times).
 * @param {object} trans1 - First connection object.
 * @param {object} trans2 - Second connection object.
 * @returns {boolean} True if they are the same, false otherwise.
 */
const compareConnections = (trans1, trans2) => {
    return (
        trans1 != null &&
        trans2 != null &&
        moment(trans1.connection_departure_datetime).isSame(
            moment(trans2.connection_departure_datetime),
        ) &&
        moment(trans1.connection_arrival_datetime).isSame(
            moment(trans2.connection_arrival_datetime),
        )
    );
};

/**
 * Helper function to compare two return connection objects to check if they represent the same trip.
 * @param {object} conn1 - First return connection object.
 * @param {object} conn2 - Second return connection object.
 * @returns {boolean} True if they are the same, false otherwise.
 */
const compareConnectionReturns = (conn1, conn2) => {
    return (
        conn1 != null &&
        conn2 != null &&
        moment(conn1.return_departure_datetime).format("HH:mm:ss") ==
            moment(conn2.return_departure_datetime).format("HH:mm:ss") &&
        moment(conn1.return_arrival_datetime).format("HH:mm:ss") ==
            moment(conn2.return_arrival_datetime).format("HH:mm:ss") &&
        conn1.return_arrival_stop == conn2.return_arrival_stop
    );
};

/**
 * Serves the GPX file for a tour.
 * Can merge the main tour track with arrival (anreise) and departure (abreise) tracks if requested (`type=all`).
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const tourGpxWrapper = async (req, res) => {
    const id = req.params.id;
    const type = req.query.type ? req.query.type : "gpx";
    const key = req.query.key;
    const keyAnreise = req.query.key_anreise;
    const keyAbreise = req.query.key_abreise;

    res.setHeader("content-type", "application/gpx+xml");
    res.setHeader("Cache-Control", "public, max-age=31557600");

    try {
        let BASE_PATH = process.env.NODE_ENV === "production" ? "../" : "../../";
        if (type == "all") {
            let filePathMain = replaceFilePath(
                path.join(__dirname, BASE_PATH, `/public/gpx/${last_two_characters(id)}/${id}.gpx`),
            );
            let filePathAbreise = replaceFilePath(
                path.join(
                    __dirname,
                    BASE_PATH,
                    `/public/gpx-track/fromtour/${last_two_characters(keyAbreise)}/${keyAbreise}.gpx`,
                ),
            );
            let filePathAnreise = replaceFilePath(
                path.join(
                    __dirname,
                    BASE_PATH,
                    `/public/gpx-track/totour/${last_two_characters(keyAnreise)}/${keyAnreise}.gpx`,
                ),
            );

            const xml = await mergeGpxFilesToOne(filePathMain, filePathAnreise, filePathAbreise);
            if (xml) {
                res.status(200).send(xml);
            } else {
                res.status(400).json({ success: false });
            }
        } else {
            let filePath = path.join(
                __dirname,
                BASE_PATH,
                `/public/gpx/${last_two_characters(id)}/${id}.gpx`,
            );
            if (type == "abreise" && !!key) {
                filePath = path.join(
                    __dirname,
                    BASE_PATH,
                    `/public/gpx-track/fromtour/${last_two_characters(key)}/${key}.gpx`,
                );
            } else if (type == "anreise" && !!key) {
                filePath = path.join(
                    __dirname,
                    BASE_PATH,
                    `/public/gpx-track/totour/${last_two_characters(key)}/${key}.gpx`,
                );
            }
            filePath = replaceFilePath(filePath);

            let stream = fs.createReadStream(filePath);
            stream.on("error", (error) => {
                logger.info("error: ", error);
                res.status(500).json({ success: false });
            });
            stream.on("open", () => stream.pipe(res));
        }
    } catch (e) {
        logger.error(e);
    }
};

/**
 * Formats a tour entry for the frontend.
 * Adds full image URLs, provider names, difficulty text, and canonical/alternate links.
 * @param {object} entry - The raw tour entry from the database.
 * @param {string} city - The city slug (optional) to link specific transport tracks.
 * @param {string} domain - The domain for URL generation.
 * @param {boolean} addDetails - Whether to fetch extra details like provider name and canonical links.
 * @returns {object} The formatted tour entry.
 */
const prepareTourEntry = async (entry, city, domain, addDetails = true) => {
    if (!(!!entry && !!entry.provider)) return entry;

    if (!entry.image_url || entry.image_url.length < 5) {
        entry.image_url = "https://cdn.zuugle.at/img/train_placeholder.webp";
    }

    const host = getHost(domain);
    entry.gpx_file = `${host}/public/gpx/${last_two_characters(entry.id)}/${entry.id}.gpx`;

    if (addDetails) {
        if (city) {
            const toTour = await knex("fahrplan")
                .select("totour_track_key")
                .where({ hashed_url: entry.hashed_url, city_slug: city })
                .whereNotNull("totour_track_key")
                .first();
            const fromTour = await knex("fahrplan")
                .select("fromtour_track_key")
                .where({ hashed_url: entry.hashed_url, city_slug: city })
                .whereNotNull("fromtour_track_key")
                .first();

            if (!!toTour && !!toTour.totour_track_key) {
                entry.totour_gpx_file = `${host}/public/gpx-track/totour/${last_two_characters(toTour.totour_track_key)}/${toTour.totour_track_key}.gpx`;
            }
            if (!!fromTour && !!fromTour.fromtour_track_key) {
                entry.fromtour_gpx_file = `${host}/public/gpx-track/fromtour/${last_two_characters(fromTour.fromtour_track_key)}/${fromTour.fromtour_track_key}.gpx`;
            }
        }

        /** add provider_name to result */
        let provider_result = await knex("provider")
            .select("provider_name")
            .where({ provider: entry.provider })
            .first();
        entry.provider_name = provider_result.provider_name;

        // convert the "difficulty" value into a text value
        entry.difficulty = convertDifficulty(entry.difficulty);

        // add info about canonical and alternate links of this tour with entry.id
        const canon_sql = `SELECT
                          city_slug,
                          canonical_yn,
                          zuugle_url,
                          href_lang
                          FROM canonical_alternate
                          WHERE id=${entry.id};`;
        const canonical = await knex.raw(canon_sql);
        if (canonical) {
            entry.canonical = canonical.rows;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ["hashed_url"]: remove, ...rest } = entry;
    return rest;
};

export default router;
