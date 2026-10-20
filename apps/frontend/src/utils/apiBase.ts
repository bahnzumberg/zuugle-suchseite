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
declare const __ZUUGLE_DOMAIN__: string | undefined;

let customApiBaseUrl: string | null = null;
let customDomain: string | null = null;

export function setApiConfig(config: {
  apiBaseUrl?: string | null;
  domain?: string | null;
}) {
  if (config.apiBaseUrl !== undefined) customApiBaseUrl = config.apiBaseUrl;
  if (config.domain !== undefined) customDomain = config.domain;
}

export function getApiBaseUrl(): string {
  if (customApiBaseUrl) return customApiBaseUrl;
  return import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : window.location.host.includes("localhost")
      ? "http://localhost:8080/api"
      : `${window.location.protocol}//${window.location.host}/api`;
}

export function getApiDomain(): string {
  if (customDomain) return customDomain;
  if (typeof __ZUUGLE_DOMAIN__ !== "undefined") return __ZUUGLE_DOMAIN__;
  return window.location.hostname;
}

/**
 * Parses and normalizes a domain string from data-domain.
 * Defaults to "www.zuugle.at" if not provided.
 */
export function parseDomainConfig(rawDomain?: string | null): {
  domain: string;
  apiBaseUrl: string;
  assetBaseUrl?: string;
} {
  const defaultDomain = "www.zuugle.at";
  const input = (rawDomain || "").trim() || defaultDomain;

  // Strip protocol and trailing slashes
  let clean = input.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
  // Strip trailing /api if accidentally included
  clean = clean.replace(/\/api$/, "");

  const isLocalhost =
    clean.startsWith("localhost") || clean.startsWith("127.0.0.1");
  const protocol = isLocalhost ? "http:" : "https:";

  const apiBaseUrl = `${protocol}//${clean}/api`;

  let assetBaseUrl: string | undefined;
  if (
    clean.includes("dev.zuugle.at") ||
    clean.includes("www2.zuugle.at") ||
    isLocalhost
  ) {
    assetBaseUrl = `${protocol}//${clean}/public`;
  } else if (clean.includes("zuugle.")) {
    assetBaseUrl = "https://cdn.zuugle.at";
  }

  return {
    domain: clean,
    apiBaseUrl,
    assetBaseUrl,
  };
}

export const API_BASE_URL = getApiBaseUrl();
