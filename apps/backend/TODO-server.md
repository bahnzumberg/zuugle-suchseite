# Server TODO

Things to verify on the server before/during next deployment.

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
| `zuugle_api`     | uat-zuugle | ✓ set (cutover complete)    |
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

`cdn.zuugle.at` is a **BunnyCDN pull zone**. Bunny is configured with an origin and
fetches + caches files on demand. The path mapping lines up:
`cdn.zuugle.at/foo` → `www.zuugle.at/public/foo`.

Consequences:

- `site.webmanifest` and the `web-app-manifest-*.png` icons are plain static files
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
   regardless of the flag (`src/routes/tours.js:986,1751`, `src/jobs/sync.js:714`),
   so UAT/DEV also emit prod-CDN URLs for range-images and the placeholder. Make
   consistent.

## Cron ↔ npm alias coupling

The nightly data loads are driven by Python orchestrators in `/usr/local/zuugle/`
(outside this repo), gated by a job-control-center precondition. They call the
package.json scripts **by name** — so renaming an npm script silently breaks cron.

| Server script (host)                      | calls (`npm run …`)                                                          | env                                    |
| ----------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------- |
| `start_zuugle_load.py` (prod, zuugle-neu) | `import-data-prod`, `import-files`                                           | `NODE_ENV=production`, `USE_CDN=true`  |
| `start_zuugle_uat_load.py` (uat-zuugle)   | `import-files` (+ `restore_databases.sh` directly, in `api/` and `dev-api/`) | `NODE_ENV=production`, `USE_CDN=false` |

Search suggestions are refreshed **as part of the nightly data load** —
`import-data` runs `refreshSearchSuggestions()` in its sequence (as does
`import-data-prod` on PROD), so `restore_databases.sh` covers it. The deploy
workflow does **not** run it. The standalone `refresh-search-suggestions` script
remains for manual/out-of-band runs.

**Keep these alias names stable:** `import-data-prod` and `import-files` are called
by name from the server Python load scripts. `refresh-search-suggestions` may be
invoked by an out-of-band job — keep it too. `import-data` (local/DEV/UAT dump
seeding) is only invoked from `restore_databases.sh` and dev docs within this repo,
so it can be renamed from here alone.

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
pre-built PostgreSQL dump from `uat-dump.zuugle.at` (`syncDataImport.js`),
bypassing MySQL entirely. `knexfileTourenDb.js` on those servers has always had
empty credentials and it doesn't matter.

Only PROD (zuugle-neu) and local dev use the MySQL connection directly.

### Knex migrations

Steps 1–4 are complete and deployed to dev and uat:

- Migrations infrastructure in place (`src/migrations/`, npm scripts, build copy).
- Baseline migration `src/migrations/0001_baseline.js` ported from `database.sql`.
- `docker-compose.yaml`, `resetDatabase.js`, `rebuildDocker.js`, and
  `restore_databases.sh` all use `npm run migrate` — no more `database.sql` references.
- Deploy workflow: `run_migrations: true` and `command_timeout: 10m` set in
  `deploy2uat.yml` / `deploy2dev.yml`; `rebuild_db_structure`, `import_files`,
  `refresh_suggestions` steps removed.

**Remaining:**

- Delete `database.sql` from the repo. Mounts and all job references are already
  gone — the file is now dead weight.
- Update `README.md` and `README_UAT.md` to reflect schema-via-migrations and
  `npm run migrate` in the setup steps. (`CLAUDE.md` and `.agent/constraints.md`
  already updated.)
- PROD cutover deferred — wire up DB credentials in the ecosystem.config.js on
  zuugle-neu before running migrations there.
