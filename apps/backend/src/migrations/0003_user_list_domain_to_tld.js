/**
 * 0003_user_list_domain_to_tld
 *
 * Migration 0002 was edited in-place (domain→tld) after it had already run on
 * dev, so the live user_list table has a `domain VARCHAR(64)` column instead of
 * `tld VARCHAR(2)`.  This migration brings those environments up to date.
 *
 * Safe to run on environments where 0002 created the table with `tld` already
 * (i.e. fresh installs): the DO $$ block checks for the column's existence
 * before touching anything.
 */

exports.up = async function (knex) {
    await knex.raw(`
        DO $$
        BEGIN
            -- Only act if the stale 'domain' column still exists
            IF EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name = 'user_list' AND column_name = 'domain'
            ) THEN
                -- Add tld with a sensible default derived from the stored domain
                ALTER TABLE user_list
                    ADD COLUMN tld VARCHAR(2) NOT NULL DEFAULT 'AT';

                -- Populate from the domain string using the same logic as
                -- get_domain_country() in utils.ts
                UPDATE user_list SET tld =
                    CASE
                        WHEN domain LIKE '%zuugle.de%' THEN 'DE'
                        WHEN domain LIKE '%zuugle.ch%' THEN 'CH'
                        WHEN domain LIKE '%zuugle.it%' THEN 'IT'
                        WHEN domain LIKE '%zuugle.si%' THEN 'SI'
                        WHEN domain LIKE '%zuugle.fr%' THEN 'FR'
                        WHEN domain LIKE '%zuugle.li%' THEN 'LI'
                        ELSE 'AT'
                    END;

                ALTER TABLE user_list DROP COLUMN domain;
            END IF;
        END
        $$;
    `);
};

exports.down = async function (knex) {
    await knex.raw(`
        DO $$
        BEGIN
            IF EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name = 'user_list' AND column_name = 'tld'
            ) THEN
                ALTER TABLE user_list
                    ADD COLUMN domain VARCHAR(64) NOT NULL DEFAULT 'zuugle.at';

                UPDATE user_list SET domain =
                    CASE tld
                        WHEN 'DE' THEN 'zuugle.de'
                        WHEN 'CH' THEN 'zuugle.ch'
                        WHEN 'IT' THEN 'zuugle.it'
                        WHEN 'SI' THEN 'zuugle.si'
                        WHEN 'FR' THEN 'zuugle.fr'
                        WHEN 'LI' THEN 'zuugle.li'
                        ELSE 'zuugle.at'
                    END;

                ALTER TABLE user_list DROP COLUMN tld;
            END IF;
        END
        $$;
    `);
};
