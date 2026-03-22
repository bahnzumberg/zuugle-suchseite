/**
 * rebuildDocker.js
 *
 * Stops, removes, and recreates the Docker PostgreSQL container for the
 * current environment. This is useful for:
 *   - PostgreSQL version upgrades (new Docker image)
 *   - Database schema changes (database.sql is re-applied on fresh container)
 *
 * The correct container and docker-compose file are determined automatically
 * from the knexfile.js configuration (containerName field).
 *
 * Usage: npm run rebuild-docker
 *
 * NOTE: This script refuses to run on production (NODE_ENV=production on
 *       a machine without docker-compose files), where PostgreSQL is
 *       installed natively and must be maintained manually.
 */

import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";
import * as readline from "readline";

// --- Container-to-Service mapping ---
// Maps container names to their docker-compose file and service name.
const CONTAINER_MAP = {
    "zuugle-container": {
        composeFile: "docker-compose.yaml",
        serviceName: "postgres",
    },
    "zuugle-postgres-uat": {
        composeFile: "docker-compose.uat.yaml",
        serviceName: "postgres-uat",
    },
    "zuugle-postgres-dev": {
        composeFile: "docker-compose.uat.yaml",
        serviceName: "postgres-dev",
    },
};

function getProjectRoot() {
    // From build/jobs/ → project root is ../../
    // From src/jobs/  → project root is ../../
    const possibleRoots = [
        path.resolve(__dirname, "../../"),
        path.resolve(__dirname, "../../../"),
        path.resolve(process.cwd()),
    ];
    for (const root of possibleRoots) {
        if (fs.existsSync(path.join(root, "docker-compose.yaml"))) {
            return root;
        }
    }
    return process.cwd();
}

function loadKnexConfig() {
    const knexfilePath = path.resolve(__dirname, "../knexfile.js");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(knexfilePath);
}

function getContainerName(knexConfig) {
    const env = process.env.NODE_ENV || "development";
    if (knexConfig[env] && knexConfig[env].containerName) {
        return knexConfig[env].containerName;
    }
    return process.env.DB_CONTAINER_NAME || "zuugle-container";
}

function ask(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
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
        if (!opts.ignoreError) {
            throw err;
        }
        return false;
    }
}

function waitForDatabase(containerName, dbUser, maxRetries = 30) {
    console.log("\n⏳ Waiting for PostgreSQL to be ready...");
    for (let i = 1; i <= maxRetries; i++) {
        try {
            execSync(`docker exec ${containerName} pg_isready -U ${dbUser}`, { stdio: "pipe" });
            console.log("✅ PostgreSQL is ready.\n");
            return true;
        } catch {
            if (i < maxRetries) {
                execSync("sleep 1");
            }
        }
    }
    console.error("❌ PostgreSQL did not become ready in time.");
    return false;
}

async function main() {
    const env = process.env.NODE_ENV || "development";

    // --- Safety check: refuse to run on production server ---
    if (env === "production") {
        const projectRoot = getProjectRoot();
        const hasUatCompose = fs.existsSync(path.join(projectRoot, "docker-compose.uat.yaml"));
        if (!hasUatCompose) {
            console.error("");
            console.error("❌ ERROR: This script cannot run on production.");
            console.error("   Production uses a natively installed PostgreSQL database");
            console.error("   that must be maintained manually.");
            console.error("");
            process.exit(1);
        }
        // If docker-compose.uat.yaml exists, we're on the UAT server —
        // production profile there means the UAT database, which is OK.
    }

    // --- Load configuration ---
    const knexConfig = loadKnexConfig();
    const containerName = getContainerName(knexConfig);
    const mapping = CONTAINER_MAP[containerName];

    if (!mapping) {
        console.error(`❌ Unknown container: "${containerName}"`);
        console.error("   Known containers:", Object.keys(CONTAINER_MAP).join(", "));
        process.exit(1);
    }

    const projectRoot = getProjectRoot();
    const composeFilePath = path.join(projectRoot, mapping.composeFile);

    if (!fs.existsSync(composeFilePath)) {
        console.error(`❌ Compose file not found: ${composeFilePath}`);
        process.exit(1);
    }

    const dbUser = knexConfig[env]?.connection?.user || process.env.DB_USER || "postgres";

    // --- Show what we're about to do ---
    console.log("");
    console.log("==============================================");
    console.log("     ZUUGLE DOCKER CONTAINER REBUILD");
    console.log("==============================================");
    console.log("");
    console.log(`  Environment:    ${env}`);
    console.log(`  Container:      ${containerName}`);
    console.log(`  Compose file:   ${mapping.composeFile}`);
    console.log(`  Service:        ${mapping.serviceName}`);
    console.log(`  DB User:        ${dbUser}`);
    console.log("");
    console.log("  ⚠️  This will DESTROY the container and all its data.");
    console.log("     The database will be recreated empty from database.sql.");
    console.log("     You will need to run 'npm run import-data-docker-download' afterwards.");
    console.log("");

    const confirm = await ask("Continue? (Y/N): ");
    if (confirm.toUpperCase() !== "Y") {
        console.log("Aborted.");
        process.exit(0);
    }

    const composeCmd = `docker compose -f ${mapping.composeFile}`;

    // --- Step 1: Stop and remove the container ---
    console.log("\n[1/4] Stopping container...");
    run(`${composeCmd} stop ${mapping.serviceName}`, {
        cwd: projectRoot,
        ignoreError: true,
    });

    console.log("\n[2/4] Removing container...");
    run(`${composeCmd} rm -f ${mapping.serviceName}`, {
        cwd: projectRoot,
        ignoreError: true,
    });

    // --- Step 2: Pull latest image ---
    console.log("\n[3/4] Pulling latest image...");
    run(`${composeCmd} pull ${mapping.serviceName}`, { cwd: projectRoot });

    // --- Step 3: Start fresh container ---
    console.log("\n[4/4] Starting fresh container...");
    run(`${composeCmd} up -d ${mapping.serviceName}`, { cwd: projectRoot });

    // --- Step 4: Wait for database readiness ---
    const dbReady = waitForDatabase(containerName, dbUser);
    if (!dbReady) {
        console.error("Container started but database is not responding.");
        process.exit(1);
    }

    // --- Verify version ---
    console.log("PostgreSQL version:");
    run(`docker exec ${containerName} psql --version`);

    console.log("");
    console.log("==============================================");
    console.log("  ✅ Container rebuilt successfully!");
    console.log("");
    console.log("  Next step: populate the database with data:");
    console.log("    npm run import-data-docker-download");
    console.log("==============================================");
    console.log("");

    process.exit(0);
}

main().catch((err) => {
    console.error("Unexpected error:", err);
    process.exit(1);
});
