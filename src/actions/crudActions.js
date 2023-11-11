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
    let res = await axios.get(route, {
      data: {},
      // data: data,
      responseType: responseType,
      params: params,
      timeout: 60000,
      headers: {
        Authorization: "FV69pR5PQQLcQ4wuMtTSqKqyYqf5XEK4",
      },
    });

    dispatch({
      type: typeDone,
    });

    //clgs
    // console.log("L34 crudActions /getFileFromServer res :", res)
    // console.log("L39 crudActions /getFileFromServer res.request.responseURL :", res.request.responseURL)
    return res;
  } catch (error) {
    console.log(" error :, L39", error.message);
    throw error;
  }
}

export function loadList(
  dispatch,
  getState,
  typeBefore,
  typeDone,
  stateName,
  data,
  route,
  entityName,
  usePagination = true,
  useState = true,
  language
) {
  //clg
  // console.log(`dispatch: packageFcn, getState: packageFcn, typeBefore: ${typeBefore}, typeDone:${typeDone}, stateName: ${stateName}, data: ${JSON.stringify(data)}, route: ${route}, entityName: ${entityName}, usePagination: ${usePagination},useState: ${useState}, language: ${language}`);
  //dispatch: packageFcn, getState: packageFcn, typeBefore: LOAD_TOUR_CONNECTIONS, typeDone:LOAD_TOUR_CONNECTIONS_DONE, stateName: tours, data: {"id":30296,"city":"graz","domain":"localhost:3000"}, route: tours/30296/connections, entityName: connections, usePagination: false,useState: true, language: en

  // language && console.log("language: " + language)
  //language && console.log("loadList / data: " + JSON.stringify(data));
  // console.log("Type is LOAD_TOURS ? : ", typeBefore == 'LOAD_TOURS')
  // console.log("Type is LOAD_TOUR_CONNECTIONS ? : ", typeBefore == 'LOAD_TOUR_CONNECTIONS')
  // initialize language param
  const langPassed =
    language &&
    (typeBefore == "LOAD_TOURS" || typeBefore == "LOAD_TOUR_CONNECTIONS")
      ? language
      : "de";

  // langPassed && console.log("passed language : " + langPassed)

  if (!!useState) {
    dispatch({ ...data, type: typeBefore });
  }
  const state = getState()[stateName];
  //console.log("L91 crudActions / state :", state); // object with 31 properties (including tours and filter)
  //console.log("L91 crudActions / stateName :", stateName); // 'tours'
  let params = {};
  if (state) {
    let pagination = {};
    if (!!usePagination) {
      pagination.page = state.page;
      pagination.page_size = state.pageSize;
      pagination.order_id = state.orderId;
      pagination.order_desc = state.orderDesc;
    }
    //console.log(" L101 data: inside if(state) : ", state.filter); //  filter is passed
    // now pass the filter
    // data = {...data, filter: filter}
    params = {
      ...pagination,
      ...data,
      currLanguage: langPassed,
      // filter: state.filter,
    };
  }

  // console.log("wichtiiiig", route, { params: params });
  return axios
    .get(route, { params: params })
    .then((res) => {
      const entities = res.data[entityName];
      //console.log(" L112 entityName :",entityName); // "connections"
      // console.log(" L113 entities :",entities) // (7) [{…}, {…}, {…}, {…}, {…}, {…}, {…}]
      // console.log(" L114 crudActions / res.data :",res.data) 
      //connections:(7) [{…}, {…}, {…}, {…}, {…}, {…}, {…}] returns : (5) [{…}, {…}, {…}, {…}, {…}] success : true
      const total = res.data.total;
      // total && total.length && console.log("total length: ", total.length);
      const filter = !!res.data.filter ? res.data.filter : null;
      //console.log(" L118: filter: ", filter) // null
      if (!!useState) {
        dispatch({
          type: typeDone,
          [entityName]: entities,
          total: total,
          filter: filter,
          page: res.data.page,
          ranges: res.data.ranges,
        });
      }
      //console.log("crudActions : response ", res); // issue #9 API

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
    .get(route + id, { params: { ...params, domain: window.location.host } })
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
      // console.log(res);
      return res.data;
    });
}

//generateShareLink is used to generate a new sharing link to the corresponding tour on a specific date, the city is saved to later on always get connections, a shareId will be returned
export function generateShareLink(provider, hashedUrl, date, city) {
  console.log("From generateShareLink :")
  return axios
    .post("/shares", {
      provider: provider,
      hashedUrl: hashedUrl,
      date: date,
      city: city,
    })
    .then((res) => {
      console.log("L281 crudActions / generateShareLink res.data :", res.data);
      return res.data;
    })
    .catch((err) => {
      console.log("L285 crudActions / generateShareLink err.response.data :", err.response.data);
      return err.response.data;
    });
}

//
export const getTotalCityTours = (city) => {
  // return axios.get(`tours/total/?city=${city}`, {
  return axios
    .get(`tours/total/`, {
      params: {
        city: city,
      },
    })
    .then((res) => {
      // console.log("L225 res :");
      // console.log(res);
      return res.data;
    });
};
