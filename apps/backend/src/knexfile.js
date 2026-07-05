// Main search database (PostgreSQL) connection config — driven entirely by env vars.
const path = require("path");
const dotenv = require("dotenv");
// Load .env robustly. The knex CLI chdir's to the knexfile's directory, so a
// bare cwd-relative dotenv.config() misses the repo-root .env during local
// `npm run migrate` (knexfile is at build/, .env one level up). dotenv does not
// override already-set keys, so these fall through in order:
//   1. cwd/.env               (app started from repo root; server app dir)
//   2. <knexfile dir>/.env     (server: .env sits next to the built knexfile)
//   3. <knexfile dir>/../.env  (local: build/knexfile.js -> repo-root .env)
dotenv.config({ quiet: true });
dotenv.config({ quiet: true, path: path.resolve(__dirname, ".env") });
dotenv.config({ quiet: true, path: path.resolve(__dirname, "../.env") });

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

module.exports = {
    production: config,
    development: config,
};
