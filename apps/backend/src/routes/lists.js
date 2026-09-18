import express from "express";
import crypto from "crypto";
import knex from "../knex";
import { get_domain_country } from "../utils/utils";
import logger from "../utils/logger";
import { listsLimiter, pairingLimiter } from "../middlewares/rateLimit";

const router = express.Router();

// Default list names per supported language — must match the i18n key
// "lists.default_list_name" in each public/i18n/<lang>.json file.
const DEFAULT_LIST_NAMES = {
    de: "Meine Favoriten",
    en: "My Favourites",
    fr: "Mes favoris",
    it: "I miei preferiti",
    sl: "Moji priljubljeni",
};

/**
 * Generates a cryptographically random, URL-safe key (43 chars, ~256 bits).
 * @returns {string}
 */
const generateListKey = () => crypto.randomBytes(32).toString("base64url");

// Crockford base32: no I, L, O or U, so a code read off a screen and typed on
// another device can't be garbled into a different valid code.
const PAIRING_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const PAIRING_CODE_LENGTH = 8;
const PAIRING_CODE_TTL_MINUTES = 10;
// /pair flattens pointers at merge time (see the tombstone step below), so a
// chain is normally at most one hop. This just guards against an unbounded
// walk if that invariant is ever violated by a bug or manual data edit.
const MERGE_CHAIN_MAX_DEPTH = 10;

/**
 * Generates a random pairing code — short enough to type, unlike the list
 * key, since it's meant to be read off one device and typed into another.
 * @returns {string}
 */
const generatePairingCode = () =>
    Array.from(
        { length: PAIRING_CODE_LENGTH },
        // randomInt is rejection-sampled, so no modulo bias.
        () => PAIRING_ALPHABET[crypto.randomInt(0, PAIRING_ALPHABET.length)],
    ).join("");

/**
 * Normalises user-typed input to the stored code form: upper-cases, drops the
 * display separator, and applies Crockford's confusable mapping so "l0-i5"
 * and "L0I5" both reach the same code.
 * @param {unknown} input
 * @returns {string|null} null when the input can't be a code
 */
const normalizePairingCode = (input) => {
    if (typeof input !== "string") return null;
    const normalized = input
        .toUpperCase()
        .replace(/[\s-]/g, "")
        .replace(/[IL]/g, "1")
        .replace(/O/g, "0");
    return normalized.length === PAIRING_CODE_LENGTH && /^[0-9A-Z]+$/.test(normalized)
        ? normalized
        : null;
};

/**
 * The TLD of the domain the request came in on. Read from the Host header
 * rather than a request body field: it decides which lists may be paired, and
 * `hostMiddleware` has already checked the header against a whitelist.
 * @param {express.Request} req
 * @returns {string}
 */
const requestTld = (req) => get_domain_country(req.headers["host"]).toUpperCase();

/**
 * Walks `merged_into_id` from a list row to the list that ultimately absorbed
 * it. Devices left pointing at a merged-away list find their way back here.
 *
 * @param {object} origin a `user_list` row
 * @param {import("knex").Knex|import("knex").Knex.Transaction} db
 * @returns {Promise<{list: object|null, movedTo: string|null}>} `list` is null
 *   when the chain is broken — that is a genuine 404. `movedTo` is the surviving
 *   key, set only when the chain actually moved.
 */
const followMerges = async (origin, db = knex) => {
    let list = origin;
    const seen = new Set([origin.id]);

    while (list.merged_into_id) {
        if (seen.size > MERGE_CHAIN_MAX_DEPTH || seen.has(list.merged_into_id)) {
            logger.error(`Merge chain for list ${origin.key} is cyclic or too deep`);
            return { list: null, movedTo: null };
        }
        seen.add(list.merged_into_id);

        const next = await db("user_list").where({ id: list.merged_into_id }).first();
        // Defensive: this app never deletes a user_list row, only tombstones
        // it, so the chain should never dangle — but the FK allows it.
        if (!next) return { list: null, movedTo: null };
        list = next;
    }

    return { list, movedTo: list.id === origin.id ? null : list.key };
};

/**
 * Looks a list up by key and resolves it through any merges.
 *
 * @param {string} key
 * @param {import("knex").Knex|import("knex").Knex.Transaction} db
 * @returns {Promise<{list: object|null, movedTo: string|null}>} `list` is null
 *   when the key is unknown or its chain is broken — both are a genuine 404.
 */
