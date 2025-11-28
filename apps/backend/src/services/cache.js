import Redis from "ioredis";
import config from "../config.js";

let redis = null;

if (config.cache && config.cache.enabled) {
    redis = new Redis({
        host: config.cache.host,
        port: config.cache.port,
        retryStrategy: (times) => Math.min(times * 100, 3000), // Retry up to 3s delay
    });

    redis.on("error", (err) => {
        // Log error but don't crash
        // console.error('Redis error:', err.message);
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

export default {
    get,
    set,
    flush,
};
