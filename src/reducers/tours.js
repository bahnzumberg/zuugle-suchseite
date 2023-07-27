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
	LOAD_TOUR_PDF,
	LOAD_TOUR_PDF_DONE,
	LOAD_TOURS,
	LOAD_TOURS_DONE,
	SET_SELECTED_DATE,
	LOAD_MAP_FILTERS
} from '../actions/types';
// import {useStateManager} from "react-select";

const initialState = {
	loading: false,
	saving: false,
	page: 1,
	pageSize: 10,
	total: '',
	orderId: "created_at",
	orderDesc: true,
	tours: [],
	favouriteTours: [],
	filter: null,
	selectedDate: null,
	isPdfLoading: false,
	total_tours: 3000,
	favouriteRanges: [],
	isLoadingFilter: false,
	total_provider: ' ',
	visibleToursGPX: []
}

export default (state = initialState, action = {}) => {
	switch(action.type) {
		case LOAD_TOURS:
			return  {
				...state,
				...action,
				loading: true
			};
		case LOAD_TOURS_DONE:
			let tours = [...state.tours];
			if(!!action.page && action.page > 1){
				tours.push(...action.tours);
			} else {
				tours = [...action.tours];
			}

			let toPush = {
				...state,
				tours: tours,
				total: action.total,
				loading: false,
				page: action.page,
			}

			/*if(!!action.filter){
				toPush.filter = action.filter;
			}*/

			return  {
				...toPush
			};
		case LOAD_TOUR:
			return  {
				...state,
				//loading: true,
				tour: null
			};

		case LOAD_TOUR_DONE:
			return  {
				...state,
				//loading: false,
				tour: action.tour,
			};
		case LOAD_FAVOURITE_TOURS:
			return  {
				...state,
				...action,
				loading: true
			};
		case LOAD_FAVOURITE_TOURS_DONE:
			return  {
				...state,
				favouriteTours: action.tours,
				favouriteRanges: action.ranges,
				loading: false,
			};
		case SET_SELECTED_DATE:
			return {
				...state,
				selectedDate: action.date
			}
		case LOAD_TOUR_PDF:
			return {
				...state,
				isPdfLoading: true
			}
		case LOAD_TOUR_PDF_DONE:
			return {
				...state,
				isPdfLoading: false
			}
		case LOAD_TOTAL_TOURS:
			return {
				...state,
			}
		case LOAD_TOTAL_TOURS_DONE:
			return {
				...state,
				total_tours: action.total_tours,
				total_connections: action.total_connections,
				total_ranges: action.total_ranges,
				total_cities: action.total_cities,
				total_provider: action.total_provider
			}
		case LOAD_TOUR_GPX:
			return {
				...state,
				isGpxLoading: true
			}
		case LOAD_TOUR_GPX_DONE:
			return {
				...state,
				isGpxLoading: false
			}
		case LOAD_TOUR_FILTER:
			return {
				...state,
				isLoadingFilter: true
			}
		case LOAD_TOUR_FILTER_DONE:
			return {
				...state,
				filter: action.filter,
				isLoadingFilter: false
			}
		case CLEAR_TOURS:
			return {
				...state,
				tours: [],
				total: 0
			}
		case LOAD_MAP_FILTERS:
			return {
				...state,
				visibleToursGPX: action.visibleToursGPX
			}
		default: return state;
	}
}