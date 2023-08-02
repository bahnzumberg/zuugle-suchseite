import axios from "../axios";
import {LOAD_TOUR, LOAD_TOUR_DONE} from "./types";

export async function loadFile(dispatch, getState, typeBefore, typeDone, stateName, data, route, entityName, responseType = "buffer") {
    dispatch({type: typeBefore, ...data});
    const state = getState()[stateName];
    let params = {};
    if (state) {
        params = {
            page: state.page,
            page_size: state.pageSize,
            order_id: state.orderId,
            order_desc: state.orderDesc,
            ...data
        }
    }

    try{
        let res = await axios.get(route, {
            data: {},
            // data: data,
            responseType: responseType,
            params: params,
            timeout: 60000,
            headers: {
                Authorization: "FV69pR5PQQLcQ4wuMtTSqKqyYqf5XEK4"
            },
        });

        dispatch({
            type: typeDone,
        })

        //clgs
        // console.log("L34 crudActions /getFileFromServer res :", res)
        // console.log("L39 crudActions /getFileFromServer res.request.responseURL :", res.request.responseURL) 
        return res
        
    } catch (error) {
        console.log(" error :, L39", error.message)
        throw error
    }
}

export function loadList(dispatch, getState, typeBefore, typeDone, stateName, data, route, entityName, usePagination = true, useState = true, language) {

    //clg
    // console.log(`dispatch: packageFcn, getState: packageFcn, typeBefore: ${typeBefore}, typeDone:${typeDone}, stateName: ${stateName}, data: ${JSON.stringify(data)}, route: ${route}, entityName: ${entityName}, usePagination: ${usePagination},useState: ${useState}, language: ${language}`)

    // language && console.log("language: " + language)
    // language && console.log("data: " + JSON.stringify(data));
    // console.log("Type is LOAD_TOURS ? : ", typeBefore == 'LOAD_TOURS')
    // console.log("Type is LOAD_TOUR_CONNECTIONS ? : ", typeBefore == 'LOAD_TOUR_CONNECTIONS')
    //initialize language param
    const langPassed = language && (typeBefore == 'LOAD_TOURS' || typeBefore == 'LOAD_TOUR_CONNECTIONS') ? language : "de";

    // langPassed && console.log("passed language : " + langPassed)

    if(!!useState){
        dispatch({...data, type: typeBefore});
    }
    const state = getState()[stateName];
    let params = {};
    if (state) {
        let pagination = {};
        if(!!usePagination){
            pagination.page = state.page;
            pagination.page_size = state.pageSize;
            pagination.order_id = state.orderId;
            pagination.order_desc = state.orderDesc;
        }
        // console.log("data: inside if(state) : " + JSON.stringify(data));
        params = {
            ...pagination,
            ...data,
            currLanguage:langPassed
        }
    }

    // console.log("wichtiiiig", route, { params: params });
    return axios.get(route, { params: params }).then(res => {
        const entities = res.data[entityName];
        // console.log("entities :",entities)
        const total = res.data.total;
        total && total.length && console.log("total length: ", total.length);
        const filter = !!res.data.filter ? res.data.filter : null;
        if(!!useState){
            dispatch({
                type: typeDone,
                [entityName]: entities,
                total: total,
                filter: filter,
                page: res.data.page,
                ranges: res.data.ranges
            });
        }
        //console.log("crudActions : response ", res); // issue #9 API

        return res;
    }).catch(err => {
        console.error(err);
        if(!!useState){
            dispatch({
                type: typeDone,
                [entityName]: [],
                total: 0
            });
        }
    })
}

export function loadOne(dispatch, getState, typeBefore, typeDone, id, route, entityName, params = {}) {
    dispatch({type: typeBefore});
    // console.log("L83: route + id : ", route+id)
    return axios.get(route+id, { params: {...params, domain: window.location.host } }).then(res => {
        const entity = res.data[entityName];

        dispatch({
            type: typeDone,
            [entityName]: entity,
        });
        return res;
    });
}

export function loadOneReturnAll(dispatch, getState, typeBefore, typeDone, id, route) {
    dispatch({type: typeBefore});
    return axios.get(route+id, { params: {domain: window.location.host} }).then(res => {
        dispatch({
            type: typeDone,
            ...!!res && !!res.data ? res.data : {}
        });
        return res;
    });
}

//Calling the BE and getting suggestions out of the LogSearchPhrase table based on the language, city, and searchPhrase
export function loadSuggestions(searchPhrase, city, language) {
    return axios.get(`searchPhrases?search=${searchPhrase}&city=${city}&language=${language}`)
        .then(res =>{
        return res.data?.items;
    }).catch(err => console.error(err));
}

//loadShareParams will according to a specific shareId return the according tour, date and city where the connections are loaded from - usedCityOfCookie contains whether the original city was used or the current user's city (based on the cookie)
export function loadShareParams(shareId, city) {
    return axios.get('shares/' + shareId, {
        params: {
            city: city
        }
    })
        .then(res => {
            console.log(res);
            return res.data;
        });
}


//generateShareLink is used to generate a new sharing link to the corresponding tour on a specific date, the city is saved to later on always get connections, a shareId will be returned
export function generateShareLink(provider, hashedUrl, date, city) {
    return axios.post('shares/', {
        "provider": provider,
        "hashedUrl": hashedUrl,
        "date": date,
        "city": city
    }).then(res => {
        return res.data;
    }).catch(err => {
        return err.response.data;
    });
}

// Code description:
// This code file exports several functions that interact with an API using the axios library.

// loadFile is used to download a file from the API. It dispatches an action with type typeBefore to indicate that the file is being loaded and sets the parameters to be passed to the API (page, page size, order, etc.). Then it makes a GET request to the API's route with the specified parameters, and on success, dispatches an action with type typeDone.

// loadList is used to load a list of items from the API. It dispatches an action with type typeBefore to indicate that the list is being loaded, and sets the parameters to be passed to the API (page, page size, order, etc.). Then it makes a GET request to the API's route with the specified parameters, and on success, dispatches an action with type typeDone and passes the list of items as well as information about total items and filters. If there's an error, it dispatches an action with type typeDone and sets the list of items and total to empty.

// loadOne is used to load a single item from the API. It dispatches an action with type typeBefore to indicate that the item is being loaded, and makes a GET request to the API's route/id with specified parameters. On success, it dispatches an action with type typeDone and passes the item.

// loadOneReturnAll is used to load a single item from the API and return all the data related to it. It dispatches an action with type typeBefore to indicate that the item is being loaded, and makes a GET request to the API's route/id with specified parameters. On success, it dispatches an action with type typeDone and passes all the data related to the item.
