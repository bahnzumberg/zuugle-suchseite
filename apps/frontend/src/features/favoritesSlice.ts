import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Transient message for the favorites snackbar. Stored as an i18n key rather
// than a translated string so the text follows a language switch.
export interface FavoritesNotice {
  key: "save_failed" | "recreated" | "recreate_failed" | "merged";
  severity: "success" | "warning" | "error";
  count?: number;
}

export interface FavoritesState {
  // Anonymous list key from POST /api/lists.
  listKey: string | null;
  // First-paint cache of the server-held list; every server response wins.
  tourIds: number[];
  // "Show only favorites" toggle — filters the search results down to tourIds.
  favoritesOnly: boolean;
  notice: FavoritesNotice | null;
  // The dialog is mounted once in ThemedApp but opened from several places
  // (two FavoritesToggle instances, the /sync/:code deep link), so its state
  // lives here rather than in the component that renders the button.
  syncDialog: { open: boolean; incomingCode: string | null };
}

export const initialFavoritesState: FavoritesState = {
  listKey: null,
  tourIds: [],
  favoritesOnly: false,
  notice: null,
  syncDialog: { open: false, incomingCode: null },
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: initialFavoritesState,
  reducers: {
    listKeyCreated: (state, action: PayloadAction<string>) => {
      state.listKey = action.payload;
    },
    listKeyCleared: (state) => {
      state.listKey = null;
    },
    favoritesReceived: (state, action: PayloadAction<number[]>) => {
      state.tourIds = action.payload;
    },
    favoriteAdded: (state, action: PayloadAction<number>) => {
      if (!state.tourIds.includes(action.payload)) {
        state.tourIds.push(action.payload);
      }
    },
    favoriteRemoved: (state, action: PayloadAction<number>) => {
      state.tourIds = state.tourIds.filter((id) => id !== action.payload);
    },
    favoritesOnlyToggled: (state) => {
      state.favoritesOnly = !state.favoritesOnly;
    },
    noticeShown: (state, action: PayloadAction<FavoritesNotice>) => {
      state.notice = action.payload;
    },
    noticeDismissed: (state) => {
      state.notice = null;
    },
    syncDialogOpened: (state, action: PayloadAction<string | null>) => {
      state.syncDialog = { open: true, incomingCode: action.payload };
    },
    syncDialogClosed: (state) => {
      state.syncDialog = { open: false, incomingCode: null };
    },
  },
});

export const {
  listKeyCreated,
  listKeyCleared,
  favoritesReceived,
  favoriteAdded,
  favoriteRemoved,
  favoritesOnlyToggled,
  noticeShown,
  noticeDismissed,
  syncDialogOpened,
  syncDialogClosed,
} = favoritesSlice.actions;
export default favoritesSlice.reducer;
