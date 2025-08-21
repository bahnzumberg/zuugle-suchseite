import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { RootState } from "..";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks";
import {
  boundsUpdated,
  citySlugUpdated,
  cityUpdated,
  languageUpdated,
  mapUpdated,
  searchPhraseUpdated,
} from "../features/searchSlice";
import { useGetCitiesQuery } from "../features/apiSlice";
import L from "leaflet";
import { toBoundsObject } from "../utils/map_utils";

export default function SearchParamSync() {
  const search = useSelector((state: RootState) => state.search);
  const [params, setParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { data: allCities = [] } = useGetCitiesQuery({});

  // Redux → URL
  useEffect(() => {
    if (search.searchPhrase) {
      params.set("search", search.searchPhrase);
    } else {
      params.delete("search");
    }
    if (search.citySlug) {
      params.set("city", search.citySlug);
    } else {
      params.delete("city");
    }
    if (search.map) {
      params.set("map", String(search.map));
    } else {
      params.delete("map");
    }
    if (search.language) {
      params.set("currLanguage", search.language);
    } else {
      params.delete("currLanguage");
    }
    if (search.bounds) {
      params.set("bounds", JSON.stringify(search.bounds));
    } else {
      params.delete("bounds");
    }
    setParams(params, { replace: true });
  }, [search, params]);

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

  // URL → Redux
  useEffect(() => {
    const search = params.get("search");
    dispatch(searchPhraseUpdated(search ?? null));

    const cityValue = params.get("city");
    dispatch(citySlugUpdated(cityValue ?? null));

    const map = params.get("map");
    if (map) {
      dispatch(mapUpdated(Boolean(map)));
    } else {
      dispatch(mapUpdated(false));
    }

    const currLanguage = params.get("currLanguage");
    dispatch(languageUpdated(currLanguage ?? null));

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
