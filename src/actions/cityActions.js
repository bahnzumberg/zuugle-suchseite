import {
    LOAD_ALL_CITIES,
    LOAD_ALL_CITIES_DONE,
    LOAD_CITIES, LOAD_CITIES_DONE,
} from './types';
import {loadList} from "./crudActions";

export function loadCities(data = {}) {
    return (dispatch, getState) => {
        data.domain = window.location.host;
        return loadList(dispatch, getState, LOAD_CITIES, LOAD_CITIES_DONE, "tours", data, "cities/", "cities", false);
    };
}

export function loadAllCities(data = {all: true}) {
    return (dispatch, getState) => {
        data.domain = window.location.host;
        return loadList(dispatch, getState, LOAD_ALL_CITIES, LOAD_ALL_CITIES_DONE, "tours", data, "cities/", "cities", false);
    };
}