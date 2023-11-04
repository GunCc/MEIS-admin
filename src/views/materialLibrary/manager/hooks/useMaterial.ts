import { nextTick } from "vue"
import { calcSubtractSpace, getViewportOffset } from "@/utils/domUtils"
import { useWindowSize } from "@/hooks/event/useWindowSizeFn"
import { onMountedOrActivated } from "@/hooks/core/onMountedOrActivated"
export function useMaterial(wrapperElRef: Ref, formElRef: Ref<ComponentRef>) {
    const wrapHeight = ref<string | number>(0)

    let paginationEl: HTMLElement | null
    let headerEl: HTMLElement | null

    const getWrapHeight = computed(() => {
        return `${unref(wrapHeight)}px`
    })

    async function calcMeterialListHeight() {
        await nextTick()

        const wrap = unref(wrapperElRef)
        if (!wrap) return

        if (!paginationEl) {
            paginationEl = wrap.querySelector(".meis-pagination") as HTMLElement
        }

        if (!headerEl) {
            headerEl = wrap.querySelector(".material-header") as HTMLElement
        }

        let formHeight = unref(formElRef)?.$el.offsetHeight || 0

        const { bottomIncludeBody } = getViewportOffset(wrap)
        const wrapSubtractSpace = calcSubtractSpace(wrap)
        let paginationHeight = paginationEl.offsetHeight || 0
        let headerHeight = headerEl.offsetHeight || 0

        let height =
            bottomIncludeBody -
            formHeight -
            wrapSubtractSpace -
            paginationHeight -
            headerHeight
        wrapHeight.value = height

    }

    useWindowSize(calcMeterialListHeight, 280)
    onMountedOrActivated(() => {
        calcMeterialListHeight()
    })

    return {
        getWrapHeight,
    }
}
