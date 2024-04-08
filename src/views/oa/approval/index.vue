<template>
    <PageWrapper>
        <basic-table @register="register">
            <template #action="{ row }">
                <TableColumnAction :row="row">
                    <template #before-action="{ value }">
                        <el-button
                            type="primary"
                            size="small"
                            @click="handleEditApproval(value)"
                        >
                            通过
                        </el-button>

                        <el-button
                            type="primary"
                            size="small"
                            @click="handleEditApproval(value)"
                        >
                            拒绝
                        </el-button>
                    </template>
                </TableColumnAction>
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

const [register, {}] = useTable({
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
            prop: "task_desc",
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
            width: 220,
        },
    ],
})

function handleEditApproval() {}
</script>
<style lang="scss"></style>
