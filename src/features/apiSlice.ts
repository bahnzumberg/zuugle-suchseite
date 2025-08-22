import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { BoundsObject, CityObject } from "./searchSlice";
import { Tour } from "../models/Tour";
import { FilterObject } from "../models/Filter";
import { Marker } from "../components/Map/TourMapContainer";
import { parseGPX, toLatLngBounds } from "../utils/map_utils";
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
  country?: string;
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
}

export interface ConnectionParams {
  id: string;
  city: string;
}

export interface ConnectionResponse {
  success: boolean;
  result: ConnectionResult[];
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
  }),
  endpoints: (build) => ({
    getCities: build.query<CityObject[], any>({
      query: (params) => {
        const searchParams = new URLSearchParams(params).toString();
        return `cities/?${searchParams}`;
      },
      transformResponse: (response: CityResponse) => {
        return response.cities;
      },
    }),
    getTotals: build.query<TotalResponse, void>({
      query: () => {
        return `tours/total`;
      },
    }),
    getTour: build.query<Tour, TourParams>({
      query: (params) => {
        return `tours/${params.id}/${params.city ?? "no-city"}`;
      },
      transformResponse: (response: TourResponse) => {
        return response.tour;
      },
    }),
    getTours: build.query<ToursResponse, ToursParams>({
      query: (params) => {
        const { bounds, ...rest } = params;
        if (bounds) {
          const leafletBounds = toLatLngBounds(bounds);
          return `tours/?${toSearchParams({ ...rest, bounds: leafletBounds })}`;
        }

        return `tours/?${toSearchParams(rest)}`;
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
    getFilter: build.query<FilterObject, FilterParams>({
      query: (params) => {
        return `tours/filter?${toSearchParams(params)}`;
      },
      transformResponse: (response: FilterResponse) => {
        return response.filter;
      },
    }),
    getGPX: build.query<L.LatLngExpression[], string>({
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
    getProviderGpxOk: build.query<boolean, string>({
      query: (provider) => `tours/provider/${provider}`,
      transformResponse: (response: {
        success: boolean;
        allow_gpx_download: string;
      }) => response.allow_gpx_download === "y",
    }),
    getConnectionsExtended: build.query<ConnectionResult[], ConnectionParams>({
      query: (params) => {
        return `tours/${params.id}/connections-extended?city=${params.city}&domain=${window.location.host}`;
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
    if (typeof value === "object" && Object.keys(value).length > 0) {
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
  useGetTourQuery,
  useLazyGetTourQuery,
  useGetGPXQuery,
  useLazyGetGPXQuery,
  useGetProviderGpxOkQuery,
  useLazyGetProviderGpxOkQuery,
  useGetConnectionsExtendedQuery,
  useLazyGetConnectionsExtendedQuery,
} = api;
