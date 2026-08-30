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

/** Scheme and host of an absolute URL, e.g. the `https://www.zuugle.at` below. */
const SCHEME_AND_HOST = /^[a-z][a-z\d+.-]*:\/\/[^/]*/i;

/** Strips scheme+host and any `/public` prefix down to the bare asset path. */
function ownAssetPath(url: string): string {
  return url.replace(SCHEME_AND_HOST, "").replace(/^\/public(?=\/)/, "");
}

/**
 * Re-points an asset URL that came from the API at this environment.
 *
 * The API hands out its own assets host-free (`/gpx/56/61256.gpx`), so this is
 * normally just `assetUrl()`. The host-stripping is a fallback for API
 * responses that predate that switch: those were built from the `domain` query
 * parameter the client sends, so `dev:main` and `dev:uat` — which run on
 * localhost but talk to a deployed API — got back hosts nothing local serves.
 *
 * Accepts absolute and relative URLs, with or without the `/public` prefix,
 * and keeps any query string (the CDN's `?width=…` image parameters).
 *
 * @example
 * publicAssetUrl("https://www.zuugle.at/public/gpx/56/61256.gpx")
 * // → "/public/gpx/56/61256.gpx"
 */
export function publicAssetUrl(url: string): string {
  if (!url) {
    return url;
  }
  return assetUrl(ownAssetPath(url));
}

/**
 * The same asset, served by this environment's own origin instead of
 * `__ASSET_BASE__`. Off PROD the two are identical; `fetchAsset()` uses that to
 * skip retrying a URL against itself.
 *
 * @example
 * originAssetUrl("https://cdn.zuugle.at/gpx/56/61256.gpx")
 * // → "/public/gpx/56/61256.gpx"
 */
export function originAssetUrl(url: string): string {
  if (!url) {
    return url;
  }
  return `/public/${ownAssetPath(url).replace(/^\/+/, "")}`;
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

/**
 * Makes an already re-pointed asset URL absolute, for the consumers that cannot
 * use a site-relative one — `og:image`/`twitter:image`, which social crawlers
 * fetch out of any page context.
 *
 * On PROD `__ASSET_BASE__` is the CDN, so our own images are absolute already
 * and this is a no-op; on UAT, DEV and local it resolves the `/public` base
 * against the page.
 */
export function absoluteAssetUrl(url: string): string {
  if (!url) {
    return url;
  }
  return new URL(url, window.location.origin).href;
}
