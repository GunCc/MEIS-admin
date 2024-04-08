<template>
    <PageWrapper>
        <basic-table @register="register">
            <template #type="{ row }">
                {{ row.approval_type == 5 ? "薪资审核" : "" }}
            </template>
            <template #is_past="{ row }">
                {{
                    row.is_past == 1
                        ? "已通过"
                        : row.is_past == 2
                        ? "已拒绝"
                        : "待审核"
                }}
            </template>
            <template #action="{ row }">
                <el-button
                    v-if="!row.is_past"
                    type="primary"
                    size="small"
                    @click="handleEditApproval(row, 1)"
                >
                    通过
                </el-button>

                <el-button
                    v-if="!row.is_past"
                    type="danger"
                    size="small"
                    @click="handleEditApproval(row, 2)"
                >
                    拒绝
                </el-button>
            </template>
        </basic-table>
    </PageWrapper>
</template>
<script lang="ts" setup>
import { BasicTable, useTable } from "@c/Table/index"
import { PageWrapper } from "@c/PageWrapper/index"
import { getList, updateApproval } from "@/api/v1/oa/approval"

import { TableColumnAction } from "@c/TableAction"
import { clone } from "lodash"

import { error } from "@/utils/log"
import { useMessage } from "@/hooks/web/useMessage"

const { createConfirm } = useMessage()

const [register, { reload }] = useTable({
    title: "审批中心",
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
            prop: "id",
            label: "ID",
            width: 50,
        },
        {
            prop: "type",
            label: "审核类型",
            width: 260,
        },
        {
            prop: "is_past",
            label: "是否审核",
        },
        {
            prop: "created_at",
            label: "创建时间",
            width: 260,
        },
        {
            prop: "updated_at",
            label: "修改时间",
            width: 260,
        },
        {
            prop: "action",
            label: "操作",
            fixed: "right",
            width: 120,
        },
    ],
})

async function handleEditApproval(row, type) {
    createConfirm({
        title: "提示",
        type: "warning",
        message: `确定要给${type == 1 ? "通过" : "驳回"}该审核吗？`,
        success: async () => {
            try {
                await updateApproval({
                    ...row,
                    is_past: type,
                })
                reload()
            } catch (error) {
                console.error(error)
            }
        },
    })
}
</script>
<style lang="scss"></style>
