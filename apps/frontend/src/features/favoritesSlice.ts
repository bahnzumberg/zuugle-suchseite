import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FavoritesState {
  // Anonymous list key from POST /api/lists.
  listKey: string | null;
  // Source of truth on this device, independent of server sync.
  tourIds: number[];
  // Once true, a server fetch no longer overwrites tourIds.
  hydrated: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  listKey: null,
  tourIds: [],
  hydrated: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    listKeyCreated: (state, action: PayloadAction<string>) => {
      state.listKey = action.payload;
      // A new list already matches local state.
      state.hydrated = true;
    },
    favoritesHydrated: (state, action: PayloadAction<number[]>) => {
      state.tourIds = action.payload;
      state.hydrated = true;
    },
    favoriteAdded: (state, action: PayloadAction<number>) => {
      if (!state.tourIds.includes(action.payload)) {
        state.tourIds.push(action.payload);
      }
    },
    favoriteRemoved: (state, action: PayloadAction<number>) => {
      if (state.tourIds.includes(action.payload)) {
        state.tourIds = state.tourIds.filter((id) => id !== action.payload);
      }
    },
    favoritesErrorSet: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  listKeyCreated,
  favoritesHydrated,
  favoriteAdded,
  favoriteRemoved,
  favoritesErrorSet,
} = favoritesSlice.actions;
export default favoritesSlice.reducer;
