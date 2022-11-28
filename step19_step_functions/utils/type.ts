export interface Response {
    student?: Student,
    success?: Message,
    error?: Message,
}

export interface Student {
    id: number,
    name: string,
    age: number,
    dept: string,
}

export interface Message {
    status_code: number,
    message: string,
}