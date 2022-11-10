import {
	LOAD_REGIONS, LOAD_REGIONS_DONE,
} from '../actions/types';

const initialState = {
	loading: false,
	saving: false,
	page: 1,
	pageSize: 10,
	total: '',
	orderId: "created_at",
	orderDesc: true,
	regions: {}
}

export default (state = initialState, action = {}) => {
	switch(action.type) {
		case LOAD_REGIONS:
			return  {
				...state,
				...action,
				loading: true
			};
		case LOAD_REGIONS_DONE:
			return  {
				...state,
				regions: action.regions,
				total: action.total,
				loading: false
			};
		default: return state;
	}
}