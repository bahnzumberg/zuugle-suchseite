// The localStorage contract for favorites: index.tsx writes these keys, the
// cross-tab `storage` listener in useFavorites reads them back.
export const FAVORITES_LIST_KEY_STORAGE = "favoritesListKey";
export const FAVORITE_TOUR_IDS_STORAGE = "favoriteTourIds";

// Anything that isn't an array of ids reads as no favorites — the state a
// first-time visitor has.
export function parseFavoriteTourIds(raw: string | null): number[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Error parsing favoriteTourIds from localStorage", e);
    return [];
  }
}
