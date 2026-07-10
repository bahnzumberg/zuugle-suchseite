/**
 * Shared Diana API utilities.
 *
 * All Diana API calls are proxied through the Zuugle backend.
 * The backend handles token management, language mapping, UTC conversion,
 * and default time window injection.
 */

// Same base-URL logic as apiSlice: dev → localhost:8080, prod → relative
const API_BASE =
  window.location.host.indexOf("localhost") >= 0
    ? (import.meta.env.VITE_API_URL ?? "http://localhost:8080/api")
    : `${window.location.protocol}//${window.location.host}/api`;

/** Base URL for all Diana proxy endpoints on the Zuugle backend */
export const DIANA_PROXY_BASE = `${API_BASE}/diana`;
