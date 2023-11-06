import { RouteRecordRaw } from "vue-router"
import Layout from "@/layout/default/index.vue"

const systemRoutes: Array<RouteRecordRaw> = [
    {
        path: "/system",
        name: "System",
        component: Layout,
        redirect: "/system/user",
        meta: {
            title: "系统",
        },
        children: [
            {
                path: "user",
                name: "User",
                component: () => import("@/views/system/user/index.vue"),
                meta: {
                    title: "用户管理",
                },
            },
            {
                path: "role",
                name: "Role",
                component: () => import("@/views/system/role/index.vue"),
                meta: {
                    title: "角色管理",
                },
            },
            {
                path: "menu",
                name: "Menu",
                component: () => import("@/views/system/menu/index.vue"),
                meta: {
                    title: "菜单管理",
                },
            },
            {
                path: "logger",
                name: "Logger",
                component: () => import("@/views/system/logger/index.vue"),
                meta: {
                    title: "日志",
                },
            },
        ],
    },
]

export default systemRoutes
