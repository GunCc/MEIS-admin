import { BasicTableProps } from "./index"

export type ResgiterFn = (tableInstance: TableActions) => void

export type UseRegisterContext = [ResgiterFn, TableActions]

export interface TableActions {
    setProps: (props: Partial<BasicTableProps>) => void
    // 获取可以被编辑的col
    getVialdColumn: () => Recordable[]
    // 重新加载
    reload: () => Promise<any>
    // 返回表格数据
    getTableDataSource: () => Recordable[]
    // 返回获取表格数据对象
    getTableRawDataSource: () => Recordable
}
