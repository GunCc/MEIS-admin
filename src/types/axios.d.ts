// 结果接口
declare interface Result<T = any> {
    message: string
    code: number
    data: T
}
