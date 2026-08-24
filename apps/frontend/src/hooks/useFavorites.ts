import { useCallback, useEffect, useRef } from "react";
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
  favoritesSyncSuccess,
  favoritesSyncFailed,
  favoritesOnlyToggled,
} from "../features/favoritesSlice";

/**
 * Shared favorites state backed by the anonymous /api/lists API. Local state
 * is authoritative; the server is a best-effort mirror, not a gate.
 */
export function useFavorites() {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const listKey = useAppSelector((state) => state.favorites.listKey);
  const tourIds = useAppSelector((state) => state.favorites.tourIds);
  const hydrated = useAppSelector((state) => state.favorites.hydrated);
  const lastSyncedAt = useAppSelector((state) => state.favorites.lastSyncedAt);
  const isSynced = useAppSelector((state) => state.favorites.isSynced);
  const favoritesOnly = useAppSelector(
    (state) => state.favorites.favoritesOnly,
  );

  const { data: listData, error: listQueryError } = useGetFavoritesListQuery(
    listKey ?? skipToken,
    {
      // Seeds tourIds once for a device that has no local cache yet.
      refetchOnFocus: true,
    },
  );
  const [createFavoritesList] = useCreateFavoritesListMutation();
  const [addFavoriteTour] = useAddFavoriteTourMutation();
  const [removeFavoriteTour] = useRemoveFavoriteTourMutation();

  // The list this device points to was deleted server-side (e.g. cleanup).
  // Local tourIds stay authoritative regardless — see module doc above.
  const listNotFound = Boolean(
    listKey &&
    listQueryError &&
    "status" in listQueryError &&
    listQueryError.status === 404,
  );

  // Self-heal a deleted server list: recreate it from the local (authoritative)
  // favorites and adopt the new key, so the server mirror is restored without
  // the user losing anything. Attempted once per broken key.
  const healedKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (!listNotFound || tourIds.length === 0) return;
    if (healedKeyRef.current === listKey) return;
    healedKeyRef.current = listKey;

    (async () => {
      try {
        const { key } = await createFavoritesList(i18n.language).unwrap();
        dispatch(listKeyCreated(key));
        await Promise.all(
          tourIds.map((tourId) => addFavoriteTour({ key, tourId }).unwrap()),
        );
        dispatch(favoritesSyncSuccess(new Date().toISOString()));
      } catch {
        // Best-effort; local stays authoritative and we retry on the next load.
        dispatch(favoritesSyncFailed());
      }
    })();
  }, [
    listNotFound,
    listKey,
    tourIds,
    createFavoritesList,
    addFavoriteTour,
    dispatch,
    i18n.language,
  ]);

  useEffect(() => {
    if (listData && !hydrated) {
      // GET /api/lists/:key can return one row per originating city for the
      // same tour — dedupe before this becomes the device's source of truth.
      const uniqueTourIds = Array.from(
        new Set(listData.tours.map((tour) => tour.id)),
      );
      dispatch(favoritesHydrated(uniqueTourIds));
      dispatch(favoritesSyncSuccess(new Date().toISOString()));
    } else if (listData && hydrated) {
      // Server returned successfully. Check if in sync.
      const serverIds = new Set(listData.tours.map((t) => t.id));
      const hasUnsynced =
        tourIds.length !== serverIds.size ||
        tourIds.some((id) => !serverIds.has(id));
      if (!hasUnsynced) {
        dispatch(favoritesSyncSuccess(new Date().toISOString()));
      }
    }
  }, [listData, hydrated, tourIds, dispatch]);

  // Cross-tab sync via the native storage event.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === "favoritesListKey" && event.newValue) {
        dispatch(listKeyCreated(event.newValue));
        return;
      }
      if (event.key === "favoritesLastSyncedAt" && event.newValue) {
        dispatch(favoritesSyncSuccess(event.newValue));
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
        dispatch(favoritesSyncSuccess(new Date().toISOString()));
      } catch {
        // Sync to server failed — recorded in state without showing a popup alert
        dispatch(favoritesSyncFailed());
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
    ],
  );

  const toggleFavoritesOnly = useCallback(() => {
    dispatch(favoritesOnlyToggled());
  }, [dispatch]);

  const isOnlyLocal =
    tourIds.length > 0 && (!listKey || !isSynced || listNotFound);

  return {
    isFavorite,
    toggleFavorite,
    tourIds,
    favoritesOnly,
    toggleFavoritesOnly,
    lastSyncedAt,
    isSynced,
    isOnlyLocal,
  };
}
