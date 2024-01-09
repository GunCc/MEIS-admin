<template>
    <div>
        <el-tabs
            v-model="currentTab"
            type="card"
            class="meis--mutiple-tabs"
            size="small"
            @tab-click="handleTabClick"
            @tab-remove="handleTabRemove"
        >
            <el-tab-pane
                v-for="item in getTabState"
                :key="item.path"
                :label="item.meta.title"
                :name="item.path"
                :closable="!item.meta.affix"
            >
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script lang="ts">
import { useGo } from "@/hooks/web/usePage"
import { listenerRouteChange } from "@/logic/mitt/routeChange"
import { mutipleStore } from "@/store/modules/mutipleTab"
import { userStore } from "@/store/modules/user"
import { TabPaneName, TabsPaneContext } from "element-plus"

// 标签栏
export default defineComponent({
    name: "MutipleTabs",
    components: {},
    setup() {
        const currentTab = ref("")
        const useUserStore = userStore()

        const useMutipleStore = mutipleStore()

        const go = useGo()

        const router = useRouter()

        const getTabState = computed(() => {
            return useMutipleStore.getTabList
        })
       
        // 监听事件
        listenerRouteChange(route => {
            // 如果没有Token 没有路由直接不执行
            if (!route || !useUserStore.getToken) {
                return
            }
            const { path } = route
            currentTab.value = path

            useMutipleStore.addTab(unref(route))
        })

        // tabs点击事件
        function handleTabClick(tab: TabsPaneContext) {
            const { paneName } = tab
            if (!paneName) return
            const path = unref(paneName) as string
            currentTab.value = path
            go(path as string)
        }

        // tabs删除事件
        function handleTabRemove(tabPaneName: TabPaneName) {
            useMutipleStore.removeTabByKey(unref(tabPaneName) as string, router)
        }

        return { currentTab, getTabState, handleTabClick, handleTabRemove }
    },
})
</script>
<style lang="scss">
.meis--mutiple-tabs {
    .el-tabs__header {
        padding: 0 4px;
        margin-bottom: 0px;
        .el-tabs__item {
            font-size: 14px;
            padding: 0 12px;
        }
    }
}
</style>
