/**
 * 0007_user_list_sync
 *
 * Adds the schema for syncing a favourites list between devices (#882).
 *
 * `merged_into_id` tombstones a list that lost a merge instead of deleting it.
 * Deletion looks safe for two devices — the device that showed the code keeps
 * its key and never migrates — but once two devices already share a list, that
 * list can later become the losing side of another merge, and the device doing
 * the merging has no way to know which other devices still point at it. The
 * tombstone lets those devices find the surviving list on their next request.
 *
 * `user_list_pairing_code` holds the short, typeable code shown in the sync
 * dialog. It is deliberately not the list key: the key is a write capability,
 * and a code short enough to type would be short enough to guess.
 */

exports.up = async function (knex) {
    await knex.raw(`
        ALTER TABLE user_list
            ADD COLUMN IF NOT EXISTS merged_into_id INTEGER NULL
                REFERENCES user_list(id) ON DELETE SET NULL;

        CREATE INDEX IF NOT EXISTS idx_user_list_merged_into
            ON user_list (merged_into_id);

        CREATE TABLE IF NOT EXISTS user_list_pairing_code (
            code          VARCHAR(16)  PRIMARY KEY,
            user_list_id  INTEGER      NOT NULL REFERENCES user_list(id) ON DELETE CASCADE,
            tld           VARCHAR(2)   NOT NULL,
            expires_at    TIMESTAMP    NOT NULL,
            consumed_at   TIMESTAMP    NULL,
            created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
        );

        -- Lookup path for "expire the list's outstanding code before issuing a
        -- new one", and for pruning expired rows.
        CREATE INDEX IF NOT EXISTS idx_pairing_code_list
            ON user_list_pairing_code (user_list_id);
        CREATE INDEX IF NOT EXISTS idx_pairing_code_expires
            ON user_list_pairing_code (expires_at);
    `);
};

exports.down = async function (knex) {
    await knex.raw(`
        DROP TABLE IF EXISTS user_list_pairing_code;

        DROP INDEX IF EXISTS idx_user_list_merged_into;
        ALTER TABLE user_list DROP COLUMN IF EXISTS merged_into_id;
    `);
};
