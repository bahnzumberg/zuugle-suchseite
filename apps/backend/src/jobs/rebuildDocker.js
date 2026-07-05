/**
 * rebuildDocker.js
 *
 * Stops, removes, and recreates the compose PostgreSQL container for the current
 * environment (local, DEV, or UAT), then re-applies the knex migrations. Useful
 * for a PostgreSQL version upgrade or a clean-slate rebuild.
 *
 * The environment is selected by COMPOSE_PROJECT_NAME (from .env), which also tells
 * this script whether the host is compose-managed. It refuses to run where that is
 * unset — i.e. native PROD, where PostgreSQL is maintained manually.
 *
 * Usage: npm run rebuild-docker
 */

import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";
import * as readline from "readline";

const SERVICE = "postgres";

function getProjectRoot() {
    // From build/jobs/ or src/jobs/ the root holds docker-compose.yaml.
    const candidates = [
        path.resolve(__dirname, "../../"),
        path.resolve(__dirname, "../../../"),
        path.resolve(process.cwd()),
    ];
    for (const root of candidates) {
        if (fs.existsSync(path.join(root, "docker-compose.yaml"))) return root;
    }
    return process.cwd();
}

function loadKnexConfig() {
    // Requiring the knexfile also loads .env (dotenv), which populates
    // COMPOSE_PROJECT_NAME for the guard and for `docker compose`.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(path.resolve(__dirname, "../knexfile.js"));
}

function ask(question) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

function run(cmd, opts = {}) {
    console.log(`  → ${cmd}`);
    try {
        execSync(cmd, { stdio: "inherit", ...opts });
        return true;
    } catch (err) {
        if (!opts.ignoreError) throw err;
        return false;
    }
}

function waitForDatabase(dbUser, opts, maxRetries = 30) {
    console.log("\n⏳ Waiting for PostgreSQL to be ready...");
    for (let i = 1; i <= maxRetries; i++) {
        try {
            execSync(`docker compose exec -T ${SERVICE} pg_isready -U ${dbUser}`, {
                stdio: "pipe",
                ...opts,
            });
            console.log("✅ PostgreSQL is ready.\n");
            return true;
        } catch {
            if (i < maxRetries) execSync("sleep 1");
        }
    }
    console.error("❌ PostgreSQL did not become ready in time.");
    return false;
}

async function main() {
    const knexConfig = loadKnexConfig();
    const env = process.env.NODE_ENV || "development";

    // Compose-managed hosts set COMPOSE_PROJECT_NAME (local/DEV/UAT); native PROD
    // does not, so this is our guard against touching a manually-maintained DB.
    const project = process.env.COMPOSE_PROJECT_NAME;
    if (!project) {
        console.error("");
        console.error("❌ ERROR: COMPOSE_PROJECT_NAME is not set.");
        console.error("   rebuild-docker only manages compose-based databases (local/DEV/UAT).");
        console.error("   Native hosts (e.g. PROD) maintain PostgreSQL manually.");
        console.error("");
        process.exit(1);
    }

    const dbUser = knexConfig[env]?.connection?.user || process.env.DB_USER || "postgres";
    const opts = { cwd: getProjectRoot() };

    console.log("");
    console.log("==============================================");
    console.log("     ZUUGLE DOCKER CONTAINER REBUILD");
    console.log("==============================================");
    console.log("");
    console.log(`  Environment:    ${env}`);
    console.log(`  Compose proj:   ${project}`);
    console.log(`  Service:        ${SERVICE}`);
    console.log(`  DB User:        ${dbUser}`);
    console.log("");
    console.log("  ⚠️  This will DESTROY the container and all its data.");
    console.log("     The database is recreated empty, then the schema is applied by");
    console.log("     knex migrations (npm run migrate).");
    console.log("     You will need to run 'npm run import-data' afterwards.");
    console.log("");

    const confirm = await ask("Continue? (Y/N): ");
    if (confirm.toUpperCase() !== "Y") {
        console.log("Aborted.");
        process.exit(0);
    }

    console.log("\n[1/4] Stopping container...");
    run(`docker compose stop ${SERVICE}`, { ...opts, ignoreError: true });

    console.log("\n[2/4] Removing container...");
    run(`docker compose rm -f ${SERVICE}`, { ...opts, ignoreError: true });

    console.log("\n[3/4] Pulling latest image...");
    run(`docker compose pull ${SERVICE}`, opts);

    console.log("\n[4/4] Starting fresh container...");
    run(`docker compose up -d ${SERVICE}`, opts);

    if (!waitForDatabase(dbUser, opts)) {
        console.error("Container started but database is not responding.");
        process.exit(1);
    }

    console.log("PostgreSQL version:");
    run(`docker compose exec -T ${SERVICE} psql --version`, opts);

    console.log("\nApplying schema via knex migrations (npm run migrate)...");
    run("npm run migrate", opts);

    console.log("");
    console.log("==============================================");
    console.log("  ✅ Container rebuilt and schema migrated!");
    console.log("");
    console.log("  Next step: populate the database with data:");
    console.log("    npm run import-data");
    console.log("==============================================");
    console.log("");

    process.exit(0);
}

main().catch((err) => {
    console.error("Unexpected error:", err);
    process.exit(1);
});
