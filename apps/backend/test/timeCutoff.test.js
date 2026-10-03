import { isCutoffReached } from "../src/utils/timeCutoff";

describe("timeCutoff utility", () => {
    const originalEnv = process.env;
    const originalArgv = process.argv;

    beforeEach(() => {
        process.env = { ...originalEnv };
        delete process.env.IGNORE_TIME_CUTOFF;
        delete process.env.IMPORT_FILES_CUTOFF_HOUR;
        delete process.env.IMPORT_FILES_RESUME_HOUR;
        process.argv = [...originalArgv.filter((arg) => arg !== "--ignore-cutoff")];
    });

    afterAll(() => {
        process.env = originalEnv;
        process.argv = originalArgv;
    });

    test("returns false during normal daytime hours", () => {
        const morning = new Date("2026-10-03T08:30:00");
        const afternoon = new Date("2026-10-03T15:45:00");
        const lateEvening = new Date("2026-10-03T22:59:59");
        const afterResume = new Date("2026-10-03T02:00:00");

        expect(isCutoffReached(morning)).toBe(false);
        expect(isCutoffReached(afternoon)).toBe(false);
        expect(isCutoffReached(lateEvening)).toBe(false);
        expect(isCutoffReached(afterResume)).toBe(false);
    });

    test("returns true during cutoff hours (23:00 to 02:00)", () => {
        const at2300 = new Date("2026-10-03T23:00:00");
        const at2330 = new Date("2026-10-03T23:30:00");
        const atMidnight = new Date("2026-10-03T00:00:00");
        const at0100 = new Date("2026-10-03T01:00:00");
        const at0159 = new Date("2026-10-03T01:59:59");

        expect(isCutoffReached(at2300)).toBe(true);
        expect(isCutoffReached(at2330)).toBe(true);
        expect(isCutoffReached(atMidnight)).toBe(true);
        expect(isCutoffReached(at0100)).toBe(true);
        expect(isCutoffReached(at0159)).toBe(true);
    });

    test("returns false when IGNORE_TIME_CUTOFF env var is set", () => {
        process.env.IGNORE_TIME_CUTOFF = "true";
        const at2330 = new Date("2026-10-03T23:30:00");
        expect(isCutoffReached(at2330)).toBe(false);
    });

    test("returns false when --ignore-cutoff CLI flag is present", () => {
        process.argv.push("--ignore-cutoff");
        const atMidnight = new Date("2026-10-03T00:00:00");
        expect(isCutoffReached(atMidnight)).toBe(false);
    });

    test("respects custom cutoff and resume hours via env vars", () => {
        process.env.IMPORT_FILES_CUTOFF_HOUR = "22";
        process.env.IMPORT_FILES_RESUME_HOUR = "4";

        expect(isCutoffReached(new Date("2026-10-03T21:59:00"))).toBe(false);
        expect(isCutoffReached(new Date("2026-10-03T22:00:00"))).toBe(true);
        expect(isCutoffReached(new Date("2026-10-03T03:30:00"))).toBe(true);
        expect(isCutoffReached(new Date("2026-10-03T04:00:00"))).toBe(false);
    });
});
