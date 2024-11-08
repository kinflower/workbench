export interface Setting {
    imgUrl: string,
    fontSize: null | string,
    fontColor: null | string,
    radius: null | string
}
export interface AppForm {
    id?: string,
    appName: string,
    url: string,
    imgUrl: string,
    type: string,
    uploadType: string,
    chose: boolean
}