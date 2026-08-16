/**
 * Single source of truth for the base URL of static assets (fonts, images,
 * icons) that live in the backend `public/` folder.
 *
 * PROD sets `VITE_ASSET_BASE_URL=https://cdn.zuugle.at`; UAT, DEV and local
 * leave it unset and serve `/public` from their own API folder, so no
 * environment loads its assets from production. See `README.md`.
 */

/**
 * Resolved once — `VITE_ASSET_BASE_URL` is a build-time constant. An empty or
 * whitespace-only value (a bare `VITE_ASSET_BASE_URL=` in a deploy workflow)
 * falls back to `/public` rather than producing site-root URLs that 404.
 */
const ASSET_BASE = (
  import.meta.env.VITE_ASSET_BASE_URL?.trim() || "/public"
).replace(/\/+$/, "");

/**
 * @example
 * assetUrl("/img/zuugle.svg")
 * // PROD → "https://cdn.zuugle.at/img/zuugle.svg"
 * // UAT/DEV/local → "/public/img/zuugle.svg"
 */
export function assetUrl(path: string): string {
  return `${ASSET_BASE}/${path.replace(/^\/+/, "")}`;
}
