/**
 * Single source of truth for the base URL of static assets (fonts, images,
 * icons) that live in the backend `public/` folder.
 *
 * PROD sets `VITE_ASSET_BASE_URL=https://cdn.zuugle.at`; UAT, DEV and local
 * leave it unset and serve `/public` from their own API folder, so no
 * environment loads its assets from production. See `README.md`.
 *
 * `vite.config.ts` resolves that variable — including the `/public` fallback
 * and the trailing slash — into `__ASSET_BASE__`, so the app code, the
 * `@font-face` `url()`s in `App.css` and the `index-*.html` entry points all
 * share one value.
 */

/**
 * @example
 * assetUrl("/img/zuugle.svg")
 * // PROD → "https://cdn.zuugle.at/img/zuugle.svg"
 * // UAT/DEV/local → "/public/img/zuugle.svg"
 */
export function assetUrl(path: string): string {
  return `${__ASSET_BASE__}/${path.replace(/^\/+/, "")}`;
}

/**
 * Re-points an asset URL that came from the API at this environment.
 *
 * The API builds absolute URLs from the `domain` query parameter the client
 * sends it, so `dev:main` and `dev:uat` — which run on localhost but talk to a
 * deployed API — get back unreachable hosts such as
 * `https://localhost/public/gpx/56/61256.gpx`.
 *
 * Accepts absolute and relative URLs, with or without the `/public` prefix,
 * and keeps any query string (the CDN's `?width=…` image parameters).
 *
 * @example
 * publicAssetUrl("https://localhost/public/gpx/56/61256.gpx")
 * // → "/public/gpx/56/61256.gpx"
 */
export function publicAssetUrl(url: string): string {
  if (!url) {
    return url;
  }
  const path = url.replace(/^[a-z][a-z\d+.-]*:\/\/[^/]*/i, "");
  return assetUrl(path.replace(/^\/public(?=\/)/, ""));
}
