/**
 * Canonical form of every image path the API stores and serves: **host-free and
 * without the `/public` prefix**, e.g. `/range-image/dachstein.webp`.
 *
 * The frontend turns these into real URLs with `assetUrl()` /`publicAssetUrl()` —
 * `https://cdn.zuugle.at` on PROD, `/public` on UAT, DEV and local.
 */

/** Shown when a tour has no image of its own. Lives in `public/img/`. */
export const PLACEHOLDER_IMAGE_PATH = "/img/train_placeholder.webp";

/**
 * Folders under `public/`. Exported so the SQL that has to recognise these paths
 * (`jobs/sync.js`) matches on the same strings the generators below write.
 */
export const RANGE_IMAGE_PREFIX = "/range-image/";
export const GPX_IMAGE_PREFIX = "/gpx-image/";

/** Pre-rendered image of the tour's mountain range, keyed by `range_slug`. */
export function rangeImagePath(rangeSlug: string) {
    return `${RANGE_IMAGE_PREFIX}${rangeSlug}.webp`;
}

/**
 * Map preview generated from the tour's GPX track. Sharded into subfolders by
 * the last two digits of the tour id to keep the directories small.
 */
export function gpxImagePath(tourId: string | number, lastTwoChars: string) {
    return `${GPX_IMAGE_PREFIX}${lastTwoChars}/${tourId}_gpx_small.webp`;
}

/** Absolute form written before image paths became relative. */
const LEGACY_CDN_URL = /^https?:\/\/cdn\.zuugle\.at\//i;

/**
 * Whether an `image_url` points at our own `public/` folder rather than at a
 * tour provider's site — true for the paths above and for the absolute CDN URLs
 * still sitting in older dumps.
 */
export function isOwnAssetPath(imageUrl?: string | null) {
    if (!imageUrl) {
        return false;
    }
    return imageUrl.startsWith("/") || LEGACY_CDN_URL.test(imageUrl);
}
