export interface BaseListRequest {
    page: number
    pagesize: number
    keyword: string
}

export interface GetById {
    id: string | number
}

export interface GetByIds {
    id: string[] | number[]
}
