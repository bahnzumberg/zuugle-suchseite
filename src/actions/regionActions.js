import {
    LOAD_REGIONS, LOAD_REGIONS_DONE,
} from './types';
import {loadList} from "./crudActions";

export function loadRegions(data = {}) {
    return (dispatch, getState) => {
        return loadList(dispatch, getState, LOAD_REGIONS, LOAD_REGIONS_DONE, "regions", data, "regions/", "regions", false);
    };
}