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

export interface CityResponse {
  success: boolean;
  cities: CityObject[];
}

export interface TotalResponse {
  success: boolean;
  total_tours: number;
  tours_city: number;
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
}

export interface ToursParams {
  limit?: number;
  city: string;
  ranges?: boolean;
  provider?: string;
  filter?: FilterObject;
  search?: string;
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

export interface Suggestion {
  suggestion: string;
}
export interface SuggestionsResponse {
  success: boolean;
  items: Suggestion[];
}

export interface FilterParams {
  search?: string;
  city?: string;
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
      transformResponse: (response: CityResponse) => {
        return response.cities;
      },
    }),
    getTotals: build.query<TotalResponse, string | undefined>({
      query: (city) => {
        return `tours/total${city ? `?city=${city}` : ""}`;
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
    getFilter: build.query<FilterWithProviders, FilterParams>({
      query: (params) => {
        return `tours/filter?${toSearchParams(params)}&domain=${domain}`;
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
  useGetTotalsQuery,
  useGetToursQuery,
  useLazyGetToursQuery,
  useGetSearchPhrasesQuery,
  useLazyGetSearchPhrasesQuery,
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
} = api;
