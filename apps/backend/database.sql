SET SEARCH_PATH TO public;

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

DROP TABLE IF EXISTS city;
DROP TABLE IF EXISTS city_static;
DROP TABLE IF EXISTS fahrplan;
DROP TABLE IF EXISTS kpi;
DROP TABLE IF EXISTS provider;
DROP TABLE IF EXISTS tour;
DROP TABLE IF EXISTS tour_inactive;
DROP TABLE IF EXISTS city2tour;
DROP TABLE IF EXISTS gpx;
DROP TABLE IF EXISTS tracks;
DROP TABLE IF EXISTS canonical_alternate;
DROP TABLE IF EXISTS city2tour_flat;
DROP TABLE IF EXISTS logsearchphrase;
DROP TABLE IF EXISTS logsearchphrase_archive;


CREATE TABLE tour (
      id SERIAL,
      url varchar(1024) NOT NULL,
      provider varchar(30) NOT NULL,
      hashed_url varchar(100) NOT NULL,
      description varchar(1000) NOT NULL,
      image_url varchar(1024) DEFAULT NULL,
      ascent int NOT NULL,
      descent int NOT NULL,
      difficulty int DEFAULT NULL,
      difficulty_orig varchar(45) DEFAULT NULL,
      duration decimal(6,2) DEFAULT NULL,
      distance decimal(6,2) DEFAULT NULL,
      title varchar(255) DEFAULT NULL,
      type varchar(255) DEFAULT NULL,
      number_of_days int DEFAULT NULL,
      traverse int DEFAULT NULL,
      country varchar(128) DEFAULT NULL,
      state varchar(128) DEFAULT NULL,
      range_slug varchar(128) DEFAULT NULL,
      range varchar(128) DEFAULT NULL,
      season varchar(1) DEFAULT NULL,
      jan boolean DEFAULT false,
      feb boolean DEFAULT false,
      mar boolean DEFAULT false,
      apr boolean DEFAULT false,
      may boolean DEFAULT false,
      jun boolean DEFAULT false,
      jul boolean DEFAULT false,
      aug boolean DEFAULT false,
      sep boolean DEFAULT false,
      oct boolean DEFAULT false,
      nov boolean DEFAULT false,
      dec boolean DEFAULT false,
      month_order int DEFAULT 12,
      quality_rating integer DEFAULT 5,
	  full_text TEXT,
	  search_column tsvector,
      ai_search_column vector(1024) DEFAULT NULL,
	  max_ele INT default 0,
	  text_lang VARCHAR(2) default 'de',
      PRIMARY KEY (id)
);


CREATE INDEX ON tour (provider);
CREATE INDEX ON tour (hashed_url);
CREATE INDEX ON tour (month_order);
CREATE INDEX ON tour (range);
CREATE INDEX ON tour (traverse);
CREATE INDEX ON tour (title);
-- CREATE INDEX ON tour USING hnsw (ai_search_column vector_l2_ops);


CREATE TABLE tour_inactive (
      id SERIAL,
      url varchar(1024) NOT NULL,
      provider varchar(30) NOT NULL,
      hashed_url varchar(100) NOT NULL,
      description varchar(1000) NOT NULL,
      image_url varchar(1024) DEFAULT NULL,
      ascent int NOT NULL,
      descent int NOT NULL,
      difficulty int DEFAULT NULL,
      difficulty_orig varchar(45) DEFAULT NULL,
      duration decimal(6,2) DEFAULT NULL,
      distance decimal(6,2) DEFAULT NULL,
      title varchar(255) DEFAULT NULL,
      type varchar(255) DEFAULT NULL,
      number_of_days int DEFAULT NULL,
      traverse int DEFAULT NULL,
      country varchar(128) DEFAULT NULL,
      state varchar(128) DEFAULT NULL,
      range_slug varchar(128) DEFAULT NULL,
      range varchar(128) DEFAULT NULL,
      last_active timestamp NOT NULL,
      PRIMARY KEY (id)
);


