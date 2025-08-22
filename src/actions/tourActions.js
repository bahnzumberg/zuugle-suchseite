import {
  LOAD_FAVOURITE_TOURS,
  LOAD_FAVOURITE_TOURS_DONE,
  LOAD_TOUR,
  LOAD_TOUR_CONNECTIONS_EXTENDED,
  LOAD_TOUR_CONNECTIONS_EXTENDED_DONE,
  LOAD_TOUR_DONE,
  LOAD_TOUR_FILTER,
  LOAD_TOUR_FILTER_DONE,
  LOAD_TOUR_GPX,
  LOAD_TOUR_GPX_DONE,
  LOAD_TOURS,
  LOAD_TOURS_DONE,
  SET_TOUR_ID,
} from "./types";
import { loadFile, loadList, loadOne } from "./crudActions";
import i18next from "i18next";

export function loadTours(data = {}) {
  const language = i18next.resolvedLanguage;
  return (dispatch, getState) => {
    data.domain = window.location.host;
    return loadList(
      dispatch,
      getState,
      LOAD_TOURS,
      LOAD_TOURS_DONE,
      "tours",
      data,
      "tours/",
      "tours",
      false,
      true,
      language,
    );
  };
}

export function loadFilter(data = {}) {
  const language = i18next.resolvedLanguage;
  return (dispatch, getState) => {
    data.domain = window.location.host;
    return loadList(
      dispatch,
      getState,
      LOAD_TOUR_FILTER,
      LOAD_TOUR_FILTER_DONE,
      "tours",
      data,
      "tours/filter",
      "filter",
      false,
      undefined,
      language,
    );
  };
}

export function loadTour(id, city) {
  return (dispatch, getState) => {
    return loadOne(
      dispatch,
      getState,
      LOAD_TOUR,
      LOAD_TOUR_DONE,
      id,
      `tours/${id}/${city}`,
      "tour",
      { city: city },
    )
      .then((res) => {
        return res;
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          // 404 error scenario
          console.error("loadTours/ Tour not found:", error);
          return;
        } else {
          // other errors
          console.error("Error:", error);
        }
        // Re-throw error to the calling code
        throw error;
      });
  };
}

export function loadTourConnectionsExtended(data) {
  // Used as the search page
  return (dispatch, getState) => {
    data.domain = window.location.host;

    return loadList(
      dispatch,
      getState,
      LOAD_TOUR_CONNECTIONS_EXTENDED,
      LOAD_TOUR_CONNECTIONS_EXTENDED_DONE,
      "tours",
      data,
      "tours/" + data.id + "/connections-extended",
      "connections",
      false,
    );
  };
}

export function loadFavouriteTours(data = {}) {
  const language = i18next.resolvedLanguage;
  return (dispatch, getState) => {
    data.domain = window.location.host;
    return loadList(
      dispatch,
      getState,
      LOAD_FAVOURITE_TOURS,
      LOAD_FAVOURITE_TOURS_DONE,
      "tours",
      data,
      "tours/",
      "tours",
      false,
      undefined,
      language,
    );
  };
}

export function loadTourGpx(data) {
  return (dispatch, getState) => {
    return loadFile(
      dispatch,
      getState,
      LOAD_TOUR_GPX,
      LOAD_TOUR_GPX_DONE,
      "tours",
      data,
      "tours/" + data.id + "/gpx",
      "gpx",
      "buffer",
    );
  };
}

export const setTourID = (tourId) => {
  return {
    type: SET_TOUR_ID,
    payload: tourId,
  };
};
