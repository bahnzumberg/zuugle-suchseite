import express from "express";
let router = express.Router();
import knex from "../knex";
router.get("/", (req, res) => listWrapper(req, res));

//calls the database statement (createQuery) and sends the therefor needed props
//it also waits for the result of the statement and returns the status of it
const listWrapper = async (req, res) => {
    let search = req.query.search;

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
    const language = req.query.language;
    const tld = req.query.tld.toUpperCase();

    const item = await createQuery(
        "phrase",
        "search_phrase",
        city,
        search,
        language,
        tld,
    );

    const result = item;

    return res.status(200).json({ success: true, items: result });
};

//queries through the database table "logsearchphrase" and returns the phrases that start with the search phrase
const createQuery = async (field, alias, city, search, language, tld) => {
    let query = knex("logsearchphrase")
        .select(knex.raw("MIN(??) as ??", [field, alias])) // shortest original phrase
        .count("* as CNT")
        .whereNot(field, null)
        .andWhereNot(field, "")
        .andWhere("country_code", tld);

    if (!!city && city.length > 0 && city != "null") {
        query = query.andWhere("city_slug", city);
    }

    if (!!language && language.length > 0) {
        query = query.andWhere("menu_lang", language);
    }

    query = query.andWhereRaw(
        `search_time > CURRENT_DATE - INTERVAL '12 MONTH'`,
    );

    const normalizedField = `LOWER(TRIM(${field}))`;
    const searchTerm = `${search.trim().toLowerCase()}%`;

    query = query.andWhereRaw(`${normalizedField} LIKE ?`, [searchTerm]);

    const queryResult = await query
        .groupByRaw(normalizedField)
        .orderBy(`CNT`, `desc`)
        .orderBy(alias, `asc`)
        .limit(5);

    const result = queryResult.map((entry) => {
        return {
            suggestion: entry[alias],
        };
    });
    return result;
};
export default router;
