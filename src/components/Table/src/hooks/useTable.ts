import { BasicTableProps } from "../types"
import { TableActions, UseRegisterContext } from "../types/actions"
import { Nullable } from "vitest"
import { WatchStopHandle } from "vue"

export function useTable(props?: BasicTableProps): UseRegisterContext {
    const tableRef = ref<Nullable<TableActions>>(null)
    let stopWatch: WatchStopHandle

    function getTableEl() {
        if (!tableRef) return
        return unref(tableRef)
    }

    function register(tableInstance: TableActions) {
        tableRef.value = tableInstance
        stopWatch?.()
        stopWatch = watch(
            () => props,
            () => {
                props && getTableEl()?.setProps(props)
            },
            {
                immediate: true,
                deep: true,
            }
        )
    }

    const actions: TableActions = {
        setProps(props: Partial<BasicTableProps>) {
            getTableEl()?.setProps(props)
        },
        getVialdColumn(): Recordable[] {
            return getTableEl()?.getVialdColumn() || []
        },
    }

    return [register, actions]
}
