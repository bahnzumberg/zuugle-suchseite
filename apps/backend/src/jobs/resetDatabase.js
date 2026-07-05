/**
 * resetDatabase.js
 *
 * Drops ALL objects in the public schema (tables, views, triggers, functions, sequences)
 * and rebuilds the database from scratch by running the knex migrations.
 *
 * Usage: npm run reset-database
 * (After building: node build/jobs/resetDatabase.js)
 */

import { execSync } from "child_process";
import * as readline from "readline";
import * as path from "path";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

async function main() {
    console.log("");
    console.log("==============================================");
    console.log("        ZUUGLE DATABASE RESET TOOL");
    console.log("==============================================");
    console.log("");
    console.log("WARNING: This will PERMANENTLY DELETE ALL DATA in the database");
    console.log("         and rebuild it from scratch via knex migrations.");
    console.log("");

    const confirm = await ask("Are you sure you want to continue? (Y/N): ");
    if (confirm !== "Y") {
        console.log("Aborted.");
        rl.close();
        process.exit(0);
    }

    const isProd = await ask("Is this the production environment? (Y/N): ");
    if (isProd !== "N") {
        console.log("Aborted. This tool must NOT be run on production. Exiting.");
        rl.close();
        process.exit(0);
    }

    rl.close();

    // --- Load DB connection config ---
    // knexfile uses module.exports, so we require it
    const knexfilePath = path.resolve(__dirname, "../knexfile.js");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const knexConfig = require(knexfilePath);

    const env = process.env.NODE_ENV || "development";
    const config = knexConfig[env];

    if (!config || !config.connection) {
        console.error(`No database config found for environment: "${env}". Check src/knexfile.js.`);
        process.exit(1);
    }

    const { host, port, user, password, database } = config.connection;

    console.log(`\nUsing database config for environment: "${env}"`);
    console.log(`Host:     ${host}:${port}`);
    console.log(`Database: ${database}`);
    console.log(`User:     ${user}`);
    console.log("");

    const env_vars = {
        ...process.env,
        PGPASSWORD: password || "",
    };

    const psqlBase = `psql -h ${host} -p ${port} -U ${user} -d ${database}`;

    // Step 1: Drop entire public schema and recreate (removes ALL objects atomically)
    console.log("[1/2] Dropping all objects in the public schema...");
    try {
        execSync(
            `${psqlBase} -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO ${user}; GRANT ALL ON SCHEMA public TO public;"`,
            { env: env_vars, stdio: "inherit" },
        );
        console.log("      Done.\n");
    } catch (err) {
        console.error("Failed to drop schema:", err.message);
        process.exit(1);
    }

    // Step 2: Rebuild schema via knex migrations.
    // `npm run migrate` resolves to the correct knexfile for the cwd (build/ locally,
    // the deploy target on servers) and reads the same DB_* env as the drop above.
    console.log("[2/2] Rebuilding schema via knex migrations (npm run migrate)...");
    try {
        execSync("npm run migrate", { env: env_vars, stdio: "inherit" });
        console.log("      Done.\n");
    } catch (err) {
        console.error("Failed to run migrations:", err.message);
        process.exit(1);
    }

    console.log("==============================================");
    console.log("  Database reset complete!");
    console.log("  Run 'npm run import-data-docker-download' to populate");
    console.log("  the database with fresh data.");
    console.log("==============================================\n");

    process.exit(0);
}

main().catch((err) => {
    console.error("Unexpected error:", err);
    process.exit(1);
});
