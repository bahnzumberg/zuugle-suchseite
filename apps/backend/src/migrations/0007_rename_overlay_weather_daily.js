/**
 * 0007_rename_overlay_weather_daily
 *
 * Renames `newest_weather_daily` (added in [0006_newest_weather_daily]) to
 * `overlay_weather_daily`, along with its two indexes, to match the weather
 * overlay job that reads it.
 *
 */

exports.up = async function (knex) {
    await knex.raw(`
ALTER TABLE IF EXISTS newest_weather_daily RENAME TO overlay_weather_daily;

ALTER INDEX IF EXISTS newest_weather_daily_pk RENAME TO overlay_weather_daily_pk;
ALTER INDEX IF EXISTS newest_weather_daily_idx RENAME TO overlay_weather_daily_idx;
    `);
};

exports.down = async function (knex) {
    await knex.raw(`
ALTER TABLE IF EXISTS overlay_weather_daily RENAME TO newest_weather_daily;

ALTER INDEX IF EXISTS overlay_weather_daily_pk RENAME TO newest_weather_daily_pk;
ALTER INDEX IF EXISTS overlay_weather_daily_idx RENAME TO newest_weather_daily_idx;
    `);
};
