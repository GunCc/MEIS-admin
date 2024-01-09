export const REDIRECT_NAME = "Redirect"

export const LAYOUT_NAME = "LAYOUT"

export const PARENT_LAYOUT_NAME = "ParentLayout"

export const PAGE_NOT_FOUND_NAME = "PageNotFound"

export const LAYOUT = () => import("@/layout/default/index.vue")

export const EXCEPTION_COMPONENT = () =>
    import("@/views/exception/Exception.vue")

/**
 * @description: parent-layout
 */
export const getParentLayout = (_name?: string) => {
    return () =>
        new Promise(resolve => {
            resolve({
                name: PARENT_LAYOUT_NAME,
            })
        })
}
