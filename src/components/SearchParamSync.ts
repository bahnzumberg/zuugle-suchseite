import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { RootState } from "..";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks";
import {
  citySlugUpdated,
  cityUpdated,
  mapUpdated,
  geolocationUpdated,
  providerUpdated,
  searchWithTypeUpdated,
} from "../features/searchSlice";
import {
  isValidSearchType,
  SearchWithType,
  useGetCitiesQuery,
} from "../features/apiSlice";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { filterUpdated } from "../features/filterSlice";
import { FilterObject } from "../models/Filter";
import { getDefaultFilterValues } from "./Filter/utils";

const SCALAR_FILTER_KEYS = [
  "singleDayTour",
  "multipleDayTour",
  "summerSeason",
  "winterSeason",
  "traverse",
  "minAscent",
  "maxAscent",
  "minDescent",
  "maxDescent",
  "minTransportDuration",
  "maxTransportDuration",
  "minDistance",
  "maxDistance",
] as const;

const ARRAY_FILTER_KEYS = [
  "ranges",
  "types",
  "languages",
  "difficulties",
  "providers",
  "countries",
] as const;

/**
 * Keeps query parameters in sync with the Redux store.
 * On SearchResults page, more query parameters are allowed
 * than on other pages.
 */
export default function SearchParamSync({
  isSearchResultsPage,
}: {
  isSearchResultsPage: boolean;
}) {
  const search = useSelector((state: RootState) => state.search);
  const filter = useSelector((state: RootState) => state.filter);
  const [params, setParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { data: allCities = [] } = useGetCitiesQuery();

  // special treatment for city
  useEffect(() => {
    if (
      allCities &&
      search.citySlug &&
      search.citySlug !== search.city?.value
    ) {
      const city = allCities.find((c) => c.value === search.citySlug);
      dispatch(cityUpdated(city ?? null));
    }
  }, [allCities, search.citySlug]);

  useEffect(() => {
    if (search.city?.value) {
      dispatch(citySlugUpdated(search.city.value));
    } else {
      dispatch(citySlugUpdated(null));
    }
  }, [search.city]);

  // Redux → URL
  function updateParam(
    newParams: URLSearchParams,
    paramName: string,
    value: string | null | undefined,
  ) {
    if (value) {
      newParams.set(paramName, value);
    } else {
      newParams.delete(paramName);
    }
  }

  useEffect(() => {
    const newParams = new URLSearchParams();
    // use Redux value when available, fall back to URL during initialisation (when language is null)
    updateParam(newParams, "lang", search.language ?? params.get("lang"));
    updateParam(newParams, "city", search.citySlug);
    updateParam(newParams, "p", search.provider);
    updateParam(
      newParams,
      "map",
      isSearchResultsPage && search.map ? "true" : null,
    );
    updateParam(
      newParams,
      "search",
      isSearchResultsPage ? search.searchWithType?.term : null,
    );
    updateParam(
      newParams,
      "search_type",
      isSearchResultsPage ? search.searchWithType?.type : null,
    );
    if (isSearchResultsPage && search.geolocation) {
      updateParam(newParams, "lat", String(search.geolocation.lat));
      updateParam(newParams, "lng", String(search.geolocation.lng));
      updateParam(
        newParams,
        "radius",
        String(search.geolocation.radius ?? 100),
      );
    } else {
      updateParam(newParams, "lat", null);
      updateParam(newParams, "lng", null);
      updateParam(newParams, "radius", null);
    }

    if (isSearchResultsPage) {
      const defaults = getDefaultFilterValues();
      for (const key of SCALAR_FILTER_KEYS) {
        const val = filter[key];
        if (val !== undefined && val !== defaults[key]) {
          newParams.set(key, String(val));
        }
      }
      for (const key of ARRAY_FILTER_KEYS) {
        const arr = filter[key];
        if (arr?.length) {
          newParams.set(key, arr.map(String).join("|"));
        }
      }
    }
    setParams(newParams, { replace: true });
  }, [search, filter]);

  // URL → Redux
  function updateReduxFromParam(
    paramName: string,
    actionCreator: ActionCreatorWithPayload<string | null>,
  ) {
    const value = params.get(paramName);
    dispatch(actionCreator(value ?? null));
  }

  /** Read city from localStorage and dispatch to Redux if it differs. */
  function syncCityFromLocalStorage() {
    const stored = localStorage.getItem("city");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.value && parsed.value !== search.citySlug) {
        dispatch(cityUpdated(parsed));
        dispatch(citySlugUpdated(parsed.value));
      }
    } catch {
      /* ignore corrupt data */
    }
  }

  useEffect(() => {
    if (params.get("city")) {
      // URL ?city= takes precedence
      updateReduxFromParam("city", citySlugUpdated);
    } else {
      // No ?city= in URL — use localStorage as fallback
      syncCityFromLocalStorage();
    }
    updateReduxFromParam("p", providerUpdated);
    if (!isSearchResultsPage) {
      dispatch(searchWithTypeUpdated(null));
    } else {
      const searchPhrase = params.get("search");
      const rawSearchType = params.get("search_type");
      const searchWithType: SearchWithType | null = searchPhrase
        ? {
            term: searchPhrase,
            type: isValidSearchType(rawSearchType) ? rawSearchType : "term",
          }
        : null;
      dispatch(searchWithTypeUpdated(searchWithType));

      const map = params.get("map");
      if (map) {
        dispatch(mapUpdated(Boolean(map)));
      } else {
        dispatch(mapUpdated(false));
      }

      const lat = params.get("lat");
      const lng = params.get("lng");
      const radius = params.get("radius");
      if (lat && lng) {
        dispatch(
          geolocationUpdated({
            lat: Number(lat),
            lng: Number(lng),
            radius: radius ? Number(radius) : 100,
          }),
        );
      } else {
        dispatch(geolocationUpdated(null));
      }

      const filterObject: FilterObject = {};
      for (const key of SCALAR_FILTER_KEYS) {
        const value = params.get(key);
        if (value === "true") (filterObject[key] as boolean) = true;
        else if (value === "false") (filterObject[key] as boolean) = false;
        else if (value !== null && !isNaN(Number(value)))
          (filterObject[key] as number) = Number(value);
      }
      for (const key of ARRAY_FILTER_KEYS) {
        const raw = params.get(key);
        if (raw) {
          const values = raw.split("|").filter(Boolean);
          if (values.length) {
            (filterObject[key] as string[] | number[]) =
              key === "difficulties" ? values.map(Number) : values;
          }
        }
      }
      // ?range=slug from range-card navigation
      const range = params.get("range");
      if (range && !filterObject.ranges?.length) {
        filterObject.ranges = [range];
      }
      dispatch(filterUpdated(filterObject));
    }
  }, []);

  // Sync city from localStorage when tab becomes visible again.
  // Covers cross-tab updates, e.g. city set on tour detail page in another tab.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      if (params.get("city")) return; // URL param takes precedence
      syncCityFromLocalStorage();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [search.citySlug, params, dispatch]);

  return null; // invisible sync component
}
