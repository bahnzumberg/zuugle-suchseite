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

export default function SearchParamSync() {
  const search = useSelector((state: RootState) => state.search);
  const [params, setParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { data: allCities = [] } = useGetCitiesQuery({});

  // special treatment for city, because it
  useEffect(() => {
    if (allCities && search.citySlug) {
      const city = allCities.find((c) => c.value === search.citySlug);
      dispatch(cityUpdated(city ?? null));
    }
  }, [allCities, search.citySlug]);

  useEffect(() => {
    if (search.city?.value && search.city.value !== search.citySlug) {
      dispatch(citySlugUpdated(search.city.value));
    }
  }, [search.city]);

  // Redux → URL
  function updateParam(paramName: string, value: string | null) {
    if (value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }
  }

  useEffect(() => {
    updateParam("map", search.map ? "true" : null);
    updateParam("city", search.citySlug);
    updateParam("search", search.searchPhrase);
    updateParam("currLanguage", search.language);
    updateParam("p", search.provider);
    updateParam("range", search.range);
    updateParam("country", search.country);
    updateParam("type", search.type);
    updateParam("bounds", search.bounds ? JSON.stringify(search.bounds) : null);
    setParams(params, { replace: true });
  }, [search, params]);

  // URL → Redux
  function updateReduxFromParam(
    paramName: string,
    actionCreator: ActionCreatorWithPayload<string | null>,
  ) {
    const value = params.get(paramName);
    console.log(value);
    dispatch(actionCreator(value ?? null));
  }

  useEffect(() => {
    updateReduxFromParam("search", searchPhraseUpdated);
    updateReduxFromParam("city", citySlugUpdated);
    updateReduxFromParam("p", providerUpdated);
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
  }, [params, allCities]);

  return null; // invisible sync component
}