-- weekday types
-- businessday, saturday, sunday,

CREATE TABLE city (
      city_slug varchar(64) NOT NULL,
      city_name varchar(128) NOT NULL,
      city_country varchar(128) NOT NULL,
      lat decimal(9,6) DEFAULT NULL,
      lon decimal(9,6) DEFAULT NULL,
      PRIMARY KEY (city_slug)
);


CREATE TABLE city_static (
      city_slug varchar(64) NOT NULL,
      city_name varchar(128) NOT NULL,
      city_country varchar(128) NOT NULL,
      lat decimal(9,6) DEFAULT NULL,
      lon decimal(9,6) DEFAULT NULL,
      PRIMARY KEY (city_slug)
);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('aix-en-provence', 'Aix-en-Provence', 'FR', 43.523338, 5.439433);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('alessandria', 'Alessandria', 'IT', 44.908791, 8.607259);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('amstetten', 'Amstetten', 'AT', 48.121542, 14.878536);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('annecy', 'Annecy', 'FR', 45.902047, 6.121826);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('attnang-puchheim', 'Attnang Puchheim', 'AT', 48.012400, 13.720984);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('avignon', 'Avignon', 'FR', 43.941923, 4.805269);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('bad-endorf', 'Bad Endorf', 'DE', 47.905068, 12.301556);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('bad-ischl', 'Bad Ischl', 'AT', 47.711601, 13.626967);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('bad-reichenhall', 'Bad Reichenhall', 'DE', 47.730934, 12.882452);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('baden', 'Baden', 'AT', 48.004058, 16.242735);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('basel', 'Basel', 'CH', 47.547413, 7.589560);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('bergamo', 'Bergamo', 'IT', 45.690536, 9.675014);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('bern', 'Bern', 'CH', 46.948271, 7.439722);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('besancon', 'Besançon', 'FR', 47.243141, 6.022137);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('biella', 'Biella', 'IT', 45.560616, 8.056082);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('bozen', 'Bozen', 'IT', 46.491321, 11.350359);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('bratislava', 'Bratislava', 'SK', 48.150020, 17.110515);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('bregenz', 'Bregenz', 'AT', 47.502856, 9.742391);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('brescia', 'Brescia', 'IT', 45.539304, 10.221535);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('bressanone-brixen', 'Bressanone/Brixen', 'IT', 46.709970, 11.652150);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('bruck-an-der-leitha', 'Bruck an der Leitha', 'AT', 48.016934, 16.779770);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('bruck-an-der-mur', 'Bruck an der Mur', 'AT', 47.411604, 15.270977);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('budapest', 'Budapest', 'HU', 47.500431, 19.040235);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('chambery', 'Chambéry', 'FR', 45.571408, 5.923485);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('chur', 'Chur', 'CH', 46.852504, 9.531236);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('colmar', 'Colmar', 'FR', 48.077752, 7.353597);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('como', 'Como', 'IT', 45.808016, 9.085181);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('dornbirn', 'Dornbirn', 'AT', 47.413204, 9.743153);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('feldkirch', 'Feldkirch', 'AT', 47.235948, 9.593710);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('fortezza-franzensfeste', 'Fortezza/Franzensfeste', 'IT', 46.786967, 11.611108);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('freiburg-im-breisgau', 'Freiburg im Breisgau', 'DE', 47.996090, 7.842104);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('freilassing', 'Freilassing', 'DE', 47.839812, 12.977093);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('friesach', 'Friesach', 'AT', 46.949756, 14.410185);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('garmisch-partenkirchen', 'Garmisch-Partenkirchen', 'DE', 47.491383, 11.100918);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('geneve', 'Genève', 'CH', 46.210452, 6.143093);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('graz', 'Graz', 'AT', 47.072218, 15.417387);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('grenoble', 'Grenoble', 'FR', 45.191549, 5.713809);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('günzburg', 'Günzburg', 'DE', 48.455246, 10.282906);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('hall-in-tirol', 'Hall in Tirol', 'AT', 47.283186, 11.512638);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('hallein', 'Hallein', 'AT', 47.683319, 13.091176);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('imst-pitztal', 'Imst-Pitztal', 'AT', 47.222384, 10.749008);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('innsbruck', 'Innsbruck', 'AT', 47.263842, 11.401170);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('jenbach', 'Jenbach', 'AT', 47.391605, 11.776607);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('judenburg', 'Judenburg', 'AT', 47.168502, 14.659344);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('kitzbühel', 'Kitzbühel', 'AT', 47.448554, 12.392949);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('klagenfurt', 'Klagenfurt', 'AT', 46.621535, 14.301323);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('knittelfeld', 'Knittelfeld', 'AT', 47.211467, 14.826703);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('kufstein', 'Kufstein', 'AT', 47.583196, 12.172832);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('landeck-zams', 'Landeck-Zams', 'AT', 47.142071, 10.573138);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('lausanne', 'Lausanne', 'CH', 46.518178, 6.629676);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('leoben', 'Leoben', 'AT', 47.381534, 15.093116);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('lienz', 'Lienz', 'AT', 46.828289, 14.511520);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('lugano', 'Lugano', 'CH', 46.005502, 8.946996);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('luzern', 'Luzern', 'CH', 47.050176, 8.310180);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('lyon', 'Lyon', 'FR', 45.760596, 4.859409);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('maribor', 'Maribor', 'SI', 46.562148, 15.657977);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('marseille', 'Marseille', 'FR', 43.302666, 5.380407);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('meran', 'Meran', 'IT', 46.673297, 11.149258);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('milano', 'Milano', 'IT', 45.487137, 9.204821);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('monza', 'Monza', 'IT', 45.578121, 9.272818);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('muenchen', 'München', 'DE', 48.140291, 11.559602);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('muerzzuschlag', 'Mürzzuschlag', 'AT', 47.607679, 15.677084);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('mulhouse', 'Mulhouse', 'FR', 47.742691, 7.343160);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('nice', 'Nice', 'FR', 43.704556, 7.261904);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('novara', 'Novara', 'IT', 45.451272, 8.624503);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('passau', 'Passau', 'DE', 48.573981, 13.447545);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('pavia', 'Pavia', 'IT', 45.187053, 9.155551);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('pörtschach-am-wörthersee', 'Pörtschach am Wörthersee', 'AT', 46.635832, 14.143891);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('prien-am-chiemsee', 'Prien am Chiemsee', 'DE', 47.855013, 12.348422);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('revelstoke', 'Revelstoke', 'CA', 51.002824, -118.194784);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('rosenheim', 'Rosenheim', 'DE', 47.850239, 12.126425);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('rovereto', 'Rovereto', 'IT', 45.889311, 11.034527);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('salzburg', 'Salzburg', 'AT', 47.810576, 13.045236);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('schladming', 'Schladming', 'AT', 47.391656, 13.685324);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('selzthal', 'Selzthal', 'AT', 47.551130, 14.316823);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('spittal-millstättersee', 'Spittal-Millstättersee', 'AT', 46.793086, 13.492576);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('st-anton-am-arlberg', 'St. Anton am Arlberg', 'AT', 47.130932, 10.270438);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('st-johann-im-pongau', 'St. Johann im Pongau', 'AT', 47.348275, 13.205260);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('st-johann-in-tirol', 'St. Johann in Tirol', 'AT', 47.521558, 12.428525);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('st-moritz', 'St. Moritz', 'CH', 46.498425, 9.839077);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('st-pölten', 'St. Pölten', 'AT', 48.204550, 15.626723);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('st-veit-an-der-glan', 'St. Veit an der Glan', 'AT', 46.764956, 14.358249);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('straßburg', 'Straßburg', 'FR', 48.584105, 7.749008);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('toulon', 'Toulon', 'FR', 43.123514, 5.928424);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('trento', 'Trento', 'IT', 46.066423, 11.121056);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('treviso', 'Treviso', 'IT', 45.666429, 12.242750);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('torino', 'Torino', 'IT', 45.070312, 7.686856);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('ulm', 'Ulm', 'DE', 48.400833, 9.987222);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('valence', 'Valence', 'FR', 44.933333, 4.891667);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('venezia', 'Venezia', 'IT', 45.440847, 12.315515);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('verona', 'Verona', 'IT', 45.438384, 10.991622);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('vicenza', 'Vicenza', 'IT', 45.547844, 11.549244);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('villach', 'Villach', 'AT', 46.611111, 13.844444);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('vöcklabruck', 'Vöcklabruck', 'AT', 48.012400, 13.655800);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('wörgl', 'Wörgl', 'AT', 47.483333, 12.066667);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('zell-am-see', 'Zell am See', 'AT', 47.323333, 12.796667);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('zermatt', 'Zermatt', 'CH', 46.020713, 7.749117);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('zürich', 'Zürich', 'CH', 47.376887, 8.541694);



