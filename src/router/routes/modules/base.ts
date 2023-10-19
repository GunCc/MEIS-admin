import { RouteRecordRaw } from "vue-router"
import Layout from "@/layout/default/index.vue"

const baseRoutes: Array<RouteRecordRaw> = [
    {
        path: "/register",
        name: "Register",
        component: () => import("@/views/login/register.vue"),
        meta: {
            title: "选择角色",
        },
    },
    {
        path: "/forgetPassword",
        name: "ForgetPassword",
        component: () => import("@/views/login/forgetPassword.vue"),
        meta: {
            title: "选择角色",
        },
    },
    {
        path: "/dashboard",
        name: "Dashboard",
        component: Layout,
        redirect: "/dashboard/analysis",
        meta: {
            title: "面板",
        },
        children: [
            {
                path: "analysis",
                name: "Analysis",
                component: () => import("@/views/dashboard/analysis/index.vue"),
                meta: {
                    title: "Analysis",
                },
            },
        ],
    },
]

export default baseRoutes
