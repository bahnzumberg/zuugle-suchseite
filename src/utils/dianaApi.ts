/**
 * Shared Diana API utilities.
 *
 * Provides token fetching, language mapping, and MEZ→UTC time conversion
 * for direct Diana API calls (address-autocomplete, connections, etc.).
 */
import { DIANA_API_BASE_URL } from "./dianaConfig";

// Same base-URL logic as apiSlice: dev → localhost:8080, prod → relative
const API_BASE =
  window.location.host.indexOf("localhost") >= 0
    ? (import.meta.env.VITE_API_URL ?? "http://localhost:8080/api")
    : `${window.location.protocol}//${window.location.host}/api`;

/** URL of the backend token proxy */
const DIANA_TOKEN_URL = `${API_BASE}/diana-token`;

/** Re-export for convenience */
export const DIANA_API_BASE = DIANA_API_BASE_URL;

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

/**
 * Fetches a Diana API access token from our backend proxy.
 * Caches the token for 50 minutes (tokens are valid for 60 min).
 */
export async function fetchDianaToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const resp = await fetch(DIANA_TOKEN_URL);
  if (!resp.ok) {
    const body = await resp.json().catch(() => null);
    const err = new Error(
      body?.error ?? `Diana token fetch failed: ${resp.status}`,
    );
    (err as Error & { status?: number }).status = resp.status;
    throw err;
  }
  const data = await resp.json();
  cachedToken = data.access_token;
  // Cache for 50 minutes
  tokenExpiresAt = now + 50 * 60 * 1000;
  return data.access_token;
}

/**
 * Map i18n language code to Diana API language format.
 */
export function mapLanguage(lang: string): string {
  const code = lang.substring(0, 2).toLowerCase();
  const supported = ["de", "en", "fr", "it"];
  return supported.includes(code) ? code : "en";
}

/**
 * Convert a local MEZ/MESZ time string ("HH:MM") to UTC ("HH:MM")
 * for a given date.
 *
 * Uses the browser's timezone support to handle CET (UTC+1) vs CEST (UTC+2)
 * automatically based on the date.
 *
 * @param timeStr  Local time in "HH:MM" format (Europe/Vienna)
 * @param dateStr  Date in "YYYY-MM-DD" format, used to determine DST offset
 * @returns        UTC time in "HH:MM" format
 */
export function localTimeToUtc(timeStr: string, dateStr: string): string {
  // Parse as local Vienna time by using Intl to find the offset
  const viennaFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Vienna",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // Find offset: create a UTC date, format it in Vienna tz, find difference
  // Simpler approach: use a known reference
  const refDate = new Date(`${dateStr}T12:00:00Z`);
  const viennaParts = viennaFormatter.formatToParts(refDate);
  const viennaHour = parseInt(
    viennaParts.find((p) => p.type === "hour")?.value || "0",
  );
  const utcHour = refDate.getUTCHours(); // 12
  const offsetHours = viennaHour - utcHour; // 1 (CET) or 2 (CEST)

  const [h, m] = timeStr.split(":").map(Number);
  let utcH = h - offsetHours;
  if (utcH < 0) utcH += 24;
  if (utcH >= 24) utcH -= 24;

  return `${String(utcH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