CREATE TABLE fahrplan (
    id INT,
    tour_provider varchar(30) NOT NULL,
    hashed_url varchar(100) NOT NULL,
    calendar_date timestamp NOT NULL,
    weekday char(3) DEFAULT NULL,
    date_any_connection varchar(3) NOT NULL,
    city_slug varchar(100) NOT NULL,
    city_name varchar(100) NOT NULL,
    city_any_connection varchar(3) NOT NULL,
    best_connection_duration time DEFAULT NULL,
    connection_rank int DEFAULT NULL,
    connection_departure_datetime timestamp DEFAULT NULL,
    connection_duration time DEFAULT NULL,
    connection_no_of_transfers int DEFAULT NULL,
    connection_arrival_datetime timestamp DEFAULT NULL,
    connection_returns_trips_back int DEFAULT NULL,
    connection_returns_min_waiting_duration time DEFAULT NULL,
    connection_returns_max_waiting_duration time DEFAULT NULL,
    connection_returns_warning_level int NOT NULL,
    connection_returns_warning varchar(37) NOT NULL,
    return_row int DEFAULT NULL,
    return_waiting_duration time DEFAULT NULL,
    return_departure_datetime timestamp DEFAULT NULL,
    return_duration time DEFAULT NULL,
    return_no_of_transfers int DEFAULT NULL,
    return_arrival_datetime timestamp DEFAULT NULL,
    totour_track_key int default null,
    totour_track_duration time DEFAULT NULL,
    fromtour_track_key int default null,
    fromtour_track_duration time DEFAULT NULL,
    connection_description_json JSONB DEFAULT NULL,
    connection_lastregular_arrival_datetime timestamp DEFAULT NULL,
    return_description_json JSONB DEFAULT NULL,
    return_firstregular_departure_datetime timestamp DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE INDEX fahrplan_calendar_date_idx ON fahrplan (calendar_date);
CREATE INDEX fahrplan_hashed_url_idx ON fahrplan (hashed_url);
CREATE INDEX fahrplan_totour_track_key_idx ON fahrplan (totour_track_key);
CREATE INDEX fahrplan_fromtour_track_key_idx ON fahrplan (fromtour_track_key);
CREATE INDEX fahrplan_best_connection_duration_idx ON fahrplan (best_connection_duration);
CREATE INDEX fahrplan_totour_track_duration_idx ON fahrplan (totour_track_duration);
CREATE INDEX fahrplan_fromtour_track_duration_idx ON fahrplan (fromtour_track_duration);
CREATE INDEX fahrplan_city_slug_idx ON fahrplan (city_slug);



CREATE TABLE kpi (
      name varchar(150) NOT NULL,
      value int DEFAULT 0,
      PRIMARY KEY (name)
);

INSERT INTO kpi SELECT 'total_ranges', COUNT(DISTINCT range) FROM tour;
INSERT INTO kpi SELECT 'total_cities', COUNT(DISTINCT city_slug) FROM city;
INSERT INTO kpi SELECT 'total_tours', COUNT(id) FROM tour;
INSERT INTO kpi SELECT CONCAT('total_tours_', f.city_slug) AS NAME, COUNT(DISTINCT t.id) AS VALUE FROM fahrplan AS f INNER JOIN tour AS t ON f.tour_provider=t.provider AND f.hashed_url=t.hashed_url GROUP BY f.city_slug;
INSERT INTO kpi SELECT 'total_connections', COUNT(id) FROM fahrplan;
INSERT INTO kpi SELECT 'total_provider', COUNT(DISTINCT provider) FROM tour;



CREATE TABLE provider (
      provider varchar(30) NOT NULL,
      provider_name varchar(150) NOT NULL,
	allow_gpx_download varchar(1) default 'y',
      PRIMARY KEY (provider)
);


CREATE TABLE logsearchphrase (
      id SERIAL,
      phrase varchar(250) DEFAULT NULL,
      num_results int DEFAULT 0,
      city_slug varchar(64) NOT NULL,
      search_time timestamp DEFAULT CURRENT_TIMESTAMP,
 	   menu_lang VARCHAR(2) default NULL,
	   country_code VARCHAR(2) default NULL,
      PRIMARY KEY (id)
);

CREATE INDEX ON logsearchphrase (LOWER(TRIM(phrase)));



CREATE TABLE logsearchphrase_archive (
      id SERIAL,
      phrase varchar(250) DEFAULT NULL,
      num_results int DEFAULT 0,
      city_slug varchar(64) NOT NULL,
      search_time timestamp DEFAULT CURRENT_TIMESTAMP,
 	   menu_lang VARCHAR(2) default NULL,
	   country_code VARCHAR(2) default NULL,
      PRIMARY KEY (id)
);


CREATE TABLE gpx (
      provider varchar(30) NOT NULL,
      hashed_url varchar(100) NOT NULL,
      typ varchar(10) NOT NULL,
      waypoint int NOT NULL,
      lat decimal(12,9) DEFAULT NULL,
      lon decimal(12,9) DEFAULT NULL,
      ele decimal(8,2) DEFAULT NULL,
      PRIMARY KEY (hashed_url, waypoint)
);

CREATE INDEX ON gpx (provider);
CREATE INDEX ON gpx (hashed_url);
CREATE INDEX ON gpx (typ);
CREATE INDEX ON gpx (waypoint);
CREATE INDEX ON gpx (lat);
CREATE INDEX ON gpx (lon);

CREATE INDEX gpx_earth_idx ON gpx USING gist (ll_to_earth(lat, lon));


CREATE TABLE city2tour (
      tour_id SERIAL,
      provider varchar(30) NOT NULL,
      hashed_url varchar(100) NOT NULL,
      city_slug varchar(64) NOT NULL,
      reachable_from_country varchar(2) NOT NULL,
      min_connection_duration int DEFAULT 0,
      max_connection_duration int DEFAULT 200,
      min_connection_no_of_transfers INTEGER DEFAULT 4, 
      avg_total_tour_duration decimal(6,2) DEFAULT NULL,
      connection_arrival_stop_lon decimal(12,9) DEFAULT NULL,
      connection_arrival_stop_lat decimal(12,9) DEFAULT NULL,
      stop_selector char(1) DEFAULT 'n'
);
CREATE INDEX ON city2tour (tour_id);
CREATE INDEX ON city2tour (city_slug);
CREATE INDEX ON city2tour (reachable_from_country);




CREATE TABLE city2tour_flat (
    reachable_from_country varchar(2) NOT NULL,
    city_slug varchar(64) NOT NULL,
    id int NOT NULL,
    provider varchar(30),
    provider_name varchar(150) NOT NULL,
    hashed_url varchar(100),
    url varchar(1024),
    title varchar(255),
    image_url varchar(1024),
    type varchar(255),
    country varchar(128),
    state varchar(128),
    range_slug varchar(128),
    range varchar(128),
    text_lang VARCHAR(2),
    difficulty_orig varchar(45),
    season varchar(1),
    max_ele INT,
    connection_arrival_stop_lon decimal(12,9),
    connection_arrival_stop_lat decimal(12,9),
    min_connection_duration int,
    max_connection_duration int,
    min_connection_no_of_transfers INTEGER,
    avg_total_tour_duration decimal(6,2),
    ascent int,
    descent int,
    difficulty int,
    duration decimal(6,2),
    distance decimal(6,2),
    number_of_days int,
    traverse int,
    quality_rating integer,
    month_order int,
    search_column tsvector,
    ai_search_column vector(1024),
    stop_selector char(1),
    PRIMARY KEY (reachable_from_country, city_slug, id)
);

-- These indices are created during the daily load in sync.js. 
-- Any changes here, have to be reflected there, too!
CREATE INDEX ON city2tour_flat 
USING hnsw (ai_search_column vector_l2_ops) 
WITH (m = 24, ef_construction = 128);
-- maybe on PROD even: WITH (m = 32, ef_construction = 200);

CREATE INDEX ON city2tour_flat USING GIN (search_column);
CREATE INDEX ON city2tour_flat (stop_selector);
CREATE INDEX ON city2tour_flat (text_lang);
CREATE INDEX ON city2tour_flat (id);
CREATE INDEX tour_title_trgm_idx ON city2tour_flat USING GIN (LOWER(title) gin_trgm_ops);


CREATE OR REPLACE FUNCTION sync_tour_image_to_flat()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE city2tour_flat
    SET image_url = COALESCE(NULLIF(NEW.image_url, ''), 'https://cdn.zuugle.at/img/train_placeholder.webp')
    WHERE id = NEW.id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_tour_image ON tour;

CREATE TRIGGER trg_update_tour_image
AFTER UPDATE OF image_url ON tour
FOR EACH ROW
WHEN (OLD.image_url IS DISTINCT FROM NEW.image_url)
EXECUTE FUNCTION sync_tour_image_to_flat();


CREATE TABLE tracks (
	   track_key INTEGER NOT NULL,
	   track_point_sequence INTEGER NOT NULL,
	   track_point_lon decimal(12,9) DEFAULT NULL,
	   track_point_lat decimal(12,9) DEFAULT NULL,
	   track_point_elevation decimal(12,8) DEFAULT NULL,
	   PRIMARY KEY (track_key, track_point_sequence)
);


CREATE TABLE canonical_alternate (
      id SERIAL,
      city_slug varchar(64) NOT NULL,
      canonical_yn char(1) DEFAULT 'n',
      zuugle_url varchar(100) NOT NULL,
      href_lang varchar(5) DEFAULT 'de-at',
      PRIMARY KEY (id, city_slug)
);


CREATE TABLE poi2tour (
      poi_id SERIAL,
      tour_id SERIAL,
      PRIMARY KEY (poi_id, tour_id)
);

CREATE TABLE pois (
      id SERIAL,
      lat decimal(12,9) DEFAULT NULL,
      lon decimal(12,9) DEFAULT NULL,
      name varchar(255) DEFAULT NULL,
      type varchar(255) DEFAULT NULL,
      PRIMARY KEY (id)
);
CREATE INDEX ON pois (lat, lon);
CREATE INDEX type_idx ON pois (type);
CREATE INDEX idx_pois_name_search ON pois (name text_pattern_ops);


CREATE TABLE search_suggestions (
    type varchar(10) NOT NULL,
    term text NOT NULL,
    reachable_from_country char(2) NOT NULL,
    city_slug varchar(64) NOT NULL,
    priority int NOT NULL,
    number_of_tours integer,
    PRIMARY KEY (reachable_from_country, city_slug, type, term)
);
CREATE INDEX idx_suggestions_exact 
ON search_suggestions (reachable_from_country, city_slug) 
INCLUDE (priority, number_of_tours);

CREATE INDEX idx_suggestions_term_trgm 
ON search_suggestions USING gin (term gin_trgm_ops);
