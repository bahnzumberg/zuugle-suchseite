# deploy/ — captured server-only state

This directory pulls *how the system runs* out of the servers and into the repo,
so the whole system is defined and deployed from one versioned place.

| Subdir | What it holds | Source (server) |
| --- | --- | --- |
| `nginx/<env>/` | Server blocks: SPA static root + `/api` reverse proxy + `/public` (BunnyCDN origin) + TLS + basic-auth | `sudo nginx -T` on each host |
| `pm2/<host>/ecosystem.config.js` | PM2 app defs (names, ports, env). **Templated** — secrets are `${VAR}`, filled at deploy time. | `~/suchseite/ecosystem.config.js` |
| `loaders/` | Nightly-load Python orchestrators + the crontab schedule they run on | `/usr/local/zuugle/` + `crontab -l` |

## Hosts

| Host | Serves | Deploy targets |
| --- | --- | --- |
| `uat-zuugle` | UAT (`zuugle_api` → www2.zuugle.{at,ch,de,fr,it,si}) + DEV (`dev-zuugle_api` → dev.zuugle.at) | `/root/suchseite/{app, dev-app, api, dev-api}` |
| `zuugle-neu` | PROD (`zuugle_api` → www.zuugle.{at,ch,de,fr,it,li,si}, native PostgreSQL, PM2 cluster) | `/root/suchseite/{app, api}` |

## The `/api` path contract (do NOT change during the merge)

The frontend talks to the backend over the **relative `/api` path**; nginx maps
`/api` → the PM2 app port on the same host (UAT 6060 / DEV 7070). Capturing these
server blocks documents that contract so it survives the monorepo merge untouched.

## Findings that revise the plan (from the 2026-07-07 UAT capture)

1. **Fourth deploy target `dev-app`.** DEV frontend root is `/root/suchseite/dev-app`,
   not `app`. Real targets on uat-zuugle: `app`, `dev-app`, `api`, `dev-api`.
   → Phase 3 frontend caller must send the DEV build to `dev-app`.
2. **Cron runs Node 20.5.0, not 24.** The uat-zuugle crontab PATH pins
   `node/v20.5.0/bin`; the PM2 API runs 24.18.0. "Node 24 everywhere" is untrue on the
   nightly-load path. → fold the runtime unification into Phase 5.4 (systemd timers).
3. **UAT DB creds are in the app-dir `.env`, not the PM2 env block** (only
   `dev-zuugle_api` carries creds in `ecosystem.config.js`). Contradicts
   `TODO-server.md`. → affects Phase 5.3 (envsubst deploy) and 5.5 (PROD cutover).
4. **Multi-TLD:** UAT serves 6 TLDs (`www2.zuugle.{at,ch,de,fr,it,si}`), PROD serves 7
   (`www.zuugle.{at,ch,de,fr,it,li,si}`, adds `.li`), each via one shared nginx snippet.
5. **PROD specifics:** public (no basic-auth), PM2 **cluster** mode (`instances: "max"`,
   4 online), per-TLD HTTP→HTTPS + bare→www redirects, `/robots.txt` served from
   host-managed `/var/www/zuugle/robots.txt`. PROD `ecosystem.config.js` holds **no**
   secrets (only `NODE_ENV`) — DB creds live in the app-dir `.env`. See `nginx/prod/README.md`.

## Capture status — Phase 0 COMPLETE (2026-07-07)

- [x] `nginx/uat/` — captured (snippet + www2 wrapper + dev block + README)
- [x] `nginx/prod/` — captured (snippet + www wrapper + README)
- [x] `pm2/uat-zuugle/ecosystem.config.js` — captured (templated, `${DEV_DB_PASSWORD}`)
- [x] `pm2/zuugle-neu/ecosystem.config.js` — captured (verbatim, no secrets)
- [x] `loaders/start_zuugle_uat_load.py` — captured (matches live, md5-verified)
- [x] `loaders/start_zuugle_load.py` — captured (PROD, zuugle-neu)
- [x] `loaders/README.md` schedule — both hosts
- [x] `scripts/check-cron-scripts.mjs` (Phase 0.4 guard) — done, wired into code-checks
