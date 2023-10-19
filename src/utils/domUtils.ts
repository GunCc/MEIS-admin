export interface ViewportOffsetResult {
    left: number
    top: number
    right: number
    bottom: number
    rightIncludeBody: number
    bottomIncludeBody: number
}

// 获取元素 上左下右四个位置
export function getBoundingClientRect(element: Element): DOMRect | number {
    if (!element || !element.getBoundingClientRect) {
        return 0
    }
    return element.getBoundingClientRect()
}

// 获取某一个元素的四周节点
export function getViewportOffset(element: Element): ViewportOffsetResult {
    const doc = document.documentElement

    // 获取上和左最大滚动距离
    const docScrollLeft = doc.scrollLeft
    const docScrollTop = doc.scrollTop
    // 获取边框厚度
    const docClientLeft = doc.clientLeft
    const docClientTop = doc.clientTop

    // 获取x和y的相对位置
    const pageXOffset = window.pageXOffset
    const pageYOffset = window.pageYOffset

    const box = getBoundingClientRect(element)

    const {
        left: retLeft,
        top: rectTop,
        width: rectWidth,
        height: rectHeight,
    } = box as DOMRect

    const scrollLeft = (pageXOffset || docScrollLeft) - (docClientLeft || 0)
    const scrollTop = (pageYOffset || docScrollTop) - (docClientTop || 0)
    const offsetLeft = retLeft + pageXOffset
    const offsetTop = rectTop + pageYOffset

    const left = offsetLeft - scrollLeft
    const top = offsetTop - scrollTop

    const clientWidth = window.document.documentElement.clientWidth
    const clientHeight = window.document.documentElement.clientHeight
    return {
        left: left,
        top: top,
        right: clientWidth - rectWidth - left,
        bottom: clientHeight - rectHeight - top,
        rightIncludeBody: clientWidth - left,
        bottomIncludeBody: clientHeight - top,
    }
}
