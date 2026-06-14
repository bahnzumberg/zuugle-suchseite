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
   regardless of the flag (`routes/tours.js`, `jobs/sync.js`), so UAT/DEV also
   emit prod-CDN URLs for range-images and the placeholder. Make consistent.
