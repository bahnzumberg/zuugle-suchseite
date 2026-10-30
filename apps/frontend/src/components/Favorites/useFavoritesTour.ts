import { usePageTour, getTourStorageKey } from "../../tours/usePageTour";

export const FAVORITES_TOUR_STORAGE_KEY = getTourStorageKey("favorites");

export function useFavoritesTour({
  enabled = false,
}: { enabled?: boolean } = {}) {
  return usePageTour({ tourId: "favorites", enabled });
}
