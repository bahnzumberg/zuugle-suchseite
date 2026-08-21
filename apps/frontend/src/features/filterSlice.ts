import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FilterObject } from "../models/Filter";

const initialState: FilterObject = {};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    // Keys are dropped rather than set to `undefined`, so that the presence of
    // a key always means the filter is set. `hasContent` counts keys.
    filterUpdated: (state, action: PayloadAction<FilterObject>) => {
      return Object.fromEntries(
        Object.entries(action.payload).filter(
          ([, value]) => value !== undefined,
        ),
      ) as FilterObject;
    },
  },
});

export const { filterUpdated } = filterSlice.actions;
export default filterSlice.reducer;
