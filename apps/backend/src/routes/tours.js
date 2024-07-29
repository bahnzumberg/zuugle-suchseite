import express from 'express';
let router = express.Router();
import knex from "../knex";
import {createImageFromMap, mergeGpxFilesToOne, last_two_characters} from "../utils/gpx/gpxUtils";
import {convertNumToTime, minutesFromMoment} from "../utils/helper";
import moment from "moment";
// import {tourPdf} from "../utils/pdf/tourPdf";
import {getHost, replaceFilePath, round, get_domain_country, get_country_lanuage_from_domain, getAllLanguages } from "../utils/utils";
import { convertDifficulty } from '../utils/dataConversion';
import logger from '../utils/logger';
import { jsonToStringArray } from '../utils/pdf/utils';

const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => listWrapper(req, res));
router.get('/filter', (req, res) => filterWrapper(req, res));
router.get('/map', (req, res) => mapWrapper(req, res));
router.get('/provider/:provider', (req, res) => providerWrapper(req, res));

router.get('/total', (req, res) => totalWrapper(req, res));
router.get('/gpx', (req, res) => gpxWrapper(req, res));
router.get('/:id/connections', (req, res) => connectionsWrapper(req, res));
router.get('/:id/connections-extended', (req, res) => connectionsExtendedWrapper(req, res));
router.get('/:id/pdf', (req, res) => tourPdfWrapper(req, res));
router.get('/:id/gpx', (req, res) => tourGpxWrapper(req, res));
router.get('/:id/:city', (req, res) => getWrapper(req, res));

const providerWrapper = async (req, res) => {
    const provider = req.params.provider; 
    const approved = await knex('provider').select('allow_gpx_download').where({ provider: provider }).first();
    if (approved) {
        res.status(200).json({ success: true, allow_gpx_download: approved.allow_gpx_download });
    } else {
        res.status(404).json({ success: false, message: "Provider not found" });
    }
}

 
const totalWrapper = async (req, res) => {
    const city = req.query.city;
    const total = await knex.raw(`SELECT 
                                tours.value as tours,
                                COALESCE(tours_city.value, 0) AS tours_city,
                                conn.value as connections,
                                ranges.value AS ranges,
                                cities.value AS cities,
                                provider.value AS provider 
                                FROM kpi AS tours 
                                LEFT OUTER JOIN kpi AS tours_city 
                                ON tours_city.name='total_tours_${city}' 
                                LEFT OUTER JOIN kpi AS conn 
                                ON conn.name='total_connections' 
                                LEFT OUTER JOIN kpi AS ranges 
                                ON ranges.name='total_ranges' 
                                LEFT OUTER JOIN kpi AS cities 
                                ON cities.name='total_cities' 
                                LEFT OUTER JOIN kpi AS provider ON provider.name='total_provider' 
                                WHERE tours.name='total_tours';`);
    
    res.status(200).json({success: true, total_tours: total.rows[0]['tours'],tours_city: total.rows[0]['tours_city'] ,total_connections: total.rows[0]['connections'], total_ranges: total.rows[0]['ranges'], total_cities: total.rows[0]['cities'], total_provider: total.rows[0]['provider']});
}

const getWrapper = async (req, res) => {
    
    const city = !!req.query.city ? req.query.city : !!req.params.city ? req.params.city : null;
    const id = parseInt(req.params.id, 10);
    // console.log("===================") 
    // console.log(" city from getWrapper : ", city )
    // console.log(" req.params from getWrapper : ", req.params )
    // console.log("===================") 
    // console.log(" req.query from getWrapper : ", (req.query) )
    // console.log("===================") 
    const domain = req.query.domain;
    const tld = get_domain_country(domain);

    if (isNaN(id)) {
        res.status(400).json({ success: false, message: "Invalid tour ID" });
        return;
    }

    if(!!!id){     
        res.status(404).json({success: false});
        return
    }
    
    let new_search_where_city = `AND c2t.stop_selector='y' `;
    if(!!city && city.length > 0){
        new_search_where_city = `AND c2t.city_slug='${city}' `
    }

    try {
        // let entry = await entryQuery;
        const sql = `SELECT id, url, provider, hashed_url, description, image_url, ascent, 
                    descent, difficulty, difficulty_orig , duration, distance, title, type, 
                    number_of_days, traverse, country, state, range_slug, range, season, 
                    month_order, quality_rating, user_rating_avg, cities, cities_object, max_ele,
                    min_connection_duration,
                    min_connection_no_of_transfers
                    FROM ( 
                    SELECT t.id, t.url, t.provider, t.hashed_url, t.description, t.image_url, t.ascent,
                    t.descent, t.difficulty, t.difficulty_orig , t.duration, t.distance, t.title, t.type,
                    t.number_of_days, t.traverse, t.country, t.state, t.range_slug, t.range, t.season,
                    t.month_order, t.quality_rating, t.user_rating_avg, t.cities, t.cities_object, t.max_ele,
                    1 AS prio,
                    c2t.min_connection_duration,
                    c2t.min_connection_no_of_transfers
                    FROM tour as t 
                    INNER JOIN city2tour AS c2t 
                    ON c2t.tour_id=t.id 
                    WHERE c2t.reachable_from_country='${tld}' 
                    ${new_search_where_city}
                    AND t.id=${id}
                    UNION 
                    SELECT t.id, t.url, t.provider, t.hashed_url, t.description, t.image_url, t.ascent, 
                    t.descent, t.difficulty, t.difficulty_orig , t.duration, t.distance, t.title, t.type, 
                    t.number_of_days, t.traverse, t.country, t.state, t.range_slug, t.range, 
                    'g' as season, 0 as month_order, 0 as quality_rating, 0 as user_rating_avg, null ascities, 
                    null as cities_object, 0 as max_ele, 
                    2 AS prio,
                    0 as min_connection_duration,
                    0 as min_connection_no_of_transfers
                    FROM tour_inactive as t WHERE t.id=${id}
                    ORDER BY prio ASC LIMIT 1) as a`
        let entry2 = await knex.raw(sql)
        let entry = entry2.rows[0]

        if (!entry) {
            res.status(404).json({ success: false, message: "Tour not found" });
            return;
        }

        entry = await prepareTourEntry(entry, city, domain, true);
        res.status(200).json({ success: true, tour: entry });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }

}

