import Layout from "@/layout/default/index.vue"
import { AppRouteRecordRaw } from "@/router/types"

const baseRoutes: Array<AppRouteRecordRaw> = [
    {
        path: "/dashboard",
        name: "Dashboard",
        component: Layout,
        redirect:"/dashboard/analysis",
        meta: {
            sort: 100,
            title: "面板",
        },
        children: [
            {
                path: "/dashboard/analysis",
                name: "Analysis",
                component: () => import("@/views/dashboard/analysis/index.vue"),
                meta: {
                    sort: 50,
                    title: "分析表",
                },
            },
        ],
    },
    {
        path: "/materialLibrary",
        name: "MaterialLibrary",
        component: Layout,
        redirect:"/materialLibrary/manager",
        meta: {
            sort: 1,
            title: "素材管理",
        },
        children: [
            {
                path: "/materialLibrary/manager",
                name: "Manager",
                component: () =>
                    import("@/views/materialLibrary/manager/index.vue"),
                meta: {
                    sort: 50,
                    title: "图片管理",
                },
            },
        ],
    },
]

export default baseRoutes
