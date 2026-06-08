import { useState, useCallback, useRef } from "react";
import { DIANA_PROXY_BASE, mapLanguage } from "../utils/dianaApi";

export interface AutocompleteOption {
  displayName: string;
  locationType: "address" | "station";
  lat: number;
  lon: number;
  citySlug?: string;
  cityName?: string;
}

/**
 * Custom hook for Diana address autocomplete.
 * Debounces input and queries the Diana /address-autocomplete endpoint.
 */
export function useDianaAutocomplete(lang: string) {
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback(
    (query: string) => {
      // Clear previous timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Cancel in-flight request
      if (abortRef.current) {
        abortRef.current.abort();
      }

      if (!query || query.length < 2) {
        setOptions([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      debounceTimer.current = setTimeout(async () => {
        try {
          const controller = new AbortController();
          abortRef.current = controller;

          const params = new URLSearchParams({
            q: query,
            limit: "6",
            lang: mapLanguage(lang),
          });

          const resp = await fetch(
            `${DIANA_PROXY_BASE}/address-autocomplete?${params}`,
            {
              signal: controller.signal,
            },
          );

          if (!resp.ok) {
            throw new Error(`Autocomplete failed: ${resp.status}`);
          }

          const data = await resp.json();

          // Response is a GeoJSON FeatureCollection or array
          const features = Array.isArray(data) ? data : data.features || [];

          const mapped: AutocompleteOption[] = features.map(
            // oxlint-disable-next-line @typescript-eslint/no-explicit-any
            (feature: any) => ({
              displayName:
                feature.diana_properties?.display_name ||
                feature.properties?.name ||
                "Unknown",
              locationType:
                feature.diana_properties?.location_type || "address",
              lat: feature.geometry?.coordinates?.[1] ?? 0,
              lon: feature.geometry?.coordinates?.[0] ?? 0,
              citySlug: feature.zuugle_properties?.city_slug ?? undefined,
              cityName: feature.zuugle_properties?.city_name ?? undefined,
            }),
          );

          setOptions(mapped);
        } catch (err) {
          if (err instanceof DOMException && err.name === "AbortError") {
            return; // Request was cancelled, ignore
          }
          console.error("Diana autocomplete error:", err);
          setOptions([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    },
    [lang],
  );

  const clearOptions = useCallback(() => {
    setOptions([]);
  }, []);

  return { options, loading, search, clearOptions };
}
