import express from "express";
import { existsSync } from "fs";
import path from "path";
import logger from "../utils/logger";

const CONFIG_PATH = path.resolve(__dirname, "../diana-config.js");

// Lazy-load credentials on first request — avoids top-level await
let CLIENT_ID, CLIENT_SECRET;
let configLoaded = false;

async function loadConfig() {
    if (configLoaded) return true;
    if (!existsSync(CONFIG_PATH)) return false;
    try {
        ({ CLIENT_ID, CLIENT_SECRET } = await import("../diana-config.js"));
        configLoaded = true;
        return true;
    } catch {
        return false;
    }
}

const router = express.Router();

const DIANA_TOKEN_URL = "https://api.zuugle-services.net/o/token/";

/**
 * GET /api/diana-token
 *
 * Fetches an OAuth2 access token from the Diana GreenConnect API using the
 * Client Credentials Grant. Returns only the access_token and expires_in
 * to the frontend — never the client credentials themselves.
 *
 * The frontend calls this endpoint:
 *   1. On initial page load to get a token
 *   2. On HTTP 401 from the Diana API to refresh the token
 */
router.get("/", async (req, res) => {
    const ok = await loadConfig();
    if (!ok || !CLIENT_ID || !CLIENT_SECRET) {
        return res.status(503).json({
            success: false,
            error: "Credentials for Diana GreenConnect API are missing. Maybe you have to rename diana-config.js.example to diana-config.js?",
        });
    }

    try {
        const body = new URLSearchParams({
            grant_type: "client_credentials",
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        });

        const fetchOptions = {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString(),
        };

        const response = await fetch(DIANA_TOKEN_URL, fetchOptions);

        if (!response.ok) {
            const errorText = await response.text();
            logger.error(
                `Diana token request failed. HTTP ${response.status}. Response: ${errorText}`,
            );
            return res.status(502).json({
                success: false,
                error: "Failed to obtain Diana token",
            });
        }

        const tokenData = await response.json();

        if (!tokenData.access_token) {
            logger.error("Diana token response missing access_token:", tokenData);
            return res.status(502).json({
                success: false,
                error: "Invalid token response from Diana API",
            });
        }

        // Only expose access_token and expires_in — never the credentials
        res.status(200).json({
            success: true,
            access_token: tokenData.access_token,
            expires_in: tokenData.expires_in || 1800,
        });
    } catch (error) {
        logger.error("Error fetching Diana token:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error while fetching Diana token",
        });
    }
});

export default router;
