import { defineStore } from "pinia"
import { store } from ".."
import { Menu } from "@/api/model/system/menu"
import { AppRouteRecordRaw } from "@/router/types"
import {
    asyncImportRoute,
    flatMultiLevelRoutes,
    transformObjToRoute,
} from "@/router/helper/routeHelper"
import { router } from "@/router"
import { RouteRecordRaw } from "vue-router"
import { MENUS_KEY } from "@/enums/cacheEnum"
import { getAuthCache, setAuthCache } from "@/utils/auth"
import { Nullable } from "vitest"
import { MenuItem } from "@/components/Menu/src/types/index"
import { genLayoutMenus } from "@/router/helper/menuHelper"
import { PAGE_NOT_FOUND_ROUTE } from "@/router/routes/base"

interface MenuStore {
    menus: MenuItem[]
    asyncMenus: Nullable<Menu[]>
    defaultRouter: AppRouteRecordRaw[]
    isDynamicAddedRoute: boolean
}

function formatRouter(menus: Menu[]): AppRouteRecordRaw[] {
    let arr: AppRouteRecordRaw[] = []
    menus &&
        menus.forEach(item => {
            if (item.hidden) {
                let route: AppRouteRecordRaw = {
                    name: item.name,
                    path: item.path,
                    redirect: item.redirect,
                    meta: {
                        ...(item.meta || {}),
                        sort: 50,
                        title: item.meta.title,
                    },
                    component: item.component,
                }
                if (item.children && item.children.length != 0)
                    route.children = formatRouter(item.children)
                arr.push(route)
            }
        })
    return arr
}

// function mergeBaseRoutes(routes: AppRouteRecordRaw[]): AppRouteRecordRaw[] {
//     return [...routes]
// }

function sortRouter(field) {
    return function (pre, next) {
        let preRoute = pre[field]
        let nextRoute = next[field]
        return nextRoute.sort - preRoute.sort
    }
}

export const menuStore = defineStore({
    id: "menu-store",
    state: (): MenuStore => ({
        // 菜单
        menus: [],
        // 请求获取的数据
        asyncMenus: null,
        defaultRouter: [],
        // 是否已经动态添加路由
        isDynamicAddedRoute: false,
    }),
    getters: {
        getMenus(state) {
            return state.menus
        },
        getAsyncMenus(state) {
            return state.asyncMenus || getAuthCache(MENUS_KEY) || []
        },
        getDefaultRouter(state) {
            return state.defaultRouter || []
        },
        getDynamicAddedRoute(state) {
            return state.isDynamicAddedRoute
        },
    },
    actions: {
        clearMenuStore() {
            this.setMenus()
            this.setDefaultMenu(null)
            this.setDynamicAddedRoute(false)
            this.setDefaultRoute()
        },
        setMenus(menus: MenuItem[] = []) {
            this.menus = menus
        },
        setDynamicAddedRoute(flag: boolean) {
            this.isDynamicAddedRoute = flag
        },
        // 修改原本有的动态路由
        setDefaultRoute(routes: AppRouteRecordRaw[] = []) {
            this.defaultRouter = routes
        },
        // 默认路由
        async setDefaultMenu(menus: Menu[] | null) {
            setAuthCache(MENUS_KEY, menus)
            this.asyncMenus = menus
            if (!menus) return
            await this.genAysncRoute()
            await this.genMenu()
        },
        // 生成菜单
        async genMenu() {
            console.log("this.defaultRouter", this.defaultRouter)
            let menus = genLayoutMenus(this.defaultRouter)
            this.setMenus(menus)
        },
        // 生成动态router
        async genAysncRoute(): Promise<AppRouteRecordRaw[]> {
            let routes = formatRouter(this.getAsyncMenus)
            // 生成动态路由
            asyncImportRoute(routes)
            // 映入基本的路由
            // routes = mergeBaseRoutes(routes)
            // 排序
            routes && routes.sort(sortRouter("meta"))
            this.setDynamicAddedRoute(true)
            this.setDefaultRoute(routes)
            this.genMenu()
            // 将多级路由转换为二级路由
            routes = flatMultiLevelRoutes(routes)
            routes.forEach(route => {
                router.addRoute(route as unknown as RouteRecordRaw)
            })
            router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw)
            return routes
        },
    },
})

// 在外部使用store
export function menuStoreOutset() {
    return menuStore(store)
}
