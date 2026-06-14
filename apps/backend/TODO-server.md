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
