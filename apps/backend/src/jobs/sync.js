import knexTourenDb from "../knexTourenDb";
import knex from "../knex";
import {createImagesFromMap, last_two_characters} from "../utils/gpx/gpxUtils";
import {round} from "../utils/utils";
import moment from "moment";
import {minutesFromMoment} from "../utils/helper";
const { create } = require('xmlbuilder2');
const fs = require('fs-extra');
const path = require('path');
const request = require('request');
import logger from "../utils/logger";

async function update_tours_from_tracks() {
    // Fill the two columns connection_arrival_stop_lat and connection_arrival_stop_lon with data
    // This is the new query, which updates city2tour table. Every city gets its own lat/lon train stop, to be more accurate on the map.
    await knex.raw(`UPDATE city2tour AS c2t
                    SET connection_arrival_stop_lon=b.stop_lon,
                    connection_arrival_stop_lat=b.stop_lat
                    FROM (
                        SELECT
                        tour_id,
                        city_slug,
                        stop_lon,
                        stop_lat
                        FROM (
                            SELECT 
                            t.id AS tour_id,
                            f.hashed_url,
                            f.city_slug,
                            tracks.track_point_lon AS stop_lon,
                            tracks.track_point_lat AS stop_lat,
                            MIN(calendar_date),
                            rank() OVER (PARTITION BY t.id, f.city_slug ORDER BY MIN(calendar_date) ASC)
                            FROM tour as t
                            INNER JOIN fahrplan AS f
                            ON t.hashed_url=f.hashed_url
                            INNER JOIN tracks AS tracks
                            ON f.totour_track_key=tracks.track_key
                            WHERE tracks.track_point_sequence=1
                            GROUP BY 1, 2, 3, 4, 5
                        ) AS a 
                        WHERE rank=1
                    ) AS b
                    WHERE b.tour_id=c2t.tour_id
                    AND b.city_slug=c2t.city_slug`);


}

