import { defineStore } from "pinia"
import { store } from ".."
import { Menu } from "@/api/model/system/menu"
import { AppRouteRecordRaw } from "@/router/types"
import { asyncImportRoute } from "@/router/helper/routeHelper"
import { router } from "@/router"
import { RouteRecordRaw } from "vue-router"
import { MENUS_KEY } from "@/enums/cacheEnum"
import { getAuthCache, setAuthCache } from "@/utils/auth"
import { Nullable } from "vitest"

interface MenuStore {
    defaultMenus: Nullable<Menu[]>
    defaultRouter: AppRouteRecordRaw[]
    isDynamicAddedRoute: boolean
}

function formatRouter(menus: Menu[]): AppRouteRecordRaw[] {
    let arr: AppRouteRecordRaw[] = []
    menus &&
        menus.forEach(item => {
            let route: AppRouteRecordRaw = {
                name: item.name,
                path: item.path,
                meta: {
                    title: "测试",
                },
                component: item.component,
            }
            if (item.children && item.children.length != 0)
                route.children = formatRouter(item.children)
            arr.push(route)
        })
    return arr
}

export const menuStore = defineStore({
    id: "menu-store",
    state: (): MenuStore => ({
        defaultMenus: null,
        defaultRouter: [],
        // 是否已经动态添加路由
        isDynamicAddedRoute: false,
    }),
    getters: {
        getDefaultMenus(state) {
            return state.defaultMenus || getAuthCache(MENUS_KEY) || []
        },
        getDefaultRouter(state) {
            return state.defaultMenus || []
        },
        getDynamicAddedRoute(state) {
            return state.isDynamicAddedRoute
        },
    },
    actions: {
        // 生成菜单
        genMenu() {},
        setDynamicAddedRoute(flag: boolean) {
            this.isDynamicAddedRoute = flag
        },
        // 修改原本有的动态路由
        setDefaultRoute(routes: AppRouteRecordRaw[] = []) {
            this.defaultRouter = routes
        },
        // 默认路由
        setDefaultMenu(menus: Menu[] | null) {
            setAuthCache(MENUS_KEY, menus)
            this.defaultMenus = menus
            this.genAysncRoute()
        },
        // 生成动态router
        async genAysncRoute(): Promise<AppRouteRecordRaw[]> {
            const routes = formatRouter(this.getDefaultMenus)
            asyncImportRoute(routes)
            this.setDynamicAddedRoute(true);
            this.setDefaultRoute(routes)
            routes.forEach(route => {
                router.addRoute(route as unknown as RouteRecordRaw)
            })
            return routes
        },
    },
})

// 在外部使用store
export function menuStoreOutset() {
    return menuStore(store)
}
