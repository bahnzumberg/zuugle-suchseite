import {LOAD_RANGES, LOAD_RANGES_DONE} from '../actions/types';

const initialState = {
	loading: false,
	saving: false,
	page: 1,
	pageSize: 10,
	total: '',
	orderId: "created_at",
	orderDesc: true,
	ranges: []
}

export default (state = initialState, action = {}) => {
	switch(action.type) {
		case LOAD_RANGES:
			return  {
				...state,
				...action,
				loading: true
			};
		case LOAD_RANGES_DONE:
			return  {
				...state,
				ranges: action.ranges,
				total: action.total,
				loading: false
			};
		default: return state;
	}
}