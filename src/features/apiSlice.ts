import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { BoundsObject, CityObject, LocationWithRadius } from "./searchSlice";
import { Tour } from "../models/Tour";
import { FilterObject, Provider } from "../models/Filter";
import { Marker } from "../models/mapTypes";
import { parseGPX } from "../utils/gpx_utils";
import { ConnectionResult } from "../models/Connections";

export interface CitiesResponse {
  success: boolean;
  cities: CityObject[];
}

export interface CityResponse {
  success: boolean;
  city: CityObject;
}
export interface Cities2TourCity {
  city_slug: string;
  city_name: string;
  reachable: number;
}

export interface Cities2TourResponse {
  success: boolean;
  cities: Cities2TourCity[];
}

export interface TotalResponse {
  success: boolean;
  total_tours: number;
  tours_city: number;
  tours_country: number;
  total_connections: number;
  total_ranges: number;
  total_cities: number;
  total_provider: number;
}

export interface RangeObject {
  range_slug: string;
  range: string;
  image_url: string;
  attract: string;
}

export interface TourParams {
  id: string;
  city?: string;
}

export interface TourResponse {
  success: boolean;
  tour: Tour;
}

export interface ToursResponse {
  success: boolean;
  tours: Tour[];
  total: number;
  page: number;
  ranges: RangeObject[];
  markers: Marker[];
  pois: PoiResult[];
}

export interface ToursParams {
  limit?: number;
  city: string;
  ranges?: boolean;
  provider?: string;
  filter?: FilterObject;
  search?: string;
  search_type?: string;
  page?: number;
  bounds?: BoundsObject;
  map?: boolean;
  range?: string;
  type?: string;
  currLanguage?: string;
  geolocation?: LocationWithRadius;
}

export interface SearchParams {
  search: string;
  city: string;
  language: string;
  tld: string;
}

export type SearchType = "hut" | "peak" | "range" | "term" | "city";

export function isValidSearchType(type: string | null): type is SearchType {
  return (
    type === "city" || type === "hut" || type === "peak" || type === "range"
  );
}

export interface PoiResult {
  lat: number;
  lon: number;
  name: string;
  type: SearchType;
}

export interface SearchWithType {
  term: string;
  type: SearchType;
}

interface AutocompleteSuggestionsResponse {
  success: boolean;
  items: SearchWithType[];
}

export interface Suggestion {
  suggestion: string;
}
export interface SuggestionsResponse {
  success: boolean;
  items: Suggestion[];
}

export interface FilterParams {
  search?: string;
  search_type?: string;
  city?: string;
  filter?: FilterObject;
}

export interface FilterResponse {
  success: boolean;
  filter: FilterObject;
  providers: Provider[];
}

export interface FilterWithProviders {
  filter: FilterObject;
  providers: Provider[];
}

export interface ConnectionParams {
  id: string;
  city: string;
}

export interface ConnectionResponse {
  success: boolean;
  result: ConnectionResult[];
}

export interface CombinedGPXParams {
  id: number;
  key_anreise: number;
  key_abreise: number;
}

const baseURL =
  window.location.host.indexOf("localhost") >= 0
    ? process.env.REACT_APP_API_URL
    : `${window.location.protocol}//${window.location.host}/api`;

