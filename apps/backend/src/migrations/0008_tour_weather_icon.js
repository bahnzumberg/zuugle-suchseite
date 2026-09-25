/**
 * 0008_tour_weather_icon
 *
 * Adds `tour_weather_icon` to both tour weather tables from
 * [0005_tour_weather]: the icon id for the day (`tour_weather_daily`) and for
 * the hourly timeslot (`tour_weather_1h`).
 *
 */

exports.up = async function (knex) {
    await knex.raw(`
ALTER TABLE tour_weather_daily ADD COLUMN IF NOT EXISTS tour_weather_icon smallint;
ALTER TABLE tour_weather_1h ADD COLUMN IF NOT EXISTS tour_weather_icon smallint;
    `);
};

exports.down = async function (knex) {
    await knex.raw(`
ALTER TABLE tour_weather_1h DROP COLUMN IF EXISTS tour_weather_icon;
ALTER TABLE tour_weather_daily DROP COLUMN IF EXISTS tour_weather_icon;
    `);
};
