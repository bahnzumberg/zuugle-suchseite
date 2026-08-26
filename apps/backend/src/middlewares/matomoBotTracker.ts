import type { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const MATOMO_URL = process.env.MATOMO_TRACKING_URL || "https://stats.bahnzumberg.at/matomo.php";
const SITE_ID = process.env.MATOMO_SITE_ID || "13";

/**
 * AI bot User-Agent patterns.  Compiled once at module load for performance.
 */
const AI_BOT_PATTERN = new RegExp(
    [
        "ChatGPT-User",
        "GPTBot",
        "OAI-SearchBot",
        "ClaudeBot",
        "Claude-Web",
        "anthropic-ai",
        "PerplexityBot",
        "Perplexity-User",
        "Google-Extended",
        "GoogleOther",
        "Bytespider",
        "CCBot",
        "cohere-ai",
        "Applebot-Extended",
        "Amazonbot",
        "Diffbot",
        "Meta-ExternalAgent",
        "FacebookBot",
    ].join("|"),
    "i",
);

/** Paths excluded from bot tracking (admin, API, static assets, health). */
const EXCLUDED_PREFIXES = ["/api/", "/public/", "/health", "/swagger"];

function isExcluded(path: string): boolean {
    return EXCLUDED_PREFIXES.some((prefix) => path.startsWith(prefix));
}

/**
 * Express middleware that detects AI crawler User-Agents and sends an
 * asynchronous, non-blocking tracking request to the Matomo Tracking API.
 *
 * Uses `recMode=1` so hits appear only in Matomo's AI/Bot reports, not in
 * regular visitor statistics.
 */
export default function matomoBotTracker(req: Request, _res: Response, next: NextFunction): void {
    next();

    const ua = req.headers["user-agent"];
    if (!ua || !AI_BOT_PATTERN.test(ua)) return;
    if (isExcluded(req.path)) return;

    const proto = req.headers["x-forwarded-proto"] || req.protocol || "https";
    const host = req.headers["host"] || "zuugle.at";
    const fullUrl = `${proto}://${host}${req.originalUrl}`;

    // Hostname without port for the source parameter (e.g. "zuugle.at")
    const source = String(host).replace(/:\d+$/, "");

    const params = new URLSearchParams({
        idsite: SITE_ID,
        rec: "1",
        recMode: "1",
        url: fullUrl,
        ua,
        send_image: "0",
        source,
    });

    // Fire-and-forget — no await, never blocks the response
    fetch(MATOMO_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
        signal: AbortSignal.timeout(5000),
    }).catch((err: unknown) => {
        logger.warn("Matomo bot tracking request failed:", err);
    });
}
