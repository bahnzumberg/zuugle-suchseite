import axios from "../axios";

export function loadGPX(url, responseType = "buffer") {
    return (dispatch, getState) => {
        return axios.get(url, {
            data: {},
            timeout: 60000,
        }).then(res => {
            return res;
        })
    };

}

