import { originAssetUrl } from "./assetUrl";

/**
 * Fetches one of our own assets, retrying against this origin's `/public` copy
 * if the request comes back blocked or failed.
 *
 * Only `fetch()` needs this — an `<img>` or `@font-face` reaches the asset base
 * under CSP/CORS rules a `fetch()` doesn't get, and those rules live in nginx
 * and the Bunny pull zone, not in this repo, so a file can be fetchable one way
 * and not the other. `/public` serves the same files the CDN pulls from, so
 * retrying there costs a request, not the tour's GPX track.
 */
export async function fetchAsset(url: string): Promise<Response> {
  const originUrl = originAssetUrl(url);
  if (originUrl === url) {
    return fetch(url);
  }
  try {
    const response = await fetch(url);
    if (response.ok || response.status === 404) {
      return response;
    }
  } catch {
    // A blocked cross-origin fetch rejects without a status to check.
  }
  return fetch(originUrl);
}
