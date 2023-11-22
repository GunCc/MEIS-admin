<template>
    <div>
        <BasicMenu
            class="layout-menu border-right border-gray-100 dark:border-gray-500 border-solid"
            v-bind="getProps"
        />
    </div>
</template>
<script lang="ts">
import { menuStore } from "@/store/modules/menu"
import { BasicMenu } from "@c/Menu"
export default defineComponent({
    name: "LayoutMenu",
    components: {
        BasicMenu,
    },
    setup() {
        const useMenuStore = menuStore()
        const getProps = computed(() => {
            return {
                router: true,
                items: useMenuStore.getMenus,
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
