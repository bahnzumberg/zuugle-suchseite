import { useState, useCallback } from "react";

export interface DepartureLocation {
  displayName: string;
  locationType: "address" | "station";
}

const STORAGE_KEY = "departureLocation";
const STORAGE_KEY_LAT = "departureLocationLat";
const STORAGE_KEY_LON = "departureLocationLon";

function readFromStorage(): {
  location: DepartureLocation | null;
  lat: number | null;
  lon: number | null;
} {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const lat = localStorage.getItem(STORAGE_KEY_LAT);
    const lon = localStorage.getItem(STORAGE_KEY_LON);
    if (stored) {
      return {
        location: JSON.parse(stored),
        lat: lat ? parseFloat(lat) : null,
        lon: lon ? parseFloat(lon) : null,
      };
    }
  } catch {
    // Ignore parse errors
  }
  return { location: null, lat: null, lon: null };
}

/**
 * Custom hook for managing the departure location in localStorage.
 * Stores displayName + locationType as JSON, and lat/lon as separate keys.
 */
export function useDepartureLocation() {
  const initial = readFromStorage();
  const [departureLocation, setDepartureLocationState] =
    useState<DepartureLocation | null>(initial.location);
  const [departureLat, setDepartureLatState] = useState<number | null>(
    initial.lat,
  );
  const [departureLon, setDepartureLonState] = useState<number | null>(
    initial.lon,
  );

  const setDepartureLocation = useCallback(
    (
      location: DepartureLocation | null,
      lat: number | null,
      lon: number | null,
    ) => {
      setDepartureLocationState(location);
      setDepartureLatState(lat);
      setDepartureLonState(lon);

      if (location && lat !== null && lon !== null) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
        localStorage.setItem(STORAGE_KEY_LAT, String(lat));
        localStorage.setItem(STORAGE_KEY_LON, String(lon));
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY_LAT);
        localStorage.removeItem(STORAGE_KEY_LON);
      }
    },
    [],
  );

  const clearDepartureLocation = useCallback(() => {
    setDepartureLocationState(null);
    setDepartureLatState(null);
    setDepartureLonState(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY_LAT);
    localStorage.removeItem(STORAGE_KEY_LON);
  }, []);

  return {
    departureLocation,
    departureLat,
    departureLon,
    setDepartureLocation,
    clearDepartureLocation,
  };
}