const resolveList = async (key, db = knex) => {
    const origin = await db("user_list").where({ key }).first();
    if (!origin) return { list: null, movedTo: null };
    return followMerges(origin, db);
};

/**
 * Locks a list row and resolves it through any merges, right before writing
 * to its tours. An unlocked read taken earlier can go stale by the time the
 * write runs — a concurrent /pair merge could tombstone that exact list in
 * between — so the write must lock and re-resolve here instead. This is the
 * only correct way for a route in this file to turn a `:key` into a list
 * it's about to write to.
 *
 * @param {import("knex").Knex.Transaction} trx
 * @param {number} listId the *raw*, unresolved row id (e.g. req.listRow.id) —
 *   passing an id that's already been walked through followMerges reports no
 *   move even when the caller's key did, in fact, move.
 * @returns {Promise<{list: object|null, movedTo: string|null}>}
 */
const resolveLocked = async (trx, listId) => {
    const fresh = await trx("user_list").where({ id: listId }).forUpdate().first();
    if (!fresh) return { list: null, movedTo: null };
    return followMerges(fresh, trx);
};

// Resolves the `:key` route param to its raw row once for every route below
// that has it, and 404s early for an unknown key. Deliberately does not walk
// merges here — a write route must do that locked, immediately before
// writing (resolveLocked above), or it can race a concurrent /pair merge.
// Read-only routes call followMerges themselves when they need the resolved
// list; see GET /:key and POST /:key/pairing-code below. Runs after the rate
// limiter (route order below) and before the matched route's own handler.
router.param("key", async (req, res, next, key) => {
    const origin = await knex("user_list").where({ key }).first();
    if (!origin) {
        return res.status(404).json({ success: false, message: "List not found" });
    }
    req.listRow = origin;
    next();
});

// ─── POST /api/lists/pair ─────────────────────────────────────────────
// Merge the caller's list into the list a pairing code points at (#882).
// Body: { code: string, key?: string }
// Registered first, with its own limiter, so a request here is answered by
// this handler alone and never also falls through to the blanket listsLimiter
// registered below it — see the comment on that line.

/**
 * @swagger
 * /api/lists/pair:
 *   post:
 *     summary: Merge two lists using a pairing code
 *     description: >
 *       Merges the calling device's list into the list the code was issued for.
 *       The code-issuing list survives, so the device that showed the code keeps
 *       its key; the calling device adopts the returned key. The absorbed list is
 *       tombstoned rather than deleted, so any other device still pointing at it
 *       is redirected on its next request.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: Pairing code shown on the other device
 *               key:
 *                 type: string
 *                 description: Calling device's current list key. Omit if it has none.
 *     responses:
 *       200:
 *         description: Lists merged (or nothing to merge).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 key:
 *                   type: string
 *                   description: Key of the surviving list — store this from now on
 *                 merged:
 *                   type: integer
 *                   description: Number of tours the surviving list gained
 *                 total:
 *                   type: integer
 *       404:
 *         description: Code unknown, expired or already used.
 *       409:
 *         description: The two lists belong to different Zuugle domains.
 */
