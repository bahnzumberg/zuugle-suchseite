import express from 'express';
let router = express.Router();
import knex from "../knex";
router.get('/', (req, res) => listWrapper(req, res));

const listWrapper = async (req, res) => {
    const search = req.query.search;

    if (search.length > 128) {
        console.log("search length: ", search.length);
        return res.status(400).json({success: false, error: 'Bad Request - search term is too long (max. 128 characters)'});
    }

    const city = req.query.city;
    const language = req.query.language;

    let item = await createQuery("phrase", "search_phrase", city, search, language);

    let result = {
        item
    }

    return res.status(200).json({success: true, phrases: result});
}

const createQuery = async (field, alias, city, search, language) => {
    let result = [];

    let query = knex('logsearchphrase').select(`${field}`)
        .as(alias)
        .count('* as CNT')
        .whereNot(field, null)
        .andWhereNot(field, "");

    if(!!city && city.length > 0){
        query = query.andWhere('city_slug', city);
    }

    if(!!language && language.length > 0){
        query = query.andWhere('menu_lang', language);
    }

    query = query.andWhereRaw(`search_time > CURRENT_DATE - INTERVAL '12 MONTH'`);

    if(!!search && search.length > 0){
        query = query.andWhereRaw(`LOWER(${field}) LIKE '${search.toLowerCase()}%'`)
    }

    result = await query.groupBy(field)
        .orderBy(`CNT`, `desc`)
        .orderBy(field, `asc`)
        .limit(5);

    result = result.map(entry => {
        return {
            suggestion: entry[field]
        }
    })

    return result;
}


export default router;