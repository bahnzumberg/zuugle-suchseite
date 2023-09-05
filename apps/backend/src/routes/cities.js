import express from 'express';
let router = express.Router();
import knex from "../knex";
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
            result = await knex('city_favourites').select().where(where).orderBy('search_count', 'desc').limit(100);
            if(!!!result || result.length === 0){
                result = await knex('city').select().where(where).orderBy('city', 'asc').limit(100);
            }
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