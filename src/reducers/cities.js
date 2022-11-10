import {
	LOAD_ALL_CITIES,
	LOAD_ALL_CITIES_DONE, LOAD_CITIES, LOAD_CITIES_DONE,
} from '../actions/types';

const initialState = {
	loading: false,
	saving: false,
	total: 0,
	cities: [],
	all_cities: []
}

export default (state = initialState, action = {}) => {
	switch(action.type) {
		case LOAD_CITIES:
			return  {
				...state,
				...action,
				loading: true
			};
		case LOAD_CITIES_DONE:
			return  {
				...state,
				cities: action.cities,
				total: action.total,
				loading: false
			};
		case LOAD_ALL_CITIES:
			return  {
				...state,
				...action,
				loading: true
			};
		case LOAD_ALL_CITIES_DONE:
			return  {
				...state,
				all_cities: action.cities,
				loading: false
			};
		default: return state;
	}
}