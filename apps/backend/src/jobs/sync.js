import knexTourenDb from "../knexTourenDb";
import knex from "../knex";
import knexConfig from "../knexfile";
import {createImagesFromMap, last_two_characters} from "../utils/gpx/gpxUtils";
import {getHost} from "../utils/utils";
import moment from "moment";
const { create } = require('xmlbuilder2');
const fs = require('fs-extra');
const path = require('path');
const request = require('request');
import { spawn } from "cross-spawn";

const activeFileWrites = []; // Array zur Verfolgung laufender Dateischreibvorgänge
const MAX_CONCURRENT_WRITES = 10; // Maximale Anzahl gleichzeitiger Schreibvorgänge


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

    // Store for each tour and city the maximum connection duration to get to the hike start                
    await knex.raw(`UPDATE city2tour AS c SET max_connection_duration = i.max_connection_dur
                    FROM (
                    SELECT 
                    f.tour_provider AS provider,
                    f.hashed_url,
                    f.city_slug,
                    EXTRACT(EPOCH FROM MAX(f.best_connection_duration))/60 AS max_connection_dur
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
                    AND ct.city_slug=e.city_slug;`);


    // fill information about canonical and alternate links
    await knex.raw(`TRUNCATE canonical_alternate;`);
    await knex.raw(`INSERT INTO canonical_alternate (id, city_slug, canonical_yn, zuugle_url, href_lang)
                    SELECT
                    tour_id,
                    city_slug,
                    CASE WHEN ranking=1 THEN 'y' ELSE 'n' END AS canonical_yn,
                    zuugle_url,
                    hreflang
                    FROM (
                        SELECT 
                        RANK() OVER(PARTITION BY c2t.tour_id ORDER BY c2t.min_connection_no_of_transfers ASC, c2t.min_connection_duration ASC, c2t.stop_selector DESC, c2t.city_slug ASC) AS ranking,
                        c2t.tour_id,
                        c2t.city_slug,
                        CONCAT('www.zuugle.', LOWER(c2t.reachable_from_country), '/tour/', c2t.tour_id, '/', c2t.city_slug) AS zuugle_url,
                        CASE WHEN c2t.reachable_from_country='SI' THEN 'sl-si' 
                            WHEN c2t.reachable_from_country='DE' THEN 'de-de'
                            WHEN c2t.reachable_from_country='IT' THEN 'it-it'
                            WHEN c2t.reachable_from_country='CH' THEN 'de-ch'
                            WHEN c2t.reachable_from_country='LI' THEN 'de-li'
                            WHEN c2t.reachable_from_country='FR' THEN 'fr-fr'
                            ELSE 'de-at' END AS hreflang	
                        FROM city2tour AS c2t
                        INNER JOIN tour AS t
                        ON t.id=c2t.tour_id
                    ) AS a;`);
                     

    // Archive all the entries from logsearchphrase, which are older than 180 days.
    await knex.raw(`INSERT INTO logsearchphrase_archive (id, phrase, num_results, city_slug, search_time, menu_lang, country_code)
                    SELECT id, phrase, num_results, city_slug, search_time, menu_lang, country_code
                    FROM logsearchphrase
                    WHERE search_time < NOW() - INTERVAL '180 days';`);
    // Delete all the entries from logsearchphrase, which are older than 180 days.
    await knex.raw(`DELETE FROM logsearchphrase WHERE search_time < NOW() - INTERVAL '180 days';`);
    

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


