import { BasicTableProps, PaginationSetting } from "./../types/index"
import { isBoolean } from "lodash"
import { PAGE_SIZE } from "../const"
interface usePaginationContext {
    getProps: ComputedRef<BasicTableProps>
}
export function usePagination({ getProps }: usePaginationContext) {
    const confRef = ref<Partial<PaginationSetting>>()

    const getPaginationProps = computed(() => {
        const { paginationSetting } = unref(getProps)
        return {
            currentPage: 1,
            pageSize: PAGE_SIZE,
            layout: "->,prev, pager, next, total",
            ...paginationSetting,
            ...unref(confRef),
        } as PaginationSetting
    })

    const getPaginationIsShow = computed(() => {
        const { paginationSetting } = unref(getProps)
        return !isBoolean(paginationSetting)
    })

    function getPagination() {
        return unref(getPaginationProps)
    }
    function setPagination(info: Partial<PaginationSetting>) {
        confRef.value = {
            ...getPagination(),
            ...info,
        }
    }

    return {
        setPagination,
        getPaginationIsShow,
        getPaginationProps,
    }
}
