import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CityObject } from "../components/Search/Search";

export interface CityResponse {
  success: boolean;
  cities: CityObject[];
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
  }),
});

export const { useGetCitiesQuery } = api;
