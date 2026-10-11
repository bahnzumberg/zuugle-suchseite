/**
 * Base URL of the Zuugle backend API.
 *
 * On localhost the frontend and the backend are separate servers, so requests
 * go to `VITE_API_URL` — the local backend by default, or a deployed
 * environment via the `dev:uat` / `dev:main` scripts. The embed build also
 * sets `VITE_API_URL` to an absolute URL (e.g. https://www.zuugle.at/api)
 * so the widget can talk to the API from any host. Everywhere else the API
 * is served from the same host as the page.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : window.location.host.includes("localhost")
    ? "http://localhost:8080/api"
    : `${window.location.protocol}//${window.location.host}/api`;
