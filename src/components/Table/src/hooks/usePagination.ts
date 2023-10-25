import { BasicTableProps } from "./../types/index"
import { isBoolean } from "lodash"
interface usePaginationContext {
    getProps: ComputedRef<BasicTableProps>
}
export function usePagination({ getProps }: usePaginationContext) {
    const getPaginationProps = computed(() => {
        return {
            layout: "->,prev, pager, next, jumper,  total",
        }
    })

    const getPaginationIsShow = computed(() => {
        const { paginationSetting } = unref(getProps)
        return !isBoolean(paginationSetting)
    })

    return {
        getPaginationIsShow,
        getPaginationProps,
    }
}
