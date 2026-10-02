/**
 * Helper to determine whether the nightly time cutoff has been reached.
 *
 * Requirements:
 * - import-files runs during the day and must stop when reaching 23:00 (the cutoff before the nightly cron at 02:00).
 * - Cutoff window defaults to 23:00 to 02:00 (i.e. hour >= 23 || hour < 2).
 * - Can be overridden via env vars:
 *   - IMPORT_FILES_CUTOFF_HOUR (default: 23)
 *   - IMPORT_FILES_RESUME_HOUR (default: 2)
 *   - IGNORE_TIME_CUTOFF (set to "true" or "1" to bypass cutoff, e.g. for local testing/manual run)
 *   - CLI flag: --ignore-cutoff
 */

export const DEFAULT_CUTOFF_HOUR = 23;
export const DEFAULT_RESUME_HOUR = 2;

export function isCutoffReached(now: Date = new Date()): boolean {
    if (
        process.env.IGNORE_TIME_CUTOFF === "true" ||
        process.env.IGNORE_TIME_CUTOFF === "1" ||
        (typeof process !== "undefined" && process.argv && process.argv.includes("--ignore-cutoff"))
    ) {
        return false;
    }

    const cutoffHour = process.env.IMPORT_FILES_CUTOFF_HOUR
        ? parseInt(process.env.IMPORT_FILES_CUTOFF_HOUR, 10)
        : DEFAULT_CUTOFF_HOUR;

    const resumeHour = process.env.IMPORT_FILES_RESUME_HOUR
        ? parseInt(process.env.IMPORT_FILES_RESUME_HOUR, 10)
        : DEFAULT_RESUME_HOUR;

    const currentHour = now.getHours();

    if (cutoffHour > resumeHour) {
        // e.g. 23:00 to 02:00 -> hours 23, 0, 1 are in cutoff
        return currentHour >= cutoffHour || currentHour < resumeHour;
    } else {
        // e.g. 0 to 2
        return currentHour >= cutoffHour && currentHour < resumeHour;
    }
}
