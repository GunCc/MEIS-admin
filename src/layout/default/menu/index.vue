<template>
    <div>
        <BasicMenu
            class="layout-menu border-right border-gray-100 dark:border-gray-500 border-solid"
            v-bind="getProps"
        />
    </div>
</template>
<script lang="ts">
import { BasicMenu } from "@c/Menu"
export default defineComponent({
    name: "LayoutMenu",
    components: {
        BasicMenu,
    },
    setup() {
        const getProps = computed(() => {
            return {
                router: true,
                items: [
                    {
                        title: "面板",
                        key: "/dashboard/analysis",
                        path: "/dashboard/analysis",
                    },
                    {
                        title: "系统管理",
                        key: "/system",
                        path: "/system",
                        children: [
                            {
                                title: "用户管理",
                                key: "/system/user",
                                path: "/system/user",
                            },
                            {
                                title: "角色管理",
                                key: "/system/role",
                                path: "/system/role",
                            },
                            {
                                title: "菜单管理",
                                key: "/system/menu",
                                path: "/system/menu",
                            },
                            {
                                title: "日志列表",
                                key: "/system/logger",
                                path: "/system/logger",
                            },
                        ],
                    },

                    {
                        title: "素材库",
                        key: "/materialLibrary/manager",
                        path: "/materialLibrary/manager",
                    },
                ],
            }
        })
        return {
            getProps,
        }
    },
})
</script>
<style lang="scss">
.layout-menu {
    width: 220px;
    height: calc(100vh - 3rem);
    .el-menu {
        border: none !important;
    }
}
</style>
