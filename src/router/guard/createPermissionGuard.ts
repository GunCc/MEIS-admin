import { Router, RouteRecordRaw } from "vue-router"
import { menuStoreOutset } from "@/store/modules/menu"
import { userStoreOutset } from "@/store/modules/user"
import { PageEnum } from "@/enums/pageEnum"
import { PAGE_NOT_FOUND_ROUTE } from "../routes/base"
import { PAGE_NOT_FOUND_NAME } from "../const"
import { RootRoute } from "../routes"

const LOGIN_PATH = PageEnum.BASE_ADMIN_LOGIN
const INIT_DB_PATH = PageEnum.INIT_DB_PAGE
const ROOT_PATH = RootRoute.path

const whitePathList: PageEnum[] = [LOGIN_PATH, INIT_DB_PATH]

export async function createPermissionGuard(router: Router) {
    const menuStore = menuStoreOutset()
    const userStore = userStoreOutset()

    router.beforeEach(async (to, from, next) => {
        const token = userStore.getToken
        debugger

        // 设置白名单
        if (whitePathList.includes(to.path as PageEnum)) {
            if (to.path === LOGIN_PATH && token) {
                try {
                    await userStore.logout()
                    next((to.query?.redirect as string) || "/")
                    return
                } catch {}
            }
            next()
            return
        }

        // 没有token的情况
        if (!token) {
            const redirectData: {
                path: string
                replace: boolean
                query?: Recordable<string>
            } = {
                path: LOGIN_PATH,
                replace: true,
            }
            if (to.path) {
                redirectData.query = {
                    ...redirectData.query,
                    redirect: to.path,
                }
            }
            next(redirectData)
            return
        }

        // 如果还没有登录，不可进入404页面
        if (from.path === LOGIN_PATH && to.name === PAGE_NOT_FOUND_ROUTE.name) {
        }

        if (menuStore.getDynamicAddedRoute) {
            next()
            return
        }
        const routes = await menuStore.genAysncRoute()

        menuStore.setDynamicAddedRoute(true)

        routes.forEach(route => {
            router.addRoute(route as unknown as RouteRecordRaw)
        })

        router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw)

        if (to.name === PAGE_NOT_FOUND_ROUTE.name) {
            // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
            next({ path: to.fullPath, replace: true, query: to.query })
        } else {
            const redirectPath = to.path as string
            const redirect = decodeURIComponent(redirectPath)
            const nextData =
                to.path === redirect
                    ? { ...to, replace: true }
                    : { path: redirect }
            next(nextData)
        }
    })
}
