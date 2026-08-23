import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import debounce from "lodash.debounce";
import { RootState } from "..";
import {
  useGetCitiesQuery,
  useGetTotalsQuery,
  useLazyGetToursQuery,
} from "../features/apiSlice";
import { Tour } from "../models/Tour";
import { cityUpdated } from "../features/searchSlice";
import { useAppDispatch } from "../hooks";
import { useFavorites } from "./useFavorites";
import {
  DirectLink,
  extractCityFromLocation,
  getTranslatedCountryName,
  usePageHeader,
} from "../utils/seoPageHelper";

/**
 * Shared hook that encapsulates all search/tour-loading logic
 * used by both StartNew (/) and SearchResults (/search).
 */
export function useSearchTours() {
  const { t } = useTranslation();
  const filter = useSelector((state: RootState) => state.filter);
  const search = useSelector((state: RootState) => state.search);
  const showMap = useSelector((state: RootState) => state.search.map);
  const city = useSelector((state: RootState) => state.search.city);
  const citySlug = useSelector((state: RootState) => state.search.citySlug);
  const dispatch = useAppDispatch();
  const {
    favoritesOnly,
    tourIds: favoriteTourIds,
    listNotFound: favoritesListNotFound,
    resetFavorites,
  } = useFavorites();

  const [tours, setTours] = useState<Tour[]>([]);
  const [triggerLoadTours, { data: loadedTours, isFetching: isToursLoading }] =
    useLazyGetToursQuery();
  const [triggerMoreTours] = useLazyGetToursQuery();
  const [filterOn, setFilterOn] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageTours, setPageTours] = useState(1);
  const [directLink, setDirectLink] = useState<DirectLink | null>(null);

  const { data: totals, isFetching: isTotalsLoading } = useGetTotalsQuery(
    citySlug || undefined,
  );
  const { data: allCities = [] } = useGetCitiesQuery();

  // SEO page header
  usePageHeader({
    header: `Zuugle ${city?.label || t(getTranslatedCountryName())}`,
    description: t("main.oeffi_bergtouren_fuer_cityname", {
      "city.label": search.city?.label || t(getTranslatedCountryName()),
    }),
  });

  // Matomo tracking
  useEffect(() => {
    // @ts-expect-error matomo
    const _mtm = (window._mtm = window._mtm || []);
    _mtm.push({ pagetitel: "Suche" });
  }, []);

  // Debounced tour loading
  const debouncedTrigger = useMemo(
    () =>
      debounce((params) => {
        triggerLoadTours(params);
      }, 1000),
    [triggerLoadTours],
  );

  // favoriteTourIds/favoritesListNotFound should only drive a reload while the
  // toggle is on — gated to stay referentially stable while it's off, so
  // favoriting an unrelated tour doesn't reset scroll/pagination for no reason.
  const favoritesReloadTourIds = favoritesOnly ? favoriteTourIds : null;
  const favoritesReloadNotFound = favoritesOnly && favoritesListNotFound;

  // Which empty state to show in place of the tour grid, if any.
  let favoritesEmptyVariant: "empty" | "not_found" | "no_matches" | null = null;
  if (favoritesOnly) {
    if (favoritesListNotFound) {
      favoritesEmptyVariant = "not_found";
    } else if (favoriteTourIds.length === 0) {
      favoritesEmptyVariant = "empty";
    } else if (!isToursLoading && tours.length === 0) {
      favoritesEmptyVariant = "no_matches";
    }
  }

  // Nothing to fetch: no favorites saved, or the saved list is gone server-side
  // — the same two cases that produce the "empty"/"not_found" empty states.
  const favoritesNothingToFetch =
    favoritesEmptyVariant === "empty" || favoritesEmptyVariant === "not_found";

  // Favorites-only injects the saved ids as just another filter dimension.
  const effectiveFilter = useMemo(
    () => (favoritesOnly ? { ...filter, favoriteTourIds } : filter),
    [favoritesOnly, filter, favoriteTourIds],
  );

  // Load tours when filter/search changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setPageTours(1);
    setHasMore(true);

    if (favoritesNothingToFetch) {
      setTours([]);
      return;
    }

    const params = {
      city:
        search.citySlug && search.citySlug !== "no-city" ? search.citySlug : "",
      filter: effectiveFilter,
      search: search.searchWithType?.term || null,
      search_type: search.searchWithType?.type || null,
      bounds: search.bounds || undefined,
      map: showMap || undefined,
      currLanguage: search.language || undefined,
      geolocation: search.geolocation || undefined,
    };
    debouncedTrigger(params);
    return () => {
      debouncedTrigger.cancel();
    };
  }, [
    filter,
    search,
    favoritesOnly,
    favoritesReloadTourIds,
    favoritesReloadNotFound,
  ]);

  // Update tours from loaded data. Skipped while there's nothing to fetch, so a
  // stale non-favorites response resolving after the user switched to an empty
  // favorites-only view can't overwrite the empty state with old results.
  useEffect(() => {
    if (favoritesNothingToFetch) {
      return;
    }
    setTours(loadedTours?.tours || []);
  }, [loadedTours, favoritesNothingToFetch]);

  // Load more tours (pagination)
  useEffect(() => {
    if (pageTours > 1) {
      const moreTours = triggerMoreTours({
        city:
          search.citySlug && search.citySlug !== "no-city"
            ? search.citySlug
            : "",
        filter: effectiveFilter,
        search: search.searchWithType?.term || "",
        search_type: search.searchWithType?.type || "",
        bounds: search.bounds || undefined,
        map: showMap || undefined,
        page: pageTours,
        currLanguage: search.language || undefined,
        geolocation: search.geolocation || undefined,
      }).unwrap();
      moreTours.then((data) => {
        if (!data.tours || data.tours.length === 0) {
          setHasMore(false);
          return;
        }
        setTours([...tours, ...data.tours]);
      });
    }
  }, [pageTours]);

  // Extract city from URL (direct links like /linz)
  useEffect(() => {
    if (!allCities) return;
    const cityFromUrl = extractCityFromLocation(location, allCities);
    if (cityFromUrl) {
      dispatch(cityUpdated(cityFromUrl));
      setDirectLink({
        header: t(`main.oeffi_bergtouren_fuer_cityname`, {
          "city.label": cityFromUrl.label,
        }),
        description: t(`main.alle_bergtouren_von_cityname`, {
          "city.label": cityFromUrl.label,
        }),
      });
    } else {
      setDirectLink(null);
    }
  }, [allCities]);

  // Hero title text (e.g. "652 Bergtouren von Linz …")
  const getHeroTitle = () => {
    if (!totals) return "";
    if (city) {
      return `${totals.tours_city.toLocaleString()} ${t("start.tourenanzahl_untertitel_city", { capCity: city.label })}`;
    }
    return `${totals.tours_country.toLocaleString()} ${t("start.tourenanzahl_untertitel")}`;
  };

  const fetchMore = () => setPageTours(pageTours + 1);

  return {
    tours,
    loadedTours,
    isToursLoading,
    hasMore,
    fetchMore,
    filterOn,
    setFilterOn,
    allCities,
    directLink,
    getHeroTitle,
    totals,
    isTotalsLoading,
    favoritesOnly,
    favoritesEmptyVariant,
    resetFavorites,
    showMap,
    city,
    citySlug,
  };
}
