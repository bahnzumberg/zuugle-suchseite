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
DROP TABLE IF EXISTS poi2tour;
DROP TABLE IF EXISTS pois;
DROP TABLE IF EXISTS search_suggestions;


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
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('bern', 'Bern', 'CH', 46.948831, 7.439129);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('besancon', 'Besançon', 'FR', 47.247049, 6.021943);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('bischofshofen', 'Bischofshofen', 'AT', 47.417798, 13.219635);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('bozen', 'Bozen', 'IT', 46.496643, 11.358379);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('braunau', 'Braunau', 'AT', 48.259025, 13.047742);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('bregenz', 'Bregenz', 'AT', 47.503003, 9.739624);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('brescia', 'Brescia', 'IT', 45.532700, 10.212969);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('brixen', 'Brixen', 'IT', 46.709991, 11.650008);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('bruck', 'Bruck an der Mur', 'AT', 47.413306, 15.279220);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('celje', 'Celje', 'SI', 46.228480, 15.268323);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('chur', 'Chur', 'CH', 46.853087, 9.528942);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('como', 'Como', 'IT', 45.808969, 9.072715);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('dijon', 'Dijon', 'FR', 47.323411, 5.027256);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('eisenstadt', 'Eisenstadt', 'AT', 47.845718, 16.525040);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('feldkirch', 'Feldkirch', 'AT', 47.241784, 9.605209);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('garmisch-partenkirchen', 'Garmisch-Partenkirchen', 'DE', 47.491454, 11.097014);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('geneve', 'Genève', 'CH', 46.210212, 6.142455);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('gmunden', 'Gmunden', 'AT', 47.926020, 13.783875);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('graz', 'Graz', 'AT', 47.072482, 15.417507);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('grenoble', 'Grenoble', 'FR', 45.191491, 5.714548);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('imst', 'Imst', 'AT', 47.219092, 10.761853);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('innsbruck', 'Innsbruck', 'AT', 47.263533, 11.400277);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('jenbach', 'Jenbach', 'AT', 47.388486, 11.777911);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('kapfenberg', 'Kapfenberg', 'AT', 47.445095, 15.292398);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('kempten', 'Kempten', 'DE', 47.711747, 10.317618);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('kitzbuehel', 'Kitzbühel', 'AT', 47.454220, 12.390615);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('klagenfurt', 'Klagenfurt', 'AT', 46.616209, 14.313136);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('knittelfeld', 'Knittelfeld', 'AT', 47.215455, 14.837411);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('koper', 'Koper', 'SI', 45.538240, 13.738235);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('kranj', 'Kranj', 'SI', 46.238956, 14.348073);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('krems-an-der-donau', 'Krems/Donau', 'AT', 48.409080, 15.604994);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('kufstein', 'Kufstein', 'AT', 47.582993, 12.165956);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('landeck', 'Landeck', 'AT', 47.148422, 10.578282);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('landshut', 'Landshut', 'DE', 48.547491, 12.135925);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('lausanne', 'Lausanne', 'CH', 46.516793, 6.629091);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('leoben', 'Leoben', 'AT', 47.386473, 15.089990);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('lienz', 'Lienz', 'AT', 46.828686, 12.771133);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('liezen', 'Liezen', 'AT', 47.562763, 14.242169);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('linz', 'Linz', 'AT', 48.290676, 14.291172);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('ljubljana', 'Ljubljana', 'SI', 46.058289, 14.511520);
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
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('passau', 'Passau', 'DE', 48.573639, 13.450331);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('reutte', 'Reutte', 'AT', 47.493089, 10.721652);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('ried-im-innkreis', 'Ried im Innkreis', 'AT', 48.200644, 13.488276);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('rosenheim', 'Rosenheim', 'DE', 47.850016, 12.119207);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('saalfelden', 'Saalfelden am Steinernen Meer', 'AT', 47.426879, 12.830134);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('salzburg', 'Salzburg', 'AT', 47.813061, 13.045128);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('schladming', 'Schladming', 'AT', 47.393789, 13.678539);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('sion', 'Sion', 'CH', 46.227553, 7.359196);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('spittal-an-der-drau', 'Spittal an der Drau', 'AT', 46.795807, 13.487934);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('st-gallen', 'St. Gallen', 'CH', 47.423177, 9.369896);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('st-johann-in-tirol', 'St. Johann in Tirol', 'AT', 47.519798, 12.430564);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('st-poelten', 'St. Pölten', 'AT', 48.208194, 15.624038);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('steyr', 'Steyr', 'AT', 48.038661, 14.423314);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('torino', 'Torino', 'IT', 45.026311, 7.656834);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('toulon', 'Toulon', 'FR', 43.128353, 5.929404);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('trento', 'Trento', 'IT', 46.070785, 11.118457);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('vaduz', 'Vaduz', 'LI', 47.168261, 9.508631);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('villach', 'Villach', 'AT', 46.618239, 13.848572);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('wels', 'Wels', 'AT', 48.165701, 14.026717);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('wien', 'Wien', 'AT', 48.174274, 16.331902);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('wolfsberg', 'Wolfsberg', 'AT', 46.842310, 14.838821);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('wr-neustadt', 'Wiener Neustadt', 'AT', 47.811305, 16.233617);
INSERT INTO city_static (city_slug, city_name, city_country, lat, lon) VALUES ('zuerich', 'Zürich', 'CH', 47.378176, 8.540212);



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
