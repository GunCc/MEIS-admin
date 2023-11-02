import { Nullable } from "vitest"
import { TableActionInstance, useTableActionContext } from "../types"

export function useTableAction(): useTableActionContext {
    const tableActionInstance = ref<Nullable<TableActionInstance>>(null)
    function register(instance: TableActionInstance) {
        tableActionInstance.value = instance
    }
    function getInstance() {
        const instance = unref(tableActionInstance)
        if (!instance) {
            console.error("没有实例化！！")
            return
        }
        return instance
    }
    const actions: TableActionInstance = {
        setEditModalProps(props: Recordable) {
            getInstance()?.setEditModalProps(props)
        },
        handleSetVisible(flag?: boolean) {
            getInstance()?.handleSetVisible(flag)
        },
    }
    return [register, actions]
}