export async function fixTours(){
    // For the case, that the load of table fahrplan did not work fully and not for every tour
    // datasets are in table fahrplan available, we delete as a short term solution all
    // tours, which have no datasets in table fahrplan.
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
                    (tour_id, provider, hashed_url, city_slug, reachable_from_country)
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

    // Store for each tour and city the minimal connection duration to get to the hike start                
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
    
    // Store for every tour and city the minimal number of transfers (changing between trains/busses)
    await knex.raw(`UPDATE city2tour AS c SET min_connection_no_of_transfers = i.min_connection_no_of_transfers
                    FROM (
                    SELECT 
                    hashed_url, 
                    city_slug, 
                    MIN(connection_no_of_transfers) AS min_connection_no_of_transfers 
                    FROM fahrplan 
                    GROUP BY hashed_url, city_slug
                    ) AS i
                    WHERE i.hashed_url=c.hashed_url
                    AND i.city_slug=c.city_slug`);

    // Store for every tour and city the total walking duration: bus stop to start of hike, hike, back to bus stop 
    await knex.raw(`UPDATE city2tour AS c SET avg_total_tour_duration = i.avg_total_tour_duration
                    FROM (
                    SELECT 
                    f.hashed_url,
                    f.city_slug,
                    ROUND(AVG(EXTRACT(EPOCH FROM f.totour_track_duration::INTERVAL)/3600 +
                    EXTRACT(EPOCH FROM f.fromtour_track_duration::INTERVAL)/3600 +
                    t.duration)*100)/100 AS avg_total_tour_duration
                    FROM fahrplan AS f
                    INNER JOIN tour AS t
                    ON f.hashed_url=t.hashed_url
                    GROUP BY f.hashed_url, f.city_slug
                    ) AS i
                    WHERE i.hashed_url=c.hashed_url
                    AND i.city_slug=c.city_slug`);


    
    if(process.env.NODE_ENV == "production"){
        // Fill the two columns connection_arrival_stop_lat and connection_arrival_stop_lon with data

        await update_tours_from_tracks();
    }
    else {
        // On local development there are no tracks. How do we update the two columns in table tours?
        // If not set, the map can not be filled with data.
        // We set the stop wrongly with the first track point of the hike. Better than having no data here.

        await knex.raw(`UPDATE city2tour AS c2t
                        SET connection_arrival_stop_lon=b.lon,
                        connection_arrival_stop_lat=b.lat
                        FROM (
                            SELECT
                            g.hashed_url,
                            g.lat-0.5 as lat,
                            g.lon-0.5 as lon
                            FROM gpx AS g
                            WHERE g.typ='first'
                        ) AS b
                        WHERE b.hashed_url=c2t.hashed_url`);

        // Generating at least one point for the tracks
        await knex.raw(`TRUNCATE tracks`)

        try {
        await knex.raw(`INSERT INTO tracks (track_key, track_point_sequence, track_point_lon, track_point_lat, track_point_elevation)
                        SELECT
                        f.totour_track_key AS track_key,
                        ROW_NUMBER() OVER(PARTITION BY f.totour_track_key ORDER BY ct.connection_arrival_stop_lon, ct.connection_arrival_stop_lat) AS track_point_sequence,
                        ct.connection_arrival_stop_lon-0.5 AS track_point_lon,
                        ct.connection_arrival_stop_lat-0.5 AS track_point_lat,
                        0 AS track_point_elevation
                        FROM fahrplan AS f
                        INNER JOIN city2tour AS ct
                        ON ct.hashed_url=f.hashed_url
                        AND f.city_slug=ct.city_slug
                        WHERE ct.connection_arrival_stop_lon IS NOT NULL
                        AND ct.connection_arrival_stop_lat IS NOT NULL
                        GROUP BY f.totour_track_key, ct.connection_arrival_stop_lon, ct.connection_arrival_stop_lat`);
        }
        catch(e) {
            console.log(e)
        }

        try {
        await knex.raw(`INSERT INTO tracks (track_key, track_point_sequence, track_point_lon, track_point_lat, track_point_elevation)
                        SELECT
                        f.fromtour_track_key AS track_key,
                        ROW_NUMBER() OVER(PARTITION BY f.fromtour_track_key ORDER BY ct.connection_arrival_stop_lon, ct.connection_arrival_stop_lat) AS track_point_sequence,
                        ct.connection_arrival_stop_lon+1 AS track_point_lon,
                        ct.connection_arrival_stop_lat+1 AS track_point_lat,
                        0 AS track_point_elevation
                        FROM fahrplan AS f
                        INNER JOIN city2tour AS ct
                        ON ct.hashed_url=f.hashed_url
                        AND f.city_slug=ct.city_slug
                        WHERE f.fromtour_track_key NOT IN (SELECT track_key FROM tracks)
                        AND ct.connection_arrival_stop_lon IS NOT NULL
                        AND ct.connection_arrival_stop_lat IS NOT NULL
                        GROUP BY f.fromtour_track_key, ct.connection_arrival_stop_lon, ct.connection_arrival_stop_lat`);
        }
        catch(e) {
            console.log(e)
        }
    }

    await knex.raw(`UPDATE city2tour as ct
                    SET stop_selector='y'
                    FROM (
                        SELECT
                        d.tour_id,
                        d.city_slug
                        FROM (
                            SELECT
                            c.tour_id,
                            c.city_slug,
                            ROW_NUMBER() OVER (PARTITION BY c.tour_id, c.reachable_from_country ORDER BY c.city_slug) AS city_order
                            FROM city2tour AS c
                            INNER JOIN (
                                SELECT 
                                COUNT(*),
                                tour_id,
                                connection_arrival_stop_lon,
                                connection_arrival_stop_lat,
                                reachable_from_country,
                                row_number() OVER (partition BY tour_id, reachable_from_country ORDER BY COUNT(*) DESC) AS lon_lat_order
                                FROM city2tour
                                GROUP BY tour_id, connection_arrival_stop_lon, connection_arrival_stop_lat, reachable_from_country
                            ) AS a 
                            ON c.tour_id=a.tour_id
                            AND c.reachable_from_country=a.reachable_from_country
                            AND c.connection_arrival_stop_lon=a.connection_arrival_stop_lon
                            AND c.connection_arrival_stop_lat=a.connection_arrival_stop_lat
                            AND a.lon_lat_order=1
                        ) AS d
                        WHERE d.city_order=1
                    ) AS e
                    WHERE ct.tour_id=e.tour_id
                    AND ct.city_slug=e.city_slug;`)

    // Delete all the entries from logsearchphrase, which are older than 360 days.
    await knex.raw(`DELETE FROM logsearchphrase WHERE search_time < NOW() - INTERVAL '360 days';`);

    // Check all entries of column image_url in table tour
    // First, we remove all images producing 404, which are already stored there - mainly provider bahnzumberg 
    const tour_image_url = await knex('tour').select(['id', 'image_url']).whereNotNull('image_url');

    if (!!tour_image_url) {
        try {
            const updatePromises = tour_image_url.map(async (entry) => {
                try {
                    if (entry.image_url != encodeURI(entry.image_url).replace(/%5B/g, '[').replace(/%5D/g, ']')) {
                        await knex.raw(`UPDATE tour SET image_url = NULL WHERE id=${entry.id}`)
                        // console.log("Id "+entry.id+" wurde auf NULL gesetzt")
                    }
                    else {
                        const options = {
                            timeout: 10000 // Set timeout to 10 seconds (default might be lower)
                        };
                          
                        request(entry.image_url, options, (error, response) => {
                            if (error ||  response.statusCode != 200) {
                                // console.log("Response: ", response)
                                // console.log("Error: ", error)
                                knex.raw(`UPDATE tour SET image_url = NULL WHERE id=${entry.id}`);
                                // console.log("Id "+entry.id+" wurde auf NULL gesetzt")
                            }
                        });                     
                    }
                }
                catch(err){
                    console.log('const updatePromises = tour_image_url.map: ', err)
                }
            });
            await Promise.all(updatePromises);
        }
        catch(err){
            console.log('error: ', err)
        }
    }
}


