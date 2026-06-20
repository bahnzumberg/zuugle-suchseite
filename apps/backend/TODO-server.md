# Server TODO

Things to verify on the server before/during next deployment.

## ecosystem.config.js — RESOLVED

The PM2 source of truth lives on the server at `~/suchseite/ecosystem.config.js`
(one level **above** the API deploy targets), not in this repo. PM2 runs with
`cwd = ~/suchseite`, so the `./api/index.js` / `./dev-api/index.js` paths resolve
correctly from there.

The server file manages **four** apps:

| App                | script (relative to `~/suchseite`) | Source                                        |
| ------------------ | ---------------------------------- | --------------------------------------------- |
| `zuugle_api`       | `./api/index.js`                   | this repo (UAT API, deployed to `…/api/`)     |
| `zuugle_proxy`     | `./server/server.js`               | frontend/proxy repo                           |
| `dev-zuugle_api`   | `./dev-api/index.js`               | this repo (DEV API, deployed to `…/dev-api/`) |
| `dev-zuugle_proxy` | `./dev-server/server.js`           | dev proxy repo                                |

The `ecosystem.config.js` that used to sit in this repo was a stale single-app
fork (only `zuugle_api`, missing `USE_CDN`, never deployed, never invoked) and has
been removed. The real file is infrastructure config spanning multiple repos and
should stay on the server / in a dedicated infra repo — not here.

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
