import {
    EXCEPTION_COMPONENT,
    LAYOUT,
    PAGE_NOT_FOUND_NAME,
    REDIRECT_NAME,
} from "@/router/const"
import { AppRouteRecordRaw } from "@/router/types"

// const baseRoutes: Array<AppRouteRecordRaw> = [
//     {
//         path: "/dashboard",
//         name: "Dashboard",
//         component: Layout,
//         redirect:"/dashboard/analysis",
//         meta: {
//             sort: 100,
//             title: "面板",
//         },
//         children: [
//             {
//                 path: "/dashboard/analysis",
//                 name: "Analysis",
//                 component: () => import("@/views/dashboard/analysis/index.vue"),
//                 meta: {
//                     sort: 50,
//                     title: "分析表",
//                 },
//             },
//         ],
//     },
// ]

export const PAGE_NOT_FOUND_ROUTE: AppRouteRecordRaw = {
    path: "/:path(.*)*",
    name: PAGE_NOT_FOUND_NAME,
    component: LAYOUT,
    meta: {
        hideTab: true,
        title: "错误页面",
    },
    children: [
        {
            path: "/:path(.*)*",
            name: PAGE_NOT_FOUND_NAME,
            component: EXCEPTION_COMPONENT,
            meta: {
                hideTab: true,

                title: "错误页面",
            },
        },
    ],
}

export const REDIRECT_ROUTE: AppRouteRecordRaw = {
    path: "/redirect",
    component: LAYOUT,
    name: "RedirectTo",
    meta: {
        hideTab: true,
        title: REDIRECT_NAME,
    },
    children: [
        {
            path: "/redirect/:path(.*)",
            name: REDIRECT_NAME,
            component: () => import("@/views/redirect/index.vue"),
            meta: {
                hideTab: true,
                title: REDIRECT_NAME,
            },
        },
    ],
}
