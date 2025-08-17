import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FilterObject } from "../models/Filter";

const initialState: FilterObject = {};

const filterSlice = createSlice({
  name: "selectedSearchParameters",
  initialState,
  reducers: {
    filterUpdated: (state, action: PayloadAction<FilterObject>) => {
      return action.payload;
    },
  },
});

export const { filterUpdated } = filterSlice.actions;
export default filterSlice.reducer;
