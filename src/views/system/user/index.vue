<template>
    <PageWrapper content-class="p-5">
        <basic-table @register="register"></basic-table>
    </PageWrapper>
</template>
<script lang="ts" setup>
import { BasicTable } from "@c/Table/index"
import { PageWrapper } from "@c/PageWrapper/index"
import { useTable } from "@c/Table/index"
import { getList } from "@/api/v1/system/user"
const [register] = useTable({
    title: "用户管理",
    api: getList,
    immediate: true,
})
</script>
<style lang="scss"></style>
