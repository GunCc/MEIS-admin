// 结果接口
export interface Result<T = any> {
    message: string
    code: number
    data: T
}
