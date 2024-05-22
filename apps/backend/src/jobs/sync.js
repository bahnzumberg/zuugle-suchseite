import knexTourenDb from "../knexTourenDb";
import knex from "../knex";
import {createImagesFromMap} from "../utils/gpx/gpxUtils";
import {round} from "../utils/utils";
import moment from "moment";
import {hashString, minutesFromMoment} from "../utils/helper";
const { create, builder } = require('xmlbuilder2');
const fs = require('fs-extra');
const path = require('path');
import pLimit from 'p-limit';
import logger from "../utils/logger";

async function update_tours_from_tracks() {
    // Fill the two columns connection_arrival_stop_lat and connection_arrival_stop_lon with data
    await knex.raw(`UPDATE tour AS t
    SET connection_arrival_stop_lat = a.lat,
    connection_arrival_stop_lon = a.lon
    FROM (SELECT
        f.id,
        f.lon,
        f.lat,
        ROW_NUMBER () OVER ( PARTITION BY f.id ORDER BY f.count_num DESC ) AS row_number
        FROM
            (SELECT 
            tour.id,
            t.track_point_lon AS lon,
            t.track_point_lat AS lat,
            COUNT(*) AS count_num
            FROM tour
            INNER JOIN fahrplan AS f
            ON f.hashed_url=tour.hashed_url
            INNER JOIN tracks AS t
            ON f.totour_track_key=t.track_key
            AND t.track_point_sequence=1
            GROUP BY tour.id, t.track_point_lon, t.track_point_lat) AS f
        GROUP BY f.id, f.lon, f.lat, f.count_num) AS a
    WHERE a.row_number=1
    AND a.id=t.id`);
}

export async function fixTours(){
    // For the case, that the load of table fahrplan did not work fully and not for every tour
    // datasets are in table fahrplan available, we delete as a short term solution all
    // tours, which have no datasets in table fahrplan.
    // await knex.raw(`DELETE FROM tour WHERE CONCAT(provider, hashed_url) NOT IN (SELECT CONCAT(tour_provider, hashed_url) FROM fahrplan GROUP BY tour_provider, hashed_url);`);
    await knex.raw(`DELETE FROM tour WHERE hashed_url NOT IN (SELECT hashed_url FROM fahrplan GROUP BY hashed_url);`);
    

    await knex.raw(`UPDATE tour SET search_column = to_tsvector( 'german', full_text ) WHERE text_lang='de';`);
    await knex.raw(`UPDATE tour SET search_column = to_tsvector( 'english', full_text ) WHERE text_lang ='en';`);
    await knex.raw(`UPDATE tour SET search_column = to_tsvector( 'italian', full_text ) WHERE text_lang ='it';`);
    await knex.raw(`UPDATE tour SET search_column = to_tsvector( 'simple', full_text ) WHERE text_lang ='sl';`);
    await knex.raw(`UPDATE tour SET search_column = to_tsvector( 'french', full_text ) WHERE text_lang ='fr';`);

    await knex.raw(`DELETE FROM city WHERE city_slug NOT IN (SELECT DISTINCT city_slug FROM fahrplan);`);

    // This step creates a table, which establishes the connection between cities and tours.
    // 1. You can filter on all tours reachable from this city (by filtering on city_slug).
    // 2. You can filter on all tours reachable from all cities in this country (by filtering on reachable_from_country).
    await knex.raw(`TRUNCATE city2tour;`);
    await knex.raw(`INSERT INTO city2tour 
                    SELECT DISTINCT
                    tour.id AS tour_id,
                    tour.provider,
                    tour.hashed_url,
                    city.city_slug,
                    UPPER(city.city_country) AS reachable_from_country
                    FROM city
                    INNER JOIN fahrplan
                    ON fahrplan.city_slug=city.city_slug
                    INNER JOIN tour
                    ON tour.hashed_url=fahrplan.hashed_url
                    WHERE fahrplan.city_any_connection='yes'`);

    await knex.raw(`UPDATE city2tour AS c SET min_connection_duration = i.min_connection_dur
                    FROM (
                    SELECT 
                    f.tour_provider AS provider,
                    f.hashed_url,
                    f.city_slug,
                    EXTRACT(EPOCH FROM MIN(f.best_connection_duration))/60 AS min_connection_dur
                    FROM fahrplan AS f
                    WHERE f.city_any_connection='yes'
                    GROUP BY f.tour_provider, f.hashed_url, f.city_slug
                    ) AS i
                    WHERE i.hashed_url=c.hashed_url
                    AND i.city_slug=c.city_slug`);
                             

    // Fill the two columns connection_arrival_stop_lat and connection_arrival_stop_lon with data
    await update_tours_from_tracks();

    // Delete all the entries from logsearchphrase, which are older than 360 days.
    await knex.raw(`DELETE FROM logsearchphrase WHERE search_time < NOW() - INTERVAL '360 days';`);


    // All files, which are older than 30 days, are deleted now. This means they have to be 
    // recreated new and by this we ensure all is updated and unused files are removed.  
    let proddevPath = "../";
    if(process.env.NODE_ENV != "production"){
        proddevPath = "../../";
    }
    deleteFilesOlder30days(path.join(__dirname, proddevPath, "public/gpx/"));
    deleteFilesOlder30days(path.join(__dirname, proddevPath, "public/gpx-image/"));
    deleteFilesOlder30days(path.join(__dirname, proddevPath, "public/gpx-image-with-track/"));
    deleteFilesOlder30days(path.join(__dirname, proddevPath, "public/gpx-track/"));
}


