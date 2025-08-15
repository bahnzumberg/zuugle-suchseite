//The exported constants are used as action types in the calls of corresponding reducers and actions files.
// By using string constants for action types, you ensure that the action types are consistent throughout the application, and you can also catch type errors at compile time instead of runtime. This can make the code easier to maintain and debug.

export const LOAD_TOURS = "LOAD_TOURS";
export const LOAD_TOURS_DONE = "LOAD_TOURS_DONE";
export const LOAD_TOUR = "LOAD_TOUR";
export const LOAD_TOUR_DONE = "LOAD_TOUR_DONE";
export const LOAD_TOUR_CONNECTIONS = "LOAD_TOUR_CONNECTIONS";
export const LOAD_TOUR_CONNECTIONS_DONE = "LOAD_TOUR_CONNECTIONS_DONE";
export const LOAD_TOUR_CONNECTIONS_EXTENDED = "LOAD_TOUR_CONNECTIONS_EXTENDED";
export const LOAD_TOUR_CONNECTIONS_EXTENDED_DONE =
  "LOAD_TOUR_CONNECTIONS_EXTENDED_DONE";
export const LOAD_FAVOURITE_TOURS = "LOAD_FAVOURITE_TOURS";
export const LOAD_FAVOURITE_TOURS_DONE = "LOAD_FAVOURITE_TOURS_DONE";
export const SET_SELECTED_DATE = "SET_SELECTED_DATE";

export const CLEAR_TOURS = "CLEAR_TOURS";

export const LOAD_TOUR_FILTER = "LOAD_TOUR_FILTER";
export const LOAD_TOUR_FILTER_DONE = "LOAD_TOUR_FILTER_DONE";

export const LOAD_TOUR_GPX = "LOAD_TOUR_GPX";
export const LOAD_TOUR_GPX_DONE = "LOAD_TOUR_GPX_DONE";

// export const LOAD_MAP_FILTERS = 'LOAD_MAP_FILTER';
export const LOAD_MAP_FILTERS = "LOAD_MAP_FILTERS";

export const NO_TOURS_AVAILABLE = "NO_TOURS_AVAILABLE";
export const NO_DATA_AVAILABLE = "NO_DATA_AVAILABLE";
export const LOAD_DATA_ERROR = "LOAD_DATA_ERROR";

export const SET_TOUR_ID = "SET_TOUR_ID";
