/**
 * 0005_tour_weather
 *
 * Adds the two weather tables the tour weather import writes to:
 *   - `tour_weather_daily` — one row per tour and day (sunrise/sunset, score)
 *   - `tour_weather_1h`    — one row per tour, day and hourly timeslot
 *
 * Both are keyed by (provider, hashed_url) like the other per-tour tables
 * (`fahrplan`, `gpx`), plus the date (and timeslot) of the forecast.
 *
 */

exports.up = async function (knex) {
    await knex.raw(`
CREATE TABLE IF NOT EXISTS tour_weather_daily (
      provider varchar(30) NOT NULL,
      hashed_url varchar(100) NOT NULL,
      weather_date date NOT NULL,
      tour_sunrise time,
      tour_sunset time,
      tour_weather_score decimal(4,1)
);

CREATE UNIQUE INDEX IF NOT EXISTS tour_weather_daily_pk
    ON tour_weather_daily (provider, hashed_url, weather_date);
CREATE INDEX IF NOT EXISTS tour_weather_daily_idx
    ON tour_weather_daily (provider, hashed_url);

CREATE TABLE IF NOT EXISTS tour_weather_1h (
      provider varchar(30) NOT NULL,
      hashed_url varchar(100) NOT NULL,
      weather_date date NOT NULL,
      weather_timeslot smallint NOT NULL,
      tour_thunderstorm_probability decimal(9,2),
      tour_precipitation decimal(9,2),
      tour_temperature_2m_high decimal(9,2),
      tour_temperature_2m_low decimal(9,2),
      tour_wind_direction_10m decimal(9,2),
      tour_wind_speed_10m decimal(9,2),
      tour_sunshine_duration decimal(9,2)
);

CREATE UNIQUE INDEX IF NOT EXISTS tour_weather_1h_pk
    ON tour_weather_1h (provider, hashed_url, weather_date, weather_timeslot);
CREATE INDEX IF NOT EXISTS tour_weather_1h_idx
    ON tour_weather_1h (provider, hashed_url);
    `);
};

exports.down = async function (knex) {
    await knex.raw(`
DROP TABLE IF EXISTS tour_weather_1h;
DROP TABLE IF EXISTS tour_weather_daily;
    `);
};