const deleteFilesOlder30days = (dirPath) => {
    // if the directory does not exist, create it
    if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath);
    }
    
    let commandline = "find "+ dirPath + " -maxdepth 2 -mtime +30 -type f -delete";
    const { exec } = require('child_process');
    exec(commandline, (err, stdout, stderr) => {
        if (err) {
            // node couldn't execute the command
            return;
        }

        // the *entire* stdout and stderr (buffered)
        // logger(`deleteFilesOlder30days stdout: ${stdout}`);
        // logger(`deleteFilesOlder30days stderr: ${stderr}`);
    });
}



export async function writeKPIs(){
    await knex.raw(`DELETE FROM kpi WHERE kpi.name='total_tours';`);
    await knex.raw(`INSERT INTO kpi SELECT 'total_tours', COUNT(id) FROM tour;`);

    await knex.raw(`DELETE FROM kpi WHERE kpi.name LIKE 'total_tours_%';`);
    await knex.raw(`INSERT INTO kpi SELECT 
                                    CONCAT('total_tours_', f.city_slug) AS NAME, 
                                    COUNT(DISTINCT t.id) AS VALUE
                                    FROM fahrplan AS f
                                    INNER JOIN tour AS t
                                    ON f.hashed_url=t.hashed_url
                                    GROUP BY f.city_slug;`);

    await knex.raw(`DELETE FROM kpi WHERE kpi.name='total_connections';`);
    await knex.raw(`INSERT INTO kpi SELECT 'total_connections', COUNT(id) FROM fahrplan;`);

    await knex.raw(`DELETE FROM kpi WHERE kpi.name='total_ranges';`);
    await knex.raw(`INSERT INTO kpi SELECT 'total_ranges', COUNT(DISTINCT range) FROM tour;`);

    await knex.raw(`DELETE FROM kpi WHERE kpi.name='total_cities';`);
    await knex.raw(`INSERT INTO kpi SELECT 'total_cities', COUNT(DISTINCT city_slug) FROM city;`);

    await knex.raw(`DELETE FROM kpi WHERE kpi.name='total_provider';`);
    await knex.raw(`INSERT INTO kpi SELECT 'total_provider', COUNT(DISTINCT provider) FROM tour;`);

    
    // Unrelated to the KPIs, but the old disposable links have to be deleted as well
    await knex.raw(`DELETE FROM disposible WHERE calendar_date < now() - INTERVAL '10 DAY';`);
}


export async function getProvider(){
    await knex.raw(`TRUNCATE provider;`);
    var query_result;
    try {
        query_result = await knexTourenDb('vw_provider_to_search').select();
    }
    catch(err){
        console.log('error: ', err)
        return false;
    }
    if(!!query_result && query_result.length > 0){
        for(let i=0; i<query_result.length; i++){
            const entry = query_result[i];

            try {
                const query = knex('provider').insert({
                    provider: entry.provider,
                    provider_name: entry.provider_name,
                    allow_gpx_download: entry.allow_gpx_download,
                });

                await query;
            } catch(err){
                console.log('error: ', err)
                return false;
            }
        }
    }
}


export async function generateTestdata(){
    try {
        await knex.raw(`DELETE FROM logsearchphrase WHERE phrase LIKE 'TEST%';`);
    
        /* Testdata into logsearchphrase */
        await knex.raw(`INSERT INTO logsearchphrase (phrase, num_results, city_slug, menu_lang, country_code) VALUES ('TEST Troppberg', 4,'wien', 'it', 'IT');`);
        await knex.raw(`INSERT INTO logsearchphrase (phrase, num_results, city_slug, menu_lang, country_code) VALUES ('TEST Schneeberg', 0,'linz', 'de', 'AT');`);
        await knex.raw(`INSERT INTO logsearchphrase (phrase, num_results, city_slug, menu_lang, country_code) VALUES ('TEST Tragöß', 3,'muenchen', 'de', 'DE');`);
        await knex.raw(`INSERT INTO logsearchphrase (phrase, num_results, city_slug, menu_lang, country_code) VALUES ('TEST langbathsee', 5,'wien', 'de', 'AT');`);
        await knex.raw(`INSERT INTO logsearchphrase (phrase, num_results, city_slug, menu_lang, country_code) VALUES ('TEST langbathseen', 6,'salzburg', 'de', 'AT');`);
        await knex.raw(`INSERT INTO logsearchphrase (phrase, num_results, city_slug, menu_lang, country_code) VALUES ('TEST lainz', 1,'bozen', 'it', 'IT');`);
        await knex.raw(`INSERT INTO logsearchphrase (phrase, num_results, city_slug, menu_lang, country_code) VALUES ('TEST linz', 2,'ljubljana', 'sl', 'SI');`);
        await knex.raw(`INSERT INTO logsearchphrase (phrase, num_results, city_slug, menu_lang, country_code) VALUES ('TEST klettersteig', 34,'wien', 'fr', 'AT');`);
        await knex.raw(`INSERT INTO logsearchphrase (phrase, num_results, city_slug, menu_lang, country_code) VALUES ('TEST Hase', 0,'wien', 'it', 'AT');`);
        await knex.raw(`INSERT INTO logsearchphrase (phrase, num_results, city_slug, menu_lang, country_code) VALUES ('TEST Dachstein', 3,'linz', 'de', 'AT');`);
        await knex.raw(`INSERT INTO logsearchphrase (phrase, num_results, city_slug, menu_lang, country_code) VALUES ('TEST Edelweisshütte', 5,'muenchen', 'de', 'DE');`);
        await knex.raw(`INSERT INTO logsearchphrase (phrase, num_results, city_slug, menu_lang, country_code) VALUES ('TEST hihi', 3,'wien', 'de', 'AT');`);
        await knex.raw(`INSERT INTO logsearchphrase (phrase, num_results, city_slug, menu_lang, country_code) VALUES ('TEST Skitour', 2,'salzburg', 'de', 'AT');`);
        await knex.raw(`INSERT INTO logsearchphrase (phrase, num_results, city_slug, menu_lang, country_code) VALUES ('TEST Skitour', 4,'bozen', 'it', 'IT');`);
        await knex.raw(`INSERT INTO logsearchphrase (phrase, num_results, city_slug, menu_lang, country_code) VALUES ('TEST Hütte', 5,'ljubljana', 'sl', 'SI');`);
        await knex.raw(`INSERT INTO logsearchphrase (phrase, num_results, city_slug, menu_lang, country_code) VALUES ('TEST Klettern', 1,'wien', 'fr', 'AT');`);
    } catch(err){
        console.log('error: ', err);
        return false;
    }
}



