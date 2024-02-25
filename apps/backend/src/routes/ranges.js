import express from 'express';
let router = express.Router();
import knex from "../knex";
import os from 'os';

router.get('/', (req, res) => listWrapper(req, res));

const listWrapper = async (req, res) => {
    const city = req.query.city;
    const domain = req.query.domain;

    let sql = "";
    let whereRaw = null;
    /** city search */
    if(!!city && city.length > 0){
        sql += "SELECT t.range, t.state, t.range_slug, avg(f.best_connection_duration) ";
        sql += "FROM tour AS t ";
        sql += "INNER JOIN fahrplan AS f ";
        sql += "ON t.provider=f.tour_provider ";
        sql += "AND t.hashed_url=f.hashed_url ";
        sql += "WHERE f.city_slug='${city}' ";
        sql += "AND t.range IS NOT NULL ";
        sql += "AND t.state IS NOT NULL ";
        sql += "AND t.range_slug IS NOT NULL ";
        sql += "AND t.id IN (SELECT tour_id FROM city2tour WHERE city_slug='${city}') "
        sql += "GROUP BY t.range, t.state, t.range_slug ";
        sql += "ORDER BY avg(f.best_connection_duration) ASC ";
        sql += "LIMIT 10;";
    }
    else {
        let tld = '';
        if (domain.indexOf('zuugle.de')) { tld='DE' }
        else if (domain.indexOf('zuugle.si')) { tld='SI' }
        else if (domain.indexOf('zuugle.it')) { tld='IT' }
        else if (domain.indexOf('zuugle.ch')) { tld='CH' }
        else if (domain.indexOf('zuugle.fr')) { tld='FR' }
        else { tld='AT' }
        
        sql += "SELECT t.range, t.state, t.range_slug, avg(f.best_connection_duration) ";
        sql += "FROM tour AS t ";
        sql += "INNER JOIN fahrplan AS f ";
        sql += "ON t.provider=f.tour_provider ";
        sql += "AND t.hashed_url=f.hashed_url ";
        sql += "WHERE t.range IS NOT NULL ";
        sql += "AND t.state IS NOT NULL ";
        sql += "AND t.range_slug IS NOT NULL ";
        sql += "AND t.id IN (SELECT tour_id FROM city2tour WHERE reachable_from_country='${tld}') "
        sql += "GROUP BY t.range, t.state, t.range_slug ";
        sql += "ORDER BY avg(f.best_connection_duration) ASC ";
        sql += "LIMIT 10;";
    }

    let result = await knex.raw(sql);

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
    }

    res.status(200).json({success: true, ranges: result});
}

export default router;