router.post("/pair", pairingLimiter, async (req, res) => {
    try {
        const code = normalizePairingCode(req.body.code);
        const ownKey = typeof req.body.key === "string" && req.body.key ? req.body.key : null;
        const tld = requestTld(req);

        // Unknown, malformed, expired and already-used codes are answered
        // identically so the endpoint can't be used to probe which codes exist.
        const notFound = { success: false, message: "Invalid or expired code" };
        const domainMismatch = { success: false, message: "Lists belong to different domains" };
        if (!code) {
            return res.status(404).json(notFound);
        }

        const outcome = await knex.transaction(async (trx) => {
            const codeRow = await trx("user_list_pairing_code")
                .where({ code })
                .whereNull("consumed_at")
                .where("expires_at", ">", trx.fn.now())
                .forUpdate()
                .first();
            if (!codeRow) return { status: 404, body: notFound };

            // Target (from the code) and source (the caller's own key, if any)
            // are unrelated lookups — resolve them concurrently.
            const resolveTarget = async () => {
                const origin = await trx("user_list").where({ id: codeRow.user_list_id }).first();
                if (!origin) return null;
                return (await followMerges(origin, trx)).list;
            };
            const [target, source] = await Promise.all([
                resolveTarget(),
                ownKey ? resolveList(ownKey, trx).then((r) => r.list) : null,
            ]);
            if (!target) return { status: 404, body: notFound };

            // Lists only ever pair within one Zuugle domain: a list carries the
            // TLD its tours are resolved against, so mixing them would silently
            // hide tours that aren't reachable from the other country.
            if (target.tld !== tld) {
                return { status: 409, body: domainMismatch };
            }
            if (source && source.tld !== tld) {
                return { status: 409, body: domainMismatch };
            }

            // Past this point the pairing attempt is valid, so spend the code
            // even if there turns out to be nothing to merge.
            await trx("user_list_pairing_code")
                .where({ code })
                .update({ consumed_at: trx.fn.now() });

            const totalOf = async (listId) => {
                const [{ count }] = await trx("user_list_tour")
                    .where({ user_list_id: listId })
                    .count();
                return Number(count);
            };
            const noMerge = async (survivor) => ({
                status: 200,
                body: {
                    success: true,
                    key: survivor.key,
                    merged: 0,
                    total: await totalOf(survivor.id),
                },
            });

            // Nothing to merge: either this device has no list yet, or its list
            // is already the code's target (it joined this list some other way).
            if (!source || source.id === target.id) {
                return noMerge(target);
            }

            // Lock both rows lowest id first so two devices pairing into each
            // other at the same moment can't deadlock. The locked rows are also
            // the freshest read of both lists, so resolve straight from them —
            // and since source and target don't depend on each other, resolve
            // both concurrently instead of one after the other.
            const ids = [source.id, target.id].sort((a, b) => a - b);
            const lockedRows = await trx("user_list").whereIn("id", ids).orderBy("id").forUpdate();
            const rowById = new Map(lockedRows.map((row) => [row.id, row]));

            const [sourceNow, targetNow] = await Promise.all([
                followMerges(rowById.get(source.id), trx),
                followMerges(rowById.get(target.id), trx),
            ]);
            if (!sourceNow.list || !targetNow.list) return { status: 404, body: notFound };
            // A concurrent pairing in the opposite direction may have already
            // merged these two lists while we were waiting for the lock.
            if (sourceNow.list.id === targetNow.list.id) {
                return noMerge(targetNow.list);
            }

            const from = sourceNow.list;
            const into = targetNow.list;
            const before = await totalOf(into.id);

            // Union the tours. A tour in both lists keeps the earlier added_at,
            // because the list is presented sorted by it.
            await trx.raw(
                `INSERT INTO user_list_tour (user_list_id, tour_id, added_at)
                 SELECT ?, tour_id, added_at FROM user_list_tour WHERE user_list_id = ?
                 ON CONFLICT (user_list_id, tour_id)
                 DO UPDATE SET added_at = LEAST(user_list_tour.added_at, EXCLUDED.added_at)`,
                [into.id, from.id],
            );

            const after = await totalOf(into.id);

            // Tombstone the absorbed list: drop its tours and point it at the
            // survivor. Any list that had already merged into `from` is
            // repointed straight at `into` too, so every chain stays at most
            // one hop deep — by induction, since this same flattening ran on
            // every prior merge, nothing could already point at `from` through
            // more than one hop. A code already outstanding for `from` is
            // deliberately left alive: followMerges sends whoever scans it to
            // the survivor, which is where they wanted to go anyway. (Retiring
            // it here would also deadlock against another device pairing in
            // the opposite direction, which holds a lock on exactly that row.)
            await trx("user_list_tour").where({ user_list_id: from.id }).del();
            await trx("user_list")
                .where({ merged_into_id: from.id })
                .update({ merged_into_id: into.id, updated_at: trx.fn.now() });
            await trx("user_list")
                .where({ id: from.id })
                .update({ merged_into_id: into.id, updated_at: trx.fn.now() });
            await trx("user_list").where({ id: into.id }).update({ updated_at: trx.fn.now() });

            return {
                status: 200,
                body: { success: true, key: into.key, merged: after - before, total: after },
            };
        });

        res.status(outcome.status).json(outcome.body);
    } catch (error) {
        logger.error("Error pairing lists:", error);
        res.status(500).json({ success: false, message: "Failed to pair lists" });
    }
});