async function _syncConnectionGPX(key, fileName, title, count_tracks_num){
    return new Promise(async resolve => {
        let filePath = '';
        if(process.env.NODE_ENV == "production"){
            filePath = path.join(__dirname, "../", fileName);
        } else {
            filePath = path.join(__dirname, "../../", fileName);
        }

        if(!!key){
            let trackPoints = null;
            if (!!!fs.existsSync(filePath)) {
                if(process.env.NODE_ENV == "production"){
                    // We enter this section on prod, uat and dev
                    if (count_tracks_num > 100000) {
                        // On production the table tracks will be already updated in the PostgreSQL database.
                        trackPoints = await knex('tracks').select().where({track_key: key}).orderBy('track_point_sequence', 'asc');
                    }
                    else {
                        // On UAT, DEV we do not need the table tracks, so we fetch the data directly from the MySQL database.
                        trackPoints = await knexTourenDb('vw_tracks_to_search').select().where({track_key: key}).orderBy('track_point_sequence', 'asc');
                        
                        // As we are fetching tracks just now, we have to set lat and lon of startingpoint in table tours
                        update_tours_from_tracks();
                    }                   
                }
                else {
                    // On DEV
                    trackPoints = await knexTourenDb('vw_tracks_to_search').select().where({track_key: key}).orderBy('track_point_sequence', 'asc');
                    
                    // As we are fetching tracks just now, we have to set lat and lon of startingpoint in table tours
                    update_tours_from_tracks();
                }


                if(!!trackPoints && trackPoints.length > 0){
                    await createFileFromGpx(trackPoints, filePath, title, 'track_point_lat', 'track_point_lon', 'track_point_elevation');
                }
            }
        }
        resolve();
    })
}

export async function syncConnectionGPX(mod=null){
    const _limit = pLimit(20);

    let count_tracks = await knex.raw(`SELECT COUNT(*) AS row_count FROM tracks`);
    let count_tracks_num = parseInt(count_tracks.rows[0].row_count, 10);


    if(mod === 'dev'){
        knex.raw('TRUNCATE TABLE tracks').catch(err =>console.error("Error truncating table tracks:", err))
    }
    const toTourFahrplan = await knex('fahrplan').select(['totour_track_key']).whereNotNull('totour_track_key').groupBy('totour_track_key');
    if(!!toTourFahrplan){
        const promises = toTourFahrplan.map(entry => {
            return _limit(() => _syncConnectionGPX(entry.totour_track_key, 'public/gpx-track/totour_track/' + last_two_characters(entry.totour_track_key) + entry.totour_track_key + '.gpx', 'Station zur Tour', count_tracks_num))
        });
        await Promise.all(promises);
    }

    const fromTourFahrplan = await knex('fahrplan').select(['fromtour_track_key']).whereNotNull('fromtour_track_key').groupBy('fromtour_track_key');
    if(!!fromTourFahrplan) {
        const promises = fromTourFahrplan.map(entry => {
            return _limit(() =>  _syncConnectionGPX(entry.fromtour_track_key, 'public/gpx-track/fromtour_track/' + last_two_characters(entry.fromtour_track_key) + entry.fromtour_track_key + '.gpx', 'Tour zur Station', count_tracks_num))
        });
        await Promise.all(promises);
    }

    return true;
}

export async function syncGPX(){
    const allTours = await knex('tour').select(["title", "hashed_url", "provider"]).distinct();
    if(!!allTours && allTours.length > 0){
        const _limit = pLimit(20);
        const promises = allTours.map(entry => {
            return _limit(() => _syncGPX(entry.provider, entry.hashed_url, entry.title));
        });
        await Promise.all(promises);
    }
    return true;

}

