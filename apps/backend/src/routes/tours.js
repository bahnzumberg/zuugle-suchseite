import express from 'express';
let router = express.Router();
import knex from "../knex";
import {createImageFromMap, mergeGpxFilesToOne} from "../utils/gpx/gpxUtils";
import {convertNumToTime, minutesFromMoment} from "../utils/helper";
import moment from "moment";
import {tourPdf} from "../utils/pdf/tourPdf";
import {getHost, replaceFilePath, round, get_domain_country, get_country_lanuage_from_domain, getAllLanguages } from "../utils/utils";
import { convertDifficulty } from '../utils/dataConversion';
import logger from '../utils/logger';

const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => listWrapper(req, res));
router.get('/filter', (req, res) => filterWrapper(req, res));
router.get('/provider/:provider', (req, res) => providerWrapper(req, res));

router.get('/total', (req, res) => totalWrapper(req, res));
router.get('/gpx', (req, res) => gpxWrapper(req, res));
router.get('/:id/connections', (req, res) => connectionsWrapper(req, res));
router.get('/:id/connections-extended', (req, res) => connectionsExtendedWrapper(req, res));
router.get('/:id/pdf', (req, res) => tourPdfWrapper(req, res));
router.get('/:id/gpx', (req, res) => tourGpxWrapper(req, res));
router.get('/:id', (req, res) => getWrapper(req, res));

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
    
    const city = req.query.city;
    const id = parseInt(req.params.id, 10); 
    const domain = req.query.domain;

    if (isNaN(id)) {
        res.status(400).json({ success: false, message: "Invalid tour ID" });
        return;
    }

    if(!!!id){
        res.status(404).json({success: false});
        return
    }
    // } else {
    let selects = ['id', 'url', 'provider', 'hashed_url', 'description', 'image_url', 'ascent', 'descent', 'difficulty', 'difficulty_orig' , 'duration', 'distance', 'title', 'type', 'number_of_days', 'traverse', 'country', 'state', 'range_slug', 'range', 'season', 'month_order', 'quality_rating', 'user_rating_avg', 'cities', 'cities_object', 'max_ele'];
    let entryQuery = knex('tour').select(selects).where({id: id}).first();

    try {
        let entry = await entryQuery;
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
    const coordinatesNorthEast = req.query.filter && req.query.filter.coordinatesNorthEast ? req.query.filter.coordinatesNorthEast : null;
    const coordinatesSouthWest = req.query.filter && req.query.filter.coordinatesSouthWest ? req.query.filter.coordinatesSouthWest : null;

    // variables initialized depending on availability of 'map' in the request
    const map = req.query.map == "true";
    let useLimit = !!!map;  // initialise with true
    let addDetails = !!!map; // initialise with true

    // This determines, if there is a search term given by the user.
    let searchIncluded = !!search && !!search.length > 0;

    //construct the array of selected columns 
    let selects = ['id', 'url', 'provider', 'hashed_url', 'description', 'image_url', 'ascent', 'descent', 'difficulty', 'difficulty_orig', 'duration', 'distance', 'title', 'type', 'number_of_days', 'traverse', 'country', 'state', 'range_slug', 'range', 'season', 'month_order', 'quality_rating', 'user_rating_avg', 'cities', 'cities_object', 'max_ele'];

    // CASE OF SEARCH
    let sql_select = "SELECT id ,  url ,  provider ,  hashed_url ,  description ,  image_url ,  ascent ,  descent ,  difficulty ,  difficulty_orig ,  duration ,  distance ,  title ,  type ,  number_of_days ,  traverse ,  country ,  state ,  range_slug ,  range ,  season ,  month_order , quality_rating ,  user_rating_avg ,  cities ,  cities_object ,  max_ele  ";
   

    let where = {};
    // This map check is not needed when we move to the new detail page design, map shows only in detail then
    if(!!map){
        selects = ['id', 'gpx_data', 'provider', 'hashed_url', 'title'];
        sql_select = "SELECT 'id', 'gpx_data', 'provider', 'hashed_url', 'title' "
    }
    //********************************************************************++*/
    // CREATE QUERY / NO SEARCH
    //********************************************************************++*/

    //define the query using knex (table name is tour) and use the 'selects' array constructed above.
    let query = knex('tour').select(selects);
    let countQuery = knex('tour').count('id');

    //initialize a new variable 'whereRaw' and use it to define the where statments
    let whereRaw = null;
    
    /** city search */
    //If the user has entered a value for city, the code sets the whereRaw variable to an SQL clause that searches for a JSONB array column called 'cities' that contains a JSON object with a property 'city_slug' matching the user input.
    if(!!city && city.length > 0){
        whereRaw = ` id IN (SELECT tour_id FROM city2tour WHERE city_slug='${city}') `;
    }
    else {
        const tld = get_domain_country(domain);
        whereRaw = ` id IN (SELECT tour_id FROM city2tour WHERE reachable_from_country='${tld}') `;
    }


    /** region search */
    // The code sets the where object to filter results by the values entered for range, state, and country if they are present in the user input.   
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
    // The code sets the 'where' object to filter results by the 'type' value if it is present in the user input.
    if(!!type && type.length > 0){
        where.type = type;
    }

    /** language search */
    // The code sets the 'where' object to filter results by the 'language' value if it is present in the user input.
    if(!!language && language.length > 0){
        where.language = language;
    }

    /** provider search */
    //describe
    // The code sets the 'where' object to filter results by the 'provider' value if it is present in the user input.
    if(!!provider && provider.length > 0){
        where.provider = provider;
    }

    //filters the tours by coordinates
    //FE sends coordinate bounds which the user sees on the map --> tours that are within these coordinates are returned
    if(!!coordinatesNorthEast && !!coordinatesSouthWest){
        const latNE = coordinatesNorthEast.lat.toString();
        const lngNE = coordinatesNorthEast.lng.toString();
        const latSW = coordinatesSouthWest.lat.toString();
        const lngSW = coordinatesSouthWest.lng.toString();

        whereRaw += whereRaw ? ' AND ' : '';
        whereRaw += `id IN (SELECT id
          FROM tour,
          jsonb_array_elements(tour.gpx_data) as tour_data
          WHERE (tour_data->>'typ') = 'first'
          AND (tour_data->>'lat')::numeric BETWEEN (${latSW})::numeric AND (${latNE})::numeric
          AND (tour_data->>'lon')::numeric BETWEEN (${lngSW})::numeric AND (${lngNE})::numeric) `;
    }


// *******************************************************************
// MOVE INTO QUERY ANY ACCUMULATED CONDITIONS INSIDE WHERE / (NO SEARCH)
// *******************************************************************
    //Build "where" object
    //After building up the where and whereRaw conditions based on the user's search input, the next 2 if statments then checks if there are any conditions to be added to the query.
    // First, it checks if there are any conditions in the 'where' object, which was built up earlier in the code. If there are, it adds these conditions to the query object and to the countQuery object using the where method.
    // Next, it checks if there are any conditions in the whereRaw string. If there are, it adds these conditions to the query object and to the countQuery object using the andWhereRaw method.
    // These methods allow the conditions to be added to the SQL query that will be executed. By chaining the where and WhereRaw methods onto the query and countQuery objects, the code is able to build up a complex SQL query with multiple conditions, based on the user's search input.
    if(!!where && Object.keys(where).length > 0){
        query = query.where(where);
        countQuery = countQuery.where(where);
    }
    if(!!whereRaw && whereRaw.length > 0){
        query = query.andWhereRaw(whereRaw);
        countQuery = countQuery.andWhereRaw(whereRaw);
    }

    
    // ****************************************************************
    // FILTER  / (BOTH)
    // ****************************************************************
    query = buildWhereFromFilter(req.query, query, true);
    countQuery = buildWhereFromFilter(req.query, countQuery);

    //DO THIS FOR SEARCH TERM ONLY
    let sql_where_filter = "";
    let sql_and_filter =""

    if (searchIncluded) {
        sql_where_filter = query.toQuery(); // transform the returned query from buildWhereFromFilter to a string
        try {
            // cut off from string "sql_where_filter" everything before "where", this way we have only where values 
            // including filter conditions from original query and in a string format
            sql_where_filter = sql_where_filter.substring(sql_where_filter.indexOf("where")) + " ";
            sql_and_filter = sql_where_filter.replace("where", "AND");

        } catch (error) {
            console.log(error.message)
        }
    }


    // ****************************************************************
    // FULL TEXT SEARCH   / SEARCH
    // ****************************************************************
    //search
    // The next block of code builds on the sql_select to create a series of inner queries. The query searches through the search_column for "search" using the PostgreSQL ts_rank() and websearch_to_tsquery() functions. So called "Fulltext search"
    //case of search/ initialize the order by rank to be used for "order by" var
    let order_by_rank = " 1.0/(ABS(1100-ascent)+1) * (CASE WHEN difficulty=2 THEN 0.5 ELSE 0.2 END) * (CASE WHEN traverse=1 THEN 1 ELSE 0.5 END) * (quality_rating+1)/10.0 * 1.0 / (month_order+0.5) DESC, "; 

    if(searchIncluded){
        order_by_rank = " result_rank DESC, ";

        const tldLangArray = get_country_lanuage_from_domain(domain);// get language of TLD / return an array of strings

        //clgs
        //example domain / menu_lang (currLanguage)
        // const tldLangArray = get_country_lanuage_from_domain("https://www.zuugle.fr/");
        // result of above clg when menu_lang = 'it' : L 217, newRanks final :  [ { en: 1 }, { de: 1 }, { fr: 10 }, { it: 100 }, { sl: 1 } ]

        // get array of ALL languages
        const allLangs = getAllLanguages(); // ["en", "de", "it", "fr", "sl"]
        // create ranks array
        const currRanks = () => {
          let newRanks = [];

            allLangs.forEach((lang) => {
                    if (lang === currLanguage) {
                        newRanks = [...newRanks, { [lang]: 100 }];
                    }else if(tldLangArray.includes(lang)) {
                        newRanks = [...newRanks, { [lang]: 10 }];
                    }else {
                        newRanks = [...newRanks, { [lang]: 1 }];
                    }
            });
          return newRanks;
        };

        //describe:
        //If '_search' contains spaces, the if statment sets the 'order_by_rank' variable to an SQL clause that ranks results by the relevance of the user input to the search_column using the ts_rank() function, and sets the whereRaw variable to an SQL clause that searches the search_column for the user input using the websearch_to_tsquery() function.
        //else, '_search' contains NO spaces: the same is repeated but with additional modifier

    
        // ****************************************************************
        // CREATING INNER QUERIES
        // ****************************************************************
        let _search = search.trim().toLowerCase();
        _search = search.replace(/'/g, "''");

        // console.log("L318 _search :", _search)

        //from is added here to be used in the search module ONLY
        sql_select += " FROM ( ";

        const langRanks = currRanks(); // internal to search section
        //clgs
        //console.log(" ");
        //console.log("L 223 , langRanks : ", langRanks); //[ { en: 100 }, { de: 10 }, { it: 1 }, { fr: 1 }, { sl: 1 } ]
        //console.log(" ");
        const encodeLang = [{ en: "english" },{ de: "german" },{ it: "italian" }, { fr: "french" } ,{ sl: "simple" }];

        let _traveltime_weight = ''
        let _traveltime_join   = ''

        for (let i = 0; i < allLangs.length; i++) {
            // console.log(" i :", i)
            const lang = allLangs[i];
            const langRank = langRanks[i][lang]; //e.g.  i=0 /lang='en' => langRanks[0][lang] = 100

            // Additional rank based on ascent, difficulty, traverse
            // 1.0/(ABS(1100-ascent)+1) AS rank_ascent,
            // CASE WHEN difficulty=2 THEN 0.5 ELSE 0.2 END as rank_difficulty,
            // CASE WHEN traverse=1 THEN 1 ELSE 0.5 END AS rank_traverse,
            // and on the quality_rating (the value of 10 should result in 1.1 and the value of 0 in 0.1)

            if(!!city && city.length > 0){
                _traveltime_weight = ` * 2.0-1000.0/((1000-ABS(90-c.min_connection_duration))-1) `
                _traveltime_join = ` INNER JOIN city2tour as c ON c.tour_id=i${i + 1}.id AND c.city_slug='${city}' `
            }

            if(_search.indexOf(' ') > 0){
                // console.log("L335 / search phrase consists of more than one word - space separated here !")
                sql_select += `
                    SELECT
                    i${i + 1}.*,
                    ts_rank(i${i + 1}.search_column, websearch_to_tsquery('${
                    encodeLang[i][lang]
                    }', ' ${_search}')) * ${langRank} 
                    * 1.0/(ABS(1100-ascent)+1)
                    * (CASE WHEN difficulty=2 THEN 0.5 ELSE 0.2 END)
                    * (CASE WHEN traverse=1 THEN 1 ELSE 0.5 END)
                    * (quality_rating+1)/10.0
                    * 1.0 / (month_order+0.5)
                    ${_traveltime_weight}
                    as result_rank     
                    FROM tour AS i${i + 1}
                    ${_traveltime_join}
                    WHERE
                    i${i + 1}.text_lang = '${lang}'
                    AND i${i + 1}.search_column @@ websearch_to_tsquery('${ encodeLang[i][lang]}', '${_search}')
                    ${sql_and_filter}
                `;

            }else {
                // console.log("L376 / NO space separated here !")
                sql_select += `
                    SELECT
                    i${i + 1}.*,
                    ts_rank(i${i + 1}.search_column, websearch_to_tsquery('${
                    encodeLang[i][lang]
                    }', ' "${_search}" ${_search}:*')) * ${langRank} 
                    * 1.0/(ABS(1100-ascent)+1)
                    * (CASE WHEN difficulty=2 THEN 0.5 ELSE 0.2 END)
                    * (CASE WHEN traverse=1 THEN 1 ELSE 0.5 END)
                    * (quality_rating+1)/10.0
                    * 1.0 / (month_order+0.5)
                    ${_traveltime_weight}
                    as result_rank 
                    FROM tour AS i${i + 1}
                    ${_traveltime_join}
                    WHERE
                    i${i + 1}.text_lang = '${lang}'
                    AND i${i + 1}.search_column @@ websearch_to_tsquery('${ encodeLang[i][lang]}', ' "${_search}" ${_search}:*')
                    ${sql_and_filter}
                `;
            }
            // console.log("sql=", sql_select)
            if (i !== allLangs.length - 1) {        // as long as end of array not reached
            sql_select += "\nUNION ";               // create a union with a line break
        }
    }
    sql_select += ") as o ";                        // provide ending for 'FROM' part

    }

    // ****************************************************************
    // GET THE COUNT WHEN SEARCH TERM IS INCLUDED
    // ****************************************************************
    let sql_count = null;

    if (searchIncluded) {
      try {
        // let count_query = knex.raw(`SELECT COUNT(*) AS row_count FROM (${sql_select}) AS subquery ${sql_where_filter}`); // includes all internal queries
        let count_query = knex.raw(`SELECT COUNT(*) AS row_count FROM (${sql_select}) AS subquery`); // includes all internal queries
        let sql_count_call = await count_query;
        sql_count = parseInt(sql_count_call.rows[0].row_count, 10);

      } catch (error) {
        console.log("Error retrieving count:", error);
      }
    }

    // ****************************************************************
    // ORDER BY
    // ****************************************************************

    //describe:
    //if-else block checks for a specific orderId parameter, which is used to determine the order in which the results should be sorted. Depending on the value of orderId, the query is sorted using different fields and ordering directions. 
    // There are some special cases where additional ordering is done based on the city parameter, as well as conditions where the query is sorted based on a combination of different fields. Finally, a default sorting order is set if no orderId parameter is provided. 

    let sql_order = "";
    sql_order += `ORDER BY `;

    // Formerly here was checked if(!!orderId && orderId == "relevanz"){
    // Now there is only one sorting algorithm. This one.
    // traverse can be 0 / 1. If we add 1 to it, it will be 1 / 2. Then we can divide the best_connection_duration by this value to favour traverse hikes.
    if(!!city){
        query = query.orderByRaw(` ${order_by_rank} month_order ASC, FLOOR((cities_object->'${city}'->>'best_connection_duration')::int/(traverse + 1)/30)*30 ASC`);
        sql_order += ` ${order_by_rank} month_order ASC, traverse DESC, FLOOR((cities_object->'${city}'->>'best_connection_duration')::int/(traverse + 1)/30)*30 ASC `; //4)
    }
    else {
        query = query.orderBy("month_order", 'asc');
        sql_order += `${order_by_rank} month_order ASC `; //3)
    }



    // ****************************************************************
    // LIMIT
    // ****************************************************************
   /** set limit to query */
    // a limit and offset are applied to the query if the useLimit flag is set to true/ in case (i.e.  map != true ). The query is then executed to get the result set, and a count is retrieved from the countQuery. The result and count are then returned.
    let sql_limit = "";
    if(!!useLimit){
        if(searchIncluded){
            sql_limit += `LIMIT 9 OFFSET ${9 * (page - 1)}`; // Add limit to string query
        }else{
            query = query.limit(9).offset(9 * (page - 1));
        }
    }

    let outer_where = "WHERE 1=1 ";

    // ****************************************************************
    // CALLING DATABASE
    // ****************************************************************
    let result = '';
    let count = '';

    if(searchIncluded){
        try {
            // console.log(" L435: with search term / final query :", sql_select + outer_where + sql_order + sql_limit)
            // console.log("================================================")
            result = await knex.raw(sql_select + outer_where + sql_order + sql_limit );// fire the DB call here (when search is included)
            
            logger("#######################################################");
            logger('SQL with search phrase: ', sql_select + outer_where + sql_order + sql_limit);
            logger("#######################################################");
            
            if (result && result.rows) {
                result = result.rows;
            //clg
              result.forEach((item) => {
                // console.log(`Title: ${item.title}`);
              });
            } else {
              console.log('Result or result.rows is null or undefined.');
            }
          } catch (error) {
            console.log("error retrieving results:", error);
          }

    }else{
        logger("#######################################################");
        const sqlQuery = query.toString();
        logger("SQL without search phrase :", sqlQuery)
        logger("#######################################################");

        result = await query;
        count = await countQuery.first();
    }


    //logsearchphrase
    //This code first logs the search phrase and the number of results in a database table called logsearchphrase if a search was performed. It replaces any single quotes in the search parameter with double quotes, which is necessary to insert the search parameter into the SQL statement.
    try {
        let searchparam = '';

        if (search !== undefined && search !== null && search.length > 0 && req.query.city !== undefined) {
            searchparam = search.replace(/'/g, "''").toLowerCase();

            let _count = searchIncluded ? sql_count : count['count'];
            if (!!_count && _count > 1) {
                await knex.raw(`INSERT INTO logsearchphrase(phrase, num_results, city_slug, menu_lang, country_code) VALUES('${searchparam}', ${_count}, '${req.query.city}', '${currLanguage}', '${get_domain_country(domain)}');`)
            }
        }
    } catch (e) {
        console.error('error inserting into logsearchphrase: ', e);
    }
    

    //preparing tour entries
    //this code maps over the query result and applies the function prepareTourEntry to each entry. The prepareTourEntry function returns a modified version of the entry that includes additional data and formatting. The function also sets the 'is_map_entry' property of the entry to true if map is truthy. The function uses Promise.all to wait for all promises returned by 'prepareTourEntry' to resolve before returning the final result array.
    if(result){
        await Promise.all(result.map(entry => new Promise(async resolve => {
            entry = await prepareTourEntry(entry, city, domain, addDetails);
            entry.is_map_entry = !!map;
            resolve(entry);
        })));
    }

    /** add ranges to result */
    //This code prepares the response to a HTTP request.
    //The ranges array is populated with data about the tours ranges. The showRanges variable is a boolean that is passed in the request to determine whether to return the ranges or not. If showRanges is true, then the code queries the database to get a list of the distinct ranges and their image urls. It then loops through the results to create an array of range objects containing the range name and the corresponding image URL. The code then queries the database to get all states of each range and adds them to the states array of each range object.
    let ranges = [];

    let rangeQuery = knex('tour').select(['month_order', 'range_slug']).distinct(['range']);
    
    if(!!showRanges){    
        //describe:
        //query 'rangeQuery' is modified to restrict the selection to a particular city.
        //the whereRaw method is called with an SQL expression that checks if the cities column (which is a JSONB data type) contains a JSON object with a city_slug property equal to the city parameter value.
        if(!!city && city.length > 0){
            // rangeQuery = rangeQuery.whereRaw(`cities @> '[{"city_slug": "${city}"}]'::jsonb`);
            rangeQuery = rangeQuery.whereRaw(` id IN (SELECT tour_id FROM city2tour WHERE city_slug='${city}') `);
            // console.log("rangeQuery=", rangeQuery.toSQL().toNative())
        }

        //describe:
        //query is modified to order the results by month_order in ascending order, and to limit the number of rows returned to 10.
        rangeQuery = rangeQuery.orderBy("month_order", 'asc').limit(10);
        //describe:
        //the query is executed by calling await on the rangeQuery object, which returns an array of objects representing the rows returned by the query.
        let rangeList = await rangeQuery;
    
        //describe:
        //a loop is performed over each object in rangeList. For each object, it is checked if both tour and tour.range properties are defined and truthy. If they are, it is checked if there is no object in the ranges array that has a range property equal to tour.range. If there isn't, a new object is constructed with a range property equal to tour.range, and an image_url property equal to a string constructed with the getHost function on the domain parameter, the "/public/range-image/" path, and the tour.range_slug value. The new object is then pushed onto the ranges array.
        rangeList.forEach(tour => {
            if(!!tour && !!tour.range){
                if(!!!ranges.find(r => r.range === tour.range)){
                    ranges.push({
                        range: tour.range,
                        image_url: `${getHost(domain)}/public/range-image/${tour.range_slug}.jpg`
                    });
                }
            }
        });
        //describe:
        //In summary, this block of code loops through each range object in the ranges array and retrieves a list of states associated with that range from the tour table, using Knex.js. It then adds a new states property to the range object, which contains the list of states.
        if(!!ranges){
            // describe:
            // For each object, a new query is created using the knex instance, with the following conditions:
            // The select method retrieves the state column from the tour table.
            // The where method is used to filter the results to only include tours where the range column matches the range property of the current object in the loop.
            // The whereNotNull method is used to exclude any tours where the state column is null.
            // The groupBy method is used to group the results by the state column.
            for(let i=0; i<ranges.length;i++){
                let r = ranges[i];
                let states = await knex('tour').select('state').where({range: r.range}).whereNotNull('state').groupBy('state');
                //Overall, this last line is used to extract the state values from the states array and assign them to the states property of each object in the ranges array.
                ranges[i].states = states.filter(s => !!s.state).map(s => s.state);
            }
        }
    }
    else {
        const tld = get_domain_country(domain);
        rangeQuery = rangeQuery.whereRaw(` id IN (SELECT tour_id FROM city2tour WHERE reachable_from_country="${tld}") `);
    }

    //describe:
    // The result array contains the list of tours returned from the database after executing the main query. This array is already looped through to transform each tour entry with additional data and metadata using the prepareTourEntry function. Finally, a JSON response is returned with success set to true, the tours array, the total count of tours returned by the main query, the current page, and the ranges array (if showRanges is true).

    let count_final = searchIncluded ? sql_count : count['count'];
    // console.log("L 563 count_final :", count_final)

    res.status(200).json({success: true, tours: result, total: count_final, page: page, ranges: ranges});
}

const filterWrapper = async (req, res) => {
    // const timer_start= Date. now();
    // console.log("Start filterWrapper: ", timer_start);

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
        // whereRaw = `cities @> '[{"city_slug": "${city}"}]'::jsonb`;
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


    res.status(200).json({success: true, filter: buildFilterResult(filterResultList, city, req.query)});
}


const connectionsWrapper = async (req, res) => {
    const id = req.params.id;
    const city = req.query.city;
    const domain = req.query.domain;

    const weekday = getWeekday(moment());
    const tour = await knex('tour').select().where({id: id}).first();
    if(!!!tour || !!!city){
        res.status(404).json({success: false});
        return;
    }

    const query_con = knex('fahrplan').select().where({hashed_url: tour.hashed_url, tour_provider: tour.provider, city_slug: city});
    /*
    if(process.env.NODE_ENV != "production"){
        console.log('query in connectionsWrapper: ', query_con.toQuery());
    }
    */
    const connections = await query_con;
    let missing_days = getMissingConnectionDays(connections);
    await Promise.all(connections.map(connection => new Promise(resolve => {
        connection.best_connection_duration_minutes = minutesFromMoment(moment(connection.best_connection_duration, 'HH:mm:ss'));
        connection.connection_duration_minutes = minutesFromMoment(moment(connection.connection_duration, 'HH:mm:ss'));
        connection.return_duration_minutes = minutesFromMoment(moment(connection.return_duration, 'HH:mm:ss'));
        connection.missing_days = missing_days;
        /* connection.connection_arrival_stop = connection_arrival_stop;
        connection.connection_returns_departure_stop = connection_returns_departure_stop; */
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
            t.gpx_file = `${getHost(domain)}/public/gpx-track/fromtour_track_${t.fromtour_track_key}.gpx`;

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
    const city = req.query.city;
    const domain = req.query.domain;

    const tour = await knex('tour').select().where({id: id}).first();
    if(!!!tour || !!!city){
        res.status(404).json({success: false});
        return;
    }

    const connections = await knex('fahrplan').select().where({hashed_url: tour.hashed_url, tour_provider: tour.provider, city_slug: city}).orderBy('return_row', 'asc');

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

            if(!!!duplicatesRemoved.find(tt => compareConnections(e, tt)) && moment(e.valid_thru).isSameOrAfter(today)){
                e = mapConnectionToFrontend(e, today.format());
                e.gpx_file = `${getHost(domain)}/public/gpx-track/totour_track_${e.totour_track_key}.gpx`;
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

        if(!!!_duplicatesRemoved.find(tt => compareConnectionReturns(e, tt)) && moment(e.valid_thru).isSameOrAfter(today)){
            e = mapConnectionToFrontend(e, today.format())
            e.gpx_file = `${getHost(domain)}/public/gpx-track/fromtour_track_${e.fromtour_track_key}.gpx`;
            _duplicatesRemoved.push(e);
        }
    });
    return _duplicatesRemoved;
}

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

    let durationFormatted = convertNumToTime(connection.return_duration_minutes / 60);
    connection.return_departure_arrival_datetime_string = `${moment(connection.return_departure_datetime).format('DD.MM. HH:mm')}-${moment(connection.return_arrival_datetime).format('HH:mm')} (${durationFormatted})`;
    connection.return_description_parsed = parseReturnConnectionDescription(connection);

    return connection;
}

const setMomentToCurrentDate = (date) => {
    let mom = moment(date);
    let today = moment();

    today.set("hour", mom.get("hour"));
    today.set("minute", mom.get("minute"));
    today.set("second", mom.get("second"));

    return today.format();
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
        && trans1.connection_departure_stop == trans2.connection_departure_stop
        && trans1.connection_rank == trans2.connection_rank;
}

const compareConnectionReturns = (conn1, conn2) => {
    return conn1 != null
        && conn2 != null
        && moment(conn1.return_departure_datetime).format('HH:mm:ss') == moment(conn2.return_departure_datetime).format('HH:mm:ss')
        && moment(conn1.return_arrival_datetime).format("HH:mm:ss") == moment(conn2.return_arrival_datetime).format("HH:mm:ss")
        && conn1.return_arrival_stop == conn2.return_arrival_stop;
}

const getWeekdayType = (date) => {
    const day = moment(date).day();
    if(day == 6){
        return "saturday";
    } else if(day == 0){
        return "sunday";
    } else {
        return "businessday";
    }
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
    if(!!connection && !!connection.connection_description_detail){
        let splitted = connection.connection_description_detail.split('|');
        return splitted;
    }
    return [];
}

const parseReturnConnectionDescription = (connection) => {
    if(!!connection && !!connection.return_description_detail){
        let splitted = connection.return_description_detail.split('|');
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

const buildWhereFromFilter = (params, query, print = false) => {
  try {

    //clg: params/* 
    // console.log('L1078 , params : ')
    // console.log(params)

    //clg: params.filter
    // if(params.filter){
        // console.log("L774 params.singleDayTour :", params.filter.singleDayTour);     
        // console.log("L774 params.multipleDayTour :", params.filter.multipleDayTour);     
        // console.log("L774 params.children :", params.filter.children);     
        // console.log("L774 params.traverse :", params.filter.traverse);     
    // }
    //clg: query
    // console.log("L1137 query at entry to buildWhereFromFilter :");
    // console.log(query.toSQL().sql) */
    
    if(!!!params.filter ) return query;
    
    // Description:
    // check if params.filter contains ONLY a key/value pair {ignore_filter : 'true'}
    let filterIgnored = Object.keys(params.filter).length === 1 && params.filter['ignore_filter'] === 'true'
    //clg:
    // console.log("L911: filterIgnored :", filterIgnored)

    if(filterIgnored ) return query;

    // ****************************************************************
    // !!query && console.log("L848 query still with us not returned yet")

    let filter ;
    if(typeof(params.filter) === 'string') {
        filter = JSON.parse(params.filter) ;
        //clg
        // console.log('Filter is string : ')
        // console.log(filter)
    }else if(typeof(params.filter) === 'object'){
        filter = params.filter;
        //clg
        // console.log('Filter is object : ')
        // console.log(filter)
    }else{
        filter={};
    }


      const {
          singleDayTour,
          multipleDayTour,
          summerSeason,
          winterSeason,
          traverse,
          difficulty,
          minAscent,
          maxAscent,
          minDescent,
          maxDescent,
          minTransportDuration,
          maxTransportDuration,
          minDistance,
          maxDistance,
          ranges,
          types,
          languages // includes languages in the filter
      } = filter;

    

    //** Wintertour oder Sommertour, Ganzjahrestour oder Nicht zutreffend*/
    if(summerSeason === 'true' && winterSeason === 'true'){
        query = query.whereIn('season', ['g', 's', 'w']);
    } else if(summerSeason === 'true'){
        query = query.whereIn('season', ['g', 's']);
    } else if(winterSeason === 'true'){
        query = query.whereIn('season', ['g', 'w']);
    } else if(summerSeason === 'false' && winterSeason === 'false'){
        query = query.whereIn('season', ['x']);
    }
    //clg
    // console.log("................................................................")
    // console.log("L1222 query / after season:");
    // console.log(query.toSQL().sql)


    /** Eintagestouren bzw. Mehrtagestouren */
    if(singleDayTour === 'true' && multipleDayTour === 'true'){

    } else if(singleDayTour === 'true'){
        query = query.where({number_of_days: 1});
    } else if(multipleDayTour === 'true'){
        query = query.whereRaw('number_of_days > 1 ')
    } else if(singleDayTour === 'false' && multipleDayTour === 'false'){
        query = query.whereRaw('number_of_days = -1 ')
    }
    // clgs
    // console.log("................................................................")
    // console.log("L1239 query / after number_of_days:");
    // console.log(query.toSQL().sql)

    /** Überschreitung */
    if (!!(traverse)) {
        let val=0;
        val = traverse == true ? 1 : 0 ;
        query = query.where({ traverse: val });
    }
    // clgs
    // console.log("................................................................")
    // console.log("L1258 query / after traverse:");
    // console.log(query.toSQL().sql);

    /** Aufstieg, Abstieg */
    if(!!minAscent){
        query = query.whereRaw('ascent >= ' + minAscent);
    }
    if(!!maxAscent){
        let _ascent = maxAscent;
        if(_ascent == 3000){
            _ascent = 100000;
        }
        query = query.whereRaw('ascent <= ' + _ascent);
    }
    // clg
    // console.log("................................................................")
    // console.log("L1275 query / after min/max Ascent:");
    // console.log(query.toSQL().sql)

    if(!!minDescent){
        query = query.whereRaw('descent >= ' + minDescent);
    }
    if(!!maxDescent){
        let _descent = maxDescent;
        if(_descent == 3000){
            _descent = 100000;
        }
        query = query.whereRaw('descent <= ' + _descent);
    }
    // clgs
    // console.log("................................................................")
    // console.log("L1290 query / after min/max Descent :");
    // console.log(query.toSQL().sql)


    /** distanz */
    if(!!minDistance){
        query = query.whereRaw('distance >= ' + minDistance);
    }
    if(!!maxDistance){
       let _distance = maxDistance;
        if(_distance == 80){
            _distance = 1000;
        }
        query = query.whereRaw('distance <= ' + _distance);
    }
    // clgs
    // console.log("................................................................")
    // console.log("L1307 query / after min/max Distance:");
    // console.log(query.toSQL().sql)

    /** schwierigkeit */
    if (!!difficulty) {
        query = query.whereRaw("difficulty <= " + difficulty);
    }
    //clgs
    // console.log("................................................................")
    // console.log("L1315 query / after Difficulty:");
    // console.log(query.toSQL().sql)


    if (!!ranges) {
        let newRanges;
        if(typeof(ranges) == "object" && !Array.isArray(ranges))  { 
            newRanges = Object.values(ranges)
        }else{
            newRanges = ranges;
        }

      const nullEntry = newRanges.find((r) => r == "Keine Angabe");
      let _ranges = newRanges.map((r) => "'" + r + "'");
      if (!!nullEntry) {
        query = query.whereRaw(
          `(range in (${_ranges}) OR range IS NULL OR range = '')`
        );

    } else {
        query = query.whereRaw(`(range in (${_ranges}))`);
      }
    }
    // clgs
    // console.log("................................................................")
    // console.log("L1342 query / after Ranges:");
    // console.log(query.toSQL().sql);

    if(!!types){
        const nullEntry = types.find(r => r == "Keine Angabe");
        let _types = types.map(r => '\'' + r + '\'');
        if(!!nullEntry){
            query = query.whereRaw(`(type in (${_types}) OR type IS NULL OR type = '')`);
        } else {
            query = query.whereRaw(`(type in (${_types}))`);
        }
    }
    // clgs
    // console.log("................................................................")
    // console.log("L1356 query / after Types:");
    // console.log(query.toSQL().sql);

    // includes a statement that asks for the specific languages in the where-clause
      if(!!languages){
          const nullEntry = languages.find(r => r == "Keine Angabe");
          let _languages = languages.map(r => '\'' + r + '\'');
          if(!!nullEntry){
              query = query.whereRaw(`(text_lang in (${_languages}) OR text_lang IS NULL OR text_lang = '')`);
          } else {
              query = query.whereRaw(`(text_lang in (${_languages}))`);
          }
      }

    /** Anfahrtszeit */
    if(!!minTransportDuration && !!params.city){
        let transportDurationMin = minTransportDuration * 60;
        query = query.whereRaw(`(cities_object->'${params.city}'->>'best_connection_duration')::int >= ${transportDurationMin}`);
    }

    if(!!maxTransportDuration && !!params.city){
        let transportDurationMin = maxTransportDuration * 60;
        query = query.whereRaw(`(cities_object->'${params.city}'->>'best_connection_duration')::int <= ${transportDurationMin}`);
    }
  } catch (error) {
    console.log("error :", error.message);
  }
//   clgs
//   console.log("................................................................")
//   console.log("L1375 query / min/max Transport Duration:");
//   console.log(query.toSQL().sql);

//   console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
//   console.log("1385, returned query buildWhereFromFilter  :")
//   console.log(query.toSQL().sql)
//   console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

//   let ret_value = {query: query, sql_query: sql_query }
//   console.log("L1390 ret_value.sql_query :");
//   console.log(ret_value.sql_query);
//   console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

  return query;
};

const parseTrueFalseQueryParam = (param) => {
    return !!param;
}

const tourPdfWrapper = async (req, res) => {
    const id = req.params.id;
    const city = req.query.city;
    const datum = !!req.query.datum ? req.query.datum : moment().format();
    const connectionId = req.query.connection_id;
    const connectionReturnId = req.query.connection_return_id;
    const connectionReturnIds = req.query.connection_return_ids;

    const tour = await knex('tour').select().where({id: id}).first();
    let connection, connectionReturn, connectionReturns = null;

    if(!!connectionId){
        connection = await knex('fahrplan').select().where({id: connectionId}).first();
    }

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
        const pdf = await tourPdf({tour, connection: mapConnectionToFrontend(connection, datum), connectionReturn: mapConnectionReturnToFrontend(connectionReturn, datum), datum, connectionReturns});
        // console.log("L1019 tours /tourPdfWrapper / pdf value :", !!pdf); // value : true
        if(!!pdf){
            console.log("L1022 tours.js : fileName passed to tourPdfWrapper : ", "Zuugle_" + tour.title.replace(/ /g, '') + ".pdf")
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
            let filePathMain = replaceFilePath(path.join(__dirname, BASE_PATH, `/public/gpx/${entry.provider}_${entry.hashed_url}.gpx`));
            let filePathAbreise = replaceFilePath(path.join(__dirname, BASE_PATH, `/public/gpx-track/fromtour_track_${keyAbreise}.gpx`));
            let filePathAnreise = replaceFilePath(path.join(__dirname, BASE_PATH, `/public/gpx-track/totour_track_${keyAnreise}.gpx`));

            const xml = await mergeGpxFilesToOne(filePathMain, filePathAnreise, filePathAbreise);
            if(!!xml){
                res.status(200).send(xml);
            } else {
                res.status(400).json({success: false});
            }

        } else {
            let filePath = path.join(__dirname, BASE_PATH, `/public/gpx/${entry.provider}_${entry.hashed_url}.gpx`);
            if(type == "abreise" && !!key){
                filePath = path.join(__dirname, BASE_PATH, `/public/gpx-track/fromtour_track_${key}.gpx`);
            } else if(type == "anreise" && !!key){
                filePath = path.join(__dirname, BASE_PATH, `/public/gpx-track/totour_track_${key}.gpx`);
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
    // console.log("L1604: prepare tourentry: entry.provider:", entry.provider);
    // entry.hashed_url ? console.log("L1604: prepare tourentry: entry.hashed_url:", entry.hashed_url) : console.log("entry.hashed_url is falsy")
    entry.gpx_file = `${getHost(domain)}/public/gpx/${entry.provider}_${entry.hashed_url}.gpx`;
    entry.gpx_image_file = `${getHost(domain)}/public/gpx-image/${entry.provider}_${entry.hashed_url}_gpx.jpg`;
    entry.gpx_image_file_small = `${getHost(domain)}/public/gpx-image/${entry.provider}_${entry.hashed_url}_gpx_small.jpg`;
    if(!!addDetails){
        if(!!city && !!entry.cities_object[city] && !!entry.cities_object[city].total_tour_duration){
            entry.total_tour_duration = entry.cities_object[city].total_tour_duration
        } else {
            entry.total_tour_duration = entry.duration;
        }

        if(!!city){
            // !!domain && console.log("tours.js L1046, domain:",domain);
            const toTour = await knex('fahrplan').select('totour_track_key').where({hashed_url: entry.hashed_url, tour_provider: entry.provider, city_slug: city}).whereNotNull('totour_track_key').first();
            const fromTour = await knex('fahrplan').select('fromtour_track_key').where({hashed_url: entry.hashed_url, tour_provider: entry.provider, city_slug: city}).whereNotNull('fromtour_track_key').first();

            if(!!toTour && !!toTour.totour_track_key){
                entry.totour_gpx_file = `${getHost(domain)}/public/gpx-track/totour_track_${toTour.totour_track_key}.gpx`;
            }
            if(!!fromTour && !!fromTour.fromtour_track_key){
                entry.fromtour_gpx_file = `${getHost(domain)}/public/gpx-track/fromtour_track_${fromTour.fromtour_track_key}.gpx`;
            }
        }

        /** add provider_name to result */
        let provider_result = await knex('provider').select('provider_name').where({provider: entry.provider}).first();
        entry.provider_name = provider_result.provider_name;

        // convert the "difficulty" value into a text value 
        entry.difficulty = convertDifficulty(entry.difficulty)
        
        // console.log('entry.difficulty value :',entry.difficulty);
    }
    return entry;
}

export default router;

