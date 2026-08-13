/**
 * Single source of truth for the base URL of static assets (fonts, images,
 * icons) that live in the backend `public/` folder.
 *
 * PROD builds set `VITE_ASSET_BASE_URL=https://cdn.zuugle.at`. That host is a
 * BunnyCDN pull zone whose origin is prod, so `cdn.zuugle.at/img/x.svg` and
 * `www.zuugle.at/public/img/x.svg` serve the same file.
 *
 * UAT, DEV and local builds leave the variable unset and fall back to the
 * relative `/public` prefix, which nginx serves from that environment's own
 * API folder — so no environment loads assets from production any more.
 */

/** Used when `VITE_ASSET_BASE_URL` is unset or empty (UAT, DEV, local). */
const DEFAULT_ASSET_BASE = "/public";

/**
 * Builds the URL for a static asset.
 *
 * An unset, empty or whitespace-only base falls back to `/public`, so a
 * `VITE_ASSET_BASE_URL=` in a deploy workflow cannot silently produce
 * site-root URLs that 404.
 *
 * @example
 * assetUrl("/img/zuugle.svg")
 * // PROD → "https://cdn.zuugle.at/img/zuugle.svg"
 * // UAT/DEV/local → "/public/img/zuugle.svg"
 */
export function assetUrl(path: string): string {
  const base = (
    import.meta.env.VITE_ASSET_BASE_URL?.trim() || DEFAULT_ASSET_BASE
  ).replace(/\/+$/, "");
  return `${base}/${path.replace(/^\/+/, "")}`;
}
