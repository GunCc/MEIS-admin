import { RouteRecordRaw } from "vue-router"
import { AppRouteRecordRaw } from "../types"

const modules = import.meta.glob("./modules/**/*.ts", { eager: true })

const routeModuleList: RouteRecordRaw[] = []
Object.keys(modules).forEach(key => {
    // @ts-ignore
    const mod = modules[key].default || {}
    const modList = Array.isArray(mod) ? [...mod] : [mod]
    routeModuleList.push(...modList)
})

// 异步路由
const asyncRoute = [...routeModuleList]

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
        path: "/",
        name: "home",
        redirect: "/login",
        meta: {
            title: "登录",
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

export { asyncRoute, LoginRoute }
