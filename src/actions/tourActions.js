import {
  CLEAR_TOURS,
  LOAD_FAVOURITE_TOURS,
  LOAD_FAVOURITE_TOURS_DONE,
  LOAD_TOTAL_TOURS,
  LOAD_TOTAL_TOURS_DONE,
  LOAD_TOUR,
  LOAD_TOUR_CONNECTIONS,
  LOAD_TOUR_CONNECTIONS_DONE,
  LOAD_TOUR_CONNECTIONS_EXTENDED,
  LOAD_TOUR_CONNECTIONS_EXTENDED_DONE,
  LOAD_TOUR_DONE,
  LOAD_TOUR_FILTER,
  LOAD_TOUR_FILTER_DONE,
  LOAD_TOUR_GPX,
  LOAD_TOUR_GPX_DONE,
  LOAD_TOURS,
  LOAD_TOURS_DONE,
  SET_SELECTED_DATE,
  SET_TOUR_ID,
} from "./types";
import { loadFile, loadList, loadOne, loadOneReturnAll, getMapData } from "./crudActions";
import i18next from "i18next";
import '/src/config.js';

export function loadTours(data = {}) {
  const language = i18next.resolvedLanguage;
  return (dispatch, getState) => {
    data.domain = window.location.host;
    return loadList(dispatch, getState, LOAD_TOURS, LOAD_TOURS_DONE, "tours", data, "tours/", "tours", false, true, language);
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
        language
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
      { city: city }
    )
      .then((res) => {
        return res;
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          // 404 error scenario
          console.error("loadTours/ Tour not found:", error);
          return
        } else {
          // other errors
          console.error("Error:", error);
        }
        // Re-throw error to the calling code
        throw error;
      });
  };
}

export function loadTotalTours() {
  return (dispatch, getState) => {
    return loadOneReturnAll(
      dispatch,
      getState,
      LOAD_TOTAL_TOURS,
      LOAD_TOTAL_TOURS_DONE,
      "total",
      "tours/"
    );
  };
}

export function loadTourConnections(data) {
  // Used on the first page (Startpage)
  const language = i18next.resolvedLanguage;
  // output: {city: "wien", domain: "localhost:3000", id: 102411}
  return (dispatch, getState) => {
    data.domain = window.location.host;
    let returndataPromise = loadList(dispatch, getState, LOAD_TOUR_CONNECTIONS, LOAD_TOUR_CONNECTIONS_DONE, "tours", data, "tours/" + data.id + "/connections", "connections", false, undefined, language);
   
    return returndataPromise;
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
      false
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
      language
    );
  };
}

export function setSelectedDate(date) {
  return (dispatch, getState) => {
    dispatch({ type: SET_SELECTED_DATE, date: date });
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
      "buffer"
    );
  };
}

export function clearTours() {
  return (dispatch, getState) => {
    dispatch({ type: CLEAR_TOURS });
  };
}

export function checkProviderApproval() {
  // related to issue #65 in the project, given a provider name this function will return from the backend with a value of "Y" or "N" (to be used inside the Details page)
}

export const setTourID = (tourId) => {
  return {
    type: SET_TOUR_ID,
    payload: tourId,
  };
};

// Passing marker Ids from map to retrieve corresponding tours
export function loadMapTours(markersArray) {
  return (dispatch) => {
      const data = {
        markerIds: markersArray, // this passed var should be already an array of ids
      };

      return getMapData(data)
          .then((res) => {
              const tours = res.tours;
              dispatch({
                type: LOAD_TOURS_DONE,
                tours: tours,
                total: res.total,
                page: res.page,
              });
              return res;
          })
          .catch((err) => {
              console.error(err);
              dispatch({
                  type: LOAD_TOURS_DONE,
                  tours: [],
                  total: 0,
              });
          });
  };
}
