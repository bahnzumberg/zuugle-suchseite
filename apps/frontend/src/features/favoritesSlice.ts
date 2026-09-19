import { createSlice, PayloadAction, UnknownAction } from "@reduxjs/toolkit";

// Transient message for the favorites snackbar. Stored as an i18n key rather
// than a translated string so the text follows a language switch; severity and
// duration are presentation and live with the component that renders it.
export interface FavoritesNotice {
  key:
    | "save_failed"
    | "recreated"
    | "recreate_failed"
    | "merged"
    | "merged_none"
    | "merged_sent";
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

// Any /api/lists response carries `moved_to` when the key this device holds was
// absorbed by another list. Matching on the shape adopts it for every endpoint
// at once, so no caller can forget and leave the device on a tombstoned key.
const isMovedResponse = (
  action: UnknownAction,
): action is UnknownAction & { payload: { moved_to: string } } =>
  typeof (action as { payload?: { moved_to?: unknown } }).payload?.moved_to ===
  "string";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: initialFavoritesState,
  reducers: {
    listKeySet: (state, action: PayloadAction<string | null>) => {
      state.listKey = action.payload;
    },
    favoritesReceived: (state, action: PayloadAction<number[]>) => {
      // Every mounted FavoriteButton runs the effect that dispatches this, so
      // one fetch arrives here a couple of dozen times with the same ids.
      // Bailing out keeps the array identity stable, which is what stops the
      // localStorage write in index.tsx from repeating too.
      const next = action.payload;
      const unchanged =
        next.length === state.tourIds.length &&
        next.every((id, i) => id === state.tourIds[i]);
      if (unchanged) return;
      state.tourIds = next;
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
  extraReducers: (builder) => {
    builder.addMatcher(isMovedResponse, (state, action) => {
      state.listKey = action.payload.moved_to;
    });
  },
});

export const {
  listKeySet,
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
