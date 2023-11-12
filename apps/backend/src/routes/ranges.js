import express from 'express';
let router = express.Router();
import knex from "../knex";
import os from 'os';

router.get('/', (req, res) => listWrapper(req, res));

const listWrapper = async (req, res) => {
    const city = req.query.city;
    const ignoreLimit = req.query.ignore_limit == "true";
    const removeDuplicates = req.query.remove_duplicates == "true";

    const domain = req.query.domain;

    let whereRaw = null;
    /** city search */
    if(!!city && city.length > 0){
        whereRaw = `id IN (SELECT tour_id FROM city2tour WHERE city_slug='${city}')`;
    }
    else {
        let tld = '';
        if (domain.indexOf('zuugle.de')) { tld='DE' }
        else if (domain.indexOf('zuugle.si')) { tld='SI' }
        else if (domain.indexOf('zuugle.it')) { tld='IT' }
        else if (domain.indexOf('zuugle.ch')) { tld='CH' }
        else if (domain.indexOf('zuugle.fr')) { tld='FR' }
        else { tld='AT' }
        whereRaw = ` id IN (SELECT tour_id FROM city2tour WHERE reachable_from_country='${tld}')  `;
    }

    let query = knex('tour').select(['range', 'state', 'range_slug']).max('quality_rating as qr').whereNotNull('range').whereNotNull('state');

    if(!!whereRaw){
        query = query.whereRaw(whereRaw);
    }

    query = query.groupBy(['range', 'range_slug', 'state']).orderBy('range', 'asc');

    if(!!!ignoreLimit){
        query = query.limit(10);
    }

    let result = await query;
    if(!!result){
        const hostname = os.hostname();

        var host = "http://localhost:8080";
        
        if(hostname.indexOf('www.zuugle') >= 0) {
            host = "https://www.zuugle.at";
        }
        else if(hostname.indexOf('www2.zuugle') >= 0) {
            host = "https://www2.zuugle.at";
        }

        for(let i=0; i<result.length;i++){
            let entry = result[i];
            if(!!entry){
                entry.image_url = `${host}/public/range-image/${entry.range}.jpg`;
            }
        }
        result = result.filter(entry => entry.range !== "Keine Gebirgsgruppe");

        if(!!removeDuplicates){
            const ids = result.map(o => o.range)
            result = result.filter(({range}, index) => !ids.includes(range, index + 1))
        }
    }

    res.status(200).json({success: true, ranges: result});
}

export default router;