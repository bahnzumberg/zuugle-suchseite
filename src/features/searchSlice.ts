import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CityObject {
  label: string;
  value: string;
}

export interface SearchState {
  city: CityObject | null;
  searchPhrase: string | null;
  language: string | null;
}

const initialState: SearchState = {
  city: null,
  searchPhrase: null,
  language: null,
};

const searchSlice = createSlice({
  name: "selectedSearchParameters",
  initialState,
  reducers: {
    cityUpdated: (state, action: PayloadAction<CityObject>) => {
      state.city = action.payload;
    },
    searchPhraseUpdated: (state, action: PayloadAction<string>) => {
      state.searchPhrase = action.payload;
    },
    languageUpdated: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
  },
});

export const { cityUpdated, searchPhraseUpdated, languageUpdated } =
  searchSlice.actions;
export default searchSlice.reducer;
