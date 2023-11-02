<template>
    <PageWrapper>
        <basic-table @register="register">
            <template #action="{ row }">
                <TableColumnAction
                    :row="row"
                    :schemas-setting="schemasSetting"
                    @action-edit="handleActionEdit"
                    @action-remove="handleActionDelete"
                />
            </template>
        </basic-table>
    </PageWrapper>
</template>
<script lang="ts" setup>
import { BasicTable, useTable } from "@c/Table/index"
import { PageWrapper } from "@c/PageWrapper/index"
import { getList } from "@/api/v1/system/user"
import { TableColumnAction } from "@c/TableAction"
const [register, { getVialdColumn }] = useTable({
    title: "用户管理",
    api: getList,
    immediate: true,
    formSettings: {
        schemas: [
            {
                label: "关键字",
                field: "keywords",
                col: { span: 6 },
                componentProps: {
                    placeholder: "请输入关键字",
                },
            },
        ],
    },
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
let schemasSetting = ref<Recordable[]>([])

function handleActionEdit(row) {
    schemasSetting.value = getVialdColumn().map(item => {
        let key = item.prop
        item.defaultValue = row[key]
        return item
    })
}

function handleActionDelete(row) {
    console.log("删除成功", row)
}
</script>
<style lang="scss"></style>
