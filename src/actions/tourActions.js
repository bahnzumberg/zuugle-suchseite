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
import i18next from 'i18next';



export function loadTours(data = {}) {
    const language = i18next.resolvedLanguage;
    // console.log("from loadTours/ tourActions : language :",language)

    // console.log("tourActions, LoadTours L36 / data passed to loadList :", data)
    return (dispatch, getState) => {
        data.domain = window.location.host;
        //clgs
        // console.log("loadTours -> LOAD_TOURS :", LOAD_TOURS);
        // console.log("loadTours -> data :", data);
        // console.log("loadTours -> language :", language);
        return loadList(dispatch, getState, LOAD_TOURS, LOAD_TOURS_DONE, "tours", data, "tours/", "tours", false, true, language);
    };
}

export function loadFilter(data = {}) {
    // console.log("tourActions, LoadFilter L34 :",data)
    const language = i18next.resolvedLanguage;
    console.log("from loadFilter/ tourActions : language :",language)

    return (dispatch, getState) => {
        return loadList(dispatch, getState, LOAD_TOUR_FILTER, LOAD_TOUR_FILTER_DONE, "tours", data, "tours/filter", "filter", false, undefined, language);
    };
}

export function loadTour(id, city) {
    // console.log("tourActions, LoadTour L41 :",id)
    return (dispatch, getState) => {
        return loadOne(dispatch, getState, LOAD_TOUR, LOAD_TOUR_DONE, id, "tours/", "tour", {city: city });
    };
}

export function loadTotalTours() {
    // console.log("tourActions, loadTotalTours L48 , no data here")
    return (dispatch, getState) => {
        return loadOneReturnAll(dispatch, getState, LOAD_TOTAL_TOURS, LOAD_TOTAL_TOURS_DONE, "total", "tours/");
    };
}

export function loadTourConnections(data) {
    // console.log("tourActions, loadTourConnections L55 :", data)
    const language = i18next.resolvedLanguage;

    // console.log("from loadTourConnections/ tourActions : language :",language)
    return (dispatch, getState) => {
        data.domain = window.location.host;
        return loadList(dispatch, getState, LOAD_TOUR_CONNECTIONS, LOAD_TOUR_CONNECTIONS_DONE, "tours", data, "tours/" + data.id + "/connections", "connections", false, undefined, language);
    };
}

export function loadTourConnectionsExtended(data) {
    // console.log("tourActions, loadTourConnectionsExtended L63 :", data)
    const language = i18next.resolvedLanguage;
    // console.log("from loadTourConnectionsExtended/ tourActions : language :",language)
    return (dispatch, getState) => {
        data.domain = window.location.host;
        // return loadList(dispatch, getState, LOAD_TOUR_CONNECTIONS, LOAD_TOUR_CONNECTIONS_DONE, "tours", data, "tours/" + data.id + "/connections", "connections", false, undefined, language);;
        return loadList(dispatch, getState, LOAD_TOUR_CONNECTIONS_EXTENDED, LOAD_TOUR_CONNECTIONS_EXTENDED_DONE, "tours", data, "tours/" + data.id + "/connections-extended", "connections", false);

    };
}

export function loadFavouriteTours(data = {}) {
    // console.log("tourActions, loadFavouriteTours L71 :", data)
    const language = i18next.resolvedLanguage;
    // console.log("from loadFavouriteTours/ tourActions : language :",language)
    return (dispatch, getState) => {
        data.domain = window.location.host;
        return loadList(dispatch, getState, LOAD_FAVOURITE_TOURS, LOAD_FAVOURITE_TOURS_DONE, "tours", data, "tours/", "tours", false, undefined, language);
    };
}

export function setSelectedDate(date) {
    return (dispatch, getState) => {
        dispatch({type: SET_SELECTED_DATE, date: date});
    };
}

export const loadTourPdf =  (data) => async (dispatch, getState) => {

    try {
        let response = await loadFile(dispatch, getState, LOAD_TOUR_PDF, LOAD_TOUR_PDF_DONE, "tours", data, "tours/" + data.id + "/pdf", "pdf", "buffer");
        
        // console.log("L91 tourActions / loadTourPdf response :", response)
         // e.g. Promise {<fulfilled>: undefined}[[Prototype]] :  Promise [[PromiseState]] :  "fulfilled" [[PromiseResult]] : undefined
        return response
    } catch (error) {
        console.log("L94, tourActions Error: " + error.message);
        throw error
    } 
}


export function loadTourGpx(data) {
    // console.log("tourActions, loadFTourGpx L92 :", data)
    return (dispatch, getState) => {
        return loadFile(dispatch, getState, LOAD_TOUR_GPX, LOAD_TOUR_GPX_DONE, "tours", data, "tours/" + data.id + "/gpx", "gpx", "arraybuffer");
    }
}

export function clearTours(){
    // console.log("tourActions, clearTours L99, no data ")
    return (dispatch, getState) => {
        dispatch({type: CLEAR_TOURS});
    };
}