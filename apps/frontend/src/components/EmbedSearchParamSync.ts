/**
 * Embed-specific parameter sync.
 *
 * Unlike the main SearchParamSync (which reads/writes browser query params),
 * the embed widget doesn't own the URL. This component ensures:
 *
 * 1. The fixed provider is always present in the filter.
 * 2. City slug from data-city is resolved to a CityObject once cities load.
 * 3. Language is kept in sync.
 *
 * It runs once on mount and whenever the cities list becomes available.
 */

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks";
import {
  citySlugUpdated,
  cityUpdated,
  mapUpdated,
  searchWithTypeUpdated,
} from "../features/searchSlice";
import {
  isValidSearchType,
  useGetCitiesQuery,
  type SearchType,
} from "../features/apiSlice";
import { filterUpdated } from "../features/filterSlice";
import { useEmbed } from "../utils/embedContext";
import type { RootState } from "..";

export default function EmbedSearchParamSync() {
  const dispatch = useAppDispatch();
  const { fixedProviders, syncUrl } = useEmbed();
  const search = useSelector((state: RootState) => state.search);
  const citySlug = search.citySlug;
  const city = search.city;
  const filter = useSelector((state: RootState) => state.filter);
  const { data: allCities = [] } = useGetCitiesQuery();

  // Resolve city slug → CityObject once cities are loaded
  useEffect(() => {
    if (allCities.length > 0 && citySlug && !city) {
      const resolved = allCities.find((c) => c.value === citySlug);
      if (resolved) {
        dispatch(cityUpdated(resolved));
      }
    }
  }, [allCities, citySlug, city, dispatch]);

  // Keep fixed providers in sync — if someone resets the filter,
  // the provider must be re-injected.
  useEffect(() => {
    if (fixedProviders.length > 0) {
      const currentProviders = filter.providers ?? [];
      const missing = fixedProviders.some((p) => !currentProviders.includes(p));
      if (missing) {
        dispatch(
          filterUpdated({
            ...filter,
            providers: fixedProviders,
          }),
        );
      }
    }
  }, [filter, fixedProviders, dispatch]);

  // Sync search state to host URL if syncUrl is enabled
  useEffect(() => {
    if (!syncUrl || typeof window === "undefined") return;

    const currentUrl = new URL(window.location.href);
    const params = currentUrl.searchParams;

    const setOrDelete = (key: string, val: string | null | undefined) => {
      if (val) {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    };

    setOrDelete("city", search.citySlug);
    setOrDelete("search", search.searchWithType?.term);
    setOrDelete("search_type", search.searchWithType?.type);
    setOrDelete("map", search.map ? "true" : null);

    const newSearch = params.toString();
    const newRelativePathQuery =
      currentUrl.pathname +
      (newSearch ? `?${newSearch}` : "") +
      currentUrl.hash;

    const currentRelative =
      window.location.pathname + window.location.search + window.location.hash;

    if (newRelativePathQuery !== currentRelative) {
      window.history.replaceState(
        window.history.state,
        "",
        newRelativePathQuery,
      );
    }
  }, [syncUrl, search.citySlug, search.searchWithType, search.map]);

  // Handle browser Back/Forward (popstate) when syncUrl is enabled
  useEffect(() => {
    if (!syncUrl || typeof window === "undefined") return;

    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const urlCity = params.get("city");
      if (urlCity !== search.citySlug) {
        dispatch(citySlugUpdated(urlCity));
      }
      const urlSearch = params.get("search");
      const urlSearchType = params.get("search_type") as SearchType | null;
      if (urlSearch) {
        dispatch(
          searchWithTypeUpdated({
            term: urlSearch,
            type: isValidSearchType(urlSearchType) ? urlSearchType : "term",
          }),
        );
      } else if (search.searchWithType) {
        dispatch(searchWithTypeUpdated(null));
      }
      const urlMap = params.get("map") === "true";
      if (urlMap !== search.map) {
        dispatch(mapUpdated(urlMap));
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [syncUrl, search.citySlug, search.searchWithType, search.map, dispatch]);

  return null; // invisible sync component
}