// Every route below shares this background limit. /pair has its own, tighter
// limiter and must stay registered above this line — Express keeps walking
// app.use() layers after an earlier one matches the path, so reordering these
// would double-count a request to /pair against both counters.
router.use(listsLimiter);

// ─── POST /api/lists ──────────────────────────────────────────────
// Create a new list.
// Body: { name?: string, language?: string, domain?: string }
// The domain is converted to a 2-letter TLD (e.g. "www.zuugle.de" → "DE")
// and stored for direct joins with city2tour_flat.reachable_from_country.
// Returns: { success, key, name }

/**
 * @swagger
 * /api/lists:
 *   post:
 *     summary: Create a new tour list
 *     description: Creates a named tour list with a cryptographically random URL-safe key (~256 bits). The domain is converted to a 2-letter TLD for DB joins.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: List name (defaults to translated "My Favourites")
 *               language:
 *                 type: string
 *                 default: de
 *                 description: Language code (de, en, fr, it, sl)
 *               domain:
 *                 type: string
 *                 description: Domain for TLD extraction (e.g. www.zuugle.at)
 *     responses:
 *       201:
 *         description: List created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 key:
 *                   type: string
 *                   description: URL-safe list key (43 chars)
 *                 name:
 *                   type: string
 *       500:
 *         description: Server error.
 */
router.post("/", async (req, res) => {
    try {
        const language = req.body.language || "de";
        const name = req.body.name || DEFAULT_LIST_NAMES[language] || DEFAULT_LIST_NAMES.de;
        // Prefer the Host header over the body's `domain`: the TLD decides which
        // lists may be paired with each other, so it should not be
        // client-settable. Host is mandatory on every real HTTP request, so the
        // `domain` fallback below is only for callers that omit it entirely.
        const tld = req.headers["host"]
            ? requestTld(req)
            : get_domain_country(req.body.domain).toUpperCase();
        const key = generateListKey();

        await knex("user_list").insert({
            key,
            name,
            language,
            tld,
        });

        res.status(201).json({ success: true, key, name });
    } catch (error) {
        logger.error("Error creating user list:", error);
        res.status(500).json({ success: false, message: "Failed to create list" });
    }
});

// ─── POST /api/lists/:key/pairing-code ────────────────────────────────
// Issue a short, typeable code for this list so another device can merge
// into it. Deliberately not the list key — see generatePairingCode.

/**
 * @swagger
 * /api/lists/{key}/pairing-code:
 *   post:
 *     summary: Issue a pairing code for a list
 *     description: >
 *       Returns a short single-use code, valid for a few minutes, that another
 *       device passes to POST /api/lists/pair. Issuing a code retires any code
 *       still outstanding for the same list, so only one is ever live.
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Code issued.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 code:
 *                   type: string
 *                 expires_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: List not found.
 */
router.post("/:key/pairing-code", async (req, res) => {
    try {
        const { list, movedTo } = await followMerges(req.listRow, knex);
        if (!list) {
            return res.status(404).json({ success: false, message: "List not found" });
        }

        const expiresAt = new Date(Date.now() + PAIRING_CODE_TTL_MINUTES * 60 * 1000);

        // Retry on the vanishingly unlikely collision with a code that is still
        // on file (32^8 possibilities against a handful of live codes).
        let code = null;
        for (let attempt = 0; attempt < 5 && !code; attempt++) {
            const candidate = generatePairingCode();
            try {
                await knex.transaction(async (trx) => {
                    // Lock the list so two concurrent requests for it can't both
                    // see zero codes to retire and both insert one — without
                    // this, a double-tap on "generate code" can leave two live
                    // codes for the same list instead of one.
                    await trx("user_list").where({ id: list.id }).forUpdate().first();

                    // Retire any code still live for this list — only one
                    // should ever be valid at a time.
                    await trx("user_list_pairing_code")
                        .where({ user_list_id: list.id })
                        .whereNull("consumed_at")
                        .update({ expires_at: trx.fn.now() });

                    await trx("user_list_pairing_code").insert({
                        code: candidate,
                        user_list_id: list.id,
                        tld: list.tld,
                        expires_at: expiresAt,
                    });
                });
                code = candidate;
            } catch (error) {
                // 23505 = unique_violation. Anything else is a real failure.
                if (error.code !== "23505") throw error;
            }
        }

        if (!code) {
            logger.error("Could not generate a unique pairing code after 5 attempts");
            return res.status(500).json({ success: false, message: "Failed to issue code" });
        }

        res.status(201).json({
            success: true,
            code,
            expires_at: expiresAt.toISOString(),
            moved_to: movedTo,
        });
    } catch (error) {
        logger.error("Error issuing pairing code:", error);
        res.status(500).json({ success: false, message: "Failed to issue code" });
    }
});

