import { useCallback, useEffect } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  errorStatus,
  useCreateFavoritesListMutation,
  useGetFavoritesListQuery,
  useAddFavoriteTourMutation,
  useRemoveFavoriteTourMutation,
} from "../features/apiSlice";
import {
  listKeySet,
  favoritesReceived,
  favoriteAdded,
  favoriteRemoved,
  favoritesOnlyToggled,
  noticeShown,
} from "../features/favoritesSlice";
import {
  FAVORITES_LIST_KEY_STORAGE,
  FAVORITE_TOUR_IDS_STORAGE,
  parseFavoriteTourIds,
} from "../utils/favoritesStorage";

/**
 * Shared favorites state backed by the anonymous /api/lists API. The server
 * holds the source of truth so that paired devices see one list; localStorage
 * keeps a copy only so the hearts are right on first paint. A write that does
 * not reach the server is rolled back rather than queued.
 *
 * A key absorbed by another list is adopted centrally, by the matcher in
 * favoritesSlice — nothing here has to notice `moved_to`.
 */

// Every FavoriteButton on the page mounts this hook, so a guard stored in the
// hook would not stop two of them creating a list at the same time. These are
// per-document, which is the scope the list key itself has.
let pendingListCreation: Promise<string> | null = null;
let recreatedForKey: string | null = null;

export function useFavorites() {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const listKey = useAppSelector((state) => state.favorites.listKey);
  const tourIds = useAppSelector((state) => state.favorites.tourIds);
  const favoritesOnly = useAppSelector(
    (state) => state.favorites.favoritesOnly,
  );

  const { data: listData, error: listQueryError } = useGetFavoritesListQuery(
    listKey ?? skipToken,
    // Refocusing is how a paired device picks up what the other one changed.
    { refetchOnFocus: true },
  );
  const [createFavoritesList] = useCreateFavoritesListMutation();
  const [addFavoriteTour] = useAddFavoriteTourMutation();
  const [removeFavoriteTour] = useRemoveFavoriteTourMutation();

  const ensureListKey = useCallback(async (): Promise<string> => {
    if (listKey) return listKey;
    pendingListCreation ??= createFavoritesList(i18n.language)
      .unwrap()
      .then((result) => result.key)
      .finally(() => {
        pendingListCreation = null;
      });
    const key = await pendingListCreation;
    dispatch(listKeySet(key));
    return key;
  }, [listKey, createFavoritesList, dispatch, i18n.language]);

  useEffect(() => {
    // The key was merged away; the slice has already adopted the survivor, so
    // wait for the refetch under it rather than trusting the redirect's tours.
    if (!listData || listData.moved_to) return;
    // A favorited tour that has dropped out of city2tour_flat (inactive, or no
    // connections left) is absent here and therefore disappears from the
    // device too. It stays in the list server-side and returns when the tour
    // does.
    dispatch(favoritesReceived(listData.tours.map((tour) => tour.id)));
  }, [listData, dispatch]);

  const listNotFound = listKey !== null && errorStatus(listQueryError) === 404;

  // The list this device points at is gone for good — a broken merge chain, or
  // a row removed server-side. Rebuild it from the cached ids so the user keeps
  // their favorites, and say so, because this device is no longer paired with
  // any other.
  useEffect(() => {
    if (!listNotFound || !listKey) return;
    if (recreatedForKey === listKey) return;
    recreatedForKey = listKey;

    void (async () => {
      try {
        const { key } = await createFavoritesList(i18n.language).unwrap();
        dispatch(listKeySet(key));
        // Oldest first and one at a time, so added_at reproduces the order the
        // list was shown in (the server sorts by it, newest first).
        for (const tourId of [...tourIds].reverse()) {
          await addFavoriteTour({ key, tourId }).unwrap();
        }
        dispatch(noticeShown({ key: "recreated" }));
      } catch {
        dispatch(noticeShown({ key: "recreate_failed" }));
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

  // Cross-tab sync via the native storage event.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === FAVORITES_LIST_KEY_STORAGE) {
        dispatch(listKeySet(event.newValue));
      } else if (event.key === FAVORITE_TOUR_IDS_STORAGE) {
        dispatch(favoritesReceived(parseFavoriteTourIds(event.newValue)));
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
      dispatch(wasFavorite ? favoriteRemoved(tourId) : favoriteAdded(tourId));

      try {
        const key = await ensureListKey();
        if (wasFavorite) {
          await removeFavoriteTour({ key, tourId }).unwrap();
        } else {
          await addFavoriteTour({ key, tourId }).unwrap();
        }
      } catch (error) {
        // Removing a tour the server does not have is the state the user asked
        // for — another device got there first. Nothing to roll back.
        if (wasFavorite && errorStatus(error) === 404) return;
        dispatch(wasFavorite ? favoriteAdded(tourId) : favoriteRemoved(tourId));
        dispatch(noticeShown({ key: "save_failed" }));
      }
    },
    [tourIds, ensureListKey, addFavoriteTour, removeFavoriteTour, dispatch],
  );

  const toggleFavoritesOnly = useCallback(() => {
    dispatch(favoritesOnlyToggled());
  }, [dispatch]);

  return {
    isFavorite,
    toggleFavorite,
    tourIds,
    favoritesOnly,
    toggleFavoritesOnly,
    listKey,
    ensureListKey,
  };
}
