/**
 * 0010_fahrplan_obsolete_columns_drop_not_null
 *
 * Drops NOT NULL constraints on legacy/obsolete columns in `fahrplan`:
 * - tour_provider
 * - date_any_connection
 * - city_name
 * - connection_returns_warning_level
 * - connection_returns_warning
 *
 * These columns are no longer consumed by the frontend or backend, allowing
 * upstream ETL processes to omit them when staging data.
 */

exports.up = async function (knex) {
    await knex.raw(`
ALTER TABLE fahrplan ALTER COLUMN tour_provider DROP NOT NULL;
ALTER TABLE fahrplan ALTER COLUMN date_any_connection DROP NOT NULL;
ALTER TABLE fahrplan ALTER COLUMN city_name DROP NOT NULL;
ALTER TABLE fahrplan ALTER COLUMN connection_returns_warning_level DROP NOT NULL;
ALTER TABLE fahrplan ALTER COLUMN connection_returns_warning DROP NOT NULL;
    `);
};

exports.down = async function (knex) {
    await knex.raw(`
UPDATE fahrplan SET tour_provider = COALESCE(tour_provider, '') WHERE tour_provider IS NULL;
UPDATE fahrplan SET date_any_connection = COALESCE(date_any_connection, 'no') WHERE date_any_connection IS NULL;
UPDATE fahrplan SET city_name = COALESCE(city_name, '') WHERE city_name IS NULL;
UPDATE fahrplan SET connection_returns_warning_level = COALESCE(connection_returns_warning_level, 0) WHERE connection_returns_warning_level IS NULL;
UPDATE fahrplan SET connection_returns_warning = COALESCE(connection_returns_warning, '') WHERE connection_returns_warning IS NULL;

ALTER TABLE fahrplan ALTER COLUMN tour_provider SET NOT NULL;
ALTER TABLE fahrplan ALTER COLUMN date_any_connection SET NOT NULL;
ALTER TABLE fahrplan ALTER COLUMN city_name SET NOT NULL;
ALTER TABLE fahrplan ALTER COLUMN connection_returns_warning_level SET NOT NULL;
ALTER TABLE fahrplan ALTER COLUMN connection_returns_warning SET NOT NULL;
    `);
};
