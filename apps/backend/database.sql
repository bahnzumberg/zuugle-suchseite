DROP TABLE IF EXISTS city;
DROP TABLE IF EXISTS fahrplan;
DROP TABLE IF EXISTS fahrplan_del;
DROP TABLE IF EXISTS fahrplan_load;
DROP TABLE IF EXISTS kpi;
-- DROP TABLE IF EXISTS logsearchphrase;
DROP TABLE IF EXISTS provider;
DROP TABLE IF EXISTS tour;
DROP TABLE IF EXISTS city2tour;
DROP TABLE IF EXISTS disposible;
DROP TABLE IF EXISTS gpx;

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
      user_rating_avg decimal(6,2) DEFAULT NULL,
      cities JSONB DEFAULT NULL,
      cities_object JSONB DEFAULT NULL,

      PRIMARY KEY (id)
);

ALTER TABLE tour ADD COLUMN full_text TEXT;
ALTER TABLE tour ADD COLUMN search_column tsvector;
ALTER TABLE tour ADD COLUMN separator smallint;
ALTER TABLE tour ADD COLUMN gpx_data JSONB;

CREATE INDEX ON tour (provider, hashed_url);
CREATE INDEX ON tour (provider);
CREATE INDEX ON tour (hashed_url);
CREATE INDEX ON tour (cities);
CREATE INDEX ON tour (cities_object);
CREATE INDEX ON tour (month_order);
CREATE INDEX ON tour (range);
CREATE INDEX ON tour (traverse);
CREATE INDEX ON tour (title);
CREATE INDEX search_column_idx ON tour USING GIN (search_column);
CREATE INDEX ON tour (separator);


-- weekday types
-- businessday, saturday, sunday,

CREATE TABLE city (
      city_slug varchar(64) NOT NULL,
      city_name varchar(128) NOT NULL,
      city_country varchar(128) NOT NULL,
      PRIMARY KEY (city_slug)
);

CREATE INDEX ON city (city_slug);

CREATE TABLE fahrplan (
     id SERIAL,
     tour_provider varchar(30)  NOT NULL,
     hashed_url varchar(100) NOT NULL,
     calendar_date timestamp NOT NULL,
     valid_thru timestamp NOT NULL,
     weekday varchar(3)  DEFAULT NULL,
     weekday_type varchar(11)  DEFAULT NULL,
     date_any_connection varchar(3)  NOT NULL,
     city_slug varchar(100)  NOT NULL,
     city_name varchar(100)  NOT NULL,
     city_any_connection varchar(3)  NOT NULL,
     best_connection_duration time DEFAULT NULL,
     connection_rank int DEFAULT NULL,
     connection_departure_datetime timestamp DEFAULT NULL,
     connection_duration time DEFAULT NULL,
     connection_no_of_transfers int DEFAULT NULL,
     connection_description varchar(2441) DEFAULT NULL,
     connection_description_detail varchar(4000) DEFAULT NULL,
     connection_departure_stop varchar(250) DEFAULT NULL,
     connection_departure_stop_lon decimal(12,9) DEFAULT NULL,
     connection_departure_stop_lat decimal(12,9) DEFAULT NULL,
     connection_arrival_stop varchar(250) DEFAULT NULL,
     connection_arrival_stop_lon decimal(12,9) DEFAULT NULL,
     connection_arrival_stop_lat decimal(12,9) DEFAULT NULL,
     connection_arrival_datetime timestamp DEFAULT NULL,
     connection_returns_departure_stop varchar(250) DEFAULT NULL,
     connection_returns_trips_back int DEFAULT NULL,
     connection_returns_min_waiting_duration time DEFAULT NULL,
     connection_returns_max_waiting_duration time DEFAULT NULL,
     connection_returns_warning_level int NOT NULL,
     connection_returns_warning varchar(37)  NOT NULL,
     return_row int DEFAULT NULL,
     return_waiting_duration time DEFAULT NULL,
     return_departure_datetime timestamp DEFAULT NULL,
     return_duration time DEFAULT NULL,
     return_no_of_transfers int DEFAULT NULL,
     return_description varchar(2441) DEFAULT NULL,
     return_description_detail varchar(4000) DEFAULT NULL,
     return_departure_stop_lon decimal(12,9) DEFAULT NULL,
     return_departure_stop_lat decimal(12,9) DEFAULT NULL,
     return_arrival_stop varchar(250) DEFAULT NULL,
     return_arrival_stop_lon decimal(12,9) DEFAULT NULL,
     return_arrival_stop_lat decimal(12,9) DEFAULT NULL,
     return_arrival_datetime timestamp DEFAULT NULL,
     totour_track_key int default null,
     totour_track_duration time DEFAULT NULL,
     fromtour_track_key int default null,
     fromtour_track_duration time DEFAULT NULL,
     PRIMARY KEY (id)
);


CREATE INDEX ON fahrplan (hashed_url, tour_provider);
CREATE INDEX ON fahrplan (hashed_url, tour_provider, city_slug);
CREATE INDEX ON fahrplan (totour_track_key);
CREATE INDEX ON fahrplan (fromtour_track_key);
CREATE INDEX ON fahrplan (connection_duration);
CREATE INDEX ON fahrplan (best_connection_duration);
CREATE INDEX ON fahrplan (totour_track_duration);
CREATE INDEX ON fahrplan (fromtour_track_duration);
CREATE INDEX ON fahrplan (city_slug);
CREATE INDEX ON fahrplan (weekday_type);