export async function syncGPXImage(){
    // let allHashedUrls = await knex.raw("SELECT CONCAT(provider,'_',hashed_url) as hashed_url FROM tour;");
    let allHashedUrls = await knex.raw("SELECT DISTINCT hashed_url FROM tour;");
    if(!!allHashedUrls && allHashedUrls.rows){
        allHashedUrls = allHashedUrls.rows;
        let toCreate = [];
        for(let i=0;i<allHashedUrls.length;i++){
            let entry = allHashedUrls[i];
            toCreate.push({
                hashed_url: entry.hashed_url,
            })
        }
        if(!!toCreate){
            await createImagesFromMap(toCreate.map(e => e.hashed_url));
        }
    }
    return true;

}

function last_two_characters(h_url) {
    const hashed_url = h_url.toString();
    if (hashed_url.length >= 2) {
        return hashed_url.substr(hashed_url.length - 2).toString();
    }
    else {
        return "undefined";
    }
}

async function _syncGPX(prov, h_url, title){
    return new Promise(async resolve => {
        try {
            let fileName = h_url + '.gpx';
            let filePath = '';
            if(process.env.NODE_ENV == "production"){
                filePath = path.join(__dirname, "../", "public/gpx/", last_two_characters(h_url), "/");
            } else {
                filePath = path.join(__dirname, "../../", "public/gpx/", last_two_characters(h_url), "/");
            }

            if (!fs.existsSync(filePath)){
                fs.mkdirSync(filePath);
            }

            let filePathName = filePath + fileName;
            if (!!!fs.existsSync(filePathName)) {
                const waypoints = await knex('gpx').select().where({hashed_url: h_url}).orderBy('waypoint');
                if(!!waypoints && waypoints.length > 0 && !!filePathName){
                    await createFileFromGpx(waypoints, filePathName, title);
                }
            } 
        } catch(err) {
            console.error(err)
        }

        resolve();
    })
}

async function createFileFromGpx(data, filePath, title, fieldLat = "lat", fieldLng = "lon", fieldEle = "ele"){
    if(!!data){
      
        const root = create({ version: '1.0' })
            .ele('gpx', { version: "1.1", xmlns: "http://www.topografix.com/GPX/1/1", "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance" })
            .ele('trk')
            .ele('name').txt(title).up()
            .ele('trkseg');

        data.forEach(wp => {
            root.ele('trkpt', {lat: wp[fieldLat], lon: wp[fieldLng]})
                .ele('ele').txt(wp[fieldEle]);
        });

        const xml = root.end({ prettyPrint: true });
        if(!!xml){
            await fs.writeFileSync(filePath, xml);
        }
    }
}


export async function syncGPXdata(mode='dev'){
    if(mode=='prod'){
        // On production the table gpx has been already loaded 
        console.log('Skipping this step, as we are on production.');
        return true;
    }


    // As we do a full load of the table "gpx" here, we empty it completely and fill it up afterwards
    try {
        await knex.raw(`TRUNCATE gpx;`);
    } catch(err){
        console.log('error: ', err)
    }

    let limit = 5000;
    const query_count = await knexTourenDb('vw_gpx_to_search').count('* as anzahl'); 
    let count_gpx = query_count[0]["anzahl"];
    let count_chunks = Math.ceil(count_gpx / limit, 0);
    let counter = 0;

    console.log('Info: Handling', count_gpx.toLocaleString("de-de"), 'rows with gpx datapoints via ', count_chunks, ' chunks.');

    while(counter < count_chunks){
        const result_query = knexTourenDb('vw_gpx_to_search').select('provider', 'hashed_url', 'typ', 'waypoint', 'lat', 'lon', 'ele').whereRaw(`ROUND(lat*lon*10000) % ${count_chunks} = ${counter}`);
        const result = await result_query;
            
        try {
            await knex('gpx').insert([...result]);
        } catch(err){
            console.log('error syncGPXdata: ', err)
        }
        counter++;
    }
}


