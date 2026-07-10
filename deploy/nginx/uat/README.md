# nginx — uat-zuugle host

Captured with `nginx -T` on 2026-07-07. This host serves **UAT** and **DEV**.

## Environment → app → target map

| Env | Host name(s) | FE static root | `/api` proxy → | `/public` alias | Backend |
| --- | --- | --- | --- | --- | --- |
| UAT | `www2.zuugle.{at,ch,de,fr,it,si}` | `/root/suchseite/app` | `localhost:6060` | `/root/suchseite/api/public/` | `zuugle_api` (PM2) |
| DEV | `dev.zuugle.at` | `/root/suchseite/dev-app` | `localhost:7070` | `/root/suchseite/dev-api/public/` | `dev-zuugle_api` (PM2) |


## Files

- `snippets/zuugle-www2.conf` — the real UAT server body (root, basic-auth, security
  headers #909–919, `/api`→:6060, `/public`, security.txt, SPA fallback). **Six** TLD
  server blocks include it: `www2.zuugle.{at,ch,de,fr,it,si}`.
- `sites-available/www2.zuugle.at` — one representative TLD wrapper (TLS + include).
  The other five are identical except `server_name` + cert paths.
- `sites-available/dev.zuugle.at` — self-contained DEV block (root `dev-app`, `/api`→:7070).

## Not captured (secret / host-managed, intentionally out of git)

- **Basic-auth**: `auth_basic_user_file /etc/nginx/.htpasswd` — credential file, stays on host.
- **TLS**: `/etc/letsencrypt/live/<domain>/…` — Certbot-managed (renew cron `0 10 * * *`).
- `sites-enabled/default` — stock nginx default (`/var/www/html`), unrelated to zuugle.

