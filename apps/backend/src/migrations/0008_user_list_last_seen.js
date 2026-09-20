/**
 * 0008_user_list_last_seen
 *
 * Adds `last_seen_at` so a favourites list can be retired once nobody uses it
 * any more (see `jobs/pruneUserLists.js`, and the retention period stated in
 * the privacy policy).
 *
 * `updated_at` alone is the wrong clock for that: it only moves when the list
 * changes, so someone who saves a handful of tours and then just looks at them
 * would have the list swept out from under them. This column moves on reads.
 *
 * Existing rows start at NOW(), which restarts the clock for every list that
 * already exists — deliberately conservative, since we have no read history
 * for them.
 *
 * CommonJS on purpose: run verbatim by the knex CLI, not compiled by tsc
 * (see tsconfig.json `exclude` and build:copy).
 */

exports.up = async function (knex) {
    await knex.raw(`
        ALTER TABLE user_list
            ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP NOT NULL DEFAULT NOW();
    `);
};

exports.down = async function (knex) {
    await knex.raw(`
        ALTER TABLE user_list DROP COLUMN IF EXISTS last_seen_at;
    `);
};
