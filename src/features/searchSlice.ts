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

export interface SearchState {
  city: CityObject | null;
  citySlug: string | null;
  searchPhrase: string | null;
  language: string | null;
  map: boolean;
  bounds: BoundsObject | null;
}

const initialState: SearchState = {
  city: null,
  citySlug: null,
  searchPhrase: null,
  language: null,
  map: false,
  bounds: null,
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
  },
});

export const {
  cityUpdated,
  citySlugUpdated,
  searchPhraseUpdated,
  languageUpdated,
  boundsUpdated,
  mapUpdated,
} = searchSlice.actions;
export default searchSlice.reducer;