const domain = window.location.hostname;

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
  }),
  endpoints: (build) => ({
    getCities: build.query<CityObject[], void>({
      query: () => {
        return `cities/?domain=${domain}`;
      },
      transformResponse: (response: CitiesResponse) => {
        return response.cities;
      },
    }),
    getTotals: build.query<TotalResponse, string | undefined>({
      query: (city) => {
        const cityParam = city && city !== "no-city" ? `city=${city}&` : "";
        return `tours/total?${cityParam}domain=${domain}`;
      },
    }),
    getTour: build.query<Tour, TourParams>({
      query: (params) => {
        return (
          `tours/${params.id}/${params.city ?? "no-city"}` + `?domain=${domain}`
        );
      },
      transformResponse: (response: TourResponse) => {
        return response.tour;
      },
    }),
    getTours: build.query<ToursResponse, ToursParams>({
      query: (params) => {
        const { bounds, geolocation, filter, ...rest } = params;
        const body: Record<string, unknown> = {};
        if (filter) {
          body.filter = filter;
        }
        if (geolocation) {
          body.geolocation = geolocation;
        } else if (bounds) {
          body.bounds = bounds;
        }
        const augmentedParams = { ...rest, domain: domain };
        return {
          url: `tours/?${toSearchParams(augmentedParams)}`,
          method: "POST",
          body: body,
        };
      },
    }),
    getSearchPhrases: build.query<SuggestionsResponse, SearchParams>({
      query: (params) => {
        const searchParams = new URLSearchParams(
          Object.entries(params).map(([key, value]) => [key, String(value)]),
        );
        return `searchPhrases?${searchParams}`;
      },
    }),
    getSearchSuggestions: build.query<
      AutocompleteSuggestionsResponse,
      SearchParams
    >({
      query: (params) => {
        const searchParams = new URLSearchParams(
          Object.entries(params).map(([key, value]) => [key, String(value)]),
        );
        return `searchphrase?${searchParams}`;
      },
    }),
    getFilter: build.query<FilterWithProviders, FilterParams>({
      query: (params) => {
        const { filter, ...queryParams } = params;
        return {
          url: `tours/filter?${toSearchParams(queryParams)}&domain=${domain}`,
          method: "POST",
          body: filter ? { filter } : {},
        };
      },
      transformResponse: (response: FilterResponse) => {
        return { filter: response.filter, providers: response.providers };
      },
    }),
    getGPX: build.query<[number, number][], string>({
      queryFn: async (url) => {
        try {
          const res = await fetch(url);
          const text = await res.text();
          const gpx = parseGPX(text);
          return { data: gpx };
        } catch (error) {
          return {
            error: { status: "FETCH_ERROR", error } as FetchBaseQueryError,
          };
        }
      },
    }),
    getCombinedGPX: build.query<Blob, CombinedGPXParams>({
      query: (params) => {
        const augmentedParams = { ...params, type: "all" };
        return {
          url: `tours/${params.id}/gpx`,
          params: augmentedParams,
          responseHandler: async (response) => await response.blob(),
        };
      },
    }),
    getProviderGpxOk: build.query<boolean, string>({
      query: (provider) => `tours/provider/${provider}`,
      transformResponse: (response: {
        success: boolean;
        allow_gpx_download: string;
      }) => response.allow_gpx_download === "y",
    }),
    getConnectionsExtended: build.query<ConnectionResult[], ConnectionParams>({
      query: (params) => {
        return `tours/${params.id}/connections-extended?city=${params.city}&domain=${domain}`;
      },
      transformResponse: (response: ConnectionResponse) => {
        return response.result;
      },
    }),
    getCities2Tour: build.query<Cities2TourCity[], string>({
      query: (id) => {
        return `cities2tour?domain=${domain}&id=${id}`;
      },
      transformResponse: (response: Cities2TourResponse) => {
        return response.cities;
      },
    }),
    getCity: build.query<CityObject, string>({
      query: (citySlug) => {
        return `city?city_slug=${citySlug}`;
      },
      transformResponse: (response: CityResponse) => {
        return response.city;
      },
    }),
  }),
});

function toSearchParams<T extends object>(obj: T): URLSearchParams {
  const searchParams = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return; // skip empty stuff
    }
    if (typeof value === "object") {
      if (Object.keys(value).length === 0) return; // skip empty objects
      searchParams.append(key, JSON.stringify(value));
    } else {
      searchParams.append(key, String(value));
    }
  });
  return searchParams;
}

export const {
  useGetCitiesQuery,
  useGetCityQuery,
  useGetTotalsQuery,
  useGetToursQuery,
  useLazyGetToursQuery,
  useGetSearchPhrasesQuery,
  useLazyGetSearchPhrasesQuery,
  useGetSearchSuggestionsQuery,
  useLazyGetSearchSuggestionsQuery,
  useGetFilterQuery,
  useLazyGetFilterQuery,
  useGetTourQuery,
  useLazyGetTourQuery,
  useGetGPXQuery,
  useLazyGetGPXQuery,
  useGetProviderGpxOkQuery,
  useLazyGetProviderGpxOkQuery,
  useGetConnectionsExtendedQuery,
  useLazyGetConnectionsExtendedQuery,
  useLazyGetCombinedGPXQuery,
  useGetCities2TourQuery,
} = api;
