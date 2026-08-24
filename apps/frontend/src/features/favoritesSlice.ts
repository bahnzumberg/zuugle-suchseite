import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FavoritesState {
  // Anonymous list key from POST /api/lists.
  listKey: string | null;
  // Source of truth on this device, independent of server sync.
  tourIds: number[];
  // Once true, a server fetch no longer overwrites tourIds.
  hydrated: boolean;
  error: string | null;
  // "Show only favorites" toggle — filters the search results down to tourIds.
  favoritesOnly: boolean;
  // ISO timestamp string of the last successful server sync
  lastSyncedAt: string | null;
  // Indicates if current local favorites are successfully mirrored on server
  isSynced: boolean;
}

const initialState: FavoritesState = {
  listKey: null,
  tourIds: [],
  hydrated: false,
  error: null,
  favoritesOnly: false,
  lastSyncedAt: null,
  isSynced: true,
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
        state.isSynced = false;
      }
    },
    favoriteRemoved: (state, action: PayloadAction<number>) => {
      if (state.tourIds.includes(action.payload)) {
        state.tourIds = state.tourIds.filter((id) => id !== action.payload);
        state.isSynced = false;
      }
    },
    favoritesSyncSuccess: (state, action: PayloadAction<string>) => {
      state.lastSyncedAt = action.payload;
      state.isSynced = true;
      state.error = null;
    },
    favoritesSyncFailed: (state) => {
      state.isSynced = false;
    },
    favoritesErrorSet: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    favoritesOnlyToggled: (state) => {
      state.favoritesOnly = !state.favoritesOnly;
    },
  },
});

export const {
  listKeyCreated,
  favoritesHydrated,
  favoriteAdded,
  favoriteRemoved,
  favoritesSyncSuccess,
  favoritesSyncFailed,
  favoritesErrorSet,
  favoritesOnlyToggled,
} = favoritesSlice.actions;
export default favoritesSlice.reducer;
