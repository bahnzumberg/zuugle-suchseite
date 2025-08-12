import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CityObject } from "../components/Search/Search";

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
  }),
});

export const { useGetCitiesQuery, useGetTotalsQuery } = api;
