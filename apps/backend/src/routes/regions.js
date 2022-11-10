import express from 'express';
let router = express.Router();
import knex from "../knex";
router.get('/', (req, res) => listWrapper(req, res));

const listWrapper = async (req, res) => {
    const search = req.query.search;
    const city = req.query.city;

    let types = await createQuery("type", city, search);
    let ranges = await createQuery("range", city, search);
    let countries = await createQuery("country", city, search);
    let states = await createQuery("state", city, search);

    let result = {
        ranges,
        types,
        countries,
        states
    }

    res.status(200).json({success: true, regions: result});
}

const createQuery = async (field, city, search) => {
    let result = [];

    let query = knex('tour').select(field).andWhereNot(field, null).andWhereNot(field, "");

    if(!!city && city.length > 0){
        query = query.whereRaw(`cities @> '[{"city_slug": "${city}"}]'::jsonb`);
    }

    if(!!search && search.length > 0){
        query = query.andWhereRaw(`LOWER(${field}) LIKE '%${search.toLowerCase()}%'`)
    }

    result = await query.groupBy(field).limit(100);

    result = result.map(entry => {
        return {
            label: entry[field],
            value: entry[field],
            type: field
        }
    })

    return result;
}


export default router;