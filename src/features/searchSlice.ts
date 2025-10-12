import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

export interface PoiWithRadius {
  lat: number;
  lng: number;
  radius: number;
}

export interface SearchState {
  city: CityObject | null;
  citySlug: string | null;
  searchPhrase: string | null;
  language: string | null;
  map: boolean;
  bounds: BoundsObject | null;
  provider: string | null;
  range: string | null;
  country: string | null;
  type: string | null;
  poi: PoiWithRadius | null;
}

const initialState: SearchState = {
  city: null,
  citySlug: null,
  searchPhrase: null,
  language: null,
  map: false,
  bounds: null,
  provider: null,
  range: null,
  country: null,
  type: null,
  poi: null,
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
    searchPhraseUpdated: (state, action: PayloadAction<string | null>) => {
      state.searchPhrase = action.payload;
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
    rangeUpdated: (state, action: PayloadAction<string | null>) => {
      state.range = action.payload;
    },
    countryUpdated: (state, action: PayloadAction<string | null>) => {
      state.country = action.payload;
    },
    typeUpdated: (state, action: PayloadAction<string | null>) => {
      state.type = action.payload;
    },
    poiUpdated: (state, action: PayloadAction<PoiWithRadius | null>) => {
      state.poi = action.payload;
    },
  },
});

export const {
  cityUpdated,
  citySlugUpdated,
  searchPhraseUpdated,
  languageUpdated,
  boundsUpdated,
  mapUpdated,
  providerUpdated,
  rangeUpdated,
  countryUpdated,
  typeUpdated,
  poiUpdated,
} = searchSlice.actions;
export default searchSlice.reducer;
