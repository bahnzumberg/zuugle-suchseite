# Server TODO

Things to verify on the server before/during next deployment.

## .env files (job credentials)

`import-files` (and other job scripts) run outside PM2 — either via the deploy
workflow SSH step or via the Python cron (`start_zuugle_uat_load.py`). They don't
inherit PM2's env block, so `DB_PASSWORD` is undefined and pg throws a SASL error.

`knexfile.js` calls `dotenv.config()` which picks up a `.env` in the working
directory. **Create this file manually** in each app directory that runs job scripts:

```bash
# /root/suchseite/api/.env  and  /root/suchseite/dev-api/.env
cat > .env << 'EOF'
NODE_ENV=production
DB_HOST=<host>
DB_PORT=5432
DB_USER=<user>
DB_PASSWORD=<password>
DB_NAME=<db_name>
EOF
chmod 600 .env
```

**Possible long-term fix:** wire up DB credentials as GitHub Secrets and deploy the `.env`
from the workflow — see the "auto-deploy via GitHub Actions" section under
`ecosystem.config.js`.

## ecosystem.config.js

The PM2 source of truth lives on the server at `~/suchseite/ecosystem.config.js`
(one level **above** the API deploy targets). PM2 runs with `cwd = ~/suchseite`,
so the `./api/index.js` / `./dev-api/index.js` paths resolve correctly from there.

Changes must be applied manually on each host.

**When applying changes on the server**, use the file — not the app name — so PM2
re-reads the env block:

```bash
cd ~/suchseite
pm2 restart ecosystem.config.js --update-env --only <app>
pm2 save
```

Using `pm2 restart <app-name> --update-env` does **not** re-read the file.

### Current state

| App              | Host       | DB credentials in env block |
| ---------------- | ---------- | --------------------------- |
| `dev-zuugle_api` | uat-zuugle | ✓ set (cutover complete)    |
| `zuugle_api`     | uat-zuugle | ✗ pending PROD cutover      |
| `zuugle_api`     | zuugle-neu | ✗ pending PROD cutover      |

### TODO: auto-deploy via GitHub Actions

Currently the file is a manually-synced reference. The better long-term approach:
deploy it from the workflow using `envsubst` so secrets never live in git:

1. Add GitHub Secrets: `UAT_DB_PASSWORD`, `DEV_DB_PASSWORD` (and eventually
   `PROD_DB_PASSWORD`).
2. In `deploy-reusable.yml`, add a step after rsync that writes the filled-in file
   to `~/suchseite/ecosystem.config.js` and runs
   `pm2 restart ecosystem.config.js --update-env`.
3. In `src/ecosystem.config.js`, replace actual passwords with `${DEV_DB_PASSWORD}`
   placeholders — safe to commit.

This pairs naturally with the PROD cutover (step 0 for PROD requires wiring up DB
credentials there anyway).

## webmanifest / CDN — how it actually works

`cdn.zuugle.at` is a **BunnyCDN pull zone**. Bunny is configured with an origin and fetches + caches files on demand. The path mapping lines
up: `cdn.zuugle.at/foo` → `www.zuugle.at/public/foo`.

Consequences:

- ~~`site.webmanifest`~~ and the `web-app-manifest-*.png` icons are plain static files
  in this repo's `public/`, copied into the build (`cp -r public build/`) and
  served by `express.static("public")`. The CDN pulls them from there — the local
  PNGs are the **origin**, not dead files. Keep them.
- The app only _emits_ CDN URLs in prod: `useCDN = isProd && USE_CDN !== "false"`
  (`src/utils/gpx/gpxUtils.js`). UAT/DEV run `USE_CDN=false` and serve `/public`
  directly.

**Confirm in the Bunny dashboard:** Pull Zone origin = prod `/public`, and the
cache TTL ("Override Cache Time").

### Cleanup / improvements

1. **Cache headers are wasteful.** The CDN returns `cache-control: public,
max-age=0`, so the edge revalidates with the origin on nearly every request —
   little offload benefit. Fix at the origin (`express.static("public",
{ maxAge: "7d" })`) or set Bunny's Override Cache Time.
2. **Invalidation for regenerated images.** gpx-images change on tour re-sync.
   Once cached for days, purge via Bunny's API on regeneration, or cache-bust the
   stored `image_url` (e.g. `?v=<mtime>`).
