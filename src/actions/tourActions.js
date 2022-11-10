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
    return (dispatch, getState) => {
        data.domain = window.location.host;
        return loadList(dispatch, getState, LOAD_TOURS, LOAD_TOURS_DONE, "tours", data, "tours/", "tours", false);
    };
}

export function loadFilter(data = {}) {
    return (dispatch, getState) => {
        return loadList(dispatch, getState, LOAD_TOUR_FILTER, LOAD_TOUR_FILTER_DONE, "tours", data, "tours/filter", "filter", false);
    };
}

export function loadTour(id, city) {
    return (dispatch, getState) => {
        return loadOne(dispatch, getState, LOAD_TOUR, LOAD_TOUR_DONE, id, "tours/", "tour", {city: city });
    };
}

export function loadTotalTours() {
    return (dispatch, getState) => {
        return loadOneReturnAll(dispatch, getState, LOAD_TOTAL_TOURS, LOAD_TOTAL_TOURS_DONE, "total", "tours/");
    };
}

export function loadTourConnections(data) {
    return (dispatch, getState) => {
        data.domain = window.location.host;
        return loadList(dispatch, getState, LOAD_TOUR_CONNECTIONS, LOAD_TOUR_CONNECTIONS_DONE, "tours", data, "tours/" + data.id + "/connections", "connections", false);
    };
}

export function loadTourConnectionsExtended(data) {
    return (dispatch, getState) => {
        data.domain = window.location.host;
        return loadList(dispatch, getState, LOAD_TOUR_CONNECTIONS_EXTENDED, LOAD_TOUR_CONNECTIONS_EXTENDED_DONE, "tours", data, "tours/" + data.id + "/connections-extended", "connections", false);
    };
}

export function loadFavouriteTours(data = {}) {
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
        return loadFile(dispatch, getState, LOAD_TOUR_PDF, LOAD_TOUR_PDF_DONE, "tours", data, "tours/" + data.id + "/pdf", "pdf", "buffer");
    }
}

export function loadTourGpx(data) {
    return (dispatch, getState) => {
        return loadFile(dispatch, getState, LOAD_TOUR_GPX, LOAD_TOUR_GPX_DONE, "tours", data, "tours/" + data.id + "/gpx", "gpx", "buffer");
    }
}

export function clearTours(){
    return (dispatch, getState) => {
        dispatch({type: CLEAR_TOURS});
    };
}