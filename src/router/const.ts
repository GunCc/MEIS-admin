export const REDIRECT_NAME = "Redirect"

export const LAYOUT_NAME = "LAYOUT"


export const PAGE_NOT_FOUND_NAME = "PageNotFound"

export const LAYOUT = () => import("@/layout/default/index.vue")

export const EXCEPTION_COMPONENT = () =>
    import("@/views/exception/Exception.vue")
