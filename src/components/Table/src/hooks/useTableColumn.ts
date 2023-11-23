import { BasicTableProps } from "./../types/index"
import { cloneDeep } from "lodash"
interface useTableColumnContext {
    getProps: ComputedRef<BasicTableProps>
}

export function useTableColumn({ getProps }: useTableColumnContext) {
    const getColumn = computed(() => {
        const { column = [] } = unref(getProps)
        return column.map(item => {
            const { columnToForm = {} } = item
            return {
                ...item,
                ...columnToForm,
            }
        })
    })

    const getColumnView = computed(() => {
        const { column = [] } = unref(getProps)
        const columnView = cloneDeep(column)
        return columnView.map(item => {
            // 处理嵌套字符
            if (item.prop?.indexOf(".") != -1 && item.isTransitionToDelimiter) {
                let delimiter = item.delimiterByte ?? "_"
                item.prop = item.prop?.replace(/\./g, delimiter)
            }
            return {
                ...item,
            }
        })
    })

    function getVialdColumn(): Recordable[] {
        const columns = unref(getColumn)
        if (!columns || columns.length == 0) return []
        return columns.filter(item => item.canViald)
    }

    return {
        getColumn,
        getColumnView,
        getVialdColumn,
    }
}
