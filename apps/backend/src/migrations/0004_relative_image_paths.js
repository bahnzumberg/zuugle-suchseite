/**
 * 0004_relative_image_paths
 *
 * `image_url` used to be written as an absolute production URL
 * (`https://cdn.zuugle.at/...`), so UAT, DEV and local all served production's
 * images no matter which environment they ran on. Image paths are now stored
 * host-free (`/range-image/x.webp` — see `src/utils/assetPaths.ts`) and the
 * frontend prefixes them with its own asset base.
 *
 * This migration brings the two tables that hold such paths in line and
 * redefines the trigger function that copies `tour.image_url` into
 * `city2tour_flat`, whose fallback still hardcoded the CDN.
 *
 * `0001_baseline.js` keeps its original definition on purpose — it has already
 * run everywhere, and `CREATE OR REPLACE` here supersedes it on fresh installs
 * too.
 *
 * Provider images (`cdn.bahn-zum-berg.at` and other external hosts, including
 * their `?width=`/`?height=` parameters) are left untouched.
 */

// Strips our own host and the two historical prefixes; leaves anything else as is.
const NORMALISE_SQL = `regexp_replace(
    regexp_replace(image_url, '^https?://cdn\\.zuugle\\.at', ''),
    '^(/public|/app_static)/', '/')`;

const OUR_LEGACY_URLS = `image_url LIKE 'http://cdn.zuugle.at%'
    OR image_url LIKE 'https://cdn.zuugle.at%'
    OR image_url LIKE '/public/%'
    OR image_url LIKE '/app_static/%'`;

// The paths `up` leaves behind. `/public` and `/app_static` are not restored by
// `down` — they were inconsistent spellings of the same files.
const OUR_RELATIVE_PATHS = `image_url LIKE '/gpx-image/%'
    OR image_url LIKE '/range-image/%'
    OR image_url LIKE '/img/%'`;

const syncTriggerFunction = (placeholder) => `
    CREATE OR REPLACE FUNCTION sync_tour_image_to_flat()
    RETURNS TRIGGER AS $$
    BEGIN
        UPDATE city2tour_flat
        SET image_url = COALESCE(NULLIF(NEW.image_url, ''), '${placeholder}')
        WHERE id = NEW.id;

        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
`;

/**
 * Rewrites `image_url` in both tables that hold it.
 *
 * `city2tour_flat` goes first, while the trigger is still live, so the lock the
 * `DISABLE TRIGGER` takes on `tour` is held for as short a stretch of the
 * migration's transaction as possible. The trigger is then disabled rather than
 * left to cascade from `tour`: the flat rows are already correct by that point,
 * so a cascade would only repeat the same writes, one plpgsql call per row.
 */
async function rewriteImageUrls(knex, valueSql, whereSql) {
    await knex.raw(`UPDATE city2tour_flat SET image_url = ${valueSql} WHERE ${whereSql};`);

    await knex.raw(`ALTER TABLE tour DISABLE TRIGGER trg_update_tour_image;`);
    try {
        await knex.raw(`UPDATE tour SET image_url = ${valueSql} WHERE ${whereSql};`);
    } finally {
        await knex.raw(`ALTER TABLE tour ENABLE TRIGGER trg_update_tour_image;`);
    }
}

exports.up = async function (knex) {
    await knex.raw(syncTriggerFunction("/img/train_placeholder.webp"));
    await rewriteImageUrls(knex, NORMALISE_SQL, OUR_LEGACY_URLS);
};

exports.down = async function (knex) {
    await knex.raw(syncTriggerFunction("https://cdn.zuugle.at/img/train_placeholder.webp"));
    await rewriteImageUrls(knex, `'https://cdn.zuugle.at' || image_url`, OUR_RELATIVE_PATHS);
};