const prepareDirectories = () => {
    // We need a basic set of directories, which are created now, if they do not exist yet
    let filePath='';
    let dirPaths = ['public/gpx/', 'public/gpx-image/', 'public/gpx-image-with-track/', 'public/gpx-track/', 'public/gpx-track/totour/', 'public/gpx-track/fromtour/'];
    
    console.log(moment().format('HH:mm:ss'), ' Start deleting old files');
    for (const i in dirPaths) {
        if(process.env.NODE_ENV == "production"){
            filePath = path.join(__dirname, "../", dirPaths[i]);
        } else {
            filePath = path.join(__dirname, "../../", dirPaths[i]);
        }

        if (!fs.existsSync(filePath)){
            fs.mkdirSync(filePath);
        }    

        // All files, which are older than 30 days, are deleted now. This means they have to be 
        // recreated new and by this we ensure all is updated and unused files are removed.
        deleteFilesOlder30days(filePath);
    }
    // console.log(moment().format('HH:mm:ss'), ' Finished deleting old files');
}


const deleteFilesOlder30days = async (dirPath) => {
    try {
        const dirents = await fs.readdir(dirPath);
        for (const dirent of dirents) {
          const filePath = path.join(dirPath, dirent);
          const stats = await fs.stat(filePath);
    
          // Check if it's a directory and recurse
          if (stats.isDirectory()) {
            await deleteFilesOlder30days(filePath);
          } else if (stats.isFile()) {
            const isOlderThan30Days = Date.now() - stats.mtimeMs > 2592000000; // 30 days in milliseconds
            if (isOlderThan30Days && Math.random() < 0.5) { // Delete with 50% probability
              await fs.unlink(filePath);
              // console.log(`Deleted ${filePath}`);
            }
          }
        }
      } catch (err) {
        // console.error(`Error processing directory: ${dirPath}`, err);
      }
};


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



