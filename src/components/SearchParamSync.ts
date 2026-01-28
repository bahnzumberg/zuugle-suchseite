import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { RootState } from "..";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks";
import {
  boundsUpdated,
  citySlugUpdated,
  cityUpdated,
  languageUpdated,
  mapUpdated,
  geolocationUpdated,
  providerUpdated,
  searchPhraseUpdated,
} from "../features/searchSlice";
import { useGetCitiesQuery } from "../features/apiSlice";
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
    const newParams = new URLSearchParams();
    updateParam(newParams, "city", search.citySlug);
    updateParam(newParams, "p", search.provider);
    updateParam(newParams, "map", isMain && search.map ? "true" : null);
    updateParam(newParams, "search", isMain ? search.searchPhrase : null);
    updateParam(newParams, "lang", isMain ? search.language : null);
    if (!search.geolocation) {
      updateParam(
        newParams,
        "bounds",
        isMain && search.bounds ? JSON.stringify(search.bounds) : null,
      );
    } else {
      updateParam(newParams, "bounds", null);
    }
    updateParam(
      newParams,
      "geolocation",
      isMain && search.geolocation ? JSON.stringify(search.geolocation) : null,
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
    updateReduxFromParam("lang", languageUpdated);
    if (isMain) {
      updateReduxFromParam("search", searchPhraseUpdated);

      const map = params.get("map");
      if (map) {
        dispatch(mapUpdated(Boolean(map)));
      } else {
        dispatch(mapUpdated(false));
      }

      // geolocation comes either as "geolocation" or as separate "lat", "lng" and "radius"
      const lat = params.get("lat");
      const lng = params.get("lng");
      const radius = params.get("radius");
      const geolocation = params.get("geolocation");
      if (geolocation || (lat && lng)) {
        const parsedLocation = geolocation
          ? JSON.parse(geolocation)
          : { lat: lat, lng: lng, radius: radius };
        if (!parsedLocation.radius) {
          parsedLocation.radius = 100;
        }
        dispatch(geolocationUpdated(parsedLocation));
      } else {
        dispatch(geolocationUpdated(null));
      }

      const bounds = params.get("bounds");
      if (!geolocation && bounds) {
        const parsedBounds = JSON.parse(bounds);
        dispatch(boundsUpdated(parsedBounds));
      } else {
        dispatch(boundsUpdated(null));
      }

      const filterParam = params.get("filter");
      let parsedFilter = {};
      if (filterParam) {
        parsedFilter = JSON.parse(filterParam);
        dispatch(filterUpdated(parsedFilter));
      } else {
        dispatch(filterUpdated({}));
      }

      // if range is set like this -> update range in filter
      const range = params.get("range");
      if (range) {
        dispatch(filterUpdated({ ...parsedFilter, ranges: [range] }));
      }
    }
  }, []);

  return null; // invisible sync component
}
