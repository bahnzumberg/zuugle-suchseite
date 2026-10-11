/**
 * 0009_tour_weather_freezing_level
 *
 * Adds `tour_freezing_level` (metres above sea level) to `tour_weather_1h`
 * from [0005_tour_weather]. Named like the other tour columns, which drop the
 * aggregate suffix of their source (`freezing_level_mean` in
 * `weather.newest_weather_1h`). The external weather import fills it; until
 * it does, the column stays NULL and the detail page hides the
 * freezing-level row.
 *
 */

exports.up = async function (knex) {
    await knex.raw(`
ALTER TABLE tour_weather_1h ADD COLUMN IF NOT EXISTS tour_freezing_level decimal(9,2);
    `);
};

exports.down = async function (knex) {
    await knex.raw(`
ALTER TABLE tour_weather_1h DROP COLUMN IF EXISTS tour_freezing_level;
    `);
};
