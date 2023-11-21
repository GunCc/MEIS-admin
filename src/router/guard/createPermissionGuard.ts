import { Router, RouteRecordRaw } from "vue-router"
import { menuStoreOutset } from "@/store/modules/menu"
import { userStoreOutset } from "@/store/modules/user"
import { PageEnum } from "@/enums/pageEnum"

const LOGIN_PATH = PageEnum.BASE_ADMIN_LOGIN

const whitePathList: PageEnum[] = [LOGIN_PATH]

export async function createPermissionGuard(router: Router) {
    const menuStore = menuStoreOutset()
    const userStore = userStoreOutset()

    router.beforeEach(async (to, from, next) => {
        const token = userStore.getToken

        // 设置白名单
        if (whitePathList.includes(to.path as PageEnum)) {
            if (to.path === LOGIN_PATH && token) {
                try {
                    await userStore.handleLoginAfter()
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

        if (menuStore.getDynamicAddedRoute) {
            next()
            return
        }
        const routes = await menuStore.genAysncRoute()

        menuStore.setDynamicAddedRoute(true)

        routes.forEach(route => {
            router.addRoute(route as unknown as RouteRecordRaw)
        })

        const redirectPath = to.path as string
        const redirect = decodeURIComponent(redirectPath)
        const nextData =
            to.path === redirect ? { ...to, replace: true } : { path: redirect }
        next(nextData)
    })
}
