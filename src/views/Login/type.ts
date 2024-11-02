export interface FormData {
    email: string,
    password: string
}
export interface Show {
    email: boolean,
    password: boolean,
    [key: string]: boolean
}