import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchWithType } from "./apiSlice";

export interface CityObject {
  label: string;
  value: string;
  lat?: number;
  lon?: number;
}

export interface BoundsObject {
  north: number;
  south: number;
  west: number;
  east: number;
}

export interface LocationWithRadius {
  lat: number;
  lng: number;
  radius: number;
}

export interface SearchState {
  city: CityObject | null;
  citySlug: string | null;
  searchWithType: SearchWithType | null;
  language: string | null;
  map: boolean;
  bounds: BoundsObject | null;
  /**
   * When true, tour links point directly to the provider's own website
   * (e.g. bahn-zum-berg.at) instead of our internal /tour/ detail pages.
   * Driven by the ?externalLinks= URL param (and the legacy ?p= param).
   */
  externalLinks: boolean;
  geolocation: LocationWithRadius | null;
}

const initialState: SearchState = {
  city: null,
  citySlug: null,
  searchWithType: null,
  language: null,
  map: false,
  bounds: null,
  externalLinks: false,
  geolocation: null,
};

const searchSlice = createSlice({
  name: "selectedSearchParameters",
  initialState,
  reducers: {
    cityUpdated: (state, action: PayloadAction<CityObject | null>) => {
      state.city = action.payload;
    },
    citySlugUpdated: (state, action: PayloadAction<string | null>) => {
      state.citySlug = action.payload;
    },
    searchWithTypeUpdated: (
      state,
      action: PayloadAction<SearchWithType | null>,
    ) => {
      state.searchWithType = action.payload;
    },
    languageUpdated: (state, action: PayloadAction<string | null>) => {
      state.language = action.payload;
    },
    boundsUpdated: (state, action: PayloadAction<BoundsObject | null>) => {
      state.bounds = action.payload;
    },
    mapUpdated: (state, action: PayloadAction<boolean>) => {
      state.map = action.payload;
    },
    externalLinksUpdated: (state, action: PayloadAction<boolean>) => {
      state.externalLinks = action.payload;
    },
    geolocationUpdated: (
      state,
      action: PayloadAction<LocationWithRadius | null>,
    ) => {
      state.geolocation = action.payload;
    },
  },
});

export const {
  cityUpdated,
  citySlugUpdated,
  searchWithTypeUpdated,
  languageUpdated,
  boundsUpdated,
  mapUpdated,
  externalLinksUpdated,
  geolocationUpdated,
} = searchSlice.actions;
export default searchSlice.reducer;
