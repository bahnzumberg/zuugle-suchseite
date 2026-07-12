import express from "express";
import crypto from "crypto";
import knex from "../knex";
import { get_domain_country } from "../utils/utils";
import logger from "../utils/logger";

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

// ─── POST /api/lists ──────────────────────────────────────────────
// Create a new list.
// Body: { name?: string, language?: string, domain: string }
// Returns: { success, key, name }
router.post("/", async (req, res) => {
    try {
        const language = req.body.language || "de";
        const name = req.body.name || DEFAULT_LIST_NAMES[language] || DEFAULT_LIST_NAMES.de;
        const domain = req.body.domain || "zuugle.at";
        const key = generateListKey();

        await knex("user_list").insert({
            key,
            name,
            language,
            domain,
        });

        res.status(201).json({ success: true, key, name });
    } catch (error) {
        logger.error("Error creating user list:", error);
        res.status(500).json({ success: false, message: "Failed to create list" });
    }
});

// ─── GET /api/lists/:key ──────────────────────────────────────────
// Get list metadata + tours (from city2tour_flat, same fields as search).
// Query: domain (required for TLD-based country filtering)
router.get("/:key", async (req, res) => {
    try {
        const { key } = req.params;
        const domain = req.query.domain || "zuugle.at";
        const tld = get_domain_country(domain).toUpperCase();

        // Fetch list metadata
        const list = await knex("user_list").where({ key }).first();
        if (!list) {
            return res.status(404).json({ success: false, message: "List not found" });
        }

        // Fetch tour IDs from the junction table
        const tourEntries = await knex("user_list_tour")
            .where({ user_list_id: list.id })
            .orderBy("added_at", "desc");

        if (tourEntries.length === 0) {
            return res.status(200).json({
                success: true,
                list: {
                    key: list.key,
                    name: list.name,
                    language: list.language,
                    domain: list.domain,
                    created_at: list.created_at,
                    updated_at: list.updated_at,
                },
                tours: [],
                total: 0,
            });
        }

        const tourIds = tourEntries.map((e) => e.tour_id);

        // Query city2tour_flat with the same fields as the search endpoint.
        // Tours that are not in city2tour_flat (e.g. inactive with no
        // connections) are silently excluded from the response but remain
        // in user_list_tour.
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
                t.min_connection_duration,
                t.min_connection_no_of_transfers,
                ROUND(t.avg_total_tour_duration*100/25)*25/100 AS avg_total_tour_duration,
                t.ascent,
                t.number_of_days,
                t.quality_rating,
                t.traverse
            FROM city2tour_flat AS t
            WHERE t.reachable_from_country = ?
              AND t.id IN (${tourIds.map(() => "?").join(", ")})
            GROUP BY t.id, t.provider, t.provider_name, t.url, t.title,
                     t.image_url, t.country, t.range, t.type,
                     t.min_connection_duration, t.min_connection_no_of_transfers,
                     t.avg_total_tour_duration, t.ascent, t.number_of_days,
                     t.quality_rating, t.traverse`,
            [tld, ...tourIds],
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
            list: {
                key: list.key,
                name: list.name,
                language: list.language,
                domain: list.domain,
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

// ─── POST /api/lists/:key/tours ───────────────────────────────────
// Add a tour to a list.
// Body: { tour_id: number }
// Validates that the tour exists in `tour` or `tour_inactive`.
router.post("/:key/tours", async (req, res) => {
    try {
        const { key } = req.params;
        const tourId = parseInt(req.body.tour_id, 10);

        if (!tourId || isNaN(tourId)) {
            return res.status(400).json({ success: false, message: "Invalid tour_id" });
        }

        // Find the list
        const list = await knex("user_list").where({ key }).first();
        if (!list) {
            return res.status(404).json({ success: false, message: "List not found" });
        }

        // Verify tour exists in tour OR tour_inactive
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

        // Insert (idempotent: ON CONFLICT DO NOTHING)
        await knex.raw(
            `INSERT INTO user_list_tour (user_list_id, tour_id)
             VALUES (?, ?)
             ON CONFLICT (user_list_id, tour_id) DO NOTHING`,
            [list.id, tourId],
        );

        // Touch updated_at on the list
        await knex("user_list").where({ id: list.id }).update({ updated_at: knex.fn.now() });

        res.status(200).json({ success: true });
    } catch (error) {
        logger.error("Error adding tour to list:", error);
        res.status(500).json({ success: false, message: "Failed to add tour" });
    }
});

// ─── DELETE /api/lists/:key/tours/:tourId ─────────────────────────
// Remove a tour from a list.
router.delete("/:key/tours/:tourId", async (req, res) => {
    try {
        const { key } = req.params;
        const tourId = parseInt(req.params.tourId, 10);

        if (!tourId || isNaN(tourId)) {
            return res.status(400).json({ success: false, message: "Invalid tour_id" });
        }

        // Find the list
        const list = await knex("user_list").where({ key }).first();
        if (!list) {
            return res.status(404).json({ success: false, message: "List not found" });
        }

        const deleted = await knex("user_list_tour")
            .where({ user_list_id: list.id, tour_id: tourId })
            .del();

        if (deleted === 0) {
            return res.status(404).json({ success: false, message: "Tour not in list" });
        }

        // Touch updated_at on the list
        await knex("user_list").where({ id: list.id }).update({ updated_at: knex.fn.now() });

        res.status(200).json({ success: true });
    } catch (error) {
        logger.error("Error removing tour from list:", error);
        res.status(500).json({ success: false, message: "Failed to remove tour" });
    }
});

export default router;
