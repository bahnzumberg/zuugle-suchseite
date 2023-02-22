import {
    CLEAR_TOURS,
    LOAD_FAVOURITE_TOURS,
    LOAD_FAVOURITE_TOURS_DONE, LOAD_MAP_TOURS, LOAD_MAP_TOURS_DONE,
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
    SET_SELECTED_DATE
} from './types';
import {loadFile, loadList, loadOne, loadOneReturnAll} from "./crudActions";

export function loadTours(data = {}) {
    console.log("tourActions, LoadTours L26 :", data)
    return (dispatch, getState) => {
        data.domain = window.location.host;
        return loadList(dispatch, getState, LOAD_TOURS, LOAD_TOURS_DONE, "tours", data, "tours/", "tours", false);
    };
}

export function loadFilter(data = {}) {
    console.log("tourActions, LoadFilter L34 :",data)
    return (dispatch, getState) => {
        return loadList(dispatch, getState, LOAD_TOUR_FILTER, LOAD_TOUR_FILTER_DONE, "tours", data, "tours/filter", "filter", false);
    };
}

export function loadTour(id, city) {
    console.log("tourActions, LoadTour L41 :",data)
    return (dispatch, getState) => {
        return loadOne(dispatch, getState, LOAD_TOUR, LOAD_TOUR_DONE, id, "tours/", "tour", {city: city });
    };
}

export function loadTotalTours() {
    console.log("tourActions, loadTotalTours L48 , no data here")
    return (dispatch, getState) => {
        return loadOneReturnAll(dispatch, getState, LOAD_TOTAL_TOURS, LOAD_TOTAL_TOURS_DONE, "total", "tours/");
    };
}

export function loadTourConnections(data) {
    console.log("tourActions, loadTourConnections L55 :", data)
    return (dispatch, getState) => {
        data.domain = window.location.host;
        return loadList(dispatch, getState, LOAD_TOUR_CONNECTIONS, LOAD_TOUR_CONNECTIONS_DONE, "tours", data, "tours/" + data.id + "/connections", "connections", false);
    };
}

export function loadTourConnectionsExtended(data) {
    console.log("tourActions, loadTourConnectionsExtended L63 :", data)
    return (dispatch, getState) => {
        data.domain = window.location.host;
        return loadList(dispatch, getState, LOAD_TOUR_CONNECTIONS_EXTENDED, LOAD_TOUR_CONNECTIONS_EXTENDED_DONE, "tours", data, "tours/" + data.id + "/connections-extended", "connections", false);
    };
}

export function loadFavouriteTours(data = {}) {
    console.log("tourActions, loadFavouriteTours L71 :", data)
    return (dispatch, getState) => {
        data.domain = window.location.host;
        return loadList(dispatch, getState, LOAD_FAVOURITE_TOURS, LOAD_FAVOURITE_TOURS_DONE, "tours", data, "tours/", "tours", false);
    };
}

export function setSelectedDate(date) {
    return (dispatch, getState) => {
        dispatch({type: SET_SELECTED_DATE, date: date});
    };
}

export function loadTourPdf(data) {
    return (dispatch, getState) => {
        console.log("L: 86 -> LOAD_TOUR_PDF_DONE :", LOAD_TOUR_PDF_DONE)
        return loadFile(dispatch, getState, LOAD_TOUR_PDF, LOAD_TOUR_PDF_DONE, "tours", data, "tours/" + data.id + "/pdf", "pdf", "buffer");
    }
}

export function loadTourGpx(data) {
    console.log("tourActions, loadFTourGpx L92 :", data)
    return (dispatch, getState) => {
        return loadFile(dispatch, getState, LOAD_TOUR_GPX, LOAD_TOUR_GPX_DONE, "tours", data, "tours/" + data.id + "/gpx", "gpx", "buffer");
    }
}

export function clearTours(){
    console.log("tourActions, clearTours L99, no data ")
    return (dispatch, getState) => {
        dispatch({type: CLEAR_TOURS});
    };
}