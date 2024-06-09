import {
  CLEAR_TOURS,
  LOAD_FAVOURITE_TOURS,
  LOAD_FAVOURITE_TOURS_DONE,
  // LOAD_MAP_TOURS,
  // LOAD_MAP_TOURS_DONE,
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
  LOAD_TOUR_PDF,
  LOAD_TOUR_PDF_DONE,
  LOAD_TOURS,
  LOAD_TOURS_DONE,
  SET_SELECTED_DATE,
  SET_TOUR_ID,
  // NO_DATA_AVAILABLE,
  // NO_TOURS_AVAILABLE,
  // LOAD_DATA_ERROR,
} from "./types";
import { loadFile, loadList, loadOne, loadOneReturnAll } from "./crudActions";
import i18next from "i18next";
import { consoleLog } from "../utils/globals";

export function loadTours(data = {}) {
  const language = i18next.resolvedLanguage;

    return (dispatch, getState) => {
        data.domain = window.location.host;
        return loadList(dispatch, getState, LOAD_TOURS, LOAD_TOURS_DONE, "tours", data, "tours/", "tours", false, true, language);
    };
}

export function loadFilter(data = {}) {

  const language = i18next.resolvedLanguage;
  // consoleLog("L44 data /tourActions", JSON.stringify(data), true)
  return (dispatch, getState) => {
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
  // console.log("1) loadTour is called !")
  return (dispatch, getState) => {
    // console.log("2) loadTour is called !")
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
        // console.log("L76 : res.data")
        // console.log(res.data)
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
  const language = i18next.resolvedLanguage;
// !!data && console.log("L112 data / loadTourConnections",data);
// output: {city: "wien", domain: "localhost:3000", id: 102411}
  return (dispatch, getState) => {
    data.domain = window.location.host;
    let returndataPromise = loadList(dispatch, getState, LOAD_TOUR_CONNECTIONS, LOAD_TOUR_CONNECTIONS_DONE, "tours", data, "tours/" + data.id + "/connections", "connections", false, undefined, language);
    
    // let returndataPromise = loadList(dispatch, getState, LOAD_TOUR_CONNECTIONS, LOAD_TOUR_CONNECTIONS_DONE, "tours", data, "tours/" + data.id + "/connections", "connections", false, undefined, language);
    
    // returndataPromise.then(returndata => {
      // consoleLog("L114 tourActions/loadTourConnections -> data: ", data);
      // consoleLog("L115 tourActions / loadTourConnections / returned data: ", returndata);
    // });
    
    return returndataPromise;
  };
}

export function loadTourConnectionsExtended(data) {

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
  // data && consoleLog("L155 -> data passed to loadFavouriteTours :")
  // data && consoleLog(data)
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

export const loadTourPdf = (data) => async (dispatch, getState) => {
  try {
    let response = await loadFile(
      dispatch,
      getState,
      LOAD_TOUR_PDF,
      LOAD_TOUR_PDF_DONE,
      "tours",
      data,
      "tours/" + data.id + "/pdf",
      "pdf",
      "buffer"
    );
    return response;
  } catch (error) {
    if(process.env.NODE_ENV !== "production"){
      console.log("L94, tourActions Error: " + error.message);
    }
    throw error;
  }
};

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
  // console.log("tourActions, clearTours L99, no data ")
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
