/**
 * 0009_sync_state
 *
 * Adds `sync_state`, a single-row control table used by background sync jobs
 * (such as weather overlay generation) to persist synchronization state across
 * runs and dump restores.
 */

exports.up = async function (knex) {
    await knex.raw(`
CREATE TABLE IF NOT EXISTS sync_state (
    id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    weather_load_id int,
    weather_synced_at timestamptz
);

INSERT INTO sync_state (id) VALUES (1) ON CONFLICT DO NOTHING;
    `);
};

exports.down = async function (knex) {
    await knex.raw(`
DROP TABLE IF EXISTS sync_state;
    `);
};
