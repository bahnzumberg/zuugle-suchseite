import express from 'express';
let router = express.Router();
import knex from "../knex";

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
router.get('/', (req, res) => listWrapper(req, res));
import {get_domain_country} from "../utils/utils"

const listWrapper = async (req, res) => {
    const search = req.query.search;
    const getAll = req.query.all;
    const domain = req.query.domain;
    let where = {};
    where['city_country'] = get_domain_country(domain);

    let result = [];

    if(!!getAll){
        result = await knex('city').select().where(where).orderBy('city', 'asc');
    } else {
        if(!!search && search.length > 0){
            result = await knex('city').select().where(where).andWhereRaw(`LOWER(city_name) LIKE '%${search.toLowerCase()}%'`).orderBy('city', 'asc').limit(100);
        } else {
            result = await knex('city').select().where(where).orderBy('city', 'asc').limit(100);
        }
    }

    result = result.map(entry => {
        return {
            value: entry.city_slug,
            label: entry.city_name
        }
    })

    res.status(200).json({success: true, cities: result});
}



export default router;