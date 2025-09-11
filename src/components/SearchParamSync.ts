import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { RootState } from "..";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks";
import {
  boundsUpdated,
  citySlugUpdated,
  cityUpdated,
  countryUpdated,
  languageUpdated,
  mapUpdated,
  providerUpdated,
  rangeUpdated,
  searchPhraseUpdated,
  typeUpdated,
} from "../features/searchSlice";
import { useGetCitiesQuery } from "../features/apiSlice";
import L from "leaflet";
import { toBoundsObject } from "../utils/map_utils";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { filterUpdated } from "../features/filterSlice";

/**
 * Keeps query parameters in sync with the Redux store.
 * On Main page (the main page displaying the search result), more query parameters are allowed
 * than on other pages.
 */
export default function SearchParamSync({ isMain }: { isMain: boolean }) {
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
    }
  }, [search.city]);

  // Redux → URL
  function updateParam(
    newParams: URLSearchParams,
    paramName: string,
    value: string | null,
  ) {
    if (value) {
      newParams.set(paramName, value);
    } else {
      newParams.delete(paramName);
    }
  }

  useEffect(() => {
    const newParams = new URLSearchParams(params);
    updateParam(newParams, "city", search.citySlug);
    updateParam(newParams, "p", search.provider);
    updateParam(newParams, "range", isMain ? search.range : null);
    updateParam(newParams, "country", isMain ? search.country : null);
    updateParam(newParams, "type", isMain ? search.type : null);
    updateParam(newParams, "map", isMain && search.map ? "true" : null);
    updateParam(newParams, "search", isMain ? search.searchPhrase : null);
    updateParam(newParams, "currLanguage", isMain ? search.language : null);
    updateParam(
      newParams,
      "bounds",
      isMain && search.bounds ? JSON.stringify(search.bounds) : null,
    );
    updateParam(
      newParams,
      "filter",
      isMain && Object.keys(filter).length > 0 ? JSON.stringify(filter) : null,
    );
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

  useEffect(() => {
    if (params.get("city")) updateReduxFromParam("city", citySlugUpdated);
    updateReduxFromParam("p", providerUpdated);
    if (isMain) {
      updateReduxFromParam("search", searchPhraseUpdated);
      updateReduxFromParam("range", rangeUpdated);
      updateReduxFromParam("country", countryUpdated);
      updateReduxFromParam("type", typeUpdated);
      updateReduxFromParam("currLanguage", languageUpdated);

      const map = params.get("map");
      if (map) {
        dispatch(mapUpdated(Boolean(map)));
      } else {
        dispatch(mapUpdated(false));
      }

      const bounds = params.get("bounds");
      if (bounds) {
        const parsedBounds = JSON.parse(bounds);
        if (parsedBounds instanceof L.LatLngBounds)
          dispatch(boundsUpdated(toBoundsObject(parsedBounds)));
      } else {
        dispatch(boundsUpdated(null));
      }

      const filter = params.get("filter");
      if (filter) {
        const parsedFilter = JSON.parse(filter);
        dispatch(filterUpdated(parsedFilter));
      } else {
        dispatch(filterUpdated({}));
      }
    }
  }, []);

  return null; // invisible sync component
}
