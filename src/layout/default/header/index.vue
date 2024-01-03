<template>
    <HeaderWrap class="flex items-center justify-between dark:bg-gray-900">
        <div> <AppLogo /> </div>

        <div class="px-4 flex items-center divide-x">
            <el-switch
                v-model="theme"
                :active-action-icon="Moon"
                :inactive-action-icon="Sunny"
                active-color="#000000"
                @change="handleTheme"
            />
            <svg-image
                name="zhongyingwenyingwen"
                style-class="w-5 h-5 fill-gray-500 dark:fill-gray-100 mr-8 ml-4"
            />
            <el-dropdown class="layout-header-dropdown">
                <div>
                    <el-avatar
                        :size="32"
                        src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                    />
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="handleLogout">
                            登出
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </HeaderWrap>
</template>
<script lang="ts">
import { Sunny, Moon } from "@element-plus/icons-vue"
import { HeaderWrap } from "@c/HeaderWrap"
import { SvgImage } from "@c/SvgImage"
import { AppLogo } from "@c/Logo"
import { useAppStore } from "@/store/modules/app"
import { userStore } from "@/store/modules/user"

export default defineComponent({
    name: "LayoutHeader",
    components: {
        AppLogo, 
        HeaderWrap,
        SvgImage,
    },
    setup() {
        const theme = ref<boolean>(false)
        const appStore = useAppStore()
        const useUserStore = userStore()

        function handleTheme(theme: boolean) {
            appStore.setTheme(theme)
        }

        function handleLogout() {
            useUserStore.logout()
        }
        return { theme, Moon, Sunny, handleTheme, handleLogout }
    },
})
</script>
<style lang="scss">
.layout-header-dropdown {
    .el-tooltip__trigger:focus-visible {
        outline: none;
    }
}
</style>
