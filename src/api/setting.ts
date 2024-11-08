import request from "./index";

export function api_insertSetting(data: object) {
    return request({
        url: '/insertSetting',
        method: 'POST',
        data
    })
}

export function api_selectSetting(params: object) {
    return request({
        url: '/selectSetting',
        method: 'GET',
        params
    })
}

export function api_updateSetting(data: object) {
    return request({
        url: '/updateSetting',
        method: 'POST',
        data
    })
}

export function api_selectApp() {
    return request({
        url: '/selectApp',
        method: 'GET'
    })
}

export function api_insertApp(data: object) {
    return request({
        url: '/insertApp',
        method: 'POST',
        data
    })
}

export function api_updateApp(data: object) {
    return request({
        url: '/updateApp',
        method: 'POST',
        data
    })
}

export function api_removeApp(data: object) {
    return request({
        url: '/removeApp',
        method: 'POST',
        data
    })
}