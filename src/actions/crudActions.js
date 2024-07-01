import axios from "../axios";
import {
  LOAD_DATA_ERROR,
  NO_DATA_AVAILABLE,
  NO_TOURS_AVAILABLE,
} from "./types";
import { consoleLog } from "../utils/globals";

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
    //when clicking "pdf" button on detail page.
    if(process.env.NODE_ENV !== "production"){
      // consoleLog("L 33 crudActions / loadFile : route :", route);//example: "tours/1971/pdf"
      // consoleLog("L 34 crudActions / loadFile : data :", data, true);//example: {id: 1971, connection_id: 957752, connection_return_id: 957752, connection_return_ids: Array(1), connectionDate: '2024-01-11T00:00:00+01:00'}
      // consoleLog("L 36 crudActions / loadFile : responseType :", responseType); //'buffer'
    }
    let res = await axios.get(route, {
      // data: {},
      data: data,
      // responseType: 'arraybuffer',
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
    console.log(" error :, L39", error.message);
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
  // console.log("L75 -> data :", data)

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
  // console.log(`L88 :  stateName :${stateName}`)
  // console.log(`L89 : state : ${JSON.stringify(state)}`)

  let params = {};
  if (state) {
    // console.log("L93 CRUD state :", state)
    // console.log("L94 CRUD state.bounds :", state["bounds"])
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
      // filter: state.filter,
      bounds: data.bounds

    };
  } else {
    // console.log("L110 CRUD inside else .....")
    params = {
      ...data,
      currLanguage: langPassed,
      bounds: data.bounds 
    };
}
  // console.log("L108 params : ", params);

  // console.log("L108 params : ", params)
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
      // console.log("entity = ", entity)

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
export function loadSuggestions(searchPhrase, city, language) {
  return axios
    .get(
      `searchPhrases?search=${searchPhrase}&city=${city}&language=${language}`
    )
    .then((res) => {
      return res.data?.items;
    })
    .catch((err) => console.error(err));
}

//loadShareParams will according to a specific shareId return the according tour, date and city where the connections are loaded from - usedCityOfCookie contains whether the original city was used or the current user's city (based on the cookie)
export function loadShareParams(shareId, city) {
  return axios
    .get("shares/" + shareId, {
      params: {
        city: city,
      },
    })
    .then((res) => {
      consoleLog("L252 crudActions --> res.data: ", res.data, true); 
      // city : "amstetten"
      // date : "2024-01-16T23:00:00.000Z"
      // success : true
      // tourId : 2708
      // usedCityOfCookie : true
      return res.data;
    });
}

//generateShareLink generates a new sharing link to the corresponding tour on a specific date, the city is saved to later on always get connections, a shareId will be returned
export function generateShareLink(provider, hashedUrl, date, city) {
  // consoleLog("From inside generateShareLink", null , false)
  // consoleLog("provider :", provider)
  // consoleLog("hashedUrl :", hashedUrl)
  // consoleLog("date :", date)
  // consoleLog("city :", city)
  // consoleLog("=====================================", null , false)
  return axios
    .post("/shares", {
      provider: provider,
      hashedUrl: hashedUrl,
      date: date,
      city: city,
    })
    .then((res) => {
      if(process.env.NODE_ENV !== "production"){
        // console.log("L281 crudActions / generateShareLink res.data :", res.data); // shareId is passed from api
      }
      return res.data;
    })
    .catch((err) => {
      if(process.env.NODE_ENV !== "production"){
        // console.log("L285 crudActions / generateShareLink err.response.data :", err.response);
      }
      return err.response;
    });
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
    // console.log("L311 res.data /crudActions  :", res.data)
    return res.data
  })

}