3. **Inconsistent `USE_CDN`.** Some URLs are hardcoded to `https://cdn.zuugle.at`
   regardless of the flag (`routes/tours.js`, `jobs/sync.js`), so UAT/DEV also
   emit prod-CDN URLs for range-images and the placeholder. Make consistent.

## Cron ↔ npm alias coupling

The nightly data loads are driven by Python orchestrators in `/usr/local/zuugle/`
(outside this repo), gated by a job-control-center precondition. They call the
package.json scripts **by name** — so renaming an npm script silently breaks cron.

| Server script (host)                      | calls (`npm run …`)                                                          | env                                    |
| ----------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------- |
| `start_zuugle_load.py` (prod, zuugle-neu) | `import-data-prod`, `import-files`                                           | `NODE_ENV=production`, `USE_CDN=true`  |
| `start_zuugle_uat_load.py` (uat-zuugle)   | `import-files` (+ `restore_databases.sh` directly, in `api/` and `dev-api/`) | `NODE_ENV=production`, `USE_CDN=false` |

Also out-of-band: `refresh-search-suggestions` is run by the UAT deploy workflow.

**Keep these alias names stable:** `import-data-prod`, `import-files`,
`refresh-search-suggestions`, and `import-data-docker-download` (local dev seeding).
The redundant aliases `import-data`, `import-data-full`, and `import-files-prod`
were unused by any cron/workflow/dev-doc and have been removed. If you ever rename
the survivors, update the Python scripts on the servers in lockstep.

### TODO: replace cron with systemd timers, versioned in this repo

The load scripts (`start_zuugle_load.py`, `start_zuugle_uat_load.py`) and their
crontab entries currently live only on the servers in `/usr/local/zuugle/`. The
schedule and the orchestration are invisible from here — this is the root of the
"renaming an npm script silently breaks cron" risk.

**Plan:** move scheduling to **systemd timers** whose unit files are versioned in
this repo and deployed from here. systemd over cron gives us: declarative units we
can commit, `systemctl list-timers` / `journalctl` observability, no overlapping
runs (long loads can't stack), missed-run catch-up (`Persistent=true`), and clean
env via `EnvironmentFile=`.

What systemd does **not** replace: the job-control-center gating (wait for the
upstream `hermes2search` dump, give up at the cutoff). That logic stays in a thin
wrapper the unit runs — but the retry cadence/cutoff window becomes declarative in
the timer instead of a `while sleep(222)` loop.

Proposed layout: `deploy/systemd/<env>/` (prod runs `import-data-prod` +
`import-files`; uat runs `restore_databases.sh` + `import-files` for `api/` and
`dev-api/`). Example pair:

```ini
# zuugle-load.timer
[Unit]
Description=Zuugle nightly data load

[Timer]
# Poll every 10 min in the load window; the wrapper does the JCC check
OnCalendar=*-*-* 18,19,20,21,22:00/10
Persistent=true

[Install]
WantedBy=timers.target
```

```ini
# zuugle-load.service
[Unit]
Description=Zuugle nightly data load

[Service]
Type=oneshot
WorkingDirectory=/root/suchseite/api
EnvironmentFile=/usr/local/zuugle/zuugle-load.env   # NODE_ENV, USE_CDN (off-repo)
ExecStart=/usr/local/zuugle/zuugle-load-wrapper.sh  # JCC check, then npm run …
```

Deploy + open questions:

- Deploy step: copy units to `/etc/systemd/system/`, then `systemctl daemon-reload`
  and `systemctl enable --now *.timer`. The deploy already SSHes as root.
- Add `systemd-analyze verify` to CI — a malformed unit could silently disable the
  nightly load.
- Keep secrets/env off-repo via `EnvironmentFile=` (consistent with the knexfile
  policy).
- `mod_jobcontrolcenter` is an external Python module on the servers — confirm it
  stays importable from the wrapper, or vendor a thin shim.
- Composes with the Docker migration: if Dockerized, `ExecStart` becomes
  `docker compose run --rm importer npm run …`. Pick systemd **or** an ofelia
  sidecar as the trigger — not both.

## Database deployment

### What is the role of tourendb?

`knexfileTourenDb.js` connects to the external MySQL source DB (`tourendatenbank_uat`
/ `tourendatenbank`). `sync.js` uses it to query `vw_touren_to_search` and
`vw_provider_to_search` — the direct MySQL import path.

The UAT/DEV servers do **not** use this path. Their nightly load downloads a
pre-built PostgreSQL dump from `uat-dump.zuugle.at` (`syncDataDockerDownload.js`),
bypassing MySQL entirely. `knexfileTourenDb.js` on those servers has always had
empty credentials and it doesn't matter.

Only PROD (zuugle-neu) and local dev use the MySQL connection directly.

### Use knex migrations

Step 0 (env-driven committed knexfile) is **complete** — see commit `6be2dec`.

Remaining steps to decouple data import from code deploy:

#### Step 1 — Migration infrastructure

- Create `src/migrations/` directory.
- Add `cp -r src/migrations build/migrations` to `build:copy` in `package.json`
  (migrations are CJS `.js` files — copied verbatim, not transformed by tsc).
- Exclude `src/migrations/` from tsc so it doesn't try to compile CJS files.
- Add npm scripts:
    ```json
    "migrate":          "knex --knexfile build/knexfile.js migrate:latest",
    "migrate:make":     "knex --knexfile src/knexfile.js migrate:make",
    "migrate:rollback": "knex --knexfile build/knexfile.js migrate:rollback",
    "migrate:status":   "knex --knexfile build/knexfile.js migrate:status",
    ```

#### Step 2 — Baseline migration

Create `src/migrations/0001_baseline.js` that faithfully ports `database.sql`:

- `knex.schema.createTable(...)` for all 17 tables.
- `knex.raw(...)` for what knex.schema can't express: extensions (`vector`, `cube`,
  `earthdistance`, `pg_trgm`), column types (`tsvector`, `vector(1024)`), HNSW
  index (`m=24, ef_construction=128`), GIN/GIST/trgm/covering indexes, the
  `sync_tour_image_to_flat()` trigger, and the `city_static` seed rows.