const listWrapper = async (req, res) => {

    const currLanguage = req.query.currLanguage ? req.query.currLanguage : 'en'; 

    const search = req.query.search; 
    const showRanges = !!req.query.ranges;
    const city = req.query.city;    
    const range = req.query.range;
    const state = req.query.state;
    const country = req.query.country;
    const type = req.query.type;
    const page = req.query.page || 1;
    const domain = req.query.domain; 
    const provider = req.query.provider;
    const language = req.query.language; 
    const filter = req.query.filter;
    const bounds = req.query.bounds;

    let parsedBounds;

    if (bounds) {
        parsedBounds = JSON.parse(bounds);
    }    
 
    const coordinatesNorthEast = !!parsedBounds ? parsedBounds._northEast : null;
    const coordinatesSouthWest = !!parsedBounds ? parsedBounds._southWest : null;

    // variables initialized depending on availability of 'map' in the request
    //const map = req && req.query && req.query.map === "true"; // add optional chaining
    //let useLimit = !!!map;  // initialise with true
    //let addDetails = !!!map; // initialise with true
    let addDetails = true; 

    let new_search_sql = `` 
    let new_search_where_searchterm = ``
    let new_search_order_searchterm = ``
    let new_search_where_city = ``
    let new_search_where_country = ``
    let new_search_where_state = ``
    let new_search_where_range = ``
    let new_search_where_type = ``
    let new_search_where_provider = ``
    let new_search_where_map = ``
    let new_search_where_language = `` 
    let new_filter_where_singleDayTour = ``
    let new_filter_where_multipleDayTour = ``
    let new_filter_where_summerSeason = ``
    let new_filter_where_winterSeason = ``
    let new_filter_where_traverse = ``
    let new_filter_where_minAscent = ``
    let new_filter_where_minDescent = ``
    let new_filter_where_minTransportDuration = ``
    let new_filter_where_minDistance = ``
    let new_filter_where_ranges = ``
    let new_filter_where_types = ``
    let new_filter_where_languages = ``

    let filter_string = filter;
    let filterJSON = undefined;
    try {
        filterJSON = JSON.parse(filter_string);
    }
    catch(e) {
        filterJSON = undefined
    }
    if (typeof filterJSON !== 'undefined' && filter_string != `{ ignore_filter: 'true' }`) {
        // console.log("filterJSON: ", filterJSON)

        if(filterJSON['singleDayTour'] && !filterJSON['multipleDayTour']){
            new_filter_where_singleDayTour = `AND t.number_of_days=1 `
        }

        if(!filterJSON['singleDayTour'] && filterJSON['multipleDayTour']){
            new_filter_where_multipleDayTour = `AND t.number_of_days>=2 `
        }

        if(filterJSON['summerSeason'] && !filterJSON['winterSeason']){
            new_filter_where_summerSeason = `AND (t.season='s' OR t.season='g') `
        }

        if(!filterJSON['summerSeason'] && filterJSON['winterSeason']){
            new_filter_where_winterSeason = `AND (t.season='w' OR t.season='g') `
        }

        if(filterJSON['traverse']){
            new_filter_where_traverse = `AND t.traverse=1 `
        }

        // difficulty not implemented - dialog in frontend has to be changed to 3 checkboxes

        if(filterJSON['minAscent'] && filterJSON['minAscent']>0 && filterJSON['maxAscent'] && filterJSON['maxAscent']>0){
            new_filter_where_minAscent = `AND t.ascent BETWEEN ${filterJSON['minAscent']} AND ${filterJSON['maxAscent']} `
        }

        if(filterJSON['minDescent'] && filterJSON['minDescent']>0 && filterJSON['maxDescent'] && filterJSON['maxDescent']>0){
            new_filter_where_minDescent = `AND t.descent BETWEEN ${filterJSON['minDescent']} AND ${filterJSON['maxDescent']} `
        }

        if(filterJSON['minTransportDuration'] && filterJSON['minTransportDuration']>0 && filterJSON['maxTransportDuration'] && filterJSON['maxTransportDuration']>0){
            new_filter_where_minTransportDuration = `AND c2t.min_connection_duration BETWEEN ${filterJSON['minTransportDuration']*60} AND ${filterJSON['maxTransportDuration']*60} `
        }

        if(filterJSON['minDistance'] && filterJSON['minDistance']>0 && filterJSON['maxDistance'] && filterJSON['maxDistance']>0){
            new_filter_where_minDistance = `AND t.distance BETWEEN ${filterJSON['minDistance']} AND ${filterJSON['maxDistance']} `
        }

        if(filterJSON['ranges']){
            new_filter_where_ranges = `AND t.range IN ${JSON.stringify(filterJSON['ranges']).replace("[", '(').replace("]", ')').replaceAll('"', "'")} `
        }

        if(filterJSON['types']){
            new_filter_where_types = `AND t.type IN ${JSON.stringify(filterJSON['types']).replace("[", '(').replace("]", ')').replaceAll('"', "'")} `
        }

        if(filterJSON['languages']){
            new_filter_where_languages = `AND t.text_lang IN ${JSON.stringify(filterJSON['languages']).replace("[", '(').replace("]", ')').replaceAll('"', "'")} `
        }
    }

    const tld = get_domain_country(domain);

    if(!!city && city.length > 0){
        new_search_where_city = `AND c2t.city_slug='${city}' `
    }
    else {
        new_search_where_city = `AND c2t.stop_selector='y' `
    }

    if (!!search && !!search.length > 0) {
        let postgresql_language_code = 'german'

        if (currLanguage == 'sl') {
            postgresql_language_code = 'simple'
        }
        else if (currLanguage == 'fr') {
            postgresql_language_code = 'french'
        }
        else if (currLanguage == 'it') {
            postgresql_language_code = 'italian'
        }
        else if (currLanguage == 'en') {
            postgresql_language_code = 'english'
        }

        new_search_where_searchterm = `AND t.search_column @@ websearch_to_tsquery('${postgresql_language_code}', '${search}') `
        new_search_order_searchterm = `COALESCE(ts_rank(COALESCE(t.search_column, ''), COALESCE(websearch_to_tsquery('${postgresql_language_code}', '${search}'), '')), 0) DESC, `
    }

    if(!!range && range.length > 0){
        new_search_where_range = `AND range='${range}' `
    }

    if(!!state && state.length > 0){
        new_search_where_state = `AND state='${state}' `
    }

    if(!!country && country.length > 0){
        new_search_where_country = `AND country='${country}' `
    }

    if(!!type && type.length > 0){
        new_search_where_type = `AND type='${type}' `
    }
    
    if(!!provider && provider.length > 0){
        new_search_where_provider = `AND t.provider='${provider}' `
    }

    if(!!language && language.length > 0){
        new_search_where_language = `AND text_lang='${language}'  `
    }

    //filters the tours by coordinates
    //FE sends coordinate bounds which the user sees on the map --> tours that are within these coordinates are returned
    if(!!coordinatesNorthEast && !!coordinatesSouthWest){  
        const latNE = coordinatesNorthEast.lat.toString();
        const lngNE = coordinatesNorthEast.lng.toString();
        const latSW = coordinatesSouthWest.lat.toString();
        const lngSW = coordinatesSouthWest.lng.toString();

        new_search_where_map = `AND c2t.connection_arrival_stop_lon between (${lngSW})::numeric and (${lngNE})::numeric AND c2t.connection_arrival_stop_lat between (${latSW})::numeric AND (${latNE})::numeric `;
    }

    new_search_sql = `SELECT 
                        t.id, 
                        t.provider, 
                        t.hashed_url, 
                        t.url, 
                        t.title, 
                        t.description,
                        t.image_url,
                        t.type, 
                        t.country, 
                        t.state, 
                        t.range_slug, 
                        t.range, 
                        t.text_lang, 
                        t.difficulty_orig,
                        t.season,
                        t.max_ele,
                        c2t.connection_arrival_stop_lon,
                        c2t.connection_arrival_stop_lat,
                        CASE WHEN t.text_lang='de' THEN 1 ELSE 0 END AS order_lang_de, 
                        CASE WHEN t.text_lang='en' THEN 1 ELSE 0 END AS order_lang_en, 
                        CASE WHEN t.text_lang='fr' THEN 1 ELSE 0 END AS order_lang_fr, 
                        CASE WHEN t.text_lang='sl' THEN 1 ELSE 0 END AS order_lang_sl, 
                        CASE WHEN t.text_lang='it' THEN 1 ELSE 0 END AS order_lang_it,
                        c2t.min_connection_duration,
                        c2t.min_connection_no_of_transfers, 
                        t.ascent, 
                        t.descent, 
                        t.difficulty, 
                        t.duration, 
                        t.distance, 
                        t.number_of_days, 
                        t.traverse, 
                        t.quality_rating,
                        t.month_order,
                        t.cities,
                        t.cities_object
                        FROM city2tour AS c2t 
                        INNER JOIN tour AS t 
                        ON c2t.tour_id=t.id 
                        WHERE c2t.reachable_from_country='${tld}' 
                        ${new_search_where_city}
                        ${new_search_where_searchterm}
                        ${new_search_where_range}
                        ${new_search_where_state}
                        ${new_search_where_country}
                        ${new_search_where_type}
                        ${new_search_where_provider}
                        ${new_search_where_language}
                        ${new_search_where_map}
                        ${new_filter_where_singleDayTour}
                        ${new_filter_where_multipleDayTour}
                        ${new_filter_where_summerSeason}
                        ${new_filter_where_winterSeason}
                        ${new_filter_where_traverse}
                        ${new_filter_where_minAscent}
                        ${new_filter_where_minDescent}
                        ${new_filter_where_minTransportDuration}
                        ${new_filter_where_minDistance}
                        ${new_filter_where_ranges}
                        ${new_filter_where_types}
                        ${new_filter_where_languages}
                        ORDER BY t.month_order ASC, 
                        order_lang_${currLanguage} DESC,  
                        ${new_search_order_searchterm}
                        t.number_of_days ASC, 
                        TRUNC(c2t.min_connection_no_of_transfers*c2t.min_connection_no_of_transfers/2) ASC,
                        CASE WHEN t.ascent BETWEEN 600 AND 1200 THEN 0 ELSE 1 END ASC,
                        TRUNC(c2t.min_connection_duration / 60, 0) ASC, 
                        t.traverse DESC, 
                        t.quality_rating DESC, 
                        t.duration ASC, 
                        MOD(t.id, CAST(EXTRACT(DAY FROM CURRENT_DATE) AS INTEGER)) ASC
                        LIMIT 9 OFFSET ${9 * (page - 1)};`;

    // console.log("new_search_sql: ", new_search_sql)
    
    // ****************************************************************
    // GET THE COUNT 
    // ****************************************************************
    let sql_count = 0;
    try {
        const count_sql = `SELECT COUNT(*) AS row_count
                            FROM city2tour AS c2t 
                            INNER JOIN tour AS t 
                            ON c2t.tour_id=t.id 
                            WHERE c2t.reachable_from_country='${tld}' 
                            ${new_search_where_city}
                            ${new_search_where_searchterm}
                            ${new_search_where_range}
                            ${new_search_where_state}
                            ${new_search_where_country}
                            ${new_search_where_type}
                            ${new_search_where_provider}
                            ${new_search_where_language}
                            ${new_search_where_map}
                            ${new_filter_where_singleDayTour}
                            ${new_filter_where_multipleDayTour}
                            ${new_filter_where_summerSeason}
                            ${new_filter_where_winterSeason}
                            ${new_filter_where_traverse}
                            ${new_filter_where_minAscent}
                            ${new_filter_where_minDescent}
                            ${new_filter_where_minTransportDuration}
                            ${new_filter_where_minDistance}
                            ${new_filter_where_ranges}
                            ${new_filter_where_types}
                            ${new_filter_where_languages}`
        let count_query = knex.raw(count_sql); 
        let sql_count_call = await count_query;
        sql_count = parseInt(sql_count_call.rows[0].row_count, 10);
        // console.log("count_sql: ", count_sql)
    } catch (error) {
        console.log("Error retrieving count:", error);
    }



    // ****************************************************************
    // CALLING DATABASE
    // ****************************************************************
    let result = '';
    let markers_result = ''; //markers-related : to return map markers positions from database
    let markers_array = []; // markers-related : to be filled by either cases(with or without "search included")
    
    try {
        result = await knex.raw(new_search_sql); // fire the DB call here
        if (result && result.rows) {
            result = result.rows;
        } else {
            console.log('knex.raw(new_search_sql): result or result.rows is null or undefined.');
        }
        // console.log("result.rows: ", result.rows)
   
        // markers-related / searchIncluded
        const markers_sql= `SELECT 
                            t.id, 
                            c2t.connection_arrival_stop_lat,
                            c2t.connection_arrival_stop_lon
                            FROM city2tour AS c2t 
                            INNER JOIN tour AS t 
                            ON c2t.tour_id=t.id 
                            WHERE c2t.reachable_from_country='${tld}' 
                            ${new_search_where_city}
                            ${new_search_where_searchterm}
                            ${new_search_where_range}
                            ${new_search_where_state}
                            ${new_search_where_country}
                            ${new_search_where_type}
                            ${new_search_where_provider}
                            ${new_search_where_language}
                            ${new_search_where_map}
                            ${new_filter_where_singleDayTour}
                            ${new_filter_where_multipleDayTour}
                            ${new_filter_where_summerSeason}
                            ${new_filter_where_winterSeason}
                            ${new_filter_where_traverse}
                            ${new_filter_where_minAscent}
                            ${new_filter_where_minDescent}
                            ${new_filter_where_minTransportDuration}
                            ${new_filter_where_minDistance}
                            ${new_filter_where_ranges}
                            ${new_filter_where_types}
                            ${new_filter_where_languages}
                            AND c2t.connection_arrival_stop_lat IS NOT NULL 
                            AND c2t.connection_arrival_stop_lon IS NOT NULL;`
        markers_result = await knex.raw(markers_sql); // fire the DB call here
        // console.log("markers_sql: ", markers_sql)

            // markers-related
            if (!!markers_result && !!markers_result.rows) {
                markers_array = markers_result.rows;   // This is to be passed to the response below
            } else {
                console.log('markers_result is null or undefined');
            }         
    } 
    catch (error) {
           console.log("tours.js: error retrieving results or markers_result:" + error);
    }

    
    //logsearchphrase
    //This code first logs the search phrase and the number of results in a database table called logsearchphrase if a search was performed. It replaces any single quotes in the search parameter with double quotes, which is necessary to insert the search parameter into the SQL statement.
    try {
        let searchparam = '';

        if (search !== undefined && search !== null && search.length > 0 && req.query.city !== undefined) {
            searchparam = search.replace(/'/g, "''").toLowerCase();

            if (!!sql_count && sql_count > 1) {
                await knex.raw(`INSERT INTO logsearchphrase(phrase, num_results, city_slug, menu_lang, country_code) VALUES('${searchparam}', ${sql_count}, '${req.query.city}', '${currLanguage}', '${get_domain_country(domain)}');`)
            }
        }
    } catch (e) {
        console.error('error inserting into logsearchphrase: ', e);
    }
    

    // preparing tour entries
    // this code maps over the query result and applies the function prepareTourEntry to each entry. The prepareTourEntry 
    // function returns a modified version of the entry that includes additional data and formatting. 
    // The function also sets the 'is_map_entry' property of the entry to true if map is truthy. 
    // The function uses Promise.all to wait for all promises returned by 'prepareTourEntry' to resolve before 
    // returning the final result array.
    if(result && Array.isArray(result)){
        await Promise.all(result.map(entry => new Promise(async resolve => {
            entry = await prepareTourEntry(entry, city, domain, addDetails);
            // entry.is_map_entry = !!map;
            resolve(entry);
        })));
    }

    /** add ranges to result */
    // This code prepares the response to a HTTP request.
    // The ranges array is populated with data about the tours ranges. The showRanges variable is a 
    // boolean that is passed in the request to determine whether to return the ranges or not. 
    // If showRanges is true, then the code queries the database to get a list of the distinct ranges
    // and their image urls. It then loops through the results to create an array of range objects
    // containing the range name and the corresponding image URL. The code then queries the database
    // to get all states of each range and adds them to the states array of each range object.
    let ranges = [];
    let rangeList = [];
    let range_result = undefined

    if(!!showRanges){    
        const months = [
            "jan", "feb", "mar", "apr", "may", "jun",
            "jul", "aug", "sep", "oct", "nov", "dec"
          ];  
        const shortMonth = months[new Date().getMonth()];
        const range_sql  = `SELECT 
                            t.state,
                            t.range_slug,
                            t.range,
                            image_url,
                            SUM(1.0/(c2t.min_connection_no_of_transfers+1)) AS attract
                            FROM city2tour AS c2t 
                            INNER JOIN tour AS t 
                            ON c2t.tour_id=t.id 
                            WHERE c2t.reachable_from_country='${tld}'
                            ${new_search_where_city}
                            AND ${shortMonth}='true'
                            AND t.range_slug IS NOT NULL
                            GROUP BY t.state, t.range_slug, t.range, image_url
                            ORDER BY SUM(1.0/(c2t.min_connection_no_of_transfers+1)) DESC, t.range_slug ASC
                            LIMIT 10`
        
        range_result = await knex.raw(range_sql)
        // console.log("range_sql: ", range_sql)
        
        if (!!range_result && !!range_result.rows) {
            rangeList = range_result.rows;
        }

        //describe:
        //a loop is performed over each object in rangeList. For each object, it is checked if both tour and tour.range properties are defined and truthy. If they are, it is checked if there is no object in the ranges array that has a range property equal to tour.range. If there isn't, a new object is constructed with a range property equal to tour.range, and an image_url property equal to a string constructed with the getHost function on the domain parameter, the "/public/range-image/" path, and the tour.range_slug value. The new object is then pushed onto the ranges array.
        rangeList.forEach(tour => {
            if(!!tour && !!tour.range){
                if(!!!ranges.find(r => r.range === tour.range)){
                    ranges.push({
                        states: tour.state,
                        range: tour.range,
                        image_url: `${getHost(domain)}/public/range-image/${tour.range_slug}.jpg`
                    });
                }
            }
        });
    }

    //describe:
    // The result array contains the list of tours returned from the database after executing the main query. 
    // This array is already looped through to transform each tour entry with additional data and metadata 
    // using the prepareTourEntry function. Finally, a JSON response is returned with success set to true, 
    // the tours array, the total count of tours returned by the main query, the current page, and the 
    // ranges array (if showRanges is true).

    
    //parse lat and lon before adding markers to response
    markers_array = markers_array.map((marker) => ({
        id: marker.id,
        lat: parseFloat(marker.connection_arrival_stop_lat),
        lon: parseFloat(marker.connection_arrival_stop_lon),
    }));
        
    res
      .status(200)
      .json({
        success: true,
        tours: result,
        total: sql_count,
        page: page,
        ranges: ranges,
        markers: markers_array,
      });
}

const filterWrapper = async (req, res) => {
    const search = req.query.search;
    const city = req.query.city;
    const range = req.query.range;
    const state = req.query.state;
    const type = req.query.type;    
    const domain = req.query.domain;
    const country = req.query.country;
    const provider = req.query.provider;
    const language = req.query.language; // gets the languages from the query

    let query = knex('tour').select(['ascent', 'descent', 'difficulty', 'difficulty_orig', 'duration', 'distance', 'type', 'number_of_days', 'traverse', 'country', 'state', 'range_slug', 'range', 'season', 'month_order', 'quality_rating', 'user_rating_avg', 'cities', 'cities_object', 'max_ele', 'text_lang']);

    let where = {};
    let whereRaw = null;

    /** city search */
    if(!!city && city.length > 0){
        whereRaw = ` id IN (SELECT tour_id FROM city2tour WHERE city_slug='${city}') `;
    }
    else {
        const tld = get_domain_country(domain);
        whereRaw = ` id IN (SELECT tour_id FROM city2tour WHERE reachable_from_country='${tld}') `;
    }

    /** region search */
    if(!!range && range.length > 0){
        where.range = range;
    }
    if(!!state && state.length > 0){
        where.state = state;
    }
    if(!!country && country.length > 0){
        where.country = country;
    }

    /** type search */
    if(!!type && type.length > 0){
        where.type = type;
    }

    /** language search */
    if(!!language && language.length > 0){
        where.language = language;
    }

    /** provider search */
    if(!!provider && provider.length > 0){
        where.provider = provider;
    }

    try {
        /** fulltext search */
        if(!!search && search.length > 0){
            let _search = search.trim().toLowerCase();
            if(_search.indexOf(' ') > 0){
                whereRaw = `${!!whereRaw ? whereRaw + " AND " : ""}search_column @@ websearch_to_tsquery('german', '${_search}')`
            }
            else {
                whereRaw = `${!!whereRaw ? whereRaw + " AND " : ""}search_column @@ websearch_to_tsquery('german', '"${_search}" ${_search}:*')`
            }
        }
    } catch(e){
        console.error('error creating fulltext search: ', e);
    }

    if(!!where && Object.keys(where).length > 0){
        query = query.where(where);
    }
    if(!!whereRaw && whereRaw.length > 0){
        query = query.andWhereRaw(whereRaw);
    }

    /** filter search */
    let queryForFilter = query.clone();

    /** load full result for filter */
    let filterResultList = await queryForFilter;

    // const tourIds = await query.pluck('id');
    // const return_string = tourIds.join(',');
    // console.log("return_string: ", return_string)

    res.status(200).json({success: true, filter: buildFilterResult(filterResultList, city, req.query)});
}


const connectionsWrapper = async (req, res) => {
    const id = req.params.id;
    const city = !!req.query.city ? req.query.city : !!req.params.city ? req.params.city : null;
    const domain = req.query.domain;

    const weekday = getWeekday(moment());
    const tour = await knex('tour').select().where({id: id}).first();
    if(!!!tour || !!!city){
        res.status(404).json({success: false});
        return;
    }

    const query_con = knex('fahrplan').select().where({hashed_url: tour.hashed_url, city_slug: city});

    const connections = await query_con;
    let missing_days = getMissingConnectionDays(connections);
    await Promise.all(connections.map(connection => new Promise(resolve => {
        connection.best_connection_duration_minutes = minutesFromMoment(moment(connection.best_connection_duration, 'HH:mm:ss'));
        connection.connection_duration_minutes = minutesFromMoment(moment(connection.connection_duration, 'HH:mm:ss'));
        connection.return_duration_minutes = minutesFromMoment(moment(connection.return_duration, 'HH:mm:ss'));
        connection.missing_days = missing_days;
        // connection.connection_departure_stop = 'XX departure_stop XX'
        // connection.connection_arrival_stop = 'YY arrival_stop YY'
        resolve(connection);
    })));


    let filteredConnections = [];
    connections.forEach(t => {
        if(!!!filteredConnections.find(tt => compareConnections(t, tt))){
            t = mapConnectionToFrontend(t)

            filteredConnections.push(t);
        }
    })

    let filteredReturns = [];
    getConnectionsByWeekday(connections, weekday).forEach(t => {
        /** Die Rückreisen werden nach aktuellem Tag gefiltert -> kann man machen, muss man aber nicht. Wenn nicht gefiltert, werden alle Rückreisen für alle Wochentage angezeigt, was eine falsche Anzahl an Rückreisen ausgibt */
        if(!!!filteredReturns.find(tt => compareConnectionReturns(t, tt))){
            t = mapConnectionReturnToFrontend(t)
            t.gpx_file = `${getHost(domain)}/public/gpx-track/fromtour/${last_two_characters(t.fromtour_track_key)}/${t.fromtour_track_key}.gpx`;

            filteredReturns.push(t);
        }
    })

    filteredReturns.sort(function(x, y){
        return moment(x.return_departure_datetime).unix() - moment(y.return_departure_datetime).unix();
    })

    res.status(200).json({success: true, connections: filteredConnections, returns: filteredReturns});
}

const connectionsExtendedWrapper = async (req, res) => {
    const id = req.params.id;
    const city = !!req.query.city ? req.query.city : !!req.params.city ? req.params.city : null;
    const domain = req.query.domain;

    // console.log("===================") 
    // console.log(" city from req.query.city /connectionsExtendedWrapper : ", req.query.city )
    // console.log(" city from req.params.city /connectionsExtendedWrapper : ", req.params.city )
    // console.log(" req.params from connectionsExtendedWrapper : ", req.params )
    // console.log("===================") 
    // console.log(" req.query from connectionsExtendedWrapper : ", (req.query) )
    // console.log("===================") 

    const tour = await knex('tour').select().where({id: id}).first();
    if(!!!tour || !!!city){
        res.status(404).json({success: false});
        return;
    }

    const connections = await knex('fahrplan').select().where({hashed_url: tour.hashed_url, city_slug: city}).orderBy('return_row', 'asc');

    const today = moment().set('hour', 0).set('minute', 0).set('second', 0);
    let end = moment().add(7, 'day');

    let result = [];

    while(today.isBefore(end)){
        const byWeekday  = connections.filter(conn => moment(conn.calendar_date).format('DD.MM.YYYY') == today.format('DD.MM.YYYY'))
        const duplicatesRemoved = [];

        byWeekday.forEach(t => {
            let e = {...t}
            e.connection_duration_minutes = minutesFromMoment(moment(e.connection_duration, 'HH:mm:ss'));
            e.return_duration_minutes = minutesFromMoment(moment(e.return_duration, 'HH:mm:ss'));
            e.connection_departure_datetime_entry = setMomentToSpecificDate(e.connection_departure_datetime, today.format());

            // if(!!!duplicatesRemoved.find(tt => compareConnections(e, tt)) && moment(e.valid_thru).isSameOrAfter(today)){
            if(!!!duplicatesRemoved.find(tt => compareConnections(e, tt))){
                e = mapConnectionToFrontend(e, today.format());
                e.gpx_file = `${getHost(domain)}/public/gpx-track/totour/${last_two_characters(e.totour_track_key)}/${e.totour_track_key}.gpx`;
                duplicatesRemoved.push(e);
            }
        })

        result.push({
            date: today.format(),
            connections: duplicatesRemoved,
            returns: getReturnConnectionsByConnection(tour, connections, domain, today),
        })
        today.add(1, "day");
    }

    //handle last value
    if(result && result.length > 0){
        if(!!result[result.length - 1] && (!!!result[result.length - 1].connections || result[result.length - 1].connections.length == 0)){
            result = result.slice(0, -1);
        }
    }

    res.status(200).json({success: true, result: result});
}

const getReturnConnectionsByConnection = (tour, connections, domain, today) => {
    let _connections = [];
    let _duplicatesRemoved = [];

    /*if(!!tour.number_of_days && tour.number_of_days > 1){
        let nextDay = today.clone();
        nextDay.add(tour.number_of_days - 1, 'days');
        _connections = connections.filter(conn => moment(conn.calendar_date).format('DD.MM.YYYY') == nextDay.format('DD.MM.YYYY'))
    } else {
        _connections = connections.filter(conn => moment(conn.calendar_date).format('DD.MM.YYYY') == today.format('DD.MM.YYYY'))
    }*/
    _connections = connections.filter(conn => moment(conn.calendar_date).format('DD.MM.YYYY') == today.format('DD.MM.YYYY'))


    //filter and map
    _connections.forEach(t => {
        let e = {...t}
        e.connection_duration_minutes = minutesFromMoment(moment(e.connection_duration, 'HH:mm:ss'));
        e.return_duration_minutes = minutesFromMoment(moment(e.return_duration, 'HH:mm:ss'));

        if(!!!_duplicatesRemoved.find(tt => compareConnectionReturns(e, tt))){
            e = mapConnectionToFrontend(e, today.format())
            e.gpx_file = `${getHost(domain)}/public/gpx-track/fromtour/${last_two_characters(e.fromtour_track_key)}/${e.fromtour_track_key}.gpx`;
            _duplicatesRemoved.push(e);
        }
    });
    return _duplicatesRemoved;
}

// TODO : gpxWrapper seems to be dead code / check if gpxWrapper is being used in a client api call
const gpxWrapper = async (req, res) => {
    createImageFromMap();
    res.status(200).json({success: true });
}

const mapConnectionToFrontend = (connection) => {
    if(!!!connection){
        return connection;
    }
    let durationFormatted = convertNumToTime(connection.connection_duration_minutes / 60);
    connection.connection_departure_arrival_datetime_string = `${moment(connection.connection_departure_datetime).format('DD.MM. HH:mm')}-${moment(connection.connection_arrival_datetime).format('HH:mm')} (${durationFormatted})`;

    connection.connection_description_parsed = parseConnectionDescription(connection);
    connection.return_description_parsed = parseReturnConnectionDescription(connection);

    return connection;
}

const mapConnectionReturnToFrontend = (connection) => {
    if(!!!connection){
        return connection;
    }

    let durationFormatted = convertNumToTime(connection.return_duration_minutes / 60); // returns a string : `${hour} h ${minute} min`
    connection.return_departure_arrival_datetime_string = `${moment(connection.return_departure_datetime).format('DD.MM. HH:mm')}-${moment(connection.return_arrival_datetime).format('HH:mm')} (${durationFormatted})`;
    connection.return_description_parsed = parseReturnConnectionDescription(connection);

    return connection;
}


const setMomentToSpecificDate = (date, _input) => {
    let mom = moment(date);
    let input = moment(_input);
    mom.set("date", input.get("date"));
    mom.set("month", input.get("month"));
    mom.set("year", input.get("year"));
    return mom.format();
}

const compareConnections = (trans1, trans2) => {
    return trans1 != null
        && trans2 != null
        && moment(trans1.connection_departure_datetime).isSame(moment(trans2.connection_departure_datetime))
        && moment(trans1.connection_arrival_datetime).isSame(moment(trans2.connection_arrival_datetime))
        // && trans1.connection_departure_stop == trans2.connection_departure_stop
        // && trans1.connection_rank == trans2.connection_rank;
}

const compareConnectionReturns = (conn1, conn2) => {
    return conn1 != null
        && conn2 != null
        && moment(conn1.return_departure_datetime).format('HH:mm:ss') == moment(conn2.return_departure_datetime).format('HH:mm:ss')
        && moment(conn1.return_arrival_datetime).format("HH:mm:ss") == moment(conn2.return_arrival_datetime).format("HH:mm:ss")
        && conn1.return_arrival_stop == conn2.return_arrival_stop;
}


const getWeekday = (date) => {
    const day = moment(date).day();
    switch(day){
        case 0: return "sun";
        case 1: return "mon";
        case 2: return "tue";
        case 3: return "wed";
        case 4: return "thu";
        case 5: return "fri";
        case 6: return "sat";
        default: return "mon";
    }
}

const parseConnectionDescription = (connection) => {
    if(!!connection && !!connection.connection_description_json){
        let splitted = jsonToStringArray(connection, 'to');  
        splitted = splitted.map(item => item.replace(/\s*\|\s*/, '').replace(/,/g, ', ') + '\n');

        return splitted;
    }
    return [];
}

const parseReturnConnectionDescription = (connection) => {
    if(!!connection && !!connection.return_description_json){
        let splitted = jsonToStringArray(connection, 'from');  
        splitted = splitted.map(item => item.replace(/\s*\|\s*/, '').replace(/,/g, ', ') + '\n');
        
        return splitted;
    }
    return [];
}

const buildFilterResult = (result, city, params) => {

    let types = [];
    let ranges = [];
    let languages = [];
    let isSingleDayTourPossible = false;
    let isMultipleDayTourPossible = false;
    let isSummerTourPossible = false;
    let isWinterTourPossible = false;
    let maxAscent = 0;
    let maxDescent = 0;
    let minAscent = 10000;
    let minDescent = 10000;
    let maxDistance = 0;
    let minDistance = 10000;
    let isTraversePossible = false;
    let minTransportDuration = 10000;
    let maxTransportDuration = 0;

    result.forEach(tour => {

        if(!!!tour.type){
            tour.type = "Keine Angabe"
        }
        if(!!!tour.range){
            tour.range = "Keine Angabe"
        }
        if(!!!tour.text_lang){
            tour.text_lang = "Keine Angabe"
        }
        if(!!tour.type && !!!types.find(t => tour.type === t)){
            types.push(tour.type);
        }
        if(!!tour.range && !!!ranges.find(t => tour.range === t)){
            ranges.push(tour.range);
        }
        if(!!tour.text_lang && !!!languages.find(t => tour.text_lang === t)){
            languages.push(tour.text_lang);
        }
        if(!!!isSingleDayTourPossible && tour.number_of_days == 1){
            isSingleDayTourPossible = true;
        } else if(!!!isMultipleDayTourPossible && tour.number_of_days > 1){
            isMultipleDayTourPossible = true;
        }

        if(!!!isSummerTourPossible && (tour.season == "s" || tour.season == "n") ){
            isSummerTourPossible = true;
        }
        if(!!!isWinterTourPossible && (tour.season == "w" || tour.season == "n") ){
            isWinterTourPossible = true;
        }

        if(tour.ascent > maxAscent){
            maxAscent = tour.ascent;
        }

        if(tour.ascent < minAscent){
            minAscent = tour.ascent;
        }

        if(tour.descent > maxDescent){
            maxDescent = tour.descent;
        }

        if(tour.descent < minDescent){
            minDescent = tour.descent;
        }

        if(parseFloat(tour.distance) > maxDistance){
            maxDistance = parseFloat(tour.distance);
        }

        if(parseFloat(tour.distance) < minDistance){
            minDistance = parseFloat(tour.distance);
        }

        if(!!!isTraversePossible && (tour.traverse == 1) ){
            isTraversePossible = true;
        }

        if(maxAscent > 3000){
            maxAscent = 3000;
        }
        if(maxDescent > 3000){
            maxDescent = 3000;
        }

        if(maxDistance > 80){
            maxDistance = 80;
        }

        if(tour.cities && !!city){
            const _city = tour.cities.find(c => c.city_slug == city);

            if(!!_city && !!_city.best_connection_duration){
                if(parseFloat(_city.best_connection_duration) > maxTransportDuration){
                    maxTransportDuration = parseFloat(_city.best_connection_duration);
                }
                if(parseFloat(_city.best_connection_duration) < minTransportDuration){
                    minTransportDuration = parseFloat(_city.best_connection_duration);
                }
            }
        }

    });

    if(!!types){
        types.sort();
    }

    if(!!ranges){
        ranges.sort();
    }
    if(!!languages){
        languages.sort();
    }

    return {
        types,
        ranges,
        isSingleDayTourPossible,
        isMultipleDayTourPossible,
        isSummerTourPossible,
        isWinterTourPossible,
        maxAscent,
        minAscent,
        maxDescent,
        minDescent,
        maxDistance,
        minDistance,
        isTraversePossible,
        minTransportDuration: round((minTransportDuration / 60), 2),
        maxTransportDuration: round((maxTransportDuration / 60), 2),
        languages
    };
}



const tourPdfWrapper = async (req, res) => {
    const id = req.params.id;
   
    const datum = !!req.query.datum ? req.query.datum : moment().format();
    const connectionId = req.query.connection_id; logger("L1319 : connectionId :", connectionId)
    const connectionReturnId = req.query.connection_return_id;
    const connectionReturnIds = req.query.connection_return_ids;

    const tour = await knex('tour').select().where({id: id}).first();
    // logger("L1319: query is completed")
    let connection, connectionReturn, connectionReturns = null;

    if (!tour){
        res.status(404).json({success: false});
        return;
    }

    if(!!connectionId){
        connection = await knex('fahrplan').select().where({id: connectionId}).first();
    }
    logger("L1343 , connection :")
    logger(connection)
    if(!!connectionReturnId){
        connectionReturn = await knex('fahrplan').select().where({id: connectionReturnId}).first();
    }

    if(!!connectionReturnIds){
        connectionReturns = await knex('fahrplan').select().whereIn('id', connectionReturnIds).orderBy('return_row', 'asc');
        if(!!connectionReturns){
            connectionReturns = connectionReturns.map(e => {
                e.return_duration_minutes = minutesFromMoment(moment(e.return_duration, 'HH:mm:ss'));
                return mapConnectionReturnToFrontend(e, datum);
            })
        }
    }

    if(!!connection){
        connection.connection_duration_minutes = minutesFromMoment(moment(connection.connection_duration, 'HH:mm:ss'));
    }
    if(!!connectionReturn){
        connectionReturn.return_duration_minutes = minutesFromMoment(moment(connectionReturn.return_duration, 'HH:mm:ss'));
    }

    if(!!tour){
        // logger('L1363 tours.js/ mapConnectionToFrontend(connection, datum) :')
        // logger(mapConnectionToFrontend(connection, datum))
        const pdf = await tourPdf({tour, connection: mapConnectionToFrontend(connection, datum), connectionReturn: mapConnectionReturnToFrontend(connectionReturn, datum), datum, connectionReturns});
        //logger(`L1019 tours /tourPdfWrapper / pdf value : ${!!pdf}`); // value : true
        if(!!pdf){
            res.status(200).json({ success: true, pdf: pdf, fileName: "Zuugle_" + tour.title.replace(/ /g, '') + ".pdf" });
            return;
        }
    }
    res.status(500).json({ success: false });
}


const tourGpxWrapper = async (req, res) => {
    const id = req.params.id;
    const type = !!req.query.type ? req.query.type : "gpx";
    const key = req.query.key;
    const keyAnreise = req.query.key_anreise;
    const keyAbreise = req.query.key_abreise;

    const entry = await knex('tour').select(['provider', 'hashed_url']).where({id: id}).first();
    res.setHeader('content-type', 'application/gpx+xml');
    res.setHeader('Cache-Control', 'public, max-age=31557600');

    try {
        let BASE_PATH = process.env.NODE_ENV === "production" ? "../" : "../../";
        if(type == "all"){
            let filePathMain = replaceFilePath(path.join(__dirname, BASE_PATH, `/public/gpx/${last_two_characters(entry.hashed_url)}/${entry.hashed_url}.gpx`));
            let filePathAbreise = replaceFilePath(path.join(__dirname, BASE_PATH, `/public/gpx-track/fromtour/${last_two_characters(keyAbreise)}/${keyAbreise}.gpx`));
            let filePathAnreise = replaceFilePath(path.join(__dirname, BASE_PATH, `/public/gpx-track/totour/${last_two_characters(keyAnreise)}/${keyAnreise}.gpx`));

            const xml = await mergeGpxFilesToOne(filePathMain, filePathAnreise, filePathAbreise);
            if(!!xml){
                res.status(200).send(xml);
            } else {
                res.status(400).json({success: false});
            }

        } else {
            let filePath = path.join(__dirname, BASE_PATH, `/public/gpx/${last_two_characters(entry.hashed_url)}/${entry.hashed_url}.gpx`);
            if(type == "abreise" && !!key){
                filePath = path.join(__dirname, BASE_PATH, `/public/gpx-track/fromtour/${last_two_characters(key)}/${key}.gpx`);
            } else if(type == "anreise" && !!key){
                filePath = path.join(__dirname, BASE_PATH, `/public/gpx-track/totour/${last_two_characters(key)}/${key}.gpx`);
            }
            filePath = replaceFilePath(filePath);

            let stream = fs.createReadStream(filePath);
            stream.on('error', error => {
                console.log('error: ', error);
                res.status(500).json({ success: false });
            });
            stream.on('open', () => stream.pipe(res));
        }
    } catch(e){
        console.error(e);
    }
}

const getMissingConnectionDays = (connections) => {
    let toReturn = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    if(!!connections && connections.length > 0){
        if(!!connections.find(c => c.weekday === "sun")){
            toReturn = toReturn.filter(c => c !== "So");
        }
        if(!!connections.find(c => c.weekday === "mon")){
            toReturn = toReturn.filter(c => c !== "Mo");
        }
        if(!!connections.find(c => c.weekday === "tue")){
            toReturn = toReturn.filter(c => c !== "Di");
        }
        if(!!connections.find(c => c.weekday === "wed")){
            toReturn = toReturn.filter(c => c !== "Mi");
        }
        if(!!connections.find(c => c.weekday === "thu")){
            toReturn = toReturn.filter(c => c !== "Do");
        }
        if(!!connections.find(c => c.weekday === "fri")){
            toReturn = toReturn.filter(c => c !== "Fr");
        }
        if(!!connections.find(c => c.weekday === "sat")){
            toReturn = toReturn.filter(c => c !== "Sa");
        }
    }
    return toReturn;
}

const getConnectionsByWeekday = (connections, weekday) => {
    if(!!connections && connections.length > 0){
        const found = connections.filter(c => c.weekday === weekday);
        if(!!found && found.length > 0){
            return found;
        } else {
            return getConnectionsByWeekday(connections, connections[0].weekday);
        }
    }
    return [];
}

const prepareTourEntry = async (entry, city, domain, addDetails = true) => {
    if( !(!!entry && !!entry.provider) ) return entry ;    

    entry.gpx_file = `${getHost(domain)}/public/gpx/${last_two_characters(entry.hashed_url)}/${entry.hashed_url}.gpx`;
    // entry.gpx_image_file = `${getHost(domain)}/public/gpx-image/${last_two_characters(entry.hashed_url)}/${entry.hashed_url}_gpx.jpg`;

    /*
    let dir_go_up = "";
    if(process.env.NODE_ENV == "production"){ 
        dir_go_up = "../../"; 
    }
    else {
        dir_go_up = "../../../";
    }
    let filePathSmall_old = path.join(__dirname, dir_go_up, "public/gpx-image/" + last_two_characters(entry.hashed_url) + "/" + entry.hashed_url + "_gpx_small.jpg")
    let filePathSmall_new = path.join(__dirname, dir_go_up, "public/gpx-image/" + last_two_characters(entry.id) + "/" + entry.id + "_gpx_small.jpg")
    
    if (fs.existsSync(filePathSmall_new)){
        entry.gpx_image_file_small = `${getHost(domain)}/public/gpx-image/${last_two_characters(entry.id)}/${entry.id}_gpx_small.jpg`;
    }
    else if (fs.existsSync(filePathSmall_old)){
        entry.gpx_image_file_small = `${getHost(domain)}/public/gpx-image/${last_two_characters(entry.hashed_url)}/${entry.hashed_url}_gpx_small.jpg`;
    }
    else {
        entry.gpx_image_file_small = `${getHost(domain)}/app_static/img/train_placeholder.webp`;
    }
    */

    if(!!addDetails){
        try {
            if(!!city && !!entry.cities_object[city] && !!entry.cities_object[city].total_tour_duration){
                entry.total_tour_duration = entry.cities_object[city].total_tour_duration
            } else {
                entry.total_tour_duration = entry.duration;
            }
        }
        catch (error) {
            logger(`Error in prepareTourEntry: ${error}`);
            entry.total_tour_duration = entry.duration;
        }

        if(!!city){
            const toTour = await knex('fahrplan').select('totour_track_key').where({hashed_url: entry.hashed_url, city_slug: city}).whereNotNull('totour_track_key').first();
            const fromTour = await knex('fahrplan').select('fromtour_track_key').where({hashed_url: entry.hashed_url, city_slug: city}).whereNotNull('fromtour_track_key').first();

            if(!!toTour && !!toTour.totour_track_key){
                entry.totour_gpx_file = `${getHost(domain)}/public/gpx-track/totour/${last_two_characters(toTour.totour_track_key)}/${toTour.totour_track_key}.gpx`;
            }
            if(!!fromTour && !!fromTour.fromtour_track_key){
                entry.fromtour_gpx_file = `${getHost(domain)}/public/gpx-track/fromtour/${last_two_characters(fromTour.fromtour_track_key)}/${fromTour.fromtour_track_key}.gpx`;
            }
        }

        /** add provider_name to result */
        let provider_result = await knex('provider').select('provider_name').where({provider: entry.provider}).first();
        entry.provider_name = provider_result.provider_name;

        // convert the "difficulty" value into a text value 
        entry.difficulty = convertDifficulty(entry.difficulty)
    }
    return entry;
}

//************ TESTING AREA / BAUSTELLE **************/

const mapWrapper = async (req, res) => {
    // const tld = req.query.tld;
  
    // 1. pull all param values in FE and add it to req.query over there 
    // 2. req.query or req.params which should be used ?
    // 3. below in the knex call , let where be escaped and filters tours by coordinates see below
  
    // console.log("req.query is : ", req.query)
    // console.log("req.query.filter is : ", req.query.filter);
    let selects = ['id', 'connection_arrival_stop_lat','connection_arrival_stop_lon'];
  
    try {
    //   await knex('tour')   //tour table
    //       .select(selects)  
    //       .count('* as count') // is it useful ? => Count all rows as 'count'
    //     //   .where('country_code', tld) // see point 3 above
    //     //   .groupBy('menu_lang')
    //     //   .orderBy('count', 'desc') // Order by id ?
    //     //   .limit(1);  // limit is what ? 10000 ?
  
  
      res.status(200).json({ success: true , data_received : "yes sir !"});
    } catch (error) {
      console.error('Error retrieving map data:', error);
      res.status(500).json({ success: false, error: 'Failed to retrieve map data' });
    }
  };
  //************ END OF TESTING AREA **************/


export default router;