async function _syncConnectionGPX(key, partFilePath, fileName, title){
    

    return new Promise(async resolve => {
        let filePath = '';
        if(process.env.NODE_ENV == "production"){
            filePath = path.join(__dirname, "../", partFilePath);
        } else {
            filePath = path.join(__dirname, "../../", partFilePath);
        }
        if (!fs.existsSync(filePath)){
            fs.mkdirSync(filePath);
        }
        filePath = path.join(filePath, fileName);
        // console.log(moment().format('HH:mm:ss'), ' Start creating gpx file '+filePath);

        if(!!key){
            let trackPoints = null;
            if (!!!fs.existsSync(filePath)) {
                trackPoints = await knex('tracks').select().where({track_key: key}).orderBy('track_point_sequence', 'asc');
               
                if(!!trackPoints && trackPoints.length > 0){
                    await createFileFromGpx(trackPoints, filePath, title, 'track_point_lat', 'track_point_lon', 'track_point_elevation');
                }
            }
        }
        resolve();
    })
}

export async function syncConnectionGPX(mod=null){


    const toTourFahrplan = await knex('fahrplan').select(['totour_track_key']).whereNotNull('totour_track_key').groupBy('totour_track_key');
    if(!!toTourFahrplan){
        const promises = toTourFahrplan.map(entry => {
            return _syncConnectionGPX(entry.totour_track_key, 'public/gpx-track/totour/' + last_two_characters(entry.totour_track_key) + "/", entry.totour_track_key + '.gpx', 'Station zur Tour')
        });
        await Promise.all(promises);
    }

    const fromTourFahrplan = await knex('fahrplan').select(['fromtour_track_key']).whereNotNull('fromtour_track_key').groupBy('fromtour_track_key');
    if(!!fromTourFahrplan) {
        const promises = fromTourFahrplan.map(entry => {
            return _syncConnectionGPX(entry.fromtour_track_key, 'public/gpx-track/fromtour/' + last_two_characters(entry.fromtour_track_key) + "/", entry.fromtour_track_key + '.gpx', 'Tour zur Station')
        });
        await Promise.all(promises);
    }

    return true;
}

export async function syncGPX(){
    // First we call the directory preparation step
    prepareDirectories();

    // const allTours = await knex('tour').select(["title", "hashed_url"])
    let allTours = null;
    let promises = null;
    for (let i=0; i<10; i++) {
        console.log(moment().format('HH:mm:ss'), ' Creating gpx files - step '+i);
        allTours = await knex('tour').select(["title", "hashed_url"]).whereRaw("MOD(id, 10)="+i)
              
        if(!!allTours && allTours.length > 0){
            try {
                promises = allTours.map(entry => {
                    return _syncGPX(entry.hashed_url, entry.title);
                });
                await Promise.all(promises);
            }
            catch(e) {
                console.log(moment().format('HH:mm:ss'), ' Error in syncGPX');
            }    
        }
    }
    return true;
}

export async function syncGPXImage(){
    // let allHashedUrls = await knex.raw("SELECT DISTINCT hashed_url FROM tour;");
    let allHashedUrls = await knex.raw("SELECT CASE WHEN id < 10 THEN CONCAT('0', id) ELSE CAST(id AS VARCHAR) END as hashed_url FROM tour");
    if(!!allHashedUrls && allHashedUrls.rows){
        allHashedUrls = allHashedUrls.rows;
        let toCreate = [];
        for(let i=0; i<allHashedUrls.length; i++){
            let entry = allHashedUrls[i];
            toCreate.push({
                hashed_url: entry.hashed_url,
            })
        }
        if(!!toCreate){
            // console.log(moment().format('HH:mm:ss'), ' Start to create gpx image files');
            await createImagesFromMap(toCreate.map(e => e.hashed_url));
        }

        await knex.raw(`UPDATE tour SET image_url='/app_static/img/train_placeholder.webp' WHERE image_url IS NULL;`);
    }
    return true;

}

