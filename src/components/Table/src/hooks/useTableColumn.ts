import { BasicTableProps } from "./../types/index"
interface useTableColumnContext {
    getProps: ComputedRef<BasicTableProps>
}

export function useTableColumn({ getProps }: useTableColumnContext) {
    const getColumn = computed(() => {
        const { column } = unref(getProps)
        return column
    })

    return {
        getColumn,
    }
}
