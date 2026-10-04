#!/usr/bin/env node
/**
 * cleanupOrphanedFiles.js
 *
 * Deletes GPX tracks and GPX-derived images whose tour ID (embedded in the
 * filename) no longer exists in the database. Also removes obsolete directories
 * (public/gpx-track/ and public/gpx-image-with-track/), since connection GPX
 * tracks and legacy composite images are no longer used.
 *
 * Scanned directories (relative to PUBLIC_DIR):
 *   public/gpx/{shard}/{tourId}.gpx            -> checked against tour.id
 *   public/gpx-image/{shard}/{tourId}_gpx_small.webp -> checked against tour.id
 *   public/gpx-track/                          -> deleted entirely
 *   public/gpx-image-with-track/               -> deleted entirely
 *
 * Usage:
 *   node cleanupOrphanedFiles.js          # dry-run (shows what would be deleted)
 *   node cleanupOrphanedFiles.js --delete # actually deletes orphaned files
 */

import fs from "fs";
import path from "path";
import knex from "../knex.js";
import { PUBLIC_DIR } from "../utils/assetPaths.js";

const DRY_RUN = !process.argv.includes("--delete");

async function loadValidTourIds() {
    console.log("Loading valid tour IDs from database...");
    const tourRows = await knex("tour").select("id");
    const tourIds = new Set(tourRows.map((r) => String(r.id)));
    console.log(`  -> ${tourIds.size} tour IDs loaded.`);
    return tourIds;
}

/**
 * Extract the numeric ID from a filename based on the directory type.
 *
 * gpx:       {id}.gpx            -> id
 * gpx-image: {id}_gpx_small.webp -> id
 * gpx-image: {id}_gpx.png        -> id  (legacy format)
 */
function extractId(filename, dirType) {
    const pattern = dirType === "gpx-image" ? /^(\d+)_gpx/ : /^(\d+)\.gpx$/;
    const match = filename.match(pattern);
    // syncGPXImage zero-pads IDs below 10 ("05_gpx_small.webp"); DB IDs are unpadded
    return match ? String(Number(match[1])) : null;
}

/**
 * Recursively find all files in a directory tree.
 */
function walkDir(dir) {
    const results = [];
    if (!fs.existsSync(dir)) return results;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...walkDir(fullPath));
        } else if (entry.isFile()) {
            results.push(fullPath);
        }
    }
    return results;
}

/**
 * Scan a directory for orphaned files (ID not in validIds).
 */
async function cleanupOrphanedFiles(baseDir, validIds, dirType) {
    const fullDir = path.join(PUBLIC_DIR, baseDir);
    if (!fs.existsSync(fullDir)) {
        console.log(`  Directory ${fullDir} does not exist -- skipping.`);
        return { scanned: 0, orphaned: 0, deletedBytes: 0 };
    }

    const files = walkDir(fullDir);
    let orphanCount = 0;
    let deletedBytes = 0;

    for (const filePath of files) {
        const filename = path.basename(filePath);
        const id = extractId(filename, dirType);

        if (id === null) {
            continue;
        }

        if (!validIds.has(id)) {
            const stats = fs.statSync(filePath);
            deletedBytes += stats.size;
            orphanCount++;

            if (DRY_RUN) {
                console.log(
                    `  [DRY-RUN] Would delete: ${filePath} (ID=${id}, ${(stats.size / 1024).toFixed(1)} KB)`,
                );
            } else {
                fs.unlinkSync(filePath);
                console.log(
                    `  [DELETED] ${filePath} (ID=${id}, ${(stats.size / 1024).toFixed(1)} KB)`,
                );
            }
        }
    }

    return { scanned: files.length, orphaned: orphanCount, deletedBytes };
}

/**
 * Remove an entire directory tree (connection GPX files are no longer needed).
 */
function removeEntireDirectory(baseDir) {
    const fullDir = path.join(PUBLIC_DIR, baseDir);
    if (!fs.existsSync(fullDir)) {
        console.log(`  Directory ${fullDir} does not exist -- skipping.`);
        return { files: 0, deletedBytes: 0 };
    }

    const files = walkDir(fullDir);
    let deletedBytes = 0;

    for (const filePath of files) {
        const stats = fs.statSync(filePath);
        deletedBytes += stats.size;
    }

    if (DRY_RUN) {
        console.log(
            `  [DRY-RUN] Would remove ${files.length} files (${(deletedBytes / 1024 / 1024).toFixed(2)} MB)`,
        );
    } else {
        fs.rmSync(fullDir, { recursive: true, force: true });
        console.log(
            `  [DELETED] Removed ${fullDir} (${files.length} files, ${(deletedBytes / 1024 / 1024).toFixed(2)} MB)`,
        );
    }

    return { files: files.length, deletedBytes };
}

async function main() {
    if (DRY_RUN) {
        console.log("=== DRY-RUN MODE (pass --delete to actually remove files) ===\n");
    } else {
        console.log("=== DELETE MODE -- orphaned files will be permanently removed ===\n");
    }

    const tourIds = await loadValidTourIds();
    console.log();

    let totalScanned = 0;
    let totalOrphaned = 0;
    let totalBytes = 0;

    // 1. Tour GPX tracks -- remove orphans
    console.log("Scanning public/gpx/ (tour GPX tracks)...");
    const gpxResult = await cleanupOrphanedFiles("gpx", tourIds, "gpx");
    totalScanned += gpxResult.scanned;
    totalOrphaned += gpxResult.orphaned;
    totalBytes += gpxResult.deletedBytes;

    // 2. Tour GPX images -- remove orphans
    console.log("Scanning public/gpx-image/ (tour map preview images)...");
    const imgResult = await cleanupOrphanedFiles("gpx-image", tourIds, "gpx-image");
    totalScanned += imgResult.scanned;
    totalOrphaned += imgResult.orphaned;
    totalBytes += imgResult.deletedBytes;

    // 3. Obsolete legacy directories -- remove entirely
    console.log("Removing public/gpx-track/ (obsolete connection GPX tracks)...");
    const gpxTrackResult = removeEntireDirectory("gpx-track");
    totalOrphaned += gpxTrackResult.files;
    totalBytes += gpxTrackResult.deletedBytes;

    console.log("Removing public/gpx-image-with-track/ (obsolete legacy image folder)...");
    const imgWithTrackResult = removeEntireDirectory("gpx-image-with-track");
    totalOrphaned += imgWithTrackResult.files;
    totalBytes += imgWithTrackResult.deletedBytes;

    // Summary
    console.log("\n=== SUMMARY ===");
    console.log(`  Files scanned:  ${totalScanned}`);
    console.log(`  Files to remove: ${totalOrphaned}`);
    console.log(
        `  Space ${DRY_RUN ? "to free" : "freed"}:  ${(totalBytes / 1024 / 1024).toFixed(2)} MB`,
    );

    if (DRY_RUN && totalOrphaned > 0) {
        console.log("\nRun with --delete to remove these files.");
    }

    await knex.destroy();
}

main().catch((err) => {
    console.error("FATAL:", err);
    knex.destroy().finally(() => process.exit(1));
});
