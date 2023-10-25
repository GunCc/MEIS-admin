import { PaginationProps, TableColumnCtx } from "element-plus"
import { TableColumn } from "element-plus/es/components/table/src/table-column/defaults"

export interface BasicTableProps {
    // 表格名称
    title: string
    // 表格列头管理
    column?: ColumnProps[]
    // 请求路径
    api?: (...arg: any) => Promise<any>
    // 是否立即请求
    immediate?: boolean
    // 在请求前做点什么
    beforeFetch?: Fn
    // 请求后
    afterFetch?: Fn
    // 分页配置
    paginationSetting?: PaginationSetting
    // 请求设置
    fetchSetting?: Partial<FetchSetting>
}

interface PaginationSetting extends PaginationProps {}

interface FetchSetting {
    // 请求接口当前页数
    pageField: string
    // 每页显示多少条
    sizeField: string
    // 请求结果列表字段  支持 a.b.c
    listField: string
    // 请求结果总数字段  支持 a.b.c
    totalField: string
}

interface ColumnProps extends Partial<TableColumnCtx<Recordable>> {
    // 是否可以获取字段 用于编辑和添加
    canViald?: boolean
}
