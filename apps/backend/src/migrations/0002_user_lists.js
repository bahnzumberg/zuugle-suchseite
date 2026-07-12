/**
 * 0002_user_lists
 *
 * Adds `user_list` and `user_list_tour` tables for the favourites / user-curated
 * tour-list feature.  Lists are identified by a long, random, URL-safe key so
 * they can be shared as links without authentication.
 *
 * CommonJS on purpose: run verbatim by the knex CLI, not compiled by tsc
 * (see tsconfig.json `exclude` and build:copy).
 */

exports.up = async function (knex) {
    await knex.raw(`
        CREATE TABLE user_list (
            id          SERIAL PRIMARY KEY,
            key         VARCHAR(48)  NOT NULL UNIQUE,
            name        VARCHAR(255) NOT NULL DEFAULT 'Meine Favoriten',
            language    VARCHAR(5)   NOT NULL DEFAULT 'de',
            tld         VARCHAR(2)   NOT NULL DEFAULT 'AT',
            created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
            updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
        );

        CREATE INDEX idx_user_list_key ON user_list (key);

        CREATE TABLE user_list_tour (
            user_list_id  INTEGER   NOT NULL REFERENCES user_list(id) ON DELETE CASCADE,
            tour_id       INTEGER   NOT NULL,
            added_at      TIMESTAMP NOT NULL DEFAULT NOW(),
            PRIMARY KEY (user_list_id, tour_id)
        );
    `);
};

exports.down = async function (knex) {
    await knex.raw(`
        DROP TABLE IF EXISTS user_list_tour;
        DROP TABLE IF EXISTS user_list;
    `);
};
