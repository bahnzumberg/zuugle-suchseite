import { useCallback, useEffect, useRef } from "react";
import { WeatherMetadata } from "../models/weatherOverlay";
import { assetUrl } from "../utils/assetUrl";

/**
 * Hook to prefetch remaining weather overlay images once the first active overlay finishes loading.
 *
 * Sequence:
 * 1. User activates weather overlay.
 * 2. The active day's overlay loads first on the map.
 * 3. When the active overlay's load event fires (or via safety timer), the remaining days'
 *    overlays are prefetched in the background.
 * 4. When the user switches days, the overlay displays instantly from browser cache.
 */
export function useWeatherOverlayPrefetch(
  weatherMetadata: WeatherMetadata | null,
  isWeatherActive: boolean,
  activeFile?: string | null,
) {
  const prefetchedFilesRef = useRef<Set<string>>(new Set());
  const hasTriggeredPrefetchRef = useRef(false);

  // Reset tracking if weather metadata changes
  useEffect(() => {
    prefetchedFilesRef.current.clear();
    hasTriggeredPrefetchRef.current = false;
  }, [weatherMetadata]);

  const prefetchRemaining = useCallback(() => {
    if (!weatherMetadata?.days || hasTriggeredPrefetchRef.current) return;
    hasTriggeredPrefetchRef.current = true;

    // Mark current active file as already handled
    if (activeFile) {
      prefetchedFilesRef.current.add(activeFile);
    }

    weatherMetadata.days.forEach((day) => {
      if (
        !day.file ||
        day.file === activeFile ||
        prefetchedFilesRef.current.has(day.file)
      ) {
        return;
      }
      prefetchedFilesRef.current.add(day.file);
      const url = assetUrl(`weather/${day.file}`);
      const img = new Image();
      img.src = url;
      if ("decode" in img && typeof img.decode === "function") {
        img.decode().catch(() => {
          // Ignore background decode failures
        });
      }
    });
  }, [weatherMetadata, activeFile]);

  // Safety fallback: if load event did not fire within 2.5s of activation, prefetch anyway
  useEffect(() => {
    if (
      !isWeatherActive ||
      hasTriggeredPrefetchRef.current ||
      !weatherMetadata?.days
    ) {
      return;
    }

    const timer = setTimeout(() => {
      prefetchRemaining();
    }, 2500);

    return () => clearTimeout(timer);
  }, [isWeatherActive, prefetchRemaining, weatherMetadata]);

  const onOverlayLoad = useCallback(() => {
    if (isWeatherActive) {
      prefetchRemaining();
    }
  }, [isWeatherActive, prefetchRemaining]);

  return {
    onOverlayLoad,
  };
}
