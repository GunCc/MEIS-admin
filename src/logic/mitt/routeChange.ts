import { getRawRoute } from "@/utils"
import mitt from "@/utils/mitt"
import { RouteLocationNormalized } from "vue-router"

// 监视路由更改，已更改菜单和选项卡状态。
// 不需要监视路由，因为路由状态的更改会受到页面呈现时间的影响，而页面呈现时间比较漫
const emitter = mitt()

const key = Symbol()

// 最后一个被修改的Tab
let lastChangeTab: RouteLocationNormalized

// 路由修改事件
export function setRouteChange(lastChangeRoute: RouteLocationNormalized) {
    // 获取路由信息
    const r = getRawRoute(lastChangeRoute)
    emitter.emit(key, r)
    lastChangeTab = r
}

// 路有变化监听
export function listenerRouteChange(
    callback: (route: RouteLocationNormalized) => void,
    immediate = true
) {
    emitter.on(key, callback)
    immediate && lastChangeTab && callback(lastChangeTab)
}

// 删除路由事件
export function removeTabChangeListener() {
    emitter.clear()
}
