#!/usr/bin/node
import fs from "fs-extra";
import path from "path";
import { spawn } from "cross-spawn";
import knexConfig from "../knexfile";
import logger from "../utils/logger";

// Tables that are loaded from external sources (ETL / external APIs)
// or derived automatically during data sync. Only their DDL structure is backed up;
// their data is excluded to keep backups fast, lightweight, and focused on server-generated state.
export const EXCLUDED_TABLE_DATA = [
    "tour",
    "tour_load",
    "tour_inactive",
    "fahrplan",
    "gpx",
    "tracks",
    "pois",
    "poi2tour",
    "canonical_alternate",
    "city",
    "city2tour",
    "city2tour_flat",
    "city2tour_flat_new",
    "kpi",
    "search_suggestions",
    "tour_weather_daily",
    "tour_weather_1h",
    "overlay_weather_daily",
    "*_staging_*",
    "tour_weather_*_load",
];

export function getAppRoot() {
    const baseDir = typeof __dirname !== "undefined" ? __dirname : process.cwd();
    const candidates = [process.cwd(), path.resolve(baseDir, ".."), path.resolve(baseDir, "../..")];
    for (const candidate of candidates) {
        if (fs.existsSync(path.join(candidate, "package.json"))) {
            return candidate;
        }
    }
    return process.cwd();
}

export function getBackupDir() {
    if (process.env.BACKUP_DIR) {
        const customDir = path.resolve(process.env.BACKUP_DIR);
        fs.ensureDirSync(customDir);
        return customDir;
    }

    // On PROD: /root/suchseite/api/zuugle-db-backup
    // Locally: <repo>/apps/backend/zuugle-db-backup
    const appRoot = getAppRoot();
    const backupDir = path.join(appRoot, "zuugle-db-backup");
    fs.ensureDirSync(backupDir);
    return backupDir;
}

export function isComposePostgresRunning() {
    try {
        const res = spawn.sync(
            "docker",
            ["compose", "ps", "--status", "running", "-q", "postgres"],
            { encoding: "utf8" },
        );
        return res.status === 0 && !!res.stdout && res.stdout.trim().length > 0;
    } catch {
        return false;
    }
}

export function hasNativePgDump() {
    try {
        const res = spawn.sync("pg_dump", ["--version"], { encoding: "utf8" });
        return res.status === 0;
    } catch {
        return false;
    }
}

export function pruneOldBackups(backupDir, keepCount = 3) {
    const entries = fs.readdirSync(backupDir);
    const backupFiles = entries
        .filter((file) => file.startsWith("zuugle-db-backup-") && !file.endsWith(".sh"))
        .map((file) => {
            const filePath = path.join(backupDir, file);
            const stats = fs.statSync(filePath);
            return { file, filePath, mtime: stats.mtimeMs };
        })
        .sort((a, b) => a.file.localeCompare(b.file));

    if (backupFiles.length > keepCount) {
        const toDelete = backupFiles.slice(0, backupFiles.length - keepCount);
        for (const item of toDelete) {
            logger.info(`Pruning old backup: ${item.file}`);
            fs.unlinkSync(item.filePath);
        }
    }

    const remaining = backupFiles.slice(Math.max(0, backupFiles.length - keepCount));
    logger.info(`Active backups retained (${remaining.length}/${keepCount}):`);
    for (const item of remaining) {
        logger.info(`  - ${item.file}`);
    }
}

export function ensureRestoreScript(backupDir) {
    const baseDir = typeof __dirname !== "undefined" ? __dirname : process.cwd();
    const possibleScriptLocations = [
        path.resolve(baseDir, "../../scripts/restore-backup.sh"),
        path.resolve(baseDir, "../scripts/restore-backup.sh"),
        path.resolve(process.cwd(), "scripts/restore-backup.sh"),
        path.resolve(process.cwd(), "apps/backend/scripts/restore-backup.sh"),
    ];

    const targetScript = path.join(backupDir, "restore-backup.sh");

    for (const src of possibleScriptLocations) {
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, targetScript);
            fs.chmodSync(targetScript, 0o755);
            logger.info(`Copied restore script to ${targetScript}`);
            break;
        }
    }

    const possibleReadmeLocations = [
        path.resolve(baseDir, "../../scripts/README-BACKUP.md"),
        path.resolve(baseDir, "../scripts/README-BACKUP.md"),
        path.resolve(process.cwd(), "scripts/README-BACKUP.md"),
        path.resolve(process.cwd(), "apps/backend/scripts/README-BACKUP.md"),
    ];

    const targetReadme = path.join(backupDir, "README-BACKUP.md");

    for (const src of possibleReadmeLocations) {
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, targetReadme);
            logger.info(`Copied backup documentation to ${targetReadme}`);
            break;
        }
    }

    // If no external script was found, ensure existing target is executable
    if (fs.existsSync(targetScript)) {
        fs.chmodSync(targetScript, 0o755);
    }
}

