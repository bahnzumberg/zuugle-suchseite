/**
 * 0006_newest_weather_daily
 *
 * Adds `newest_weather_daily`, the per-coordinate daily forecast the tour
 * weather tables in [0005_tour_weather] are derived from: one row per day and
 * rounded lat/lon grid point, carrying local sunrise/sunset and the day's
 * lowest weather score.
 *
 */

exports.up = async function (knex) {
    await knex.raw(`
CREATE TABLE IF NOT EXISTS newest_weather_daily (
      load_id int NOT NULL,
      weather_date date NOT NULL,
      lat decimal(4,1) NOT NULL,
      lon decimal(4,1) NOT NULL,
      sunrise_local time,
      sunset_local time,
      weather_score_min decimal(4,1)
);

CREATE UNIQUE INDEX IF NOT EXISTS newest_weather_daily_pk
    ON newest_weather_daily (weather_date, lat, lon);
CREATE INDEX IF NOT EXISTS newest_weather_daily_idx
    ON newest_weather_daily (lat, lon);
    `);
};

exports.down = async function (knex) {
    await knex.raw(`
DROP TABLE IF EXISTS newest_weather_daily;
    `);
};