export async function syncFahrplan(mode='dev'){
    if(mode=='prod'){
        // On production the table fahrplan has been already loaded 
        console.log('Skipping this step, as we are on production.');
        return true;
    }
    
    try {
        await knex.raw(`TRUNCATE fahrplan;`);
    } catch(err){
        console.log('error: ', err)
    }
    
    // Now add new lines
    let limit = 1000; // not more than 5000;
    let counter = 0;
    const _limit = pLimit(3);
    let bundles = [];
    
    let trigger_id_min_array = [];
    let trigger_id_max_array = [];
    let chunksizer = 0;
    let count_tours = 0;

    let trigger_id_min = 0;
    let trigger_id_max = 0;
    try {
        const query_add_min = knexTourenDb('vw_fplan_to_search').min('trigger_id');
        const query_add_max = knexTourenDb('vw_fplan_to_search').max('trigger_id');
        trigger_id_min_array = await query_add_min;
        trigger_id_max_array = await query_add_max;
        trigger_id_min = trigger_id_min_array[0]['min(`trigger_id`)']
        trigger_id_max = trigger_id_max_array[0]['max(`trigger_id`)'];
    } catch(err){
        console.log('error: ', err);
    }

    const query_count = await knexTourenDb('vw_fplan_to_search').count('* as anzahl'); 
    count_tours = query_count[0]["anzahl"];
    chunksizer = Math.ceil( count_tours / limit, 0 );
    if (isNaN(chunksizer) || chunksizer < 1) { 
        chunksizer = 1;
    }

    console.log('Info: Handling ', count_tours.toLocaleString("de-de"), ' rows fplan data.');
    while (counter < chunksizer) {
        bundles.push({
            leftover: counter,
            chunksizer: chunksizer
        });
        counter++;
    }

    // remove all indizes from PostgreSQL table "fahrplan" for quicker inserts
    try {
        await knex.raw(`DROP INDEX IF EXISTS public.fahrplan_best_connection_duration_idx;`);
        await knex.raw(`DROP INDEX IF EXISTS public.fahrplan_city_slug_idx;`);
        await knex.raw(`DROP INDEX IF EXISTS public.fahrplan_connection_duration_idx;`);
        await knex.raw(`DROP INDEX IF EXISTS public.fahrplan_fromtour_track_duration_idx;`);
        await knex.raw(`DROP INDEX IF EXISTS public.fahrplan_fromtour_track_key_idx;`);
        await knex.raw(`DROP INDEX IF EXISTS public.fahrplan_hashed_url_idx;`);
        await knex.raw(`DROP INDEX IF EXISTS public.fahrplan_hashed_url_provider_idx;`);
        await knex.raw(`DROP INDEX IF EXISTS public.fahrplan_totour_track_duration_idx;`);
        await knex.raw(`DROP INDEX IF EXISTS public.fahrplan_totour_track_key_idx;`);
        await knex.raw(`DROP INDEX IF EXISTS public.fahrplan_provider_hashed_url_city_slug_idx;`);
        await knex.raw(`DROP INDEX IF EXISTS public.fahrplan_tour_provider_idx;`);
        await knex.raw(`DROP INDEX IF EXISTS public.fahrplan_weekday_type_idx;`);
    } catch(err){
        console.log('error: ', err);
    }

    const promises_add = bundles.map(bundle => {
        return _limit(() => readAndInsertFahrplan(bundle));
    });
    await Promise.all(promises_add);


    // set all indizes on PostgreSQL table "fahrplan" again
    try{
        await knex.raw(`CREATE INDEX ON fahrplan (hashed_url);`);
        await knex.raw(`CREATE INDEX ON fahrplan (totour_track_key);`);
        await knex.raw(`CREATE INDEX ON fahrplan (fromtour_track_key);`);
        await knex.raw(`CREATE INDEX ON fahrplan (best_connection_duration);`);
        await knex.raw(`CREATE INDEX ON fahrplan (totour_track_duration);`);
        await knex.raw(`CREATE INDEX ON fahrplan (fromtour_track_duration);`);
        await knex.raw(`CREATE INDEX ON fahrplan (city_slug);`);
    } catch(err){
        console.log('error: ', err);
    }
}




