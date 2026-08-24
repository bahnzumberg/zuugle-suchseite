/**
 * Base URL of the Zuugle backend API.
 *
 * On localhost the frontend and the backend are separate servers, so requests
 * go to `VITE_API_URL` — the local backend by default, or a deployed
 * environment via the `dev:uat` / `dev:main` scripts. Everywhere else the API
 * is served from the same host as the page.
 */
export const API_BASE_URL = window.location.host.includes("localhost")
  ? (import.meta.env.VITE_API_URL ?? "http://localhost:8080/api")
  : `${window.location.protocol}//${window.location.host}/api`;
