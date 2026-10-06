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
import { cityUpdated, citySlugUpdated } from "../features/searchSlice";
import { useGetCitiesQuery } from "../features/apiSlice";
import { filterUpdated } from "../features/filterSlice";
import { useEmbed } from "../utils/embedContext";
import type { RootState } from "..";

export default function EmbedSearchParamSync() {
  const dispatch = useAppDispatch();
  const { fixedProviders } = useEmbed();
  const citySlug = useSelector((state: RootState) => state.search.citySlug);
  const city = useSelector((state: RootState) => state.search.city);
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

  return null; // invisible sync component
}
