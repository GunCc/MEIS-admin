import { BasicTableProps } from "../types"
import { Nullable } from "vitest"
import { onMountedOrActivated } from "@/hooks/core/onMountedOrActivated"
import { useWindowSize } from "@/hooks/event/useWindowSizeFn"
import { calcSubtractSpace, getViewportOffset } from "@/utils/domUtils"
import { nextTick } from "vue"

interface useTableScrollContext {
    getProps: ComputedRef<BasicTableProps>
    tableElRef: Ref
    formElRef: Ref<ComponentRef>
}

export function useTableScroll({
    getProps,
    tableElRef,
    formElRef,
}: useTableScrollContext) {
    // 表格高度
    const tableHeightRef: Ref<Nullable<number | string>> = ref(167)

    function setHeight(height: number) {
        tableHeightRef.value = height
    }

    let headerEl: HTMLElement | null
    let footerEl: HTMLElement | null
    async function calcTableHeight() {
        const { autoHeight } = unref(getProps)

        if (!autoHeight) {
            stop()
            return
        }

        await nextTick()

        const table = unref(tableElRef)
        if (!table) return

        if (!headerEl) {
            headerEl = table.querySelector(".table-title") as HTMLElement
        }

        if (!footerEl) {
            footerEl = table.querySelector(".table-footer") as HTMLElement
        }

        const { showSearchForm, showPagination } = unref(getProps)
        let formHeight = 0
        if (showSearchForm) {
            formHeight = unref(formElRef)?.$el.offsetHeight || 0
        }
        let headerHeight = headerEl.offsetHeight
        let footerHeight = footerEl.offsetHeight
        if (!showPagination) footerHeight = 0
        const { bottomIncludeBody } = getViewportOffset(table)
        const tableSubtractSpace = calcSubtractSpace(table)

        let height =
            bottomIncludeBody -
            headerHeight -
            footerHeight -
            formHeight -
            tableSubtractSpace
        setHeight(height)
    }

    // 重新计算
    function redoHeight() {
        nextTick(() => {
            calcTableHeight()
        })
    }

    // 计算表格可用高度
    const getTableHeight = computed(() => {
        return `${unref(tableHeightRef)}px`
    })

    const [stop] = useWindowSize(calcTableHeight, 280)
    onMountedOrActivated(() => {
        calcTableHeight()
    })

    return {
        redoHeight,
        getTableHeight,
    }
}
