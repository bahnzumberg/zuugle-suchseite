//The combineReducers function takes an object as its argument, where the keys represent the names of the different slices of the state, and the values are the corresponding reducers that manage those slices of the state. (see also https://redux.js.org/api/combinereducers)
// combineReducers function is imported in index.js and passed as a parameter to createStore function

import { combineReducers } from 'redux';

import modal from './reducers/modal';
import tours from './reducers/tours';
import cities from './reducers/cities';
import regions from './reducers/regions';
import ranges from './reducers/ranges';

// object passed below uses 'shorthand property names' https://ui.dev/shorthand-properties
export default combineReducers({
	modal,
	tours,
	cities,
	regions,
	ranges
});