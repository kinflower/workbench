import request from "./index";

export function api_selectalltodo() {
    return request({
        url: '/selectalltodo',
        method: 'GET'
    })
}

export function api_inserttodo(data: object) {
    return request({
        url: '/inserttodo',
        method: 'POST',
        data
    })
}

export function api_updatetodo(data: object) {
    return request({
        url: '/updatetodo',
        method: 'POST',
        data
    })
}

export function api_deletetodo(params: object) {
    return request({
        url: '/deletetodo',
        method: 'GET',
        params
    })
}

export function api_searchtodo(params: object) {
    return request({
        url: '/searchtodo',
        method: 'GET',
        params
    })
}