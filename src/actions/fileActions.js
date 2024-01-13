import axios from "../axios";

export function loadGPX(url, responseType = "buffer") {
    return (dispatch, getState) => {
        return axios.get(url, {
            data: {},
            timeout: 60000,
            responseType: responseType,
        }).then(res => {
            return res;
        })
    };

}

