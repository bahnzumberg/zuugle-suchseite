import { useState, useCallback } from "react";

const STORAGE_KEY = "zuugle_cookie_consent";

export type ConsentLevel = "essential_only" | "all";

/**
 * Reads the current consent level from localStorage.
 * Returns null when the user has not yet made a choice.
 */
export function getConsentLevel(): ConsentLevel | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "all" || stored === "essential_only") return stored;
  // Migrate legacy "accepted" value (old banner stored this)
  if (stored === "accepted") return "all";
  return null;
}

export function hasComfortConsent(): boolean {
  return getConsentLevel() === "all";
}

/** Keys that belong to the "comfort" category and require consent. */
const COMFORT_KEYS = [
  "departureLocation",
  "departureLocationLat",
  "departureLocationLon",
];

function clearComfortStorage() {
  for (const key of COMFORT_KEYS) {
    localStorage.removeItem(key);
  }
}

/**
 * Hook for managing cookie/localStorage consent.
 *
 * - `consentLevel`: current choice or null (undecided)
 * - `isComfortAllowed`: true only when the user accepted all cookies
 * - `acceptEssential()`: stores "essential_only", clears comfort keys
 * - `acceptAll()`: stores "all"
 */
export function useConsent() {
  const [consentLevel, setConsentLevel] = useState<ConsentLevel | null>(
    getConsentLevel,
  );

  const acceptEssential = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "essential_only");
    clearComfortStorage();
    setConsentLevel("essential_only");
  }, []);

  const acceptAll = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "all");
    setConsentLevel("all");
  }, []);

  return {
    consentLevel,
    isComfortAllowed: consentLevel === "all",
    acceptEssential,
    acceptAll,
  };
}
