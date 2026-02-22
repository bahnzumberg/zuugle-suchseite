import express from "express";
let router = express.Router();
import knex from "../knex";
import cacheService from "../services/cache.js";
import logger from "../utils/logger";
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

    if (search.length < 3) {
        return res.status(400).json({
            success: false,
            error: "Bad Request - search term is too short (min 3 characters)",
        });
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
    let sql = `WITH RankedSuggestions AS (
                    SELECT
                        type,
                        term,
                        priority,
                        number_of_tours,
                        ROW_NUMBER() OVER (
                            PARTITION BY 
                                CASE 
                                    WHEN type = 'peak' THEN 'peak_group'
                                    WHEN type = 'range' THEN 'range_group'
                                    ELSE 'other_group'
                                END
                            ORDER BY priority ASC, number_of_tours DESC, term ASC
                        ) as category_rank
                    FROM search_suggestions
                    WHERE reachable_from_country = :tld
                    __city_filter__
                    AND term ILIKE :searchTerm
                ),
                FilteredQuotas AS (
                    SELECT * FROM RankedSuggestions
                    WHERE 
                        (category_rank <= 3 AND type = 'peak') 
                        OR 
                        (category_rank <= 2 AND type = 'range')
                        OR 
                        (type NOT IN ('peak', 'range'))
                )
                SELECT 
                    type, 
                    term
                FROM FilteredQuotas
                ORDER BY priority ASC, number_of_tours DESC, term ASC
                LIMIT 6;`;

    // City can be null, so we insert the WHERE condition only if city is not null
    let city_filter = " AND city_slug = :city ";
    if (city == "null" || !city || city.length == 0) {
        city_filter = "";
    }

    let sql_final = sql.replaceAll("__city_filter__", city_filter);
    let rows = [];
    try {
        const queryResult = await knex.raw(sql_final, { tld, city, searchTerm });
        rows = queryResult.rows;
    } catch (err) {
        logger.error("Error querying search_suggestions:", err);
        return res.status(200).json({ success: true, items: [] });
    }

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
