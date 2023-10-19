import { useWindowSize } from "@/hooks/event/useWindowSizeFn"

const headerHeightRef = ref(0)
const footerHeightRef = ref(0)

// 获取Layoutcontent可视高度
export function useViewContentHeight() {
    const contentHeight = ref(window.innerHeight)
    const pageHeight = ref(window.innerHeight)
    const getViewHeight = computed(() => {
        return (
            unref(contentHeight) -
                unref(headerHeightRef) -
                unref(footerHeightRef) || 0
        )
    })

    useWindowSize(
        () => {
            contentHeight.value = window.innerHeight
        },
        100,
        { immediate: true }
    )

    // 修改页面高度
    async function setPageHeight(height: number) {
        pageHeight.value = height
    }

    return {
        contentHeight: getViewHeight,
        setPageHeight,
        pageHeight,
    }
}