export async function copyRangeImage(){
    let dir_go_up = "../../";
    let ranges = [];
    if(process.env.NODE_ENV == "production"){ 
        dir_go_up = "../"; 
    }

    try {
        // Check if all existing ranges have a valid image
        const range_result = await knex.raw(`SELECT range_slug FROM tour WHERE range_slug IS NOT NULL GROUP BY range_slug;`);
        ranges = range_result.rows;
    } catch (error) {
        console.error("Error querying the database:", error);
    }

    try {
        for (const range of ranges) {
            const fs_source = path.join(__dirname, dir_go_up, 'public/range-image/default.webp');
            const fs_target = path.join(__dirname, dir_go_up, 'public/range-image/' + range.range_slug + '.webp');

            if (!fs.existsSync(fs_target)) {
            await fs.promises.copyFile(fs_source, fs_target);
            console.log("No image for range found. Copying from default: ", fs_target);
            }
        }
    } catch (error) {
        console.error("Error copying images:", error);
    }
}


const prepareDirectories = () => {
    // We need a basic set of directories, which are created now, if they do not exist yet
    let filePath='';
    let dirPaths = ['public/gpx/', 'public/gpx-image/', 'public/gpx-image-with-track/', 'public/gpx-track/', 'public/gpx-track/totour/', 'public/gpx-track/fromtour/'];
    
    console.log(moment().format('YYYY-MM-DD HH:mm:ss'), ' Start deleting old files');
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
        // deleteFilesOlder30days(filePath); We do this from now on after we generated all Image database entries and generated all images
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
            if (isOlderThan30Days && Math.random() < 0.15) { // Delete with 15% probability
              await fs.unlink(filePath);
              // console.log(`Deleted ${filePath}`);
            }
          }
        }
      } catch (err) {
        // console.error(`Error processing directory: ${dirPath}`, err);
      }
};

export async function truncateAll(){
    await knex.raw(`TRUNCATE city;`);
    await knex.raw(`TRUNCATE fahrplan;`);
    await knex.raw(`TRUNCATE kpi;`);
    await knex.raw(`TRUNCATE provider;`);
    await knex.raw(`TRUNCATE tour;`);
    await knex.raw(`TRUNCATE tour_inactive;`);
    await knex.raw(`TRUNCATE city2tour;`);
    await knex.raw(`TRUNCATE gpx;`);
    await knex.raw(`TRUNCATE logsearchphrase;`);
    await knex.raw(`TRUNCATE tracks;`);
    await knex.raw(`TRUNCATE canonical_alternate;`);
}

function getContainerName() {
    const env = process.env.NODE_ENV || 'development';
    if (knexConfig[env] && knexConfig[env].containerName) {
        return knexConfig[env].containerName;
    }
    return process.env.DB_CONTAINER_NAME || "zuugle-container";
}

export async function copyDump(localPath, remotePath) {
    return new Promise((resolve, reject) => {
        const container = getContainerName();
        console.log(`Copying dump to container ${container}...`);
        const dockerProc = spawn("docker", [
            "cp",
            localPath,
            `${container}:${remotePath}`
        ]);

        dockerProc.stderr.on("data", (data) => {
            console.error(`docker cp stderr: ${data}`);
        });

        dockerProc.on("close", (code) => {
            if (code === 0) {
                console.log(`Dump copied successfully to ${container}:${remotePath}`);
                resolve(undefined);
            } else {
                reject(new Error(`docker cp exited with code ${code}`));
            }
        });
    });
}

export async function restoreDump() {
  return new Promise((resolve, reject) => {
    const env = process.env.NODE_ENV || 'development';
    const config = knexConfig[env];

    const container = getContainerName();
    const dbName = (config && config.connection && config.connection.database) ? config.connection.database : (process.env.DB_NAME || "zuugle_suchseite_dev");
    const dbUser = (config && config.connection && config.connection.user) ? config.connection.user : (process.env.DB_USER || "postgres");
    const dbDump = "/tmp/zuugle_postgresql.dump";

    console.log(`Restoring dump in container ${container} (DB: ${dbName}, User: ${dbUser})...`);
    const dockerProc = spawn("docker", [
      "exec", container,
      "pg_restore", dbDump,
      "-U", dbUser,
      "-d", dbName,
    ]);
    dockerProc.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });
    dockerProc.stderr.on("data", (data) => {
      reject(new Error(data));
    });
    dockerProc.on("close", (code) => {
      if (code === 0) {
        console.log(`pg_restore executed successfully`);
        resolve(undefined);
      } else {
        reject(new Error(`pg_restore exited with code ${code}`));
      }
    });
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
}


