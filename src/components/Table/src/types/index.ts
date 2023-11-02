import { BasicFormProps } from "@/components/Form/src/types/form"
import { PaginationProps, TableColumnCtx } from "element-plus"

export interface BasicTableProps {
    // 表格名称
    title?: string
    // 表格样式
    tableClass?: Recordable | string
    // 表格列头管理
    column?: ColumnProps[]
    // 是否响应式表格高度
    autoHeight?: boolean
    // 是否显示阴影
    showShadow?: boolean
    // 表格搜索管理
    formSettings?: BasicFormProps
    // 是否显示form表单
    showSearchForm?: boolean
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
    // 是否使用分页功能
    showPagination?: boolean
    // 请求设置
    fetchSetting?: Partial<FetchSetting>
}

export interface PaginationSetting extends PaginationProps {}

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

export interface FetchParams {
    searchInfo?: Recordable
    page?: number
}
