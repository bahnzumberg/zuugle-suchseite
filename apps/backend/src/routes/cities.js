import express from 'express';
let router = express.Router();
import knex from "../knex";
router.get('/', (req, res) => listWrapper(req, res));

const listWrapper = async (req, res) => {
    const search = req.query.search;
    const getAll = req.query.all;
    const domain = req.query.domain;
    let where = {};

    if(domain.indexOf("zuugle.at") >= 0 || domain.indexOf("localhost") >= 0){
        where['city_country'] = "AT";
    } else if(domain.indexOf("zuugle.de") >= 0){
        where['city_country'] = "DE";
    } else if(domain.indexOf("zuugle.ch") >= 0){
        where['city_country'] = "CH";
    } else if(domain.indexOf("zuugle.it") >= 0){
        where['city_country'] = "IT";
    } else if(domain.indexOf("zuugle.si") >= 0){
        where['city_country'] = "SI";
    } else if(domain.indexOf("zuugle.fr") >= 0){
        where['city_country'] = "FR";
    }

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