- Drop the `kpi` INSERT … SELECT statements — derived data recomputed by
  `writeKPIs()`.
- `exports.down` mirrors the current DROP TABLE block (including `poi2tour`,
  `pois`, `search_suggestions` which the old block was missing — fixed in `ff7d949`).

Verify: `npm run migrate` on a fresh container produces a schema that matches
`pg_dump --schema-only` of the current UAT DB (no meaningful diff).

#### Step 3 — Retire database.sql

- Remove the `database.sql:/docker-entrypoint-initdb.d/init.sql` mount from
  `docker-compose.yaml` and `docker-compose.uat.yaml`.
- `src/jobs/resetDatabase.js`: after `DROP SCHEMA public CASCADE; CREATE SCHEMA
public`, run `npm run migrate` instead of `psql -f database.sql`.
- `src/jobs/rebuildDocker.js`: run `npm run migrate` after the fresh container
  starts.
- `restore_databases.sh`: replace the `--structure` branch (`cat database.sql |
psql`) with `npm run migrate`. Decouple the data import — `--structure` must no
  longer auto-trigger `syncDataDockerDownload.js`; the bare invocation stays as
  data-import-only so the nightly cron is unaffected.
- Remove `database.sql` from `build:copy` and delete the file.

#### Step 4 — Code-only deploys for UAT/DEV

- `deploy-reusable.yml`: add `run_migrations` boolean input; replace the
  `rebuild_db_structure` → `restore_databases.sh --structure` step with
  `npm run migrate` when set.
- `deploy2uat.yml` / `deploy2dev.yml`: set `run_migrations: true`; remove
  `rebuild_db_structure`, `import_files`, `refresh_suggestions`. Drop
  `command_timeout` from 60m to ~10m.
- `deploy2prod.yml`: unchanged this round (PROD deferred).

#### Step 5 — Docs

Update `README.md`, `README_UAT.md`, `CLAUDE.md`, and `.agent/constraints.md` to
reflect schema-via-migrations, `npm run migrate` in setup, and code-only deploys.

#### Manual server steps (coordinated, off-repo)

1. **One-time baseline** of existing UAT/DEV DBs: drop schema and `migrate:latest`
   to bootstrap a clean migration ledger, then let the nightly import reload data.
   (Databases are disposable — rebuilt nightly from the dump.)
2. **Change the UAT `pg_dump`** that produces `uat-dump.zuugle.at/zuugle_postgresql.dump`
   to `--data-only` (and confirm no `--clean` flag). Until this is done, a full
   schema+data dump can clobber migration-added columns on the next nightly import.
   This command lives on the source server.
3. **Verify nightly cron is active** on UAT and DEV before relying on code-only
   deploys — `crontab -l` on the hosts. If disabled, a deploy won't refresh data.
