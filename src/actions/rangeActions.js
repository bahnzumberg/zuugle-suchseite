import {LOAD_RANGES, LOAD_RANGES_DONE
} from './types';
import {loadList} from "./crudActions";

export function loadRanges(data = {}) {
    return (dispatch, getState) => {
        data.domain = window.location.host;
        return loadList(dispatch, getState, LOAD_RANGES, LOAD_RANGES_DONE, "ranges", data, "ranges/", "ranges", false);
    };
}