import axios from "../axios";

export function loadFile(dispatch, getState, typeBefore, typeDone, stateName, data, route, entityName, responseType = "arraybuffer") {
    dispatch({type: typeBefore, ...data});
    const state = getState()[stateName];
    let params = {};
    if (state) {
        params = {
            page: state.page,
            page_size: state.pageSize,
            order_id: state.orderId,
            order_desc: state.orderDesc,
            ...data
        }
    }

    return axios.get(route, {
        data: {},
        responseType: responseType,
        params: params,
        timeout: 2000000,
    }).then(res => {
        dispatch({
            type: typeDone,
        });
        return res;
    })
}

export function loadList(dispatch, getState, typeBefore, typeDone, stateName, data, route, entityName, usePagination = true, useState = true) {
    if(!!useState){
        dispatch({...data, type: typeBefore});
    }
    const state = getState()[stateName];
    let params = {};
    if (state) {
        let pagination = {};
        if(!!usePagination){
            pagination.page = state.page;
            pagination.page_size = state.pageSize;
            pagination.order_id = state.orderId;
            pagination.order_desc = state.orderDesc;
        }
        params = {
            ...pagination,
            ...data
        }
    }

    return axios.get(route, { params: params }).then(res => {
        const entities = res.data[entityName];
        const total = res.data.total;
        const filter = !!res.data.filter ? res.data.filter : null;

        if(!!useState){
            dispatch({
                type: typeDone,
                [entityName]: entities,
                total: total,
                filter: filter,
                page: res.data.page,
                ranges: res.data.ranges
            });
        }

        return res;
    }).catch(err => {
        console.error(err);
        if(!!useState){
            dispatch({
                type: typeDone,
                [entityName]: [],
                total: 0
            });
        }
    })
}

export function loadOne(dispatch, getState, typeBefore, typeDone, id, route, entityName, params = {}) {
    dispatch({type: typeBefore});
    return axios.get(route+id, { params: {...params, domain: window.location.host } }).then(res => {
        const entity = res.data[entityName];

        dispatch({
            type: typeDone,
            [entityName]: entity,
        });
        return res;
    });
}

export function loadOneReturnAll(dispatch, getState, typeBefore, typeDone, id, route) {
    dispatch({type: typeBefore});
    return axios.get(route+id, { params: {domain: window.location.host} }).then(res => {
        dispatch({
            type: typeDone,
            ...!!res && !!res.data ? res.data : {}
        });
        return res;
    });
}