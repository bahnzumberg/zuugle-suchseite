import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CityObject } from "../components/Search/Search";

const citySlice = createSlice({
  name: "selectedCity",
  initialState: null as CityObject | null,
  reducers: {
    cityUpdated: (state, action: PayloadAction<CityObject>) => {
      return action.payload;
    },
  },
});

export const { cityUpdated } = citySlice.actions;
export default citySlice.reducer;
