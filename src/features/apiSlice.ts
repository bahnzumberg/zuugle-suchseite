import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CityObject } from "./searchSlice";
import { Tour } from "../models/Tour";
import { FilterObject } from "../models/Filter";

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

export interface ToursResponse {
  success: boolean;
  tours: Tour[];
  total: number;
  page: number;
  ranges: RangeObject[];
  markers: any[];
}

export interface ToursParams {
  limit?: number;
  city: string;
  ranges?: boolean;
  provider?: string;
  filter?: FilterObject;
  search?: string;
  page?: number;
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
    getTours: build.query<ToursResponse, ToursParams>({
      query: (params) => {
        return `tours/?${toSearchParams(params)}`;
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
  }),
});

function toSearchParams<T extends object>(obj: T): URLSearchParams {
  const searchParams = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (value instanceof Object) {
        value = JSON.stringify(value);
      }
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
} = api;
