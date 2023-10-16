<template>
    <el-dropdown>
        <span class="el-dropdown-link">
            角色却换
            <el-icon class="el-icon--right">
                <arrow-down />
            </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item>管理端</el-dropdown-item>
                <el-dropdown-item>企业版</el-dropdown-item>
                <el-dropdown-item>教育版</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
    name: "Dropdown",
    props:{
        items:{
            // type:props
        }

    },
    setup(props, { emit, attrs }) {},
})
</script>
<style lang="less" scoped></style>
