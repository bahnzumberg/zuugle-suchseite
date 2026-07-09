# loaders/ — nightly data-load orchestrators

Python scripts that run the nightly data load, plus the crontab schedule that
triggers them. They live only on the servers today (`/usr/local/zuugle/`), which
is why the schedule is invisible from the repo.

## Scripts

| Script | Host | npm scripts it calls (by name) | Env |
| --- | --- | --- | --- |
| `start_zuugle_load.py` | `zuugle-neu` (PROD) | `import-data-prod`, `import-files` | `NODE_ENV=production`, `USE_CDN=true` |
| `start_zuugle_uat_load.py` | `uat-zuugle` (UAT+DEV) | `import-files` (+ `restore_databases.sh` in `api/` and `dev-api/`) | `NODE_ENV=production`, `USE_CDN=false` |

> The npm-script names above are asserted by `scripts/check-cron-scripts.mjs`
> (`apps/backend/scripts/…` after the monorepo merge), wired into code-checks so a
> rename fails CI instead of silently breaking cron.

## Dependency

Both scripts `import mod_jobcontrolcenter` — an external module on the servers
(`/usr/local/zuugle/mod_jobcontrolcenter.py`, ~6.6 KB, present on uat-zuugle) that
gates the load on the upstream `hermes2search` dump (waits, gives up past a cutoff).
It is **not** part of this repo. Capture it too if we replace cron with systemd
timers (Phase 5.4).

## Schedule (crontab)

### uat-zuugle (root crontab) — captured 2026-07-07

```cron
# ACTIVE — runs the UAT loader daily at 02:15 (waits on JCC job
# 'hermes2search.datatransfer.uat', gives up after 20:30):
15 2 * * * python3 /usr/local/zuugle/start_zuugle_uat_load.py >> /var/log/import-data-file.log

# TLS renewal (not zuugle-specific):
0 10 * * * /usr/bin/certbot renew --quiet

# COMMENTED OUT on the host (kept for reference):
#   */10 5-16 * * * python3 /usr/local/zuugle/start_zuugle_uat_load.py >> /var/log/import-uat.log 2>&1   (old polling schedule)
#   0 8 * * *       /usr/local/zuugle/import-files.sh >> /var/log/import-files.log 2>&1
#                   ("Solange prod DB genutzt wird, darf das nicht aktiviert werden")
```

> ⚠️ **Node version in cron ≠ Node 24.** The uat-zuugle crontab pins
> `PATH=…/root/.nvm/versions/node/v20.5.0/bin:…`, so the nightly `npm run import-files`
> runs under **Node 20.5.0**, while the PM2 API runs under **24.18.0** (deploy workflow
> sets `v24.18.0/bin`). "Node 24 everywhere" is **not** actually true on the load path.
> Unify the cron/timer runtime to 24 as part of Phase 5.4 (systemd timers).
>
> ℹ️ `import-files.sh` (referenced, commented out) is **not** in this repo — capture it
> from the host if it's ever re-enabled.

### zuugle-neu (PROD) — captured 2026-07-07

```cron
# ACTIVE — runs the PROD loader daily at 02:00 (waits on JCC job
# 'hermes2search.datatransfer.zuugle', gives up after 22:30):
0 2 * * * /usr/bin/python3 /usr/local/zuugle/start_zuugle_load.py >> /var/log/import-data-files.log 2>&1

# TLS renewal (not zuugle-specific):
0 10 * * * /usr/bin/certbot renew --quiet

# COMMENTED OUT on the host (kept for reference):
#   52 9 * * * /usr/local/zuugle/import-data-files.sh > /var/log/import-data-files.log 2>&1
#   30 0 * * * /usr/local/zuugle/find-duplicates/delete-duplicates.sh > .../output.log
#   06 11 * * * /usr/local/zuugle/import-files.sh >> /var/log/import-data-files.log 2>&1
```

> Same Node-version caveat as UAT: the zuugle-neu crontab pins
> `PATH=…/node/v20.5.0/bin:…/node/v20.3.0/bin:…`, so the PROD nightly load runs under
> **Node 20.5.0**, not 24. `import-data-files.sh`, `import-files.sh`, and the
> `find-duplicates/` scripts are referenced but **not** in this repo — capture from the
> host if any get re-enabled.
