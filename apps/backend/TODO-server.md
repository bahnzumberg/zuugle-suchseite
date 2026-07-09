# Server TODO

Things to verify on the server before/during next deployment.

## DB credentials — `.env` is the source of truth

Job scripts (`import-files`, migrations, etc.) run outside PM2 via cron/SSH, so
they never see PM2's env block — only `knexfile.js`'s `dotenv.config()` fallback
reaches them. `.env` is therefore the sole source of DB credentials for all three
apps (dev/UAT/PROD);

```bash
# /root/suchseite/api/.env and /root/suchseite/dev-api/.env (uat-zuugle),
# /root/suchseite/api/.env (zuugle-neu)
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

## ecosystem.config.js

Lives on the server at `~/suchseite/ecosystem.config.js` (PM2 runs with
`cwd = ~/suchseite`, so `./api/index.js` / `./dev-api/index.js` resolve from
there). Holds process-level settings only (`NODE_ENV`, `USE_CDN`) — not DB
credentials. Changes must be applied manually on each host.

Restart via the **file**, not the app name, so PM2 re-reads the env block:

```bash
cd ~/suchseite
pm2 restart ecosystem.config.js --update-env --only <app>
pm2 save
```

## webmanifest / CDN — how it actually works

`cdn.zuugle.at` is a **BunnyCDN pull zone**: `cdn.zuugle.at/foo` → `www.zuugle.at/public/foo`.
`public/` (including `site.webmanifest`, `web-app-manifest-*.png`) is the origin,
served via `express.static("public")` — not dead files.

The app only emits CDN URLs in prod (`useCDN = isProd && USE_CDN !== "false"` in
`src/utils/gpx/gpxUtils.js`); UAT/DEV serve `/public` directly.

**Confirm in the Bunny dashboard:** Pull Zone origin = prod `/public`, and cache
TTL ("Override Cache Time").

### Cleanup / improvements

1. **Cache headers are wasteful** — CDN returns `cache-control: public,
max-age=0`, so the edge revalidates almost every request. Fix via
   `express.static("public", { maxAge: "7d" })` or Bunny's Override Cache Time.
2. **No invalidation for regenerated images** — gpx-images change on tour
   re-sync but stay cached for days. Purge via Bunny's API on regeneration, or
   cache-bust `image_url` (e.g. `?v=<mtime>`).
3. **Inconsistent `USE_CDN`** — `src/routes/tours.js:986,1751` and
   `src/jobs/sync.js:714` hardcode `https://cdn.zuugle.at` regardless of the
   flag, so UAT/DEV also emit prod-CDN URLs. Make consistent.

## Cron ↔ npm alias coupling

Nightly loads are driven by Python orchestrators in `/usr/local/zuugle/`
that call package.json scripts **by name**.

| Server script (host)                      | calls (`npm run …`)                                                          | env                                    |
| ----------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------- |
| `start_zuugle_load.py` (prod, zuugle-neu) | `import-data-prod`, `import-files`                                           | `NODE_ENV=production`, `USE_CDN=true`  |
| `start_zuugle_uat_load.py` (uat-zuugle)   | `import-files` (+ `restore_databases.sh` directly, in `api/` and `dev-api/`) | `NODE_ENV=production`, `USE_CDN=false` |

Search suggestions refresh **as part of the nightly load**
(`refreshSearchSuggestions()` inside `import-data`/`import-data-prod`) — the
deploy workflow does not run it. `refresh-search-suggestions` remains for
manual/out-of-band runs.

**Keep these alias names stable:** `import-data-prod` and `import-files` are
called by name from the server scripts; `refresh-search-suggestions` may be
too. `import-data` is only referenced within this repo, so it can be renamed
freely.

### TODO: replace cron with systemd timers, versioned in this repo

We could move scheduling to **systemd timers** committed in `deploy/systemd/<env>/`,
giving declarative units, observability (`systemctl list-timers`/`journalctl`), no
overlapping runs, missed-run catch-up (`Persistent=true`), and env via
`EnvironmentFile=`. The job-control-center gating logic stays in a thin
wrapper script the unit runs; only the retry/cutoff scheduling moves to the
timer.

Example:

```ini
# zuugle-load.timer
[Timer]
OnCalendar=*-*-* 18,19,20,21,22:00/10   # poll every 10 min in the load window
Persistent=true
```

```ini
# zuugle-load.service
[Service]
Type=oneshot
WorkingDirectory=/root/suchseite/api
EnvironmentFile=/usr/local/zuugle/zuugle-load.env
ExecStart=/usr/local/zuugle/zuugle-load-wrapper.sh   # JCC check, then npm run …
```

Open questions: add `systemd-analyze verify` to CI; confirm
`mod_jobcontrolcenter` (external Python module) stays importable from the
wrapper; if Dockerized later, `ExecStart` becomes `docker compose run --rm
importer npm run …` — pick systemd or an ofelia sidecar, not both.
