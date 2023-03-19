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

//Code description: 
// This code defines two functions, loadCities and loadAllCities, that are used to load data from an API endpoint. The code makes use of two other functions, dispatch and getState, that are part of the Redux framework, a popular state management library for React applications.

// The loadCities function takes an optional data parameter, which is an object that can be used to specify filter conditions for the API request. The function creates a new object, data, which includes a property domain that is set to the host name of the current location. This new object is then passed to loadList, which is a utility function that dispatches actions and makes the API request.

// The loadAllCities function works in the same way as loadCities, but sets the data object to include a property all with a value of true.

// Both functions return the result of calling loadList with specific arguments, including the action types to dispatch, the endpoint to send the request to, and the property of the state object to store the response data in.
