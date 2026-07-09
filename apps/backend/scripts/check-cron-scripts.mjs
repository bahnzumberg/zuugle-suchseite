#!/usr/bin/env node
/*
 * Guard: the npm scripts that the server nightly-load orchestrators call BY NAME.
 *
 * The Python loaders in /usr/local/zuugle/ (start_zuugle_load.py on PROD,
 * start_zuugle_uat_load.py on UAT) and their crontab entries invoke these via
 * `npm run <name>`. Renaming one here silently breaks the nightly data load with
 * no error at PR time. This check fails the build instead.
 *
 * See deploy/loaders/ + TODO-server.md ("Cron <-> npm alias coupling").
 * Run from CI (code-checks) as: `node scripts/check-cron-scripts.mjs`
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const pkgPath = fileURLToPath(new URL("../package.json", import.meta.url));
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

// Called by name from the server load scripts — DO NOT rename without also
// updating deploy/loaders/*.py (and the crontab on the hosts).
const REQUIRED = ["import-data-prod", "import-files", "refresh-search-suggestions"];

const scripts = pkg.scripts ?? {};
const missing = REQUIRED.filter((name) => !(name in scripts));

if (missing.length > 0) {
    console.error(
        "✗ Missing npm script(s) invoked by the server nightly load: " + missing.join(", "),
    );
    console.error(
        "  These are called by name from deploy/loaders/*.py. If you intended to " +
            "rename them, update the loaders (and the hosts' crontab) in the same change.",
    );
    process.exit(1);
}

console.log("✓ cron-invoked npm scripts present: " + REQUIRED.join(", "));