const readAndInsertFahrplan = async (bundle) => {
    let insert_sql = '';
    let mysql_sql = '';

    return new Promise(async resolve => {
        mysql_sql = `select 
                        provider,
                        hashed_url, 
                        CONCAT(DATE_FORMAT(calendar_date, '%Y-%m-%d'), ' 00:00:00') as calendar_date,
                        weekday, date_any_connection,
                        city_slug, 
                        city_name, 
                        city_any_connection, 
                        best_connection_duration,
                        connection_rank, 
                        DATE_FORMAT(connection_departure_datetime, '%Y-%m-%d %H:%i:%s') as connection_departure_datetime, 
                        connection_duration, 
                        connection_no_of_transfers,
                        DATE_FORMAT(connection_arrival_datetime, '%Y-%m-%d %H:%i:%s') as connection_arrival_datetime,
                        connection_returns_trips_back, 
                        connection_returns_min_waiting_duration, connection_returns_max_waiting_duration, 
                        connection_returns_warning_level, 
                        connection_returns_warning,  
                        return_row, 
                        return_waiting_duration, 
                        DATE_FORMAT(return_departure_datetime, '%Y-%m-%d %H:%i:%s') as return_departure_datetime, 
                        return_duration,
                        return_no_of_transfers,
                        DATE_FORMAT(return_arrival_datetime, '%Y-%m-%d %H:%i:%s') as return_arrival_datetime, 
                        totour_track_key, totour_track_duration,  
                        fromtour_track_key,
                        fromtour_track_duration, 
                        REPLACE(REPLACE(connection_description_json, '\n', ''), "'", "´") as connection_description_json,
                        DATE_FORMAT(connection_lastregular_arrival_datetime, '%Y-%m-%d %H:%i:%s') as connection_lastregular_arrival_datetime, 
                        REPLACE(REPLACE(return_description_json, '\n', ''), "'", "´") as return_description_json,
                        DATE_FORMAT(return_firstregular_departure_datetime, '%Y-%m-%d %H:%i:%s') as return_firstregular_departure_datetime
                        FROM vw_fplan_to_search 
                        WHERE trigger_id % ${bundle.chunksizer} = ${bundle.leftover} 
                        AND calendar_date >= CURRENT_DATE
                        AND connection_description_json NOT LIKE '%""%'
                        AND return_description_json NOT LIKE '%""%'`
        const result_query = knexTourenDb.raw(mysql_sql);
        const result = await result_query;

        let data = result[0].map(row => ({ ...row }));

        // !!data && Array.isArray(data) && console.log("L557 data[0]:", data[0])
        
        if (!!data && Array.isArray(data) && data.length > 0) {
            insert_sql = `INSERT INTO fahrplan (tour_provider,
                                            hashed_url,
                                            calendar_date, 
                                            weekday, 
                                            date_any_connection,
                                            city_slug, 
                                            city_name, 
                                            city_any_connection, 
                                            best_connection_duration,
                                            connection_rank, 
                                            connection_departure_datetime,
                                            connection_duration, 
                                            connection_no_of_transfers,
                                            connection_arrival_datetime,
                                            connection_returns_trips_back,
                                            connection_returns_min_waiting_duration, 
                                            connection_returns_max_waiting_duration,
                                            connection_returns_warning_level,
                                            connection_returns_warning, 
                                            return_row,
                                            return_waiting_duration,
                                            return_departure_datetime,
                                            return_duration,
                                            return_no_of_transfers,
                                            return_arrival_datetime,
                                            totour_track_key,
                                            totour_track_duration, 
                                            fromtour_track_key,
                                            fromtour_track_duration,
                                            connection_description_json,
                                            connection_lastregular_arrival_datetime,
                                            return_description_json,
                                            return_firstregular_departure_datetime) VALUES `;
 

            for (let i = 0; i < data.length; i++) {
                insert_sql += '(';

                Object.keys(data[i]).forEach(column => {
                    //check the type of each column
                    const col_value = data[i][column];

                    if (col_value === null || col_value === undefined) {
                        // case of  null or undefined
                        insert_sql += 'NULL';
                    } else if (column == 'connection_description_json' || column == 'return_description_json') {
                        insert_sql += "'";
                        insert_sql += col_value.replaceAll("'", '"');
                        insert_sql += "'";
                    } else {
                        insert_sql += "'"+col_value+"'";
                    }

                    if (column !== 'return_firstregular_departure_datetime') {
                        insert_sql += ', ';
                    }
                }
                );
                insert_sql += ')';
                if (i < data.length - 1) {
                    insert_sql += ', ';
                }
            }   

            try {
                await knex.raw(insert_sql);
                resolve(true);
            } catch (err) {
                logger('############### Error with this SQL ###############');
                logger(`Insert sql into fahrplan table: ${insert_sql}`);
                logger('############### End of error with this SQL ###############');
                resolve(false);
            }
        } else {
            resolve();
        }
    });
};



const readAndInsertFahrplan_del = (bundle, where = {}) => {
    return new Promise(async resolve => {
        const result = await knexTourenDb('vw_fplan_to_search').select('trigger_id').where(where).andWhere('trigger_id', '>=', bundle.from).andWhere('trigger_id', '<', bundle.to);
        if(!!result && result.length > 0){
            await insertFahrplanMultiple_del(result);
        }
        resolve();
    })
}


const insertFahrplanMultiple = async (entries) => {

    let attrToRemove = [
        "trigger_datetime",
        "tour_duration",
        "tour_hiking_days",
        "tour_title",
        "delta_type",
    ];


    let _entries = entries.map(entry => {
        attrToRemove.forEach(attr => {
            delete entry[attr];
        });

        if(!!entry.trigger_id){
            entry.id = ""+entry.trigger_id;
            delete entry.trigger_id;
        }

        if (!!entry.provider) {
            entry = {
                ...entry, 
                tour_provider: entry.provider, 
            };
            delete entry.provider; // Delete the original "provider" property
        }

        return entry;
    });

    try {
        await knex.raw(knex('fahrplan').insert([..._entries]).toString()+" ON CONFLICT(id) DO NOTHING");
        return true;
    } catch(err){
        console.log('error insertFahrplanMultiple: ', err)
        return false;
    }
}


const insertFahrplanMultiple_del = async (entries) => {

    let _entries = entries.map(entry => {
        if(!!entry.trigger_id){
            entry.id = ""+entry.trigger_id;
            delete entry.trigger_id;
        }
        return entry;
    });

    try {
        await knex('fahrplan_del').insert([..._entries]);
        return true;
    } catch(err){
        console.log('error: ', err)
        return false;
    }
}