// ─── GET /api/lists/:key ──────────────────────────────────────────
// Get list metadata + tours (from city2tour_flat, same fields as search).
// No domain parameter needed — uses the TLD stored in user_list.

/**
 * @swagger
 * /api/lists/{key}:
 *   get:
 *     summary: Get a tour list by key
 *     description: Returns list metadata and all tours (from city2tour_flat) using the stored TLD. No domain parameter needed.
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: URL-safe list key (43 chars)
 *     responses:
 *       200:
 *         description: List with tours.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 list:
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *                     name:
 *                       type: string
 *                     language:
 *                       type: string
 *                     tld:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                 tours:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 *       404:
 *         description: List not found.
 */
router.get("/:key", async (req, res) => {
    try {
        const { list, movedTo } = await followMerges(req.listRow, knex);
        if (!list) {
            return res.status(404).json({ success: false, message: "List not found" });
        }

        const tourEntries = await knex("user_list_tour")
            .where({ user_list_id: list.id })
            .orderBy("added_at", "desc");

        if (tourEntries.length === 0) {
            return res.status(200).json({
                success: true,
                moved_to: movedTo,
                list: {
                    key: list.key,
                    name: list.name,
                    language: list.language,
                    tld: list.tld,
                    created_at: list.created_at,
                    updated_at: list.updated_at,
                },
                tours: [],
                total: 0,
            });
        }

        const tourIds = tourEntries.map((e) => e.tour_id);

        // Query city2tour_flat using the stored TLD — same fields as search.
        // Tours not in city2tour_flat (e.g. inactive with no connections)
        // are silently excluded from the response but remain in user_list_tour.
        const result = await knex.raw(
            `SELECT
                t.id,
                t.provider,
                t.provider_name,
                t.url,
                t.title,
                t.image_url,
                t.country,
                t.range,
                t.type,
                -- city2tour_flat carries one row per originating city, so the
                -- connection-dependent columns have to be aggregated: grouping
                -- by them instead returns the same tour once per city, which
                -- also made the total count cities rather than tours. Same idiom
                -- as the search query in tours.js.
                MIN(t.min_connection_duration) AS min_connection_duration,
                MIN(t.min_connection_no_of_transfers) AS min_connection_no_of_transfers,
                ROUND(MIN(t.avg_total_tour_duration)*100/25)*25/100 AS avg_total_tour_duration,
                t.ascent,
                t.number_of_days,
                t.quality_rating,
                t.traverse
            FROM city2tour_flat AS t
            WHERE t.reachable_from_country = ?
              AND t.id IN (${tourIds.map(() => "?").join(", ")})
            GROUP BY t.id, t.provider, t.provider_name, t.url, t.title,
                     t.image_url, t.country, t.range, t.type,
                     t.ascent, t.number_of_days,
                     t.quality_rating, t.traverse`,
            [list.tld, ...tourIds],
        );

        const tours = result.rows || [];

        // Enrich each tour with list-specific fields (added_at)
        const addedAtMap = new Map(tourEntries.map((e) => [e.tour_id, e.added_at]));
        const enrichedTours = tours.map((tour) => ({
            ...tour,
            added_at: addedAtMap.get(tour.id) || null,
        }));

        // Sort by added_at descending (most recently added first)
        enrichedTours.sort((a, b) => {
            if (!a.added_at || !b.added_at) return 0;
            return new Date(b.added_at).getTime() - new Date(a.added_at).getTime();
        });

        res.status(200).json({
            success: true,
            moved_to: movedTo,
            list: {
                key: list.key,
                name: list.name,
                language: list.language,
                tld: list.tld,
                created_at: list.created_at,
                updated_at: list.updated_at,
            },
            tours: enrichedTours,
            total: enrichedTours.length,
        });
    } catch (error) {
        logger.error("Error fetching user list:", error);
        res.status(500).json({ success: false, message: "Failed to fetch list" });
    }
});

