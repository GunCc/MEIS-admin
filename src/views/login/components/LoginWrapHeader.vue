<template>
    <HeaderWrap class="flex items-center justify-center">
        <div v-if="unref(getShowInitDBTips)" class="text-sm text-gray-600">
            {{ getShowInitDBTips }}
            欢迎使用MEIS，这是您第一次启动项目，输入库为初始化，
            <span
                class="text-green-700 underline cursor-pointer"
                @click="handleInitDB"
            >
                点击此处可初始化数据库！
            </span>
        </div>
    </HeaderWrap>
</template>
<script lang="ts">
import { useGo } from "@/hooks/web/usePage"
import { useAppStore } from "@/store/modules/app"
import { HeaderWrap } from "@c/HeaderWrap"

export default defineComponent({
    name: "LoginHeader",

    components: {
        HeaderWrap,
    },
    setup() {
        const appStore = useAppStore()
        const go = useGo()

        const getShowInitDBTips = computed(() => {
            console.log("appStore.getNeedInitDB",appStore.getNeedInitDB)
            return appStore.getNeedInitDB
        })

        async function getStatus() {
            await appStore.getNeedInitDBStatus()
        }

        function handleInitDB() {
            go("/initDB")
        }

        onMounted(() => {
            getStatus()
        })

        return {
            handleInitDB,
            getShowInitDBTips,
        }
    },
})
</script>
<style lang="scss" scoped></style>
