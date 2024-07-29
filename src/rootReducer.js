import { combineReducers } from 'redux';

import modal from './reducers/modal';
import tours from './reducers/tours';
import cities from './reducers/cities';
import ranges from './reducers/ranges';


export default combineReducers({
	modal,
	tours,
	cities,
	ranges
});