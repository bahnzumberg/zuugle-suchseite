/**
 * Shared Diana API utilities.
 *
 * All Diana API calls are proxied through the Zuugle backend.
 * The backend handles token management, language mapping, UTC conversion,
 * and default time window injection.
 */

import { API_BASE_URL } from "./apiBase";

/** Base URL for all Diana proxy endpoints on the Zuugle backend */
export const DIANA_PROXY_BASE = `${API_BASE_URL}/diana`;
