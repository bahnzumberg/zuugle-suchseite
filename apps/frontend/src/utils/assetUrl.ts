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
/** Scheme and host of an absolute URL, e.g. the `https://localhost` above. */
const SCHEME_AND_HOST = /^[a-z][a-z\d+.-]*:\/\/[^/]*/i;

export function publicAssetUrl(url: string): string {
  if (!url) {
    return url;
  }
  const path = url.replace(SCHEME_AND_HOST, "");
  return assetUrl(path.replace(/^\/public(?=\/)/, ""));
}

/**
 * Same, for `image_url` — which, unlike the GPX links, is not always ours.
 * Some come from (`https://cdn.bahn-zum-berg.at/…?width=784&height=523`).
 * Those keep their host.
 * Absolute `cdn.zuugle.at` URLs can still reach us from a production dump that
 * predates the switch. Those are left alone too.
 *
 * @example
 * apiImageUrl("/range-image/dachstein.webp")
 * // PROD → "https://cdn.zuugle.at/range-image/dachstein.webp"
 * // UAT/DEV/local → "/public/range-image/dachstein.webp"
 */
export function apiImageUrl(url: string): string {
  if (!url || SCHEME_AND_HOST.test(url)) {
    return url;
  }
  return publicAssetUrl(url);
}

/** The size parameters `sizedImageUrl()` replaces. */
const SIZE_PARAM = /^(width|height)=/i;

/**
 * Asks for an image at a given size, replacing any size the URL already carries.
 *
 * Only PROD actually resizes: its asset base is the BunnyCDN pull zone, whose
 * on-the-fly optimizer reads these parameters.
 *
 * @example
 * sizedImageUrl("/public/range-image/dachstein.webp", { width: 600, height: 400 })
 * // → "/public/range-image/dachstein.webp?width=600&height=400"
 */
export function sizedImageUrl(
  url: string,
  { width, height }: { width: number; height: number },
): string {
  const [path, query] = url.split("?");
  // Kept verbatim rather than run through URLSearchParams, which would re-encode
  // them — the provider images carry an `aspect_ratio=500:570` that has always
  // reached their CDN with the colon intact.
  const otherParams = (query ?? "")
    .split("&")
    .filter((param) => param && !SIZE_PARAM.test(param));
  return `${path}?${[...otherParams, `width=${width}`, `height=${height}`].join("&")}`;
}
