import { Nullable } from "vitest"
import { calcSubtractSpace, getViewportOffset } from "@/utils/domUtils"
import { onMountedOrActivated } from "./../core/onMountedOrActivated"
import { useWindowSize } from "@/hooks/event/useWindowSizeFn"
import { isArray } from "lodash"

/**
 * @param anchorRef 锚点组件 Ref<ElRef | ComponentRef>
 * @param subtractHeightRefs 待减去高度的组件列表 Ref<ElRef | ComponentRef>
 * @param substractSpaceRefs 待减去空闲空间(margins/paddings)的组件列表 Ref<ElRef | ComponentRef>
 * @returns 响应式高度
 */
export function useCalcContentHeight(
    anchorRef: Ref,
    subtractHeightRefs?: Ref[],
    substractSpaceRefs?: Ref[]
) {
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

        // 增加待减去的组件高度
        let substractHeight = 0
        if (isArray(subtractHeightRefs) && subtractHeightRefs.length != 0) {
            subtractHeightRefs.forEach(item => {
                substractHeight += getEl(unref(item))?.offsetHeight ?? 0
            })
        }
        // 增加待减去的组件margin和padding
        let substractSpaceHeight = calcSubtractSpace(anchorEl) ?? 0
        if (isArray(substractSpaceRefs) && substractSpaceRefs.length != 0) {
            substractSpaceRefs.forEach(item => {
                substractSpaceHeight += calcSubtractSpace(unref(item))
            })
        }
        height = height - substractHeight - substractSpaceHeight

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
