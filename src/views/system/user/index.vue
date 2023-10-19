<template>
    <PageWrapper content-class="p-5">
        <basic-table @register="register">
            <template #action="{ row }">
                <TableColumnAction :row="row" />
            </template>
        </basic-table>
    </PageWrapper>
</template>
<script lang="ts" setup>
import { BasicTable } from "@c/Table/index"
import { PageWrapper } from "@c/PageWrapper/index"
import { useTable } from "@c/Table/index"
import { getList } from "@/api/v1/system/user"
import { TableColumnAction } from "@c/TableAction"
const [register] = useTable({
    title: "用户管理",
    api: getList,
    immediate: true,
    column: [
        {
            prop: "uuid",
            label: "uuid",
        },
        {
            prop: "email",
            label: "邮箱",
        },
        {
            prop: "nickname",
            label: "昵称",
        },
        {
            prop: "created_at",
            label: "创建时间",
        },
        {
            prop: "updated_at",
            label: "上次修改时间",
        },
        {
            prop: "action",
            label: "操作",
        },
    ],
})
</script>
<style lang="scss"></style>
