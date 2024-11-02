export interface FormData {
    email: string,
    password: string,
    code: string
}
export interface Show {
    email: boolean,
    password: boolean,
    code: boolean,
    [key: string]: boolean
}