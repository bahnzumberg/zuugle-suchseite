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
import { API_BASE_URL } from "../utils/apiBase";
import { apiImageUrl, assetUrl, publicAssetUrl } from "../utils/assetUrl";
import { fetchAsset } from "../utils/fetchAsset";
import { forecastDays, type TourWeatherDetailDay } from "../models/tourWeather";
import type { WeatherMetadata } from "../models/weatherOverlay";

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

interface TourWeatherResponse {
  success: boolean;
  days: TourWeatherDetailDay[];
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

export interface LicensePublisher {
  name: string;
  url?: string;
}

export interface LicenseEntry {
  country_code: string;
  country_name: string;
  human_name: string;
  license_url?: string;
  spdx_license_identifier?: string;
  publisher?: LicensePublisher;
  source?: string;
}

export interface LicensesResponse {
  success: boolean;
  licenses: LicenseEntry[];
}

export interface CreateListResponse {
  success: boolean;
  key: string;
  name: string;
}

export interface FavoriteListTour {
  id: number;
}

export interface FavoritesListResponse {
  success: boolean;
  list: {
    key: string;
    name: string;
    language: string;
    tld: string;
  };
  tours: FavoriteListTour[];
  total: number;
  // Set when the requested key was merged into another list — adopt this key.
  moved_to: string | null;
}

export interface FavoriteMutationResponse {
  success: boolean;
  moved_to: string | null;
}

export interface PairingCodeResponse {
  success: boolean;
  code: string;
  expires_at: string;
  moved_to: string | null;
}

export interface PairListResponse {
  success: boolean;
  // Key of the surviving list — the caller's device stores this from now on.
  key: string;
  // Both counts are from this device's side: what it gained, and what the
  // other device gained from it.
  received: number;
  sent: number;
  total: number;
}

/**
 * HTTP status of a rejected RTK Query call, or null when the failure carries
 * none — a network or parsing error, where `status` is one of RTK's string
 * markers instead.
 */
export const errorStatus = (error: unknown): number | null => {
  const status = (error as FetchBaseQueryError | undefined)?.status;
  return typeof status === "number" ? status : null;
};

/**
 * Domain sent to the API in every request (`?domain=…`).
 *
 * The main app uses the page's own hostname (`www.zuugle.at`, `www.zuugle.de`,
 * …). The embed widget runs on a third-party host (e.g. `www.bahn-zum-berg.at`)
 * but must still tell the API which Zuugle domain it represents — the build
 * sets `__ZUUGLE_DOMAIN__` to the correct value (e.g. `dev.zuugle.at`).
 */
declare const __ZUUGLE_DOMAIN__: string | undefined;
const domain =
  typeof __ZUUGLE_DOMAIN__ !== "undefined"
    ? __ZUUGLE_DOMAIN__
    : window.location.hostname;

/**
 * The API returns GPX links as absolute URLs built from the `domain` above, so
 * on localhost it hands back `https://localhost/public/gpx/…`, which nothing
 * serves. Its own images arrive host-free and need this environment's asset
 * base prefixed; bahn-zum-berg images arrive absolute and are left as they are.
 */
const withLocalAssetUrls = (tour: Tour): Tour => ({
  ...tour,
  gpx_file: publicAssetUrl(tour.gpx_file),
  image_url: apiImageUrl(tour.image_url),
});

const withLocalRangeImageUrl = (range: RangeObject): RangeObject => ({
  ...range,
  image_url: apiImageUrl(range.image_url),
});

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  tagTypes: ["FavoritesList"],
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
        return withLocalAssetUrls(response.tour);
      },
    }),
    getTourWeather: build.query<TourWeatherDetailDay[], string>({
      query: (id) => `tours/${id}/weather`,
      transformResponse: (response: TourWeatherResponse) =>
        forecastDays(response.days),
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
      transformResponse: (response: ToursResponse) => ({
        ...response,
        tours: response.tours.map(withLocalAssetUrls),
        ranges: response.ranges?.map(withLocalRangeImageUrl),
      }),
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
          const res = await fetchAsset(url);
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

    /**
     * The map overlay's metadata; its `generated_at` is also the "Stand" of the
     * detail page's weather panel. Unfiltered; the maps read it through
     * `useWeatherOverlay`.
     */
    getWeatherMetadata: build.query<WeatherMetadata, void>({
      queryFn: async () => {
        try {
          const res = await fetchAsset(
            assetUrl("weather/weather_metadata.json"),
          );
          if (!res.ok) {
            return { error: { status: res.status, data: null } };
          }
          return { data: (await res.json()) as WeatherMetadata };
        } catch (error) {
          console.warn("Could not load weather metadata:", error);
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
    getLicenses: build.query<LicenseEntry[], void>({
      query: () => "licenses",
      transformResponse: (response: LicensesResponse) => response.licenses,
    }),
    createFavoritesList: build.mutation<CreateListResponse, string>({
      // No domain: the list's TLD comes from the request's Host header, so that
      // which lists may be paired is not client-settable.
      query: (language) => ({
        url: "lists",
        method: "POST",
        body: { language },
      }),
    }),
    getFavoritesList: build.query<FavoritesListResponse, string>({
      query: (key) => `lists/${key}`,
      providesTags: (_result, _error, key) => [
        { type: "FavoritesList", id: key },
      ],
    }),
    addFavoriteTour: build.mutation<
      FavoriteMutationResponse,
      { key: string; tourId: number }
    >({
      query: ({ key, tourId }) => ({
        url: `lists/${key}/tours`,
        method: "POST",
        body: { tour_id: tourId },
      }),
      invalidatesTags: (_result, _error, { key }) => [
        { type: "FavoritesList", id: key },
      ],
    }),
    removeFavoriteTour: build.mutation<
      FavoriteMutationResponse,
      { key: string; tourId: number }
    >({
      query: ({ key, tourId }) => ({
        url: `lists/${key}/tours/${tourId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { key }) => [
        { type: "FavoritesList", id: key },
      ],
    }),
    createPairingCode: build.mutation<PairingCodeResponse, string>({
      query: (key) => ({
        url: `lists/${key}/pairing-code`,
        method: "POST",
      }),
    }),
    // Pairing replaces the device's key, so every cached list is stale
    // afterwards — both the absorbed one and the survivor.
    pairList: build.mutation<
      PairListResponse,
      { code: string; key: string | null }
    >({
      query: ({ code, key }) => ({
        url: "lists/pair",
        method: "POST",
        body: { code, key },
      }),
      invalidatesTags: ["FavoritesList"],
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
  useGetTourWeatherQuery,
  useGetWeatherMetadataQuery,
  useGetGPXQuery,
  useLazyGetGPXQuery,
  useGetProviderGpxOkQuery,
  useLazyGetProviderGpxOkQuery,
  useGetCities2TourQuery,
  useGetLicensesQuery,

  useCreateFavoritesListMutation,
  useGetFavoritesListQuery,
  useAddFavoriteTourMutation,
  useRemoveFavoriteTourMutation,
  useCreatePairingCodeMutation,
  usePairListMutation,
} = api;