CREATE TABLE kpi (
      name varchar(30) NOT NULL,
      value int DEFAULT 0,
      PRIMARY KEY (name)
);
INSERT INTO kpi SELECT 'total_ranges', COUNT(DISTINCT range) FROM tour;
INSERT INTO kpi SELECT 'total_cities', COUNT(DISTINCT city_slug) FROM city;

CREATE TABLE provider (
      provider varchar(30) NOT NULL,
      provider_name varchar(150) NOT NULL,
      PRIMARY KEY (provider)
);


CREATE TABLE logsearchphrase (
     id SERIAL,
     phrase varchar(250) DEFAULT NULL,
     num_results int DEFAULT 0,
     city_slug varchar(64) NOT NULL,
     search_time timestamp DEFAULT CURRENT_TIMESTAMP,
     PRIMARY KEY (id)
);
ALTER TABLE logsearchphrase ADD COLUMN menu_lang VARCHAR(2) default NULL;
ALTER TABLE logsearchphrase ADD COLUMN country_code VARCHAR(2) default NULL;


ALTER TABLE tour ADD COLUMN max_ele INT default 0;
ALTER TABLE tour ADD COLUMN text_lang VARCHAR(2) default 'de';


CREATE TABLE disposible (
      provider varchar(30) NOT NULL,
      hashed_url varchar(100) NOT NULL,
      link varchar(100) NOT NULL,
      calendar_date timestamp NOT NULL,
      city_slug varchar(100) NOT NULL
);

CREATE INDEX ON disposible (provider);
CREATE INDEX ON disposible (hashed_url);
CREATE INDEX ON disposible (link);
CREATE INDEX ON disposible (city_slug);


CREATE TABLE gpx (
      provider varchar(30) NOT NULL,
      hashed_url varchar(100) NOT NULL,
      typ varchar(10) NOT NULL,
      waypoint int NOT NULL,
      lat decimal(12,9) DEFAULT NULL,
      lon decimal(12,9) DEFAULT NULL,
      ele decimal(12,8) DEFAULT NULL,
      PRIMARY KEY (provider, hashed_url, waypoint)
);

CREATE INDEX ON gpx (provider);
CREATE INDEX ON gpx (hashed_url);
CREATE INDEX ON gpx (typ);
CREATE INDEX ON gpx (waypoint);
CREATE INDEX ON gpx (lat);
CREATE INDEX ON gpx (lon);

ALTER TABLE provider ADD COLUMN allow_gpx_download varchar(1) default 'y';

ALTER TABLE kpi ALTER COLUMN name TYPE varchar(150);

CREATE TABLE city2tour (
      tour_id SERIAL,
      provider varchar(30) NOT NULL,
      hashed_url varchar(100) NOT NULL,
      city_slug varchar(64) NOT NULL,
      reachable_from_country varchar(2) NOT NULL,
      min_connection_duration int DEFAULT 200
);
CREATE INDEX ON city2tour (tour_id);
CREATE INDEX ON city2tour (city_slug);
CREATE INDEX ON city2tour (reachable_from_country);


ALTER TABLE fahrplan ADD COLUMN connection_description_json JSONB DEFAULT NULL;
ALTER TABLE fahrplan ADD COLUMN connection_lastregular_arrival_stop varchar(250) DEFAULT NULL;
ALTER TABLE fahrplan ADD COLUMN connection_lastregular_arrival_stop_lon decimal(12,9) DEFAULT NULL;
ALTER TABLE fahrplan ADD COLUMN connection_lastregular_arrival_stop_lat decimal(12,9) DEFAULT NULL;
ALTER TABLE fahrplan ADD COLUMN connection_lastregular_arrival_datetime timestamp DEFAULT NULL;
ALTER TABLE fahrplan ADD COLUMN return_description_json JSONB DEFAULT NULL;
ALTER TABLE fahrplan ADD COLUMN return_firstregular_departure_stop varchar(250) DEFAULT NULL;
ALTER TABLE fahrplan ADD COLUMN return_firstregular_departure_stop_lon decimal(12,9) DEFAULT NULL;
ALTER TABLE fahrplan ADD COLUMN return_firstregular_departure_stop_lat decimal(12,9) DEFAULT NULL;
ALTER TABLE fahrplan ADD COLUMN return_firstregular_departure_datetime timestamp DEFAULT NULL;

INSERT INTO kpi SELECT 'total_tours', COUNT(id) FROM tour;
INSERT INTO kpi SELECT CONCAT('total_tours_', f.city_slug) AS NAME, COUNT(DISTINCT t.id) AS VALUE FROM fahrplan AS f INNER JOIN tour AS t ON f.tour_provider=t.provider AND f.hashed_url=t.hashed_url GROUP BY f.city_slug;
INSERT INTO kpi SELECT 'total_connections', COUNT(id) FROM fahrplan;
INSERT INTO kpi SELECT 'total_ranges', COUNT(DISTINCT range) FROM tour;
INSERT INTO kpi SELECT 'total_cities', COUNT(DISTINCT city_slug) FROM city;
INSERT INTO kpi SELECT 'total_provider', COUNT(DISTINCT provider) FROM tour;