// ─── POST /api/lists/:key/tours ───────────────────────────────────────
// Add a tour to a list.
// Body: { tour_id: number }
// Validates that the tour exists in `tour` or `tour_inactive`.

/**
 * @swagger
 * /api/lists/{key}/tours:
 *   post:
 *     summary: Add a tour to a list
 *     description: Adds a tour to the list identified by key. The tour must exist in the `tour` or `tour_inactive` table. Duplicate adds are idempotent.
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tour_id
 *             properties:
 *               tour_id:
 *                 type: integer
 *                 description: ID of the tour to add
 *     responses:
 *       200:
 *         description: Tour added (or already present).
 *       400:
 *         description: Invalid or missing tour_id.
 *       404:
 *         description: List or tour not found.
 */
router.post("/:key/tours", async (req, res) => {
    try {
        const tourId = parseInt(req.body.tour_id, 10);

        if (!tourId || isNaN(tourId)) {
            return res.status(400).json({ success: false, message: "Invalid tour_id" });
        }

        const tourExists = await knex.raw(
            `SELECT id FROM tour WHERE id = ?
             UNION ALL
             SELECT id FROM tour_inactive WHERE id = ?
             LIMIT 1`,
            [tourId, tourId],
        );

        if (!tourExists.rows || tourExists.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Tour not found" });
        }

        // Resolve locked, right before writing — see resolveLocked.
        const outcome = await knex.transaction(async (trx) => {
            const { list, movedTo } = await resolveLocked(trx, req.listRow.id);
            if (!list) {
                return { status: 404, body: { success: false, message: "List not found" } };
            }

            await trx.raw(
                `INSERT INTO user_list_tour (user_list_id, tour_id)
                 VALUES (?, ?)
                 ON CONFLICT (user_list_id, tour_id) DO NOTHING`,
                [list.id, tourId],
            );

            await trx("user_list").where({ id: list.id }).update({ updated_at: trx.fn.now() });

            return { status: 200, body: { success: true, moved_to: movedTo } };
        });

        res.status(outcome.status).json(outcome.body);
    } catch (error) {
        logger.error("Error adding tour to list:", error);
        res.status(500).json({ success: false, message: "Failed to add tour" });
    }
});

// ─── DELETE /api/lists/:key/tours/:tourId ─────────────────────────────
// Remove a tour from a list.

/**
 * @swagger
 * /api/lists/{key}/tours/{tourId}:
 *   delete:
 *     summary: Remove a tour from a list
 *     description: Removes the specified tour from the list. Updates the list's updated_at timestamp.
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: tourId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tour removed.
 *       400:
 *         description: Invalid tour ID.
 *       404:
 *         description: List not found or tour not in list.
 */
router.delete("/:key/tours/:tourId", async (req, res) => {
    try {
        const tourId = parseInt(req.params.tourId, 10);

        if (!tourId || isNaN(tourId)) {
            return res.status(400).json({ success: false, message: "Invalid tour_id" });
        }

        // Resolve locked, right before writing — see the matching note on the
        // add route and resolveLocked.
        const outcome = await knex.transaction(async (trx) => {
            const { list, movedTo } = await resolveLocked(trx, req.listRow.id);
            if (!list) {
                return { status: 404, body: { success: false, message: "List not found" } };
            }

            const deleted = await trx("user_list_tour")
                .where({ user_list_id: list.id, tour_id: tourId })
                .del();

            if (deleted === 0) {
                return {
                    status: 404,
                    body: { success: false, moved_to: movedTo, message: "Tour not in list" },
                };
            }

            await trx("user_list").where({ id: list.id }).update({ updated_at: trx.fn.now() });

            return { status: 200, body: { success: true, moved_to: movedTo } };
        });

        res.status(outcome.status).json(outcome.body);
    } catch (error) {
        logger.error("Error removing tour from list:", error);
        res.status(500).json({ success: false, message: "Failed to remove tour" });
    }
});

export default router;
