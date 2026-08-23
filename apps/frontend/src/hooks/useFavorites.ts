import { useCallback, useEffect } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  useCreateFavoritesListMutation,
  useGetFavoritesListQuery,
  useAddFavoriteTourMutation,
  useRemoveFavoriteTourMutation,
} from "../features/apiSlice";
import {
  listKeyCreated,
  favoritesHydrated,
  favoriteAdded,
  favoriteRemoved,
  favoritesErrorSet,
} from "../features/favoritesSlice";

/**
 * Shared favorites state backed by the anonymous /api/lists API. Local state
 * is authoritative; the server is a best-effort mirror, not a gate.
 */
export function useFavorites() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const listKey = useAppSelector((state) => state.favorites.listKey);
  const tourIds = useAppSelector((state) => state.favorites.tourIds);
  const hydrated = useAppSelector((state) => state.favorites.hydrated);
  const error = useAppSelector((state) => state.favorites.error);

  const { data: listData } = useGetFavoritesListQuery(listKey ?? skipToken, {
    // Seeds tourIds once for a device that has no local cache yet.
    refetchOnFocus: true,
  });
  const [createFavoritesList] = useCreateFavoritesListMutation();
  const [addFavoriteTour] = useAddFavoriteTourMutation();
  const [removeFavoriteTour] = useRemoveFavoriteTourMutation();

  useEffect(() => {
    if (listData && !hydrated) {
      dispatch(favoritesHydrated(listData.tours.map((tour) => tour.id)));
    }
  }, [listData, hydrated, dispatch]);

  // Cross-tab sync via the native storage event.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === "favoritesListKey" && event.newValue) {
        dispatch(listKeyCreated(event.newValue));
        return;
      }
      if (event.key === "favoriteTourIds" && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (Array.isArray(parsed)) {
            dispatch(favoritesHydrated(parsed));
          }
        } catch {
          // Ignore malformed payload.
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [dispatch]);

  const isFavorite = useCallback(
    (tourId: number) => tourIds.includes(tourId),
    [tourIds],
  );

  const clearError = useCallback(() => {
    dispatch(favoritesErrorSet(null));
  }, [dispatch]);

  const toggleFavorite = useCallback(
    async (tourId: number) => {
      const wasFavorite = tourIds.includes(tourId);
      // The actual save; never rolled back on sync failure below.
      dispatch(wasFavorite ? favoriteRemoved(tourId) : favoriteAdded(tourId));

      try {
        let key = listKey;
        if (!key) {
          const result = await createFavoritesList(i18n.language).unwrap();
          key = result.key;
          dispatch(listKeyCreated(key));
        }

        if (wasFavorite) {
          await removeFavoriteTour({ key, tourId }).unwrap();
        } else {
          await addFavoriteTour({ key, tourId }).unwrap();
        }
      } catch {
        dispatch(favoritesErrorSet(t("favorites.error")));
      }
    },
    [
      tourIds,
      listKey,
      createFavoritesList,
      addFavoriteTour,
      removeFavoriteTour,
      dispatch,
      i18n.language,
      t,
    ],
  );

  return { isFavorite, toggleFavorite, error, clearError };
}
