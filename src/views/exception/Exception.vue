<template>
    <div>
        <el-empty description="页面不存在">
            <el-button type="primary" @click="handleChangeRoute">跳转至默认页面</el-button>
        </el-empty>
    </div>
</template>
<script setup lang="ts">
import { PageEnum } from '@/enums/pageEnum';
import { useGo } from '@/hooks/web/usePage';
import { userStore } from '@/store/modules/user';


const useUserStore = userStore()
const go = useGo()
// 跳转至默认页面
function handleChangeRoute(){
    go(useUserStore.getUserInfo?.defaultRoute || PageEnum.BASE_HOME)
}
</script>
<style lang="scss"></style>
