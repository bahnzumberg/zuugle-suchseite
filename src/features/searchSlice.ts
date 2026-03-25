import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchWithType } from "./apiSlice";

export interface CityObject {
  label: string;
  value: string;
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
  provider: string | null;
  geolocation: LocationWithRadius | null;
}

const initialState: SearchState = {
  city: null,
  citySlug: null,
  searchWithType: null,
  language: null,
  map: false,
  bounds: null,
  provider: null,
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
    providerUpdated: (state, action: PayloadAction<string | null>) => {
      state.provider = action.payload;
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
  providerUpdated,
  geolocationUpdated,
} = searchSlice.actions;
export default searchSlice.reducer;
