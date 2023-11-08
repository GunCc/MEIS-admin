<template>
    <PageWrapper>
        <basic-table @register="register">
            <template #action="{ row }">
                <TableColumnAction
                    :row="row"
                    :remove-button-setting="actionRemoveSetting"
                    @action-remove="handleActionDelete"
                />
            </template>
        </basic-table>
    </PageWrapper>
</template>
<script lang="ts" setup>
import { BasicTable, useTable } from "@c/Table/index"
import { PageWrapper } from "@c/PageWrapper/index"
import { getList, removeOperation } from "@/api/v1/system/operationRecord"
import { TableColumnAction } from "@c/TableAction"
const [register, { reload }] = useTable({
    title: "日志列表",
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
            prop: "ip",
            label: "IP地址",
            width: 80,
        },
        {
            prop: "method",
            label: "请求方法",
            width: 80,

        },
        {
            prop: "path",
            label: "请求路径",
            width: 250,

        },
        {
            prop: "status",
            label: "请求状态",
            width: 80,

        },
        {
            prop: "agent",
            label: "代理",
            width: 400,

        },
        {
            prop: "error_message",
            label: "错误信息",
            width: 220,

        },
        {
            prop: "created_at",
            label: "创建时间",
            width: 320,
        },
        {
            prop: "action",
            label: "操作",
        },
    ],
})
let schemasSetting = ref<Recordable[]>([])

const actionRemoveSetting = computed(() => {
    return {
        context: row => {
            return `确定删除${row.id}这个日志吗？`
        },
    }
})

async function handleActionDelete(row) {
    try {
        await removeOperation(row)
        reload()
    } catch (error) {
        console.error(error)
    }
}
</script>
<style lang="scss"></style>