export async function syncTours(){
    // Set Maintenance mode for Zuugle (webpage is disabled)
    await knex.raw(`UPDATE kpi SET VALUE=0 WHERE name='total_tours';`);

    // Table tours will be rebuild from scratch
    await knex.raw(`TRUNCATE tour;`);

    let limit = 500;
    let offset = 0;
    let counter = 0;
    const countResult = await knexTourenDb('vw_touren_to_search').count('* as anzahl');

    let count = 0;
    if(!!countResult && countResult.length == 1 && countResult[0]["anzahl"]){
        count = countResult[0]["anzahl"];
    }

    while((counter *  limit) <= count){
        const query = knexTourenDb.raw(`SELECT
                                        t.id,
                                        t.url,
                                        t.provider,
                                        t.hashed_url,
                                        t.description,
                                        t.country,
                                        t.state,
                                        t.range_slug,
                                        t.range_name,
                                        t.image_url,
                                        t.ascent,
                                        t.descent,
                                        t.difficulty,
                                        t.duration,
                                        t.distance,
                                        t.title,
                                        t.typ,
                                        t.number_of_days,
                                        t.traverse,
                                        t.season,
                                        t.jan,
                                        t.feb,
                                        t.mar,
                                        t.apr,
                                        t.may,
                                        t.jun,
                                        t.jul,
                                        t.aug,
                                        t.sep,
                                        t.oct,
                                        t.nov,
                                        t.dec,
                                        t.full_text,
                                        t.quality_rating,
                                        t.user_rating_avg,
                                        t.difficulty_orig,
                                        t.text_lang,
                                        t.lat_start,
                                        t.lon_start,
                                        t.lat_end,
                                        t.lon_end,
                                        t.maxele
                                        from vw_touren_to_search as t limit ${limit} offset ${offset};`);

        const result = await query;
        if(!!result && result.length > 0 && result[0].length > 0){
            bulk_insert_tours(result[0]);
        }
        offset = offset + limit;
        counter++;
    }
}

export async function mergeToursWithFahrplan(){
    const cities = await knex('city').select();
    const tours = await knex('tour').select(['hashed_url', 'duration']);
    
    if(!!tours){

        for(let i=0;i<tours.length;i++){

            let entry = tours[i];
            let fahrplan = await knex('fahrplan').select(['city_slug']).where({hashed_url: entry.hashed_url}).groupBy('city_slug');
            if(!!fahrplan && fahrplan.length > 0){
                await Promise.all(fahrplan.map(fp => new Promise(async resolve => {

                    let durations = {};
                    // let connections = await knex('fahrplan').min(['connection_duration']).select(["weekday_type"]).where({hashed_url: entry.hashed_url, city_slug: fp.city_slug}).andWhereNot("connection_duration", null).groupBy('weekday_type');
                    let connections = await knex.raw("SELECT min(connection_duration) as min, CASE WHEN (weekday='mon' OR weekday='thu' OR weekday= 'wed' OR weekday= 'fri') THEN 'weekday' ELSE weekday END as weekday_type FROM fahrplan WHERE hashed_url='${entry.hashed_url}' AND city_slug='${fp.city_slug}' AND connection_duration IS NOT NULL GROUP BY 2")
                    if(!!connections && connections.length > 0){
                        connections.forEach(con => {
                            durations[con.weekday_type] = minutesFromMoment(moment(con.min, "HH:mm:ss"))
                        })
                    }

                    const values = await knex('fahrplan')
                        .avg('fromtour_track_duration as avg_fromtour_track_duration')
                        .avg('totour_track_duration as avg_totour_track_duration')
                        .min('best_connection_duration as min_best_connection_duration')
                        .where({hashed_url: entry.hashed_url, city_slug: fp.city_slug})
                        .andWhereNot("connection_duration", null)
                        .andWhereNot('fromtour_track_duration', null)
                        .andWhereNot('totour_track_duration', null)
                        .andWhereNot('best_connection_duration', null)
                        .first();

                    fp.best_connection_duration = !!values ? minutesFromMoment(moment(values.min_best_connection_duration, "HH:mm:ss")) : undefined;
                    fp.durations = durations;

                    fp.total_tour_duration = round((
                        Number(entry.duration)
                        + getDurationValue(values.avg_totour_track_duration)
                        + getDurationValue(values.avg_fromtour_track_duration)), 2);
                    resolve(fp);
                })));

                let fahrplanObject = {}
                fahrplan.forEach(fp => {
                    fahrplanObject[fp.city_slug] = {
                        durations: {...fp.durations},
                        best_connection_duration: fp.best_connection_duration,
                        total_tour_duration: Math.ceil(fp.total_tour_duration / 0.25) * 0.25
                    };
                })

                await knex('tour').update({
                    cities: JSON.stringify(fahrplan),
                    cities_object: JSON.stringify(fahrplanObject)
                })
                .where({hashed_url: entry.hashed_url});

            }
        }
    }
}

const getDurationValue = (value) => {
    let _valueMinutes = parsePostgresIntervalToMoment(value) / 60;
    if(_valueMinutes < 5){
        return 0;
    }
    return round(_valueMinutes / 60, 2);
}

const parsePostgresIntervalToMoment = (value) => {
    let result = 0; //seconds
    if(!!value && !!value.hours){
        result += value.hours * 60 * 60;
    }
    if(!!value && !!value.minutes){
        result += value.minutes * 60;
    }
    if(!!value && !!value.seconds){
        result += value.seconds;
    }
    return result;
}

const roundTo10 = (value) => {
    return Math.ceil(value / 10) * 10;
}

export async function syncCities(){
    const query = knexTourenDb('vw_cities_to_search').select();
    const result = await query;
    if(!!result && result.length > 0){
        for(let i=0; i<result.length; i++){
            await knex.raw(`insert into city values ('${result[i].city_slug}', '${result[i].city_name}', '${result[i].city_country}') ON CONFLICT (city_slug) DO NOTHING`);
        }
    }
    
}

