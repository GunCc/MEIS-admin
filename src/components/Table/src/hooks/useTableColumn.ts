import { BasicTableProps } from "./../types/index"
interface useTableColumnContext {
    getProps: ComputedRef<BasicTableProps>
}

export function useTableColumn({ getProps }: useTableColumnContext) {
    const getColumn = computed(() => {
        const { column } = unref(getProps)
        console.log("getColumn",column)
        return column
    })

    function getVialdColumn(): Recordable[] {
        const columns = unref(getColumn)
        if (!columns || columns.length == 0) return []
        return columns.filter(item => item.canViald)
    }

    return {
        getColumn,
        getVialdColumn,
    }
}
