// Tour source database (MySQL, read-only) connection config — driven entirely by env vars.
require("dotenv").config({ quiet: true });

const config = {
    client: "mysql2",
    connection: {
        host: process.env.TOUREN_DB_HOST,
        user: process.env.TOUREN_DB_USER,
        password: process.env.TOUREN_DB_PASSWORD,
        database: process.env.TOUREN_DB_NAME,
        charset: "utf8",
        connectTimeout: 60000,
    },
    pool: {
        min: Number(process.env.TOUREN_DB_POOL_MIN) || 2,
        max: Number(process.env.TOUREN_DB_POOL_MAX) || 10,
        acquireTimeoutMillis: 60000,
        idleTimeoutMillis: 600000,
        createTimeoutMillis: 30000,
    },
};

module.exports = {
    production: config,
    development: config,
};
