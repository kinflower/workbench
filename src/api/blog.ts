import request from "./index";

export function api_select_all_pic() {
    return request({
        url: '/selectAllPic',
        method: 'GET'
    })
}

export function api_select_pic(params: object) {
    return request({
        url: '/selectPic',
        method: 'GET',
        params
    })
}

export function api_select_page_pic(params: object) {
    return request({
        url: '/selectPagePic',
        method: 'GET',
        params
    })
}