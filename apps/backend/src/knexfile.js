// Main search database (PostgreSQL) connection config — driven entirely by env vars.
require("dotenv").config({ quiet: true });
const path = require("path");

const config = {
    client: "pg",
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    pool: {
        min: Number(process.env.DB_POOL_MIN) || 2,
        max: Number(process.env.DB_POOL_MAX) || 10,
    },
    migrations: {
        directory: path.join(__dirname, "migrations"),
        tableName: "knex_migrations",
    },
};

// Docker container name (used by the rebuild/restore jobs). Unset on native PROD hosts.
if (process.env.DB_CONTAINER_NAME) {
    config.containerName = process.env.DB_CONTAINER_NAME;
}

module.exports = {
    production: config,
    development: config,
};