async function _syncGPX(h_url, title){
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
                // console.log(`${filePath} folder created`)
            }

            let filePathName = filePath + fileName;
            let waypoints = null;
            if (!!!fs.existsSync(filePathName)) {
                try {
                    waypoints = await knex('gpx').select().where({hashed_url: h_url}).orderBy('waypoint');
                }
                catch(err) {
                    console.log(`Error in _syncGPX while trying to execute waypoints query`)
                }
                
                if(!!waypoints && waypoints.length > 0 && !!filePathName){
                    await createFileFromGpx(waypoints, filePathName, title);

                    if (!fs.existsSync(filePathName)) {
                        // Something went wrong before. Let's try one more time.
                        console.log(`Trying to generate ${filePathName} a second time`)
                        await createFileFromGpx(waypoints, filePathName, title);
                    }
                }
            } 
        } catch(err) {
            console.error(err)
            console.log(`Error in _syncGPX while trying to generate a gpx file`)
        }
        resolve();
    })
}

async function createFileFromGpx(data, filePath, title, fieldLat = "lat", fieldLng = "lon", fieldEle = "ele"){
    if(!!data){
        // console.log(`createFileFromGpx ${filePath}`)
        
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
            const filedisc = fs.openSync(filePath) 
            fs.close(filedisc);
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
    let limit = 100; // not more than 5000;
    let counter = 0;
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
        return readAndInsertFahrplan(bundle);
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
            } catch (err) {
                logger('############### Error with this SQL ###############');
                logger(`Insert sql into fahrplan table: ${insert_sql}`);
                logger('############### End of error with this SQL ###############');
                resolve(false);
            }
            resolve(true);
        } else {
            resolve();
        }
    });
};



export async function syncTours(){
    // Set Maintenance mode for Zuugle (webpage is disabled)
    await knex.raw(`UPDATE kpi SET VALUE=0 WHERE name='total_tours';`);

    // Table tours will be rebuild from scratch
    await knex.raw(`TRUNCATE tour;`);

    let limit = 500;
    const countResult = await knexTourenDb('vw_touren_to_search').count('* as anzahl');

    let count = 0;
    if(!!countResult && countResult.length == 1 && countResult[0]["anzahl"]){
        count = countResult[0]["anzahl"];
    }

    const modulo = Math.ceil( count / limit, 0 );

    for (let i=0; i<modulo; i++) {
        const query = knexTourenDb.raw(`SELECT
                                        t.id,
                                        t.url,
                                        t.provider,
                                        t.hashed_url,
                                        REPLACE(t.description, '\0', ' 0') as description,
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
                                        REPLACE(t.title, '\0', ' 0') as title,
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
                                        REPLACE(t.full_text, '\0', ' 0') as full_text,
                                        t.quality_rating,
                                        t.difficulty_orig,
                                        t.text_lang,
                                        t.lat_start,
                                        t.lon_start,
                                        t.lat_end,
                                        t.lon_end,
                                        t.maxele
                                        from vw_touren_to_search as t
                                        WHERE t.id % ${modulo} = ${i};`);

        const result = await query;
        if(!!result && result.length > 0 && result[0].length > 0){
            bulk_insert_tours(result[0]);
        }
    }
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
            return Math.floor(i/6)*2;
        }
    }
    return 1;
}


const bulk_insert_tours = async (entries) => {
    let queries = [];

    for (let i=0; i<entries.length; i++) {
        let entry = entries[i];

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
        // entry.gpx_data = JSON.stringify(gpxData);

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
            quality_rating: entry.quality_rating,
            full_text: entry.full_text,
            // gpx_data: entry.gpx_data,
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