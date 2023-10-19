export interface BasicTableProps {
    // 表格名称
    title: string
    // 请求路径
    api?: (...arg: any) => Promise<any>
    // 是否立即请求
    immediate?: boolean
    // 在请求前做点什么
    beforeFetch?: Fn
}
