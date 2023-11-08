export interface BaseListRequest {
    page: number
    pageSize: number
    keyword: string
}

export interface GetById {
    id: string | number
}

export interface GetByIds {
    id: string[] | number[]
}
