export interface Setting {
    imgUrl: string,
    fontSize: null | string,
    fontColor: null | string,
    radius: null | string,
    size: null | string,
    column: null | string
}
export interface AppForm {
    id?: string,
    appName: string,
    url: string,
    imgUrl: string,
    type: string,
    uploadType: string
}
export interface BlogForm {
    id?: string,
    title: string,
    src: string,
    time: string,
    type: string
}