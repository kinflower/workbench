import request from "./index";


export function api_register(data: object) {
    return request({
        url: '/register',
        method: 'POST',
        data
    })
}

export function api_sendCode(data: object) {
    return request({
        url: '/sendCode',
        method: 'POST',
        data
    })
}

export function api_login(data: object) {
    return request({
        url: '/login',
        method: 'POST',
        data
    })
}

export function api_checkAccount(params: object) {
    return request({
        url: '/checkAccount',
        method: 'GET',
        params
    })
}

export function api_changePassword(data: object) {
    return request({
        url: '/changePassword',
        method: 'POST',
        data
    })
}

export function api_personalInfo() {
    return request({
        url: '/personalInfo',
        method: 'GET'
    })
}

export function api_upload(data: object) {
    return request({
        url: '/upload',
        method: 'POST',
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export function api_updateInfo(data: object) {
    return request({
        url: '/updateInfo',
        method: 'POST',
        data
    })
}