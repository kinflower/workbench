import request from "./index";

export function api_selectMemo() {
    return request({
        url: '/selectMemo',
        method: 'GET'
    })
}

export function api_insertMemo(data: object) {
    return request({
        url: '/insertMemo',
        method: 'POST',
        data
    })
}

export function api_updateMemo(data: object) {
    return request({
        url: '/updateMemo',
        method: 'POST',
        data
    })
}

export function api_removeMemo(data: object) {
    return request({
        url: '/removeMemo',
        method: 'POST',
        data
    })
}

export function api_searchMemo(params: object) {
    return request({
        url: '/searchMemo',
        method: 'GET',
        params
    })
}