const calcMonthOrder = (entry) => {
    // This function looks up the current month.
    // Then it takes the sorting fitting to the current month and calculates the sorting value.
    // This function is called to set the column "month_order" in tables "tour".
    // As the sorting is ASC, we need to return the best match as a low and the worst match as a high number.
 
    const d = new Date();
    let month = d.getMonth();

    let entryScore = 
        [{name: "jan", value: entry.jan},
        {name: "feb", value: entry.feb},
        {name: "mar", value: entry.mar},
        {name: "apr", value: entry.apr},
        {name: "may", value: entry.may},
        {name: "jun", value: entry.jun},
        {name: "jul", value: entry.jul},
        {name: "aug", value: entry.aug},
        {name: "sep", value: entry.sep},
        {name: "oct", value: entry.oct},
        {name: "nov", value: entry.nov},
        {name: "dec", value: entry.dec}];

    let MonthScore = [
        ['jan', 'feb', 'dec', 'mar', 'nov', 'apr', 'oct', 'may', 'sep', 'jun', 'aug', 'jul'],
        ['feb', 'jan', 'mar', 'apr', 'dec', 'may', 'nov', 'jun', 'oct', 'jul', 'sep', 'aug'], 
        ['mar', 'feb', 'apr', 'jan', 'may', 'jun', 'dec', 'jul', 'nov', 'aug', 'oct', 'sep'],
        ['apr', 'mar', 'may', 'feb', 'jun', 'jan', 'jul', 'aug', 'dec', 'sep', 'nov', 'oct'],
        ['may', 'apr', 'jun', 'mar', 'jul', 'feb', 'aug', 'jan', 'sep', 'oct', 'dec', 'nov'],
        ['jun', 'may', 'jul', 'apr', 'aug', 'mar', 'sep', 'feb', 'oct', 'jan', 'nov', 'dec'],
        ['jul', 'jun', 'aug', 'sep', 'may', 'oct', 'apr', 'nov', 'mar', 'feb', 'dec', 'jan'],
        ['aug', 'jul', 'sep', 'jun', 'oct', 'may', 'nov', 'apr', 'dec', 'jan', 'mar', 'feb'],
        ['sep', 'oct', 'aug', 'nov', 'jul', 'dec', 'jun', 'jan', 'may', 'feb', 'apr', 'mar'],
        ['oct', 'sep', 'nov', 'aug', 'dec', 'jan', 'jul', 'feb', 'jun', 'mar', 'may', 'apr'],
        ['nov', 'oct', 'dec', 'jan', 'sep', 'feb', 'aug', 'mar', 'jul', 'apr', 'jun', 'may'],
        ['dec', 'jan', 'nov', 'feb', 'oct', 'mar', 'sep', 'apr', 'aug', 'may', 'jul', 'jun']
    ];

    let Monthname = '';
    for(let i=0;i<=11;i++){
        Monthname = MonthScore[month][i];
        var Monthobject = entryScore.find(Monthvalue => Monthvalue.name === Monthname);

        if (Monthobject.value=='true') {
            return i;
        }
    }
    return 100;
}


const bulk_insert_tours = async (entries) => {
    let queries = [];

    for (let i=0; i<entries.length; i++) {
        let entry = entries[i];
        // if(entry.publishing_date == '0000-00-00'){
        //     delete entry['publishing_date'];
        // }

        let gpxData = [];
        if(entry.lat_start && entry.lon_start){
            gpxData.push({
                lat: entry.lat_start,
                lon: entry.lon_start,
                typ: "first"
            });
        }
        if(entry.lat_end && entry.lon_end){
            gpxData.push({
                lat: entry.lat_end,
                lon: entry.lon_end,
                typ: "last"
            });
        }
        entry.gpx_data = JSON.stringify(gpxData);

        queries.push({
            id: entry.id,
            url: entry.url,
            provider: entry.provider,
            hashed_url: entry.hashed_url,
            description: entry.description,
            image_url: entry.image_url,
            ascent: entry.ascent,
            descent: entry.descent,
            difficulty: entry.difficulty,
            difficulty_orig: entry.difficulty_orig,
            duration: entry.duration,
            distance: entry.distance,
            title: entry.title,
            type: entry.typ,
            country: entry.country,
            state: entry.state,
            range_slug: entry.range_slug,
            range: entry.range_name,
            season: entry.season,
            number_of_days: entry.number_of_days,
            jan: entry.jan,
            feb: entry.feb,
            mar: entry.mar,
            apr: entry.apr,
            may: entry.may,
            jun: entry.jun,
            jul: entry.jul,
            aug: entry.aug,
            sep: entry.sep,
            oct: entry.oct,
            nov: entry.nov,
            dec: entry.dec,
            month_order: calcMonthOrder(entry),
            traverse: entry.traverse,
            // publishing_date: entry.publishing_date,
            quality_rating: entry.quality_rating,
            user_rating_avg: entry.user_rating_avg,
            full_text: entry.full_text,
            gpx_data: entry.gpx_data,
            text_lang: entry.text_lang,
            max_ele: entry.maxele
        });
    }

    try {
        await knex('tour').insert(queries);
        return true;
    } catch(err){
        console.log('error: ', err)
        return false;
    }
}