export async function createBackup() {
    const env = process.env.NODE_ENV || "development";
    const conn = (knexConfig[env] && knexConfig[env].connection) || {};
    const dbName = conn.database || process.env.DB_NAME || "zuugle_suchseite_dev";
    const dbUser = conn.user || process.env.DB_USER || "postgres";
    const dbHost = conn.host || process.env.DB_HOST || "localhost";
    const dbPort = String(conn.port || process.env.DB_PORT || 5432);
    const dbPassword = conn.password || process.env.DB_PASSWORD || "";

    const backupDir = getBackupDir();
    const dateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const backupFileName = `zuugle-db-backup-${dateStr}.dump`;
    const backupFilePath = path.join(backupDir, backupFileName);

    logger.info(`START DATABASE BACKUP -> ${backupFilePath}`);
    logger.info(`Target database: ${dbName} (user: ${dbUser})`);

    const excludeArgs = EXCLUDED_TABLE_DATA.flatMap((tbl) => ["--exclude-table-data", tbl]);
    const dumpArgs = [
        "-U",
        dbUser,
        "-d",
        dbName,
        "-F",
        "c",
        "--no-owner",
        "--no-privileges",
        ...excludeArgs,
    ];

    const composeRunning = isComposePostgresRunning();
    const nativePgDump = hasNativePgDump();

    if (composeRunning) {
        logger.info(`Running backup via docker compose postgres container...`);
        const tempFilePath = `${backupFilePath}.tmp`;
        const writeStream = fs.createWriteStream(tempFilePath);

        const proc = spawn(
            "docker",
            ["compose", "exec", "-T", "postgres", "pg_dump", ...dumpArgs],
            { stdio: ["ignore", "pipe", "inherit"] },
        );

        proc.stdout.pipe(writeStream);

        await new Promise((resolve, reject) => {
            proc.on("error", reject);
            writeStream.on("error", reject);
            proc.on("close", (code) => {
                if (code === 0) resolve(undefined);
                else reject(new Error(`docker compose pg_dump exited with code ${code}`));
            });
        });

        fs.renameSync(tempFilePath, backupFilePath);
    } else if (nativePgDump) {
        logger.info(`Running backup via native pg_dump to ${dbHost}:${dbPort}...`);
        const proc = spawn(
            "pg_dump",
            ["-h", dbHost, "-p", dbPort, ...dumpArgs, "-f", backupFilePath],
            {
                stdio: ["ignore", "inherit", "inherit"],
                env: { ...process.env, PGPASSWORD: dbPassword },
            },
        );

        await new Promise((resolve, reject) => {
            proc.on("error", reject);
            proc.on("close", (code) => {
                if (code === 0) resolve(undefined);
                else reject(new Error(`pg_dump exited with code ${code}`));
            });
        });
    } else {
        throw new Error(
            "Cannot create backup: neither running compose 'postgres' service nor native 'pg_dump' found. " +
                "Start the database with 'docker compose up -d' or install 'postgresql-client'.",
        );
    }

    const stats = fs.statSync(backupFilePath);
    const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
    logger.info(`Backup created successfully: ${backupFileName} (${sizeMb} MB)`);

    // Ensure restore script is present in the backup directory
    ensureRestoreScript(backupDir);

    // Keep the 3 newest backups, remove older ones
    logger.info("Applying backup retention limit (keep 3 newest)...");
    pruneOldBackups(backupDir, 3);

    logger.info("DONE DATABASE BACKUP");
    return backupFilePath;
}

// Run directly if invoked as main script
const isDirectRun = process.argv[1] && process.argv[1].includes("createBackup");
if (isDirectRun) {
    createBackup()
        .then(() => process.exit(0))
        .catch((err) => {
            logger.error("Error creating database backup:", err);
            process.exit(1);
        });
}
