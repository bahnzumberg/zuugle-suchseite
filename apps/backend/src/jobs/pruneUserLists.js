// One-shot script: enforces the retention limit on anonymous favourites lists.
// Meant to be run from cron — see deploy/loaders/README.md.
//
// Two sweeps, both safe to repeat:
//   * favourites lists nobody has used for RETENTION_MONTHS, and
//   * pairing codes that are long past their ten-minute window.
//
// The retention period is stated in the privacy policy ("privacy.favoriten_
// speicherdauer" in assets/i18n/*.json) — change it in both places or not at all.
import knex from "../knex";
import logger from "../utils/logger";

const RETENTION_MONTHS = 24;

/**
 * Deletes lists that have gone untouched for the retention period, along with
 * their tours and pairing codes (both cascade from `user_list`).
 * @returns {Promise<number>} rows deleted
 */
const pruneInactiveLists = async () => {
    // `inactive` only considers lists that are still real — a tombstone's own
    // timestamps stopped moving at the merge that retired it, and it must live
    // exactly as long as the list it redirects to.
    //
    // `doomed` then collects those tombstones. Deleting a survivor without them
    // would fire the FK's ON DELETE SET NULL and leave a tombstone behind that
    // no longer redirects anywhere: a device still pointing at it would silently
    // read an empty list instead of finding out its list is gone. The recursion
    // is one hop deep in practice (POST /pair flattens chains as it merges) and
    // UNION terminates even if a bug ever produced a cycle.
    const { rowCount } = await knex.raw(
        `WITH RECURSIVE inactive AS (
             SELECT id FROM user_list
              WHERE merged_into_id IS NULL
                AND GREATEST(updated_at, last_seen_at) < NOW() - ?::interval
         ),
         doomed AS (
             SELECT id FROM inactive
              UNION
             SELECT l.id FROM user_list l JOIN doomed d ON l.merged_into_id = d.id
         )
         DELETE FROM user_list WHERE id IN (SELECT id FROM doomed)`,
        [`${RETENTION_MONTHS} months`],
    );
    return rowCount;
};

/**
 * Deletes spent pairing codes. Issuing a code already drops the list's previous
 * one, so this only catches codes whose list never asked for another; a day's
 * grace past a ten-minute TTL covers consumed codes too, since nothing reads a
 * code once it is expired or consumed.
 * @returns {Promise<number>} rows deleted
 */
const pruneExpiredPairingCodes = () =>
    knex("user_list_pairing_code")
        .where("expires_at", "<", knex.raw("NOW() - INTERVAL '1 day'"))
        .del();

// One after the other: deleting a list cascades into its pairing codes, so
// running both sweeps at once would have them deleting overlapping rows.
pruneInactiveLists()
    .then(async (lists) => {
        const codes = await pruneExpiredPairingCodes();
        logger.info(
            `Pruned ${lists} favourites list(s) unused for ${RETENTION_MONTHS} months and ${codes} expired pairing code(s).`,
        );
        process.exit(0);
    })
    .catch((error) => {
        logger.error("Error pruning user lists:", error);
        process.exit(1);
    });
