import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CityObject } from "./searchSlice";
import { Tour } from "../models/Tour";

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
        const searchParams = new URLSearchParams(
          Object.entries(params).map(([key, value]) => [key, String(value)]),
        );
        return `tours/?${searchParams}`;
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
  }),
});

export const {
  useGetCitiesQuery,
  useGetTotalsQuery,
  useGetToursQuery,
  useLazyGetToursQuery,
  useGetSearchPhrasesQuery,
  useLazyGetSearchPhrasesQuery,
} = api;
