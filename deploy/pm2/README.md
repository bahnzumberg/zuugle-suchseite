# pm2 — templated ecosystem configs

One `ecosystem.config.js` **per host** (they define different apps):

| File | Host | Apps | Status |
| --- | --- | --- | --- |
| `uat-zuugle/ecosystem.config.js` | `uat-zuugle` | `zuugle_api` (UAT), `dev-zuugle_api` (DEV) | captured 2026-07-07 (fork) |
| `zuugle-neu/ecosystem.config.js` | `zuugle-neu` | `zuugle_api` (PROD) | captured 2026-07-07 (**cluster**, `instances:"max"`) |

These are **verbatim captures with any secret values replaced by `${VAR}` placeholders**
— kept byte-for-byte otherwise so `diff <captured> <live>` shows only the placeholder
line (Phase 0 verify step). The PROD file has **no** secrets (only `NODE_ENV`); the UAT
file has one (`${DEV_DB_PASSWORD}`). At deploy time the real file is produced with
`envsubst` (Phase 5.3), secrets sourced from GitHub Secrets — never committed.

> **PROD runs clustered** (`exec_mode: "cluster"`, `instances: "max"`) → the 4 online
> `zuugle_api` processes seen in `pm2 ls`. UAT/DEV run single-process fork.

## How PM2 runs these (do not "clean up" during the migration)

- **No `cwd` is set.** PM2 is started from `~/suchseite`, so `./api/index.js` and
  `./dev-api/index.js` resolve relative to that dir. Preserve this.
- **App ports are NOT here.** UAT listens on 6060, DEV on 7070 (per nginx `proxy_pass`);
  those come from each app dir's `.env`, not this file.
- **`exec_mode: "fork_mode"`** — PM2's documented value is `"fork"`; `"fork_mode"` is
  effectively ignored and PM2 defaults to fork. Captured verbatim; flag, don't fix here.

## ⚠️ Where the UAT DB credentials actually live

The UAT app (`zuugle_api`) env block has **only** `NODE_ENV` + `USE_CDN` — **no DB
creds**. It reads `DB_*` from `/root/suchseite/api/.env` on the host. Only
`dev-zuugle_api` carries DB creds in this file (→ `${DEV_DB_PASSWORD}`, a Dockerized
Postgres on :5433, container `zuugle-postgres-dev`). This contradicts
`TODO-server.md` ("DB credentials in env block ✓ set" for UAT) — the UAT creds are in
the app-dir `.env`, not here. Matters for Phase 5.3 (envsubst deploy) and 5.5 (PROD
cutover): the envsubst approach must account for creds that live in per-app `.env`.

To restart after an env change (re-reads the file):
```bash
cd ~/suchseite
pm2 restart ecosystem.config.js --update-env --only <app>
pm2 save
```
