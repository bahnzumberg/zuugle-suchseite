import axios from "../axios";
import {
  LOAD_DATA_ERROR,
  NO_DATA_AVAILABLE,
  NO_TOURS_AVAILABLE,
} from "./types";

export async function loadFile(
  dispatch,
  getState,
  typeBefore,
  typeDone,
  stateName,
  data,
  route,
  entityName,
  responseType = "buffer"
) {
  dispatch({ type: typeBefore, ...data });
  const state = getState()[stateName];
  let params = {};
  if (state) {
    params = {
      page: state.page,
      page_size: state.pageSize,
      order_id: state.orderId,
      order_desc: state.orderDesc,
      ...data,
    };
  }
  try {
    //when clicking "gpx" button on detail page.

    let res = await axios.get(route, {
      data: data,
      responseType: responseType,
      params: params,
      timeout: 60000,
      headers: {
        "authorization": "FV69pR5PQQLcQ4wuMtTSqKqyYqf5XEK4",
      },
    });

    dispatch({
      type: typeDone,
    });

    return res;
  } catch (error) {
      console.log(" error:, ", error.message);
      throw error;
  }
}

export function loadList(
  dispatch,                                                   
  getState, //returns the current state of the Redux store.   
  typeBefore, // load-action type                     
  typeDone, // done-action type
  stateName, //redux store-key
  data,   // to be passed to the backend
  route, //endpoint URL for the API request
  entityName,  //key-name used to extract the relevant data from the API response.
  usePagination = true,
  useState = true, //a should-merge boolean (fetched data should be merged with existing data in the Redux state.)
  language
) {


  // initialize language param
  const langPassed =
    language &&
    (typeBefore === "LOAD_TOURS" || typeBefore === "LOAD_TOUR_CONNECTIONS")
      ? language
      : "de";

  if (!!useState) {
    dispatch({ ...data, type: typeBefore });
  }
  const state = getState()[stateName];


  let params = {};
  if (state) {
 
    let pagination = {};
    if (!!usePagination) {
      pagination.page = state.page;
      pagination.page_size = state.pageSize;
      pagination.order_id = state.orderId;
      pagination.order_desc = state.orderDesc;
    }
    params = {
      ...pagination,
      ...data,
      currLanguage: langPassed,
      bounds: data.bounds

    };
  } else {
    params = {
      ...data,
      currLanguage: langPassed,
      bounds: data.bounds 
    };
}

  return axios
    .get(route, { params: params })
    .then((res) => {
      const entities = res.data[entityName];
      const total = res.data.total;
      const filter = !!res.data.filter ? res.data.filter : null;
      const markers = res?.data?.markers?.map((markerObj) => ({
      id: markerObj.id,
      lat: markerObj.lat,
      lon: markerObj.lon,
    })) || [];

      if (!!useState) {
        dispatch({
          type: typeDone,
          [entityName]: entities,
          total: total,
          filter: filter,
          page: res.data.page,
          ranges: res.data.ranges,
          markers:markers
        });
      }
      return res;
    })
    .catch((err) => {
      console.error(err);
      if (!!useState) {
        dispatch({
          type: typeDone,
          [entityName]: [],
          total: 0,
        });
      }
    });
}

export function loadOne(
  dispatch,
  getState,
  typeBefore,
  typeDone,
  id,
  route,
  entityName,
  params = {}
) {
  dispatch({ type: typeBefore });

  return axios
    .get(route, { params: { ...params, domain: window.location.host } })
    .then((res) => {
      const entity = res.data[entityName];

      dispatch({
        type: typeDone,
        [entityName]: entity,
      });
      return res;
    })
    .catch((error) => {
      console.error("Error in loadOne:", error); // Log the full error object
      if (error.response && error.response.status === 404) {
        // Pass on the 404 error to the calling function
        throw error; // Throwing the error here
      } else {
        // Handle other errors
        dispatch({
          type: typeDone,
          error: "An error occurred",
        });
        throw error; // Throwing the error here as well
      }
    });
}

export function loadOneReturnAll(
  dispatch,
  getState,
  typeBefore,
  typeDone,
  id,
  route
) {
  const abortController = new AbortController();
  const signal = abortController.signal;

  const requestConfig = {
    params: { domain: window.location.host },
    signal: signal,
  };
  dispatch({ type: typeBefore });

  return axios
    .get(route + id, requestConfig)
    .then((res) => {
      if (!!res && !!res.data) {
        const { total_tours } = res.data;

        if (total_tours === 0) {
          dispatch({ type: NO_TOURS_AVAILABLE });
        } else {
          dispatch({
            type: typeDone,
            ...res.data,
          });
        }
      } else {
        dispatch({ type: NO_DATA_AVAILABLE });
      }
      return res;
    })
    .catch((error) => {
      // errors that occur during the request
      if (error.name === "AbortError") {
        console.log("Request was canceled:", error.message);
      } else {
        console.error("Error loading data:", error);
        // Dispatch LOAD_DATA_ERROR action with the error message
        dispatch({ type: LOAD_DATA_ERROR, error });
      }
      return error; // Allow calling code to know there was an error
    })
    .finally(() => {
      // Clean up and cancel the request if necessary
      abortController.abort();
    });
}

//Calling the BE and getting suggestions out of the LogSearchPhrase table based on the language, city, and searchPhrase
export function loadSuggestions(searchPhrase, city, language, tld) {
  return axios
    .get(
      `searchPhrases?search=${searchPhrase}&city=${city}&language=${language}&tld=${tld}`
    )
    .then((res) => {
      return res.data?.items;
    })
    .catch((err) => console.error(err));
}

//
export const getTotalCityTours = (city) => {
  return axios
    .get(`tours/total/`, {
      params: {
        city: city,
      },
    })
    .then((res) => {
      return res.data;
    });
};

// This is a "BAUSTELLE" but already has basic fucntionality (for this stage May 2024 it is not needed)
export const getMapData = (data)=>{
  return axios.get('tours/map/', {
    params: data
  }).then((res)=>{
    return res.data
  })

}
