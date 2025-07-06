import {
  CLEAR_TOURS,
  LOAD_FAVOURITE_TOURS,
  LOAD_FAVOURITE_TOURS_DONE,
  LOAD_TOTAL_TOURS,
  LOAD_TOTAL_TOURS_DONE,
  LOAD_TOUR,
  LOAD_TOUR_DONE,
  LOAD_TOUR_FILTER,
  LOAD_TOUR_FILTER_DONE,
  LOAD_TOUR_GPX,
  LOAD_TOUR_GPX_DONE,
  LOAD_TOURS,
  LOAD_TOURS_DONE,
  SET_SELECTED_DATE,
  LOAD_MAP_FILTERS,
  NO_DATA_AVAILABLE,
  LOAD_DATA_ERROR,
  NO_TOURS_AVAILABLE,
  SET_TOUR_ID,
} from "../actions/types";

const initialState = {
  loading: false,
  saving: false,
  page: 1,
  pageSize: 100,
  total: "",
  orderId: "created_at",
  orderDesc: true,
  tours: [],
  favouriteTours: [],
  filter: null,
  selectedDate: null,
  total_tours: 0,
  favouriteRanges: [],
  isLoadingFilter: false,
  total_provider: 0,
  total_cities: 0,
  total_ranges: 0,
  total_connections: 0,
  visibleToursGPX: [],
  noToursAvailable: null,
  markers: [],
  selectedTourID: null,
};

// Keep comment below for Eslint purposes
// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action = {}) => {
  switch (action.type) {
    case LOAD_TOURS:
      return {
        ...state,
        ...action,
        loading: true,
      };
    case LOAD_TOURS_DONE:
      let tours = [...state.tours];
      if (!!action.page && action.page > 1) {
        tours.push(...action.tours);
      } else {
        tours = [...action.tours];
      }

      const markers = action?.markers || [];

      let toPush = {
        ...state,
        tours: tours,
        total: action.total,
        loading: false,
        page: action.page,
        markers: markers,
      };

      return {
        ...toPush,
      };
    case LOAD_TOUR:
      return {
        ...state,
        //loading: true,
        tour: null,
      };

    case LOAD_TOUR_DONE:
      return {
        ...state,
        //loading: false,
        tour: action.tour,
      };
    case LOAD_FAVOURITE_TOURS:
      return {
        ...state,
        ...action,
        loading: true,
      };
    case LOAD_FAVOURITE_TOURS_DONE:
      return {
        ...state,
        favouriteTours: action.tours,
        favouriteRanges: action.ranges,
        loading: false,
      };
    case SET_SELECTED_DATE:
      return {
        ...state,
        selectedDate: action.date,
      };
    case LOAD_TOTAL_TOURS:
      return {
        ...state,
      };
    case LOAD_TOTAL_TOURS_DONE:
      return {
        ...state,
        total_tours: action.total_tours,
        total_connections: action.total_connections,
        total_ranges: action.total_ranges,
        total_cities: action.total_cities,
        total_provider: action.total_provider,
        noToursAvailable: action.total_tours === 0 ? true : false,
      };
    case LOAD_TOUR_GPX:
      return {
        ...state,
        isGpxLoading: true,
      };
    case LOAD_TOUR_GPX_DONE:
      return {
        ...state,
        isGpxLoading: false,
      };
    case LOAD_TOUR_FILTER:
      return {
        ...state,
        isLoadingFilter: true,
      };
    case LOAD_TOUR_FILTER_DONE:
      return {
        ...state,
        filter: action.filter,
        isLoadingFilter: false,
      };
    case CLEAR_TOURS:
      return {
        ...state,
        tours: [],
        total: 0,
      };
    case LOAD_MAP_FILTERS:
      return {
        ...state,
        visibleToursGPX: action.visibleToursGPX,
      };
    // cases when NO DATA AVAILABLE or LOAD DATA ERROR
    case NO_DATA_AVAILABLE:
      return {
        ...state,
        noDataAvailable: true, // set a flag to indicate no data
      };

    // cases when NO TOURS AVAILABLE or LOAD DATA ERROR
    case NO_TOURS_AVAILABLE:
      return {
        ...state,
        noToursAvailable: true, // set a flag to indicate no data
      };

    case LOAD_DATA_ERROR:
      return {
        ...state,
        error: action.error, // Store the error message for display
      };
    default:
      return state;

    case SET_TOUR_ID:
      return {
        ...state,
        selectedTourID: action.payload, // Update the state with the new tour ID
      };
  }
};
