import { getApiDomain } from "./apiBase";

/**
 * Mapping from 2-letter uppercase ISO country code to Zuugle TLD.
 */
export const SUPPORTED_COUNTRY_TLDS: Record<string, string> = {
  AT: "at",
  DE: "de",
  CH: "ch",
  IT: "it",
  SI: "si",
  FR: "fr",
  LI: "li",
};

/**
 * Mapping from 2-letter uppercase ISO country code to i18n key in section "main".
 */
export const COUNTRY_NAME_KEYS: Record<string, string> = {
  AT: "main.country_oesterreich",
  DE: "main.country_deutschland",
  CH: "main.country_schweiz",
  IT: "main.country_italien",
  SI: "main.country_slowenien",
  FR: "main.country_frankreich",
  LI: "main.country_liechtenstein",
};

/**
 * Determines the target domain host and full URL for a target country code,
 * preserving environment (UAT vs PROD).
 */
export function getTargetDomainInfo(
  targetCountryCode: string,
): { host: string; url: string } | null {
  const code = targetCountryCode.toUpperCase();
  const tld = SUPPORTED_COUNTRY_TLDS[code];
  if (!tld) return null;

  const currentDomain = getApiDomain();
  const isUat = currentDomain.includes("www2.");

  // Liechtenstein does not have a www2 domain on UAT
  const host =
    isUat && tld !== "li" ? `www2.zuugle.${tld}` : `www.zuugle.${tld}`;
  const url = `https://${host}`;
  return { host, url };
}

/**
 * Returns the grammatically correct country representation in the context
 * of "located in ...".
 */
export function getLocalizedCountryInText(
  countryCode: string,
  t: (key: string) => string,
  lang: string,
): string {
  const code = countryCode.toUpperCase();
  const key = COUNTRY_NAME_KEYS[code];
  const name = key ? t(key) : code;

  if (lang.startsWith("de") && code === "CH") {
    return "der Schweiz";
  }
  return name;
}

export interface DomainSwitchParams {
  targetUrl: string;
  tourId?: string | number;
  citySlug?: string;
  lang: string;
  useFlex?: boolean;
  selectedDate?: string;
  departure: {
    displayName: string;
    lat: number;
    lon: number;
    locationType: "address" | "station";
    citySlug?: string;
    cityName?: string;
  };
}

/**
 * Constructs the redirect URL to the new domain, carrying language in query params
 * and sensitive address details in the URL hash fragment.
 */
export function buildDomainSwitchUrl(params: DomainSwitchParams): string {
  const {
    targetUrl,
    tourId,
    citySlug,
    lang,
    useFlex,
    selectedDate,
    departure,
  } = params;

  const searchParams = new URLSearchParams();
  if (lang) {
    searchParams.set("lang", lang);
  }
  if (useFlex) {
    searchParams.set("flex", "1");
  }

  const hashParams = new URLSearchParams({
    origin: departure.displayName,
    lat: String(departure.lat),
    lon: String(departure.lon),
    type: departure.locationType,
  });
  if (departure.citySlug) hashParams.set("city", departure.citySlug);
  if (departure.cityName) hashParams.set("cityName", departure.cityName);
  if (selectedDate) hashParams.set("date", selectedDate);

  const cityParam = citySlug || departure.citySlug || "no-city";
  const tourPath = tourId
    ? `/tour/${tourId}/${cityParam}`
    : `/search?city=${cityParam}`;

  const qs = searchParams.toString();
  return `${targetUrl}${tourPath}${qs ? `?${qs}` : ""}#${hashParams.toString()}`;
}

export interface HashDepartureData {
  displayName: string;
  lat: number;
  lon: number;
  locationType: "address" | "station";
  citySlug?: string;
  cityName?: string;
  date?: string;
}

/**
 * Parses and validates departure location from the URL hash fragment.
 */
export function parseDepartureFromHash(
  hashString?: string,
): HashDepartureData | null {
  const hash =
    hashString !== undefined
      ? hashString
      : typeof window !== "undefined"
        ? window.location.hash
        : "";
  if (!hash || !hash.includes("origin=")) return null;

  try {
    const raw = hash.replace(/^#/, "");
    const params = new URLSearchParams(raw);
    const origin = params.get("origin");
    const latStr = params.get("lat");
    const lonStr = params.get("lon");
    const type = (params.get("type") as "address" | "station") || "address";
    const citySlug = params.get("city") || undefined;
    const cityName = params.get("cityName") || undefined;
    const date = params.get("date") || undefined;

    if (!origin || !latStr || !lonStr) return null;

    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);
    if (isNaN(lat) || isNaN(lon)) return null;

    return {
      displayName: origin,
      lat,
      lon,
      locationType: type === "station" ? "station" : "address",
      citySlug,
      cityName,
      date,
    };
  } catch {
    return null;
  }
}

/**
 * Removes the hash from the URL bar without triggering a reload or navigation.
 */
export function clearDepartureHashFromUrl() {
  if (typeof window === "undefined") return;
  window.history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search,
  );
}
