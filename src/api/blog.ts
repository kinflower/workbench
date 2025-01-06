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

export function api_insert_blog(data: object) {
    return request({
        url: '/insertBlog',
        method: 'POST',
        data
    })
}

export function api_update_blog(data: object) {
    return request({
        url: '/updateBlog',
        method: 'POST',
        data
    })
}

export function api_remove_blog(data: object) {
    return request({
        url: '/removeBlog',
        method: 'POST',
        data
    })
}