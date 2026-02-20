import express from "express";
let router = express.Router();
import knex from "../knex";
import cacheService from "../services/cache.js";
router.get("/searchphrase", (req, res) => autocompleteWrapper(req, res));

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
                        2 as priority
                    FROM pois p
                    JOIN poi2tour pt ON p.id = pt.poi_id
                    JOIN city2tour_flat c2f ON pt.tour_id = c2f.id
                    WHERE c2f.reachable_from_country = :tld
                    __city_filter__
                    AND p.name ILIKE :searchTerm
                UNION
                    SELECT 
                        'term' AS type,
                        term,
                        1 as priority
                    FROM vw_search_suggestions
                    WHERE reachable_from_country = :tld
                    __city_filter__
                    AND term ILIKE :searchTerm
                    ) 
                ORDER BY priority DESC, term ASC
                LIMIT 5;`;

    // City can be null, so we insert the WHERE condition only if city is not null
    let city_filter = " AND c2f.city_slug = :city ";
    if (city == "null" || !city || city.length == 0) {
        city_filter = "";
    }

    let sql_final = sql.replace("__city_filter__", city_filter);
    const queryResult = await knex.raw(sql_final, [tld, city, searchTerm]);
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
