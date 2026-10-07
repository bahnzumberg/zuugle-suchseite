import { todayInVienna } from "../models/tourWeather";

const STORAGE_KEY = "tourDate";

/**
 * Returns the stored tour date ("YYYY-MM-DD") from localStorage.
 * If the date is missing, invalid, or in the past (Europe/Vienna), it is discarded and null is returned.
 */
export function getStoredTourDate(): string | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const today = todayInVienna();
    if (stored < today) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return stored;
  } catch {
    return null;
  }
}

/**
 * Persists the selected tour date ("YYYY-MM-DD") to localStorage.
 * Removes the key if null or empty.
 */
export function setStoredTourDate(date: string | null): void {
  try {
    if (date) {
      localStorage.setItem(STORAGE_KEY, date);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore localStorage errors (e.g. quota exceeded or private mode)
  }
}
