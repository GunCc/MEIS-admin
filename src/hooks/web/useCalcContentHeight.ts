import { Nullable } from "vitest"
import { getViewportOffset } from "@/utils/domUtils"
import { onMountedOrActivated } from "./../core/onMountedOrActivated"
import { useWindowSize } from "@/hooks/event/useWindowSizeFn"

// 计算页面剩余高度
export function useCalcContentHeight(anchorRef: Ref) {
    const contentHeight: Ref<Nullable<number>> = ref(null)

    // 重新计算高度
    function redoHeight() {
        nextTick(() => {
            calcContentHeight()
        })
    }

    function getEl(element: any): Nullable<HTMLDivElement> {
        if (element == null) {
            return null
        }
        return (
            element instanceof HTMLDivElement ? element : element.$el
        ) as HTMLDivElement
    }

    async function calcContentHeight() {
        // 等待页面渲染完毕
        await nextTick()
        const anchorEl = getEl(unref(anchorRef))
        if (!anchorEl) {
            return
        }
        const { bottomIncludeBody } = getViewportOffset(anchorEl)

        let height = bottomIncludeBody
        contentHeight.value = height
    }

    onMountedOrActivated(() => {
        nextTick(() => {
            calcContentHeight()
        })
    })
    useWindowSize(
        () => {
            calcContentHeight()
        },
        50,
        { immediate: true }
    )
    //   watch(
    //     () => [layoutFooterHeightRef.value],
    //     () => {
    //       calcContentHeight();
    //     },
    //     {
    //       flush: 'post',
    //       immediate: true,
    //     },
    //   );
    return {
        redoHeight,
        contentHeight,
    }
}
