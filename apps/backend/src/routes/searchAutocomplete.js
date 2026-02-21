import express from "express";
let router = express.Router();
import knex from "../knex";
import cacheService from "../services/cache.js";
router.get("/", (req, res) => autocompleteWrapper(req, res));

const autocompleteWrapper = async (req, res) => {
    let search = req.query.search;
    let searchTerm = `${search}%`;

    // Check if content of "search" is a string and not empty and not too long
    if (typeof search !== "string") {
        search = "";
        return res.status(400).json({
            success: false,
            error: "Bad Request - no valid search term",
        });
    }

    if (!search || search.length == 0) {
        return res.status(200).json({ success: true, error: "no search term" });
    }

    if (search.length > 128) {
        return res.status(400).json({
            success: false,
            error: "Bad Request - search term is too long (max. 128 characters)",
        });
    }

    const city = req.query.city;
    const tld = req.query.tld?.toUpperCase() ?? "AT";

    // If we found the combination of city, tld and search term in the cache, return it
    const cacheKey = `autocomplete:searchterm:${city || "all"}:${tld}:${search}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }

    // No cached result, so we need to query the database
    let sql = `SELECT
                type,
                term
                FROM (
                    SELECT
                        p.type,
                        p.name AS term,
                        CASE WHEN p.type='peak' THEN 1 ELSE 2 END as priority
                        1 as number_of_tours
                    FROM pois p
                    JOIN poi2tour pt ON p.id = pt.poi_id
                    JOIN city2tour c ON pt.tour_id = c.tour_id
                    WHERE c.reachable_from_country = :tld
                    __city_filter__
                    AND p.name ILIKE :searchTerm
                UNION
                    SELECT
                        'term' AS type,
                        c.term,
                        2 as priority,
                        c.number_of_tours
                    FROM search_suggestions as c
                    WHERE c.reachable_from_country = :tld
                    __city_filter__
                    AND term ILIKE :searchTerm
                    )
                ORDER BY priority ASC, number_of_tours DESC, term ASC
                LIMIT 5;`;

    // City can be null, so we insert the WHERE condition only if city is not null
    let city_filter = " AND c.city_slug = :city ";
    if (city == "null" || !city || city.length == 0) {
        city_filter = "";
    }

    let sql_final = sql.replaceAll("__city_filter__", city_filter);
    const queryResult = await knex.raw(sql_final, { tld, city, searchTerm });
    const rows = queryResult.rows;

    const items = rows.map((row) => {
        return {
            [row.type]: row.term,
        };
    });

    // Store in cache and return the result as json
    cacheService.set(cacheKey, { success: true, items: items });
    return res.status(200).json({ success: true, items: items });
};

export default router;
