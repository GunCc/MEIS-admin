import { setRouteChange } from "@/logic/mitt/routeChange"
import { Router } from "vue-router"

// 一个用于页面state的hooks
export function createPageGuard(router: Router) {
    router.beforeEach(async to => {
        setRouteChange(to)
        return true
    })
}
