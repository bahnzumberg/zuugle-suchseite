import express from "express";
let router = express.Router();
import knex from "../knex";
import cacheService from "../services/cache";
import { get_domain_country } from "../utils/utils";

// Generate cache key for cities
const generateCacheKey = (params) => {
    return `cities:${JSON.stringify(params)}`;
};

/**
 * @swagger
 * /api/cities:
 *   get:
 *     summary: Retrieve a list of cities
 *     description: Retrieve a list of cities that have tours available.
 *     parameters:
 *       - in: query
 *         name: domain
 *         schema:
 *           type: string
 *         description: The domain to filter by (e.g. www.zuugle.at)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for city name
 *       - in: query
 *         name: all
 *         schema:
 *           type: boolean
 *         description: If true, returns all cities
 *     responses:
 *       200:
 *         description: A list of cities.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         description: The city slug
 *                       label:
 *                         type: string
 *                         description: The city name
 */
router.get("/", (req, res) => listWrapper(req, res));

const listWrapper = async (req, res) => {
    const search = req.query.search;
    const getAll = req.query.all;
    const domain = req.query.domain;

    // Check cache first
    const cacheKey = generateCacheKey({ domain, search, all: getAll });
    const cached = await cacheService.get(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }

    let where = {};
    where["city_country"] = get_domain_country(domain);

    let result = [];

    if (getAll) {
        result = await knex("city")
            .select("city_slug", "city_name")
            .where(where)
            .orderBy("city", "asc");
    } else {
        if (!!search && search.length > 0) {
            result = await knex("city")
                .select("city_slug", "city_name")
                .where(where)
                .andWhereRaw(`LOWER(city_name) LIKE ?`, [`%${search.toLowerCase()}%`])
                .orderBy("city", "asc")
                .limit(100);
        } else {
            result = await knex("city")
                .select("city_slug", "city_name")
                .where(where)
                .orderBy("city", "asc")
                .limit(100);
        }
    }

    result = result.map((entry) => {
        return {
            value: entry.city_slug,
            label: entry.city_name,
        };
    });

    const responseData = { success: true, cities: result };
    cacheService.set(cacheKey, responseData);
    res.status(200).json(responseData);
};

/**
 * @swagger
 * /api/city:
 *   get:
 *     summary: Retrieve a single city by slug
 *     description: Returns city_slug, city_name, lat and lon for a given city.
 *     parameters:
 *       - in: query
 *         name: city_slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The city slug (e.g. innsbruck)
 *     responses:
 *       200:
 *         description: City found.
 *       404:
 *         description: City not found.
 */
let cityRouter = express.Router();
cityRouter.get("/", (req, res) => getWrapper(req, res));

const getWrapper = async (req, res) => {
    const city_slug = req.query.city_slug;

    if (!city_slug || city_slug.trim().length === 0) {
        return res.status(400).json({ success: false, message: "city_slug parameter is required" });
    }

    const cacheKey = `city:${city_slug}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }

    const result = await knex("city")
        .select("city_slug", "city_name", "lat", "lon")
        .where({ city_slug: city_slug })
        .first();

    if (!result) {
        return res.status(404).json({ success: false, message: "City not found" });
    }

    const responseData = { success: true, city: result };
    cacheService.set(cacheKey, responseData);
    res.status(200).json(responseData);
};

/**
 * @swagger
 * /api/cities2tour:
 *   get:
 *     summary: Retrieve all cities with reachability for a given tour
 *     description: Returns all cities for the domain's country with a reachable flag indicating whether the tour is reachable from each city.
 *     parameters:
 *       - in: query
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *         description: The domain (e.g. zuugle.at)
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The tour ID
 *     responses:
 *       200:
 *         description: List of cities with reachability.
 *       400:
 *         description: Missing parameters.
 */
let cities2tourRouter = express.Router();
cities2tourRouter.get("/", (req, res) => cities2tourWrapper(req, res));

const cities2tourWrapper = async (req, res) => {
    const domain = req.query.domain;
    const tour_id = parseInt(req.query.id, 10);

    if (!domain || isNaN(tour_id)) {
        return res
            .status(400)
            .json({ success: false, message: "domain and id parameters are required" });
    }

    const tld = get_domain_country(domain).toUpperCase();

    const cacheKey = `cities2tour:${tld}:${tour_id}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }

    const result = await knex.raw(
        `
        SELECT
        c.city_slug,
        c.city_name,
        CASE WHEN COALESCE(t.min_connection_duration, 9999) < 9999 THEN 1 ELSE 0 END as reachable
        FROM city as c
        LEFT OUTER JOIN (SELECT city_slug, min_connection_duration FROM city2tour WHERE tour_id=?) as t
        ON c.city_slug=t.city_slug
        WHERE c.city_country=?
        ORDER BY c.city_slug ASC
    `,
        [tour_id, tld],
    );

    const cities = result.rows || [];
    const responseData = { success: true, cities: cities };
    cacheService.set(cacheKey, responseData);
    res.status(200).json(responseData);
};

export { cityRouter, cities2tourRouter };
export default router;
