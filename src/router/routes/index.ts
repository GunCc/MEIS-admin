import { RouteRecordRaw } from "vue-router"
import { AppRouteRecordRaw } from "../types"
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from "./base"
import { PageEnum } from "@/enums/pageEnum"

// const modules = import.meta.glob("./modules/**/*.ts", { eager: true })

const routeModuleList: RouteRecordRaw[] = []
// Object.keys(modules).forEach(key => {
//     // @ts-ignore
//     const mod = modules[key].default || {}
//     const modList = Array.isArray(mod) ? [...mod] : [mod]
//     routeModuleList.push(...modList)
// })

// 异步路由
export const asyncRoute = [...routeModuleList]

const LoginRoute: Array<AppRouteRecordRaw> = [
    {
        path: "/login",
        name: "Login",
        component: () => import("@/views/login/login.vue"),
        meta: {
            title: "登录",
        },
    },
    {
        path: "/login-admin",
        name: "LoginAdmin",
        component: () => import("@/views/login/login-admin.vue"),
        meta: {
            title: "管理员登录",
        },
    },

    {
        path: "/register",
        name: "Register",
        component: () => import("@/views/login/register.vue"),
        meta: {
            title: "选择角色",
        },
    },
    {
        path: "/initDB",
        name: "InitDB",
        component: () => import("@/views/system/init/db.vue"),
        meta: {
            title: "初始化数据库",
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
]

const RootRoute: AppRouteRecordRaw = {
    path: "/",
    name: "Root",
    redirect: PageEnum.BASE_HOME,
    meta: {
        title: "Root",
    },
}
// export { asyncRoute, LoginRoute,RootRoute }

export const basicRoutes = [
    RootRoute,
    LoginRoute,
    REDIRECT_ROUTE,
    PAGE_NOT_FOUND_ROUTE,
]
