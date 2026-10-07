import { useCallback, useEffect } from "react";
import { useSearchParams, useParams } from "react-router";
import { RootState } from "..";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks";
import {
  citySlugUpdated,
  cityUpdated,
  mapUpdated,
  weatherUpdated,
  geolocationUpdated,
  externalLinksUpdated,
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
import {
  ARRAY_FILTER_KEYS,
  SCALAR_FILTER_KEYS,
  writeFilterParams,
} from "../utils/filterParams";

/**
 * Keeps query parameters in sync with the Redux store.
 * Used on both the start page (/) and SearchResults (/search),
 * which share the same search/filter capabilities.
 */
export default function SearchParamSync() {
  const search = useSelector((state: RootState) => state.search);
  const filter = useSelector((state: RootState) => state.filter);
  const [params, setParams] = useSearchParams();
  // On the /:city route (e.g. /wien) this is the city slug; undefined elsewhere.
  const { city: pathCitySlug } = useParams<{ city?: string }>();
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
  }, [allCities, search.citySlug, search.city?.value, dispatch]);

  useEffect(() => {
    if (search.city?.value) {
      dispatch(citySlugUpdated(search.city.value));
    } else {
      dispatch(citySlugUpdated(null));
    }
  }, [search.city, dispatch]);

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
    // On a /:city route the slug already lives in the path — don't duplicate it
    // into ?city= so the clean /wien URL is preserved.
    updateParam(newParams, "city", pathCitySlug ? null : search.citySlug);
    updateParam(
      newParams,
      "externalLinks",
      search.externalLinks ? "true" : null,
    );
    updateParam(newParams, "map", search.map ? "true" : null);
    updateParam(
      newParams,
      "weather",
      search.map && search.weather ? "true" : null,
    );
    updateParam(newParams, "search", search.searchWithType?.term);
    updateParam(newParams, "search_type", search.searchWithType?.type);
    if (search.geolocation) {
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

    writeFilterParams(newParams, filter);
    setParams(newParams, { replace: true });
    // setParams is stable (react-router); including it keeps the linter happy
  }, [search, filter, pathCitySlug, params, setParams]);

  // URL → Redux
  const updateReduxFromParam = useCallback(
    (
      paramName: string,
      actionCreator: ActionCreatorWithPayload<string | null>,
    ) => {
      const value = params.get(paramName);
      dispatch(actionCreator(value ?? null));
    },
    [params, dispatch],
  );

  /** Read city from localStorage and dispatch to Redux if it differs. */
  const syncCityFromLocalStorage = useCallback(() => {
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
  }, [search.citySlug, dispatch]);

  // The /:city path segment (e.g. /wien) is the authoritative city for that
  // page and overrides both the ?city= query param and localStorage.
  useEffect(() => {
    if (pathCitySlug) {
      dispatch(citySlugUpdated(pathCitySlug));
    }
  }, [pathCitySlug, dispatch]);

  useEffect(() => {
    // City precedence: /:city path > ?city= query > localStorage. The path
    // segment is owned by the effect above; here we resolve the fallback.
    if (!pathCitySlug) {
      if (params.get("city")) {
        updateReduxFromParam("city", citySlugUpdated);
      } else {
        syncCityFromLocalStorage();
      }
    }

    // Legacy ?p= embedded-provider param. It is folded into the providers filter
    // (single source of truth) below and dropped from the URL by the Redux → URL
    // sync above, so ?p=X is effectively rewritten to ?providers=X. The
    // bahn-zum-berg embed additionally enables external tour links.
    const legacyProvider = params.get("p");
    dispatch(
      externalLinksUpdated(
        legacyProvider === "bahnzumberg" ||
          (!legacyProvider && params.get("externalLinks") === "true"),
      ),
    );

    const searchPhrase = params.get("search");
    const rawSearchType = params.get("search_type");
    const searchWithType: SearchWithType | null = searchPhrase
      ? {
          term: searchPhrase,
          type: isValidSearchType(rawSearchType) ? rawSearchType : "term",
        }
      : null;
    dispatch(searchWithTypeUpdated(searchWithType));

    dispatch(mapUpdated(params.get("map") === "true"));
    dispatch(weatherUpdated(params.get("weather") === "true"));

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

    const filterObject: FilterObject = { ...filter };
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
    // Sync ?p= into filter.providers so chip + dialog checkbox reflect it
    if (legacyProvider) {
      filterObject.providers = filterObject.providers?.includes(legacyProvider)
        ? filterObject.providers
        : [...(filterObject.providers ?? []), legacyProvider];
    }
    dispatch(filterUpdated(filterObject));
    // This effect intentionally runs only on mount to bootstrap Redux from URL.
    // Listing all deps would cause an infinite loop (dispatch → state → params).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync city from localStorage when tab becomes visible again.
  // Covers cross-tab updates, e.g. city set on tour detail page in another tab.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      if (pathCitySlug || params.get("city")) return; // URL city takes precedence
      syncCityFromLocalStorage();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [search.citySlug, params, dispatch, pathCitySlug]);

  return null; // invisible sync component
}
