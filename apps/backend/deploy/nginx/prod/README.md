# nginx — zuugle-neu host (PROD)

Captured with `nginx -T` on 2026-07-07. This host serves **PROD** (public — **no
basic-auth**, unlike UAT/DEV), native PostgreSQL.

## Environment → app → target map

| Env | Host name(s) | FE static root | `/api` proxy → | `/public` alias | Backend |
| --- | --- | --- | --- | --- | --- |
| PROD | `www.zuugle.{at,ch,de,fr,it,li,si}` (+ bare→www) | `/root/suchseite/app` | `localhost:6060` | `/root/suchseite/api/public/` | `zuugle_api` (PM2, **cluster** ×max) |

Deploy targets on this host: **`app`** (FE) + **`api`** (BE). No `dev-app`/`dev-api` here.

## Files

- `snippets/zuugle.conf` — the real PROD server body (root, security headers #909–919,
  `/api`→:6060, `/public`, security.txt, SPA fallback). **No `auth_basic`** (public site).
- `sites-available/www.zuugle.at` — one representative TLD block (HTTP→HTTPS redirect +
  bare→www redirect + main block including the snippet + per-TLD `/robots.txt` alias).
  **Seven** TLDs include the snippet: `www.zuugle.{at,ch,de,fr,it,li,si}` — identical
  except `server_name` + cert paths.

## Differences vs UAT (nginx/uat/)

- **No basic-auth** on PROD (UAT/DEV gate behind `/etc/nginx/.htpasswd`).
- **Full redirect setup**: each TLD has an HTTP→HTTPS block and an HTTPS bare→www block.
- **`/robots.txt`** is served per-TLD from `/var/www/zuugle/robots.txt` (outside the app
  root, host-managed) — the app/deploy must not clobber it.
- Snippet is named `zuugle.conf` (UAT's is `zuugle-www2.conf`).
- Seven TLDs (adds `.li`), vs UAT's six.

## Not captured (secret / host-managed, intentionally out of git)

- **TLS**: `/etc/letsencrypt/live/<domain>/…` — Certbot-managed (renew cron `0 10 * * *`).
- `/var/www/zuugle/robots.txt` — host-managed PROD robots.
- `sites-enabled/default` — stock nginx default.

## Notes

- `nginx -T` emits `conflicting server name "91.98.144.30" on 0.0.0.0:80` warnings —
  every TLD's HTTP-redirect block lists the shared IP in `server_name`; nginx keeps the
  first and ignores the rest. Harmless, but could be tidied (drop the IP from all but one).
- PM2 reported an in-memory/local version drift (5.4.2 vs 6.0.14, "run `pm2 update`") —
  unrelated to this capture; worth resolving during the PROD infra work (Phase 5.6).
