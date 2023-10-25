<template>
    <PageWrapper content-class="p-5">
        <basic-table @register="register">
            <template #action="{ row }">
                <TableColumnAction
                    :row="row"
                    :edit-schemas="editSchemas"
                    @action-edit="handleActionEdit"
                />
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
const [register, { getVialdColumn }] = useTable({
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
            canViald: true,
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
let editSchemas = ref<Recordable[]>([])

function handleActionEdit(row) {
    editSchemas.value = getVialdColumn().map(item => {
        let key = item.prop
        item.defaultValue = row[key]
        return item
    })
}
</script>
<style lang="scss"></style>
