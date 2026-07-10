# pm2 — templated ecosystem configs

One `ecosystem.config.js` **per host** (they define different apps):

| File | Host | Apps | Status |
| --- | --- | --- | --- |
| `uat-zuugle/ecosystem.config.js` | `uat-zuugle` | `zuugle_api` (UAT), `dev-zuugle_api` (DEV) | captured 2026-07-07 (fork) |
| `zuugle-neu/ecosystem.config.js` | `zuugle-neu` | `zuugle_api` (PROD) | captured 2026-07-07 (**cluster**, `instances:"max"`) |

> **PROD runs clustered** (`exec_mode: "cluster"`, `instances: "max"`) → the 4 online
> `zuugle_api` processes seen in `pm2 ls`. UAT/DEV run single-process fork.

## How PM2 runs these (do not "clean up" during the migration)

- **No `cwd` is set.** PM2 is started from `~/suchseite`, so `./api/index.js` and
  `./dev-api/index.js` resolve relative to that dir. Preserve this.
- **App ports are NOT here.** UAT listens on 6060, DEV on 7070 (per nginx `proxy_pass`);
  those come from each app dir's `.env`, not this file.
- **`exec_mode: "fork_mode"`** — PM2's documented value is `"fork"`; `"fork_mode"` is
  effectively ignored and PM2 defaults to fork. Captured verbatim; flag, don't fix here.

To restart after an env change (re-reads the file):
```bash
cd ~/suchseite
pm2 restart ecosystem.config.js --update-env --only <app>
pm2 save
```