export async function getProvider(retryCount = 0, maxRetries = 3) {
    try {
        await knex.raw(`TRUNCATE provider;`);
        const query_result = await knexTourenDb('vw_provider_to_search').select();

        if (query_result.length > 0) {
            for (const entry of query_result) {
                await knex('provider').insert({
                    provider: entry.provider,
                    provider_name: entry.provider_name,
                    allow_gpx_download: entry.allow_gpx_download,
                });
            }
        }
        return true; // Success
    } catch (err) {
        console.error('Error in getProvider:', err);

        if (retryCount < maxRetries) {
            console.log(`Retrying getProvider (attempt ${retryCount + 1} of ${maxRetries})`);
            return getProvider(retryCount + 1, maxRetries);
        } else {
            console.error('Max retries reached. Giving up.');
            return false; // Failure
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



async function _syncConnectionGPX(key, partFilePath, fileName, title) {
    // Warte dynamisch, bis ein freier Slot für einen Dateischreibvorgang verfügbar ist
    while (activeFileWrites.length >= MAX_CONCURRENT_WRITES) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    try {
        var filePath = '';
        if (process.env.NODE_ENV == "production") {
            filePath = path.join(__dirname, "../", partFilePath);
        } else {
            filePath = path.join(__dirname, "../../", partFilePath);
        }
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath);
        }
        filePath = path.join(filePath, fileName);
        if (!!key) {
            var trackPoints = null;
            if (!!!fs.existsSync(filePath)) {
                // Schritt 1: Serielle Datenbankabfrage.
                trackPoints = await knex('tracks').select().where({ track_key: key }).orderBy('track_point_sequence', 'asc');
                if (!!trackPoints && trackPoints.length > 0) {
                    const writePromise = createFileFromGpx(trackPoints, filePath, title, 'track_point_lat', 'track_point_lon', 'track_point_elevation');
                    // Füge die Promise dem Array der aktiven Schreibvorgänge hinzu
                    activeFileWrites.push(writePromise);
                    writePromise.finally(() => {
                        const index = activeFileWrites.indexOf(writePromise);
                        if (index > -1) {
                            activeFileWrites.splice(index, 1);
                        }
                    });
                }
            }
        }
    } catch (e) {
        console.error("Error in _syncConnectionGPX:", e);
    }
}


export async function syncConnectionGPX() {
    // var mod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var toTourFahrplan = await knex('fahrplan').select(['totour_track_key']).whereNotNull('totour_track_key').groupBy('totour_track_key');
    if (!!toTourFahrplan) {
        // Serielle Verarbeitung der "toTour"-Fahrpläne
        for (const entry of toTourFahrplan) {
            await _syncConnectionGPX(entry.totour_track_key, 'public/gpx-track/totour/' + last_two_characters(entry.totour_track_key) + "/", entry.totour_track_key + '.gpx', 'Station zur Tour');
        }
    }

    var fromTourFahrplan = await knex('fahrplan').select(['fromtour_track_key']).whereNotNull('fromtour_track_key').groupBy('fromtour_track_key');
    if (!!fromTourFahrplan) {
        // Serielle Verarbeitung der "fromTour"-Fahrpläne
        for (const entry of fromTourFahrplan) {
            await _syncConnectionGPX(entry.fromtour_track_key, 'public/gpx-track/fromtour/' + last_two_characters(entry.fromtour_track_key) + "/", entry.fromtour_track_key + '.gpx', 'Tour zur Station');
        }
    }

    // Warte, bis alle Jobs in der Warteschlange abgeschlossen sind, bevor die Funktion beendet wird.
    while (activeFileWrites.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    return true;
}


export async function syncGPX() {
    prepareDirectories();
    var allTours = null;
    console.log(moment().format('YYYY-MM-DD HH:mm:ss'), ' Creating gpx files for all tours');
    allTours = await knex('tour').select(["title", "id", "hashed_url"]);
    var allTourlength = allTours.length;
    if (!!allTours && allTours.length > 0) {
        for (var i = 0; i < allTourlength; i++) {
            try {
                var entry = allTours[i];
                // Führt die DB-Abfrage seriell aus und startet den File-Schreib-Job in der Queue
                await _syncGPX(entry.id, entry.hashed_url, entry.title);
            } catch (e) {
                console.log(moment().format('YYYY-MM-DD HH:mm:ss'), ' Error in syncGPX');
            }
        }
    }
    // WICHTIG: Warte, bis alle Jobs in der Warteschlange abgeschlossen sind, bevor die Funktion beendet wird.
    while (activeFileWrites.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    return true;
}

async function _syncGPX(id, h_url, title) {
    // Warte dynamisch, bis ein freier Slot für einen Dateischreibvorgang verfügbar ist
    while (activeFileWrites.length >= MAX_CONCURRENT_WRITES) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    try {
        var fileName = id + '.gpx';
        var filePath = '';
        if (process.env.NODE_ENV == "production") {
            filePath = path.join(__dirname, "../", "public/gpx/", last_two_characters(id), "/");
        } else {
            filePath = path.join(__dirname, "../../", "public/gpx/", last_two_characters(id), "/");
        }
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
        }
        var filePathName = filePath + fileName;
        var waypoints = null;
        if (!!!fs.existsSync(filePathName)) {
            try {
                // Schritt 1: Serielle Datenbankabfrage. Die Funktion wartet hier.
                waypoints = await knex('gpx').select().where({ hashed_url: h_url }).orderBy('waypoint');
            } catch (err) {
                console.log("Error in _syncGPX while trying to execute waypoints query: ", err);
            }
            if (!!waypoints && waypoints.length > 0 && !!filePathName) {
                const writePromise = createFileFromGpx(waypoints, filePathName, title);
                // Füge die Promise dem Array der aktiven Schreibvorgänge hinzu
                activeFileWrites.push(writePromise);
                writePromise.finally(() => {
                    const index = activeFileWrites.indexOf(writePromise);
                    if (index > -1) {
                        activeFileWrites.splice(index, 1);
                    }
                });
            }
        }
    } catch (err) {
        console.error(err);
        console.log("Error in _syncGPX while trying to generate a gpx file");
    }
}


export async function syncGPXImage(){
    let allIDs = await knex.raw("SELECT CASE WHEN id < 10 THEN CONCAT('0', id) ELSE CAST(id AS VARCHAR) END as id FROM tour WHERE image_url IS NULL OR image_url='null';");
    if(!!allIDs && allIDs.rows){
        allIDs = allIDs.rows;
        let toCreate = [];
        for(let i=0; i<allIDs.length; i++){
            let entry = allIDs[i];
            toCreate.push({
                id: entry.id,
            })
        }
        if(!!toCreate){
            console.log(moment().format('YYYY-MM-DD HH:mm:ss'), ' Start to create gpx image files');
            await createImagesFromMap(toCreate.map(e => e.id));
        }

        // This step ensures that all tours have an image_url set. If not, a placeholder image is set.
        // The cdn url can be used, as this is a static image.
        await knex.raw(`UPDATE tour SET image_url='https://cdn.zuugle.at/img/train_placeholder.webp' WHERE image_url IS NULL OR image_url='null';`);
    }
    return true;

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


export async function syncTours(){
    // Set Maintenance mode for Zuugle (webpage is disabled)
    await knex.raw(`UPDATE kpi SET VALUE=0 WHERE name='total_tours';`);

    // Table tours will be rebuild from scratch
    await knex.raw(`TRUNCATE tour;`);

    let limit = 100;
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
                                        REPLACE(REPLACE(REPLACE(t.description, '\0', ' 0'), "'", ""), "?", "") as description,
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
                                        REPLACE(REPLACE(REPLACE(t.title, '\0', ' 0'), "'", ""), "?", "") as title,
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
                                        REPLACE(REPLACE(REPLACE(t.full_text, '\0', ' 0'), "'", ""), "?", " ") as full_text,
                                        t.ai_search_column,
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

    await knex.raw(`UPDATE tour SET image_url=NULL WHERE image_url='null';`);
    await knex.raw(`UPDATE tour SET image_url=CONCAT(image_url, '\\?width=784&height=523') WHERE image_url IS NOT NULL AND provider='bahnzumberg';`); // This is the needed size for the tour detail page
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
    let sql_values = '';

    for (let i=0; i<entries.length; i++) {
        let entry = entries[i];
        
        if (i != 0) {
            sql_values = sql_values + ",";
        }
        sql_values = sql_values + "(" +
                     entry.id + "," + 
                     "'" + entry.url + "'" + "," +
                     "'" + entry.provider + "'" + "," +
                     "'" + entry.hashed_url + "'" + "," +
                     "'" + entry.description + "'" + "," +
                     "'" + entry.image_url + "'," +
                     entry.ascent + "," +
                     entry.descent + "," +
                     entry.difficulty + "," +
                     "'" + entry.difficulty_orig + "'" + "," +
                     entry.duration + "," +
                     entry.distance + "," +
                     "'" + entry.title + "'" + "," +
                     "'" + entry.typ + "'" + "," +
                     "'" + entry.country + "'" + "," +
                     "'" + entry.state + "'" + "," +
                     "'" + entry.range_slug + "'" + "," +
                     "'" + entry.range_name + "'" + "," +
                     "'" + entry.season + "'" + "," +
                     entry.number_of_days + "," +
                     entry.jan + "," +
                     entry.feb + "," +
                     entry.mar + "," +
                     entry.apr + "," +
                     entry.may + "," +
                     entry.jun + "," +
                     entry.jul + "," +
                     entry.aug + "," +
                     entry.sep + "," +
                     entry.oct + "," +
                     entry.nov + "," +
                     entry.dec + "," +
                     calcMonthOrder(entry) + "," +
                     entry.traverse + "," +
                     entry.quality_rating + "," +
                     "'" + entry.full_text + "'" + ",";
        
        if (entry.ai_search_column==null) {
             sql_values = sql_values + "null,"
        }
        else {
             sql_values = sql_values + "'" + entry.ai_search_column + "'" + ",";
        }
        
        sql_values = sql_values + 
                     "'" + entry.text_lang + "'" + "," +
                     entry.maxele + ")";
    }

    const sql_insert = `INSERT INTO tour (id, 
                                          url, 
                                          provider,
                                          hashed_url,
                                          description,
                                          image_url,
                                          ascent,
                                          descent,
                                          difficulty,
                                          difficulty_orig,
                                          duration,
                                          distance,
                                          title,
                                          type,
                                          country,
                                          state,
                                          range_slug,
                                          range,
                                          season,
                                          number_of_days,
                                          jan,
                                          feb,
                                          mar,
                                          apr,
                                          may,
                                          jun,
                                          jul,
                                          aug,
                                          sep,
                                          oct,
                                          nov,
                                          dec,
                                          month_order,
                                          traverse,
                                          quality_rating,
                                          full_text,
                                          ai_search_column,
                                          text_lang,
                                          max_ele)
                                          VALUES ${sql_values}`
    // console.log(sql_insert)

    try {
        await knex.raw(sql_insert)
        return true;
    } catch(err){
        console.log('error: ', err)
        return false;
    }
}