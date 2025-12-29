import Redis from "ioredis";
import config from "../config.js";

let redis = null;

if (config.cache && config.cache.enabled) {
    redis = new Redis({
        host: config.cache.host,
        port: config.cache.port,
        retryStrategy: (times) => Math.min(times * 100, 3000), // Retry up to 3s delay
    });

    let errorLogged = false;
    redis.on("error", (err) => {
        // Log error only once
        if (!errorLogged) {
            console.error("Redis error:", err.message);
            errorLogged = true;
        }
    });

    redis.on("connect", () => {
        errorLogged = false; // Reset when connected
    });
}

const get = async (key) => {
    if (!redis) return null;
    // Fail fast if not connected
    if (redis.status !== "ready") return null;

    try {
        const data = await redis.get(key);
        if (!data) return null;
        return JSON.parse(data);
    } catch (e) {
        console.warn("Cache get failed:", e.message);
        return null;
    }
};

const set = async (key, value, ttl = config.cache.ttl) => {
    if (!redis || redis.status !== "ready") return;
    try {
        await redis.set(key, JSON.stringify(value), "EX", ttl);
    } catch (e) {
        console.warn("Cache set failed:", e.message);
    }
};

const flush = async () => {
    if (!redis || redis.status !== "ready") return;
    try {
        await redis.flushall();
        console.log("Cache flushed.");
    } catch (e) {
        console.error("Cache flush failed:", e.message);
    }
};

const getStats = async () => {
    if (!redis || redis.status !== "ready") return null;
    try {
        const info = await redis.info("stats");
        const hits = info.match(/keyspace_hits:(\d+)/)?.[1] || "0";
        const misses = info.match(/keyspace_misses:(\d+)/)?.[1] || "0";
        return { hits: parseInt(hits), misses: parseInt(misses) };
    } catch (e) {
        console.warn("Cache getStats failed:", e.message);
        return null;
    }
};

export default {
    get,
    set,
    flush,
    getStats,
};
