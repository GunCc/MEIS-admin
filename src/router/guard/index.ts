import { Router } from "vue-router"
import nProgress from "nprogress"
import { createPermissionGuard } from "./createPermissionGuard"
import { createPageGuard } from "./createPageGuard"
import { createStoreGuard } from "./createStoreGuard"

export function setupRouterGuard(router: Router) {
    createProgressGuard(router)
    createPermissionGuard(router)
    createPageGuard(router)
    createStoreGuard(router)
}

// 页面切换显示进度条
export function createProgressGuard(router: Router) {
    // const { getOpenNProgress } = useTransitionSetting()
    // const getOpenNProgress = ref<boolean>(true)
    router.beforeEach(async to => {
        if (to.meta.loaded) {
            return true
        }
        nProgress.start()
        return true
    })

    router.afterEach(async () => {
        nProgress.done()
        return true
    })
}
