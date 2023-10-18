<template>
    <HeaderWrap class="flex items-center justify-end dark:bg-dark-900">
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
                style-class="w-5 h-5 fill-gray-500 mr-8 ml-4"
            />
            <!-- <div
                class="flex w-18 h-8 bg-green-700 items-center justify-center text-white rounded rounded-3xl text-sm mx-4"
            >
                <svg-image
                    name="jiahao2"
                    style-class="w-5 h-5 mr-1 fill-gray-500"
                />
                <div>发布</div>
            </div> -->
            <div>
                <el-avatar
                    :size="32"
                    src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                />
            </div>
        </div>
    </HeaderWrap>
</template>
<script lang="ts">
import { Sunny, Moon } from "@element-plus/icons-vue"
import { HeaderWrap } from "@c/HeaderWrap"
import { SvgImage } from "@c/SvgImage"
import { appStore } from "@/store/modules/app"
export default defineComponent({
    name: "LayoutHeader",
    components: {
        HeaderWrap,
        SvgImage,
    },
    setup() {
        const theme = ref<boolean>(false)
        const useAppStore = appStore()

        function handleTheme(theme: boolean) {
            useAppStore.setTheme(theme)
        }
        return { theme, Moon, Sunny, handleTheme }
    },
})
</script>
<style lang="scss"></style>
