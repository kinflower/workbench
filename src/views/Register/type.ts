export interface FormData {
    email: string,
    password: string,
    tmp_password: string,
    code: string
}
export interface Show {
    email: boolean,
    password: boolean,
    tmp_password: boolean,
    code: boolean,
    [key: string]: boolean
}