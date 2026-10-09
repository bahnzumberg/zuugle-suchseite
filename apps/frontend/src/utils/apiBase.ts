/**
 * Base URL of the Zuugle backend API.
 *
 * On localhost the frontend and the backend are separate servers, so requests
 * go to `VITE_API_URL` — the local backend by default, or a deployed
 * environment via the `dev:uat` / `dev:main` scripts. The embed build also
 * sets `VITE_API_URL` to an absolute URL (e.g. https://www.zuugle.at/api)
 * so the widget can talk to the API from any host. Everywhere else the API
 * is served from the same host as the page.
 *
 * The embed widget can override this at runtime via `setApiBaseUrl()` before
 * the Redux store is created, so the host page can pass `data-api` without
 * requiring a rebuild.
 */
let _apiBaseUrl = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : window.location.host.includes("localhost")
    ? "http://localhost:8080/api"
    : `${window.location.protocol}//${window.location.host}/api`;

/** Current API base URL — read this instead of the old `API_BASE_URL` const. */
export function getApiBaseUrl(): string {
  return _apiBaseUrl;
}

/**
 * Override the API base URL at runtime.
 *
 * **Must** be called before the RTK Query store is created (i.e. before
 * `configureStore()` in `embed.tsx`), because `createApi()` captures
 * `baseUrl` eagerly via a custom `baseQuery` that calls `getApiBaseUrl()`.
 */
export function setApiBaseUrl(url: string): void {
  _apiBaseUrl = url;
}

/**
 * @deprecated Use `getApiBaseUrl()` instead. Kept for backwards-compat with
 * code that imports the named constant.
 */
export const API_BASE_URL = _apiBaseUrl;
