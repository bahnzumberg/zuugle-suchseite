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

// Description of code above:
// This code defines the cities reducer that manages the state related to cities in the application. A Redux reducer is a function that takes the current state and an action as arguments and returns a new state based on the action.

// The code starts by importing the action type constants related to cities from a separate module. Then, it defines the initial state of the cities state, which includes fields such as loading, saving, total, cities, and all_cities.

// The switch statement in the export default function handles different types of actions related to cities. The switch statement takes the action's type property as an argument and compares it with the imported action type constants. Depending on the type of action, the function returns a new state object that reflects the changes to the cities state.

// For example, if the action type is LOAD_CITIES, the function returns a new state object with loading set to true, indicating that cities are being loaded. If the action type is LOAD_CITIES_DONE, the function returns a new state object with cities set to the action's cities property, total set to the action's total property, and loading set to false, indicating that the cities have been successfully loaded.

// Because state in Redux is immutable, the ...state and ...action spread operator syntax is used to copy the properties of the current state and action objects into the new state object, respectively. The default case in the switch statement returns the current state if the action type is not matched, which is important to avoid modifying the state in an unintended way.
