export interface GetEmailCode {
    to_mail: string
}

export interface Register {
    nickname: string
    password: string
    email: string
    role_id: number
    code: string
}
