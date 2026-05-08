export default {
    cache: {
        host: process.env.CACHE_HOST || "localhost",
        port: process.env.CACHE_PORT || 6379,
        ttl: 86400, // 24 hours in seconds
        enabled: true,
        namespace: process.env.CACHE_NAMESPACE || process.env.NODE_ENV || "dev",
    },
};
