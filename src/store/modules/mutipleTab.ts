import { defineStore } from "pinia"
import { store } from ".."
import { RouteLocationNormalized, RouteLocationRaw } from "vue-router"
import { getRawRoute } from "@/utils"
import { Router } from "vue-router"
import { userStore } from "./user"
import { PageEnum } from "@/enums/pageEnum"
import { Persistent } from "@/utils/cache/persistent"
import { MULTIPLE_TABS_KEY } from "@/enums/cacheEnum"

export interface MutipleState {
    // 缓存的标签
    cacheTabList: Set<string>
    // 存出route的基本信息
    tabList: RouteLocationNormalized[]
}

// 获取目标对象数据
const getToTarget = (tabItem: RouteLocationNormalized) => {
    const { params, query, path } = tabItem
    return {
        params,
        query,
        path,
    }
}

export const mutipleStore = defineStore({
    id: "mutiple-store",
    state: (): MutipleState => ({
        cacheTabList: new Set(),
        tabList: Persistent.getLocal(MULTIPLE_TABS_KEY) || [],
    }),
    getters: {
        getTabList(): RouteLocationNormalized[] {
            return this.tabList
        },
        getCachedTabList(): string[] {
            return Array.from(this.cacheTabList)
        },
    },
    actions: {
        // 根据当前打开的页面，修改tabs缓存中的数据
        setTabList() {
            const cacheMap: Set<string> = new Set()

            for (const tab of this.tabList) {
                const item = getRawRoute(tab)
                const name = item.name as string
                cacheMap.add(name)
            }

            this.cacheTabList = cacheMap
        },
        // 添加操作
        addTab(route: RouteLocationNormalized) {

            
            const {
                meta = {},
                fullPath,
                path,
                params,
                query,
            } = getRawRoute(route)
          
            if (path === PageEnum.ERROR_PAGE) {
                return
            }

            let updateIndex = -1

            // 查看tablist中是否以及存在
            const tabHasExits = this.getTabList.some((tab, index) => {
                updateIndex = index
                return (tab.fullPath || tab.path) === (fullPath || path)
            })

            if (tabHasExits) {
                const currentTab = toRaw(this.tabList)[updateIndex]
                if (!currentTab) {
                    return
                }
                currentTab.params = params || currentTab.params
                currentTab.query = query || currentTab.query
                currentTab.fullPath = fullPath || currentTab.fullPath
                // @ts-ignore
                currentTab.meta = meta || currentTab.meta

                this.tabList.splice(updateIndex, 1, currentTab)
            } else {
                this.tabList.push(route)
            }
            Persistent.setLocal(MULTIPLE_TABS_KEY, this.tabList, true)
        },
        // 根据key删除
        async removeTabByKey(path: string, router: Router) {
            const index = this.tabList.findIndex(
                item => (item.fullPath || item.path) === path
            )

            if (index !== -1) {
                await this.removeTab(this.tabList[index], router)
            }
        },
        // 删除
        async removeTab(route: RouteLocationNormalized, router: Router) {
            const close = route => {
                const { fullPath } = route
                const index = this.tabList.findIndex(
                    item => item.fullPath === fullPath
                )

                index != -1 && this.tabList.splice(index, 1)
            }
            const { currentRoute, replace } = router

            const { path } = unref(currentRoute)

            // 如果不等于直接删除
            if (path !== route.path) {
                close(route)
                return
            }

            // 如果删除当前Path
            let toTagret: RouteLocationRaw = {}

            const index = this.tabList.findIndex(item => item.path === path)

            // 如果删除第一个
            if (index === 0) {
                // 如果只有一个了,那么在删除之后，应该去默认页面。
                if (this.tabList.length == 1) {
                    const useUserStore = userStore()
                    toTagret =
                        (useUserStore.getUserInfo || {}).defaultRoute ||
                        PageEnum.BASE_HOME
                } else {
                    const page = this.tabList[index + 1]
                    toTagret = getToTarget(page)
                }
            } else {
                const page = this.tabList[index - 1]
                toTagret = getToTarget(page)
            }

            close(currentRoute.value)

            await replace(toTagret)
        },
    },
})

export function useMutipleStoreWithoutStore() {
    return mutipleStore(store)
}
