type RegisterFn = (instance: TableActionInstance) => void

export type useTableActionContext = [RegisterFn, TableActionInstance]

export interface TableActionInstance {
    // 修改编辑modal配置
    setEditModalProps: (props: Recordable) => void
    // 打开modal
    handleSetVisible: (flag?: boolean) => void
}
