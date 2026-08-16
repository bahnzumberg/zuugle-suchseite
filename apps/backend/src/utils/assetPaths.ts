/**
 * Canonical form of every asset path the API stores and serves: **host-free and
 * without the `/public` prefix**, e.g. `/range-image/dachstein.webp`.
 *
 * The frontend turns these into real URLs with `assetUrl()` /`publicAssetUrl()` —
 * `https://cdn.zuugle.at` on PROD, `/public` on UAT, DEV and local. The API
 * therefore never needs to know which host the client is on: the environment
 * that reads a path decides its host.
 */

import path from "path";

const isProd = process.env.NODE_ENV === "production";

/** Shown when a tour has no image of its own. Lives in `public/img/`. */
export const PLACEHOLDER_IMAGE_PATH = "/img/train_placeholder.webp";

/**
 * Folder under `public/` holding the generated map previews. Exported so the SQL
 * in `jobs/sync.js` that has to recognise those paths matches on the same string
 * `gpxImagePath()` writes.
 */
export const GPX_IMAGE_PREFIX = "/gpx-image/";

/**
 * The shard a sharded path goes into: the last two digits of the id, padded to
 * two characters. Keeps the directories small enough to list.
 */
export function last_two_characters(original: string | number | null | undefined) {
    if (!original) {
        return "00";
    }
    const asString = `${original}`;
    return asString.length >= 2 ? asString.slice(-2) : `0${asString}`;
}

/** Pre-rendered image of the tour's mountain range, keyed by `range_slug`. */
export function rangeImagePath(rangeSlug: string) {
    return `/range-image/${rangeSlug}.webp`;
}

/** Map preview generated from the tour's GPX track. */
export function gpxImagePath(tourId: string | number) {
    return `${GPX_IMAGE_PREFIX}${last_two_characters(tourId)}/${tourId}_gpx_small.webp`;
}

/** The tour's own GPX track. */
export function tourGpxPath(tourId: string | number) {
    return `/gpx/${last_two_characters(tourId)}/${tourId}.gpx`;
}

/** The walking track between the station and the tour. */
export function connectionGpxPath(direction: "totour" | "fromtour", trackKey: string | number) {
    return `/gpx-track/${direction}/${last_two_characters(trackKey)}/${trackKey}.gpx`;
}

/**
 * Where the paths above live on disk. `build:copy` puts `public/` next to the
 * compiled code, so in production it sits one level above this module; running
 * from source (`tsx watch src/index.js`) it sits one level above `src/`.
 */
export const PUBLIC_DIR = path.join(__dirname, isProd ? ".." : "../..", "public");

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
