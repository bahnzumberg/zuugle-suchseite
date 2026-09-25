import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import config from "../config.js";
import { redisClient } from "../services/cache.js";
import logger from "../utils/logger";

/**
 * Rate limiters for the list endpoints.
 *
 * The pairing code is short enough to type, which makes it short enough to
 * guess; expiry and single use bound the window, and this bounds the attempt
 * rate inside it.
 */

if (!redisClient) {
    logger.warn(
        "Rate limiting is using per-process counters: Redis is disabled. " +
            "On a clustered deployment the effective limit is multiplied by the worker count.",
    );
}

/**
 * Builds a counter store for one limiter. Each limiter needs its own instance
 * with its own prefix — express-rate-limit rejects a shared store. Keys carry
 * the cache namespace for the same reason cached values do: UAT and dev share
 * one Redis, and unnamespaced counters would let one environment's traffic
 * throttle the other.
 *
 * @param {string} prefix
 * @returns {import("express-rate-limit").Store|undefined} undefined falls back
 *   to express-rate-limit's per-process memory store.
 */
const buildStore = (prefix) =>
    redisClient
        ? new RedisStore({
              prefix: `${config.cache.namespace}:ratelimit:${prefix}:`,
              sendCommand: (...args) => redisClient.call(...args),
          })
        : undefined;

const shared = {
    standardHeaders: "draft-7",
    legacyHeaders: false,
    // A Redis outage should slow nobody down rather than 500 every request.
    passOnStoreError: true,
};

/**
 * Guards the brute-force target. Only failed attempts count: a successful pair
 * is a user who already had the code, so this bounds guessing rather than use.
 */
export const pairingLimiter = rateLimit({
    ...shared,
    store: buildStore("pair"),
    windowMs: 10 * 60 * 1000,
    limit: 20,
    skipSuccessfulRequests: true,
    message: { success: false, message: "Too many attempts. Please try again later." },
});

/**
 * Background limit for the rest of /api/lists. Loose enough that normal use
 * never sees it — favouriting a tour is one request.
 */
export const listsLimiter = rateLimit({
    ...shared,
    store: buildStore("lists"),
    windowMs: 10 * 60 * 1000,
    limit: 300,
    message: { success: false, message: "Too many requests. Please try again later." },
});
