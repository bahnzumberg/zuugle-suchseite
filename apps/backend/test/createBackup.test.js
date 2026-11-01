import fs from "fs-extra";
import path from "path";
import os from "os";
import {
    EXCLUDED_TABLE_DATA,
    getBackupDir,
    pruneOldBackups,
    ensureRestoreScript,
} from "../src/jobs/createBackup.js";

describe("createBackup job", () => {
    let tempDir;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "zuugle-backup-test-"));
    });

    afterEach(() => {
        if (tempDir && fs.existsSync(tempDir)) {
            fs.removeSync(tempDir);
        }
    });

    describe("EXCLUDED_TABLE_DATA", () => {
        test("excludes external and derived tables", () => {
            const expectedExcluded = [
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
                "kpi",
                "search_suggestions",
                "tour_weather_daily",
                "tour_weather_1h",
            ];

            for (const tbl of expectedExcluded) {
                expect(EXCLUDED_TABLE_DATA).toContain(tbl);
            }
        });
    });

    describe("getBackupDir", () => {
        test("uses BACKUP_DIR from environment if specified", () => {
            const customDir = path.join(tempDir, "custom-backups");
            process.env.BACKUP_DIR = customDir;

            const resolved = getBackupDir();
            expect(resolved).toBe(customDir);
            expect(fs.existsSync(customDir)).toBe(true);

            delete process.env.BACKUP_DIR;
        });

        test("defaults to zuugle-db-backup in app root", () => {
            delete process.env.BACKUP_DIR;
            const resolved = getBackupDir();
            expect(resolved).toMatch(/zuugle-db-backup$/);
            expect(fs.existsSync(resolved)).toBe(true);
        });
    });

    describe("pruneOldBackups", () => {
        test("retains exactly the 3 newest backups and deletes older ones", () => {
            const files = [
                "zuugle-db-backup-2026-10-25.dump",
                "zuugle-db-backup-2026-10-26.dump",
                "zuugle-db-backup-2026-10-27.dump",
                "zuugle-db-backup-2026-10-28.dump",
                "zuugle-db-backup-2026-10-29.dump",
            ];

            for (const file of files) {
                fs.writeFileSync(path.join(tempDir, file), "dummy backup content");
            }

            pruneOldBackups(tempDir, 3);

            const remaining = fs.readdirSync(tempDir);
            expect(remaining).toHaveLength(3);
            expect(remaining).toContain("zuugle-db-backup-2026-10-27.dump");
            expect(remaining).toContain("zuugle-db-backup-2026-10-28.dump");
            expect(remaining).toContain("zuugle-db-backup-2026-10-29.dump");
            expect(remaining).not.toContain("zuugle-db-backup-2026-10-25.dump");
            expect(remaining).not.toContain("zuugle-db-backup-2026-10-26.dump");
        });

        test("does not delete when 3 or fewer backups exist", () => {
            const files = ["zuugle-db-backup-2026-10-28.dump", "zuugle-db-backup-2026-10-29.dump"];

            for (const file of files) {
                fs.writeFileSync(path.join(tempDir, file), "dummy backup content");
            }

            pruneOldBackups(tempDir, 3);

            const remaining = fs.readdirSync(tempDir);
            expect(remaining).toHaveLength(2);
        });

        test("does not delete non-backup files like restore scripts", () => {
            const files = [
                "zuugle-db-backup-2026-10-25.dump",
                "zuugle-db-backup-2026-10-26.dump",
                "zuugle-db-backup-2026-10-27.dump",
                "zuugle-db-backup-2026-10-28.dump",
            ];

            for (const file of files) {
                fs.writeFileSync(path.join(tempDir, file), "dummy backup content");
            }
            fs.writeFileSync(path.join(tempDir, "restore-backup.sh"), "#!/bin/bash\n");

            pruneOldBackups(tempDir, 3);

            const remaining = fs.readdirSync(tempDir);
            expect(remaining).toContain("restore-backup.sh");
            expect(remaining.filter((f) => f.endsWith(".dump"))).toHaveLength(3);
        });
    });

    describe("ensureRestoreScript", () => {
        test("copies restore-backup.sh and README-BACKUP.md into backup directory and makes script executable", () => {
            ensureRestoreScript(tempDir);

            const scriptPath = path.join(tempDir, "restore-backup.sh");
            expect(fs.existsSync(scriptPath)).toBe(true);

            const readmePath = path.join(tempDir, "README-BACKUP.md");
            expect(fs.existsSync(readmePath)).toBe(true);

            const stats = fs.statSync(scriptPath);
            // Verify executable permission for owner (0o100)
            expect(stats.mode & 0o100).toBeTruthy();
        });
    });
});
