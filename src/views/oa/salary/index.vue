<template>
    <PageWrapper>
        <basic-table @register="register">
            <template #action-before>
                <el-button type="success" @click="handleCreateAttendance">
                    添加
                </el-button>
            </template>
            <template #payslip_send="{ row }">
                {{ row.payslip_send ? "是" : "否" }}
            </template>

            <template #personnel_id="{ row }">
                {{ row.personnel.name }}
            </template>
            <template #action="{ row }">
                <TableColumnAction
                    :row="row"
                    :remove-button-setting="actionRemoveSetting"
                    @action-remove="handleActionDelete"
                >
                    <template #before-action="{ value }">
                        <el-button
                            type="primary"
                            size="small"
                            @click="handleEditAttendance(value)"
                        >
                            编辑
                        </el-button>
                    </template>
                </TableColumnAction>
            </template>
        </basic-table>
        <BasicModal v-model:visible="visible" width="500px">
            <template #header> {{ getModalProps.title }}</template>
            <template #default>
                <ModalForm
                    ref="ModalFormElRef"
                    @success-submit="handleSuccessSubmit"
                    :schema-setting="getModalProps.schema"
                    :row="getModalProps.row"
                ></ModalForm>
            </template>
        </BasicModal>
    </PageWrapper>
</template>
<script lang="ts" setup>
import { BasicTable, useTable } from "@c/Table/index"
import { PageWrapper } from "@c/PageWrapper/index"
import { getList, removeSalary } from "@/api/v1/oa/salary"
import { getAllList } from "@/api/v1/oa/personnel"
import { TableColumnAction } from "@c/TableAction"
import { isFunction, keys, pick } from "lodash"
import { FormItemSchemas } from "@/components/Form"

import ModalForm from "./ModalForm.vue"
import { error } from "@/utils/log"
interface ModalProps {
    title: string
    schema: FormItemSchemas[]
    row: Recordable | "create"
}

const visible = ref<boolean>(false)

const ModalFormElRef = ref()

const modalProps = ref<ModalProps>({
    title: "",
    schema: [],
    row: "create",
})

const getModalProps = computed(() => {
    return unref(modalProps)
})

function setModalValue(values: Partial<ModalProps & { visible: boolean }>) {
    let innerModalProps = pick(values, keys(unref(modalProps)))
    modalProps.value = {
        ...unref(modalProps),
        ...innerModalProps,
    }
    visible.value = !!values.visible
}

const [register, { getVialdColumn, reload }] = useTable({
    title: "薪资管理",
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
            prop: "personnel_id",
            label: "薪资",
            canViald: true,
            columnToForm: {
                component: "Select",
                componentProps: {
                    api: getAllList,
                    immediate: true,
                    labelField: "name",
                    valueField: "id",
                },
            },
        },
        {
            prop: "base_salary",
            label: "基本薪资",
            width: 260,
            canViald: true,
        },
        {
            prop: "wage_salary",
            label: "绩效薪资",
            width: 260,
            canViald: true,
        },
        {
            prop: "social_security",
            label: "社保",
            width: 260,
            canViald: true,
        },
        {
            prop: "payslip_send",
            label: "是否发放工资",
            width: 260,
        },
        {
            prop: "created_at",
            label: "创建时间",
            width: 260,
        },
        {
            prop: "updated_at",
            label: "上次修改时间",
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

const actionRemoveSetting = computed(() => {
    return {
        context: row => {
            return `确定删除${row.personnel.name}薪资吗？删除后将无法恢复，如果以后还需再次使用建议执行冻结操作。`
        },
    }
})

async function handleActionDelete(row) {
    try {
        await removeSalary(row)
        reload()
    } catch (err) {
        error(err as string)
    }
}

function getSchema(row?: Recordable): FormItemSchemas[] {
    let schemas = getVialdColumn().map(item => {
        let key = item.prop
        let formatDefault = item.formatDefault
        return {
            ...item,
            label: item.label,
            field: item.prop,
            defaultValue: isFunction(formatDefault)
                ? formatDefault(row)
                : row
                ? row[key]
                : "",
        }
    }) as FormItemSchemas[]

    return schemas
}

function handleEditAttendance(row) {
    setModalValue({
        visible: true,
        title: "编辑薪资",
        row,
        schema: getSchema(row),
    })
}

function handleCreateAttendance() {
    setModalValue({
        visible: true,
        title: "创建薪资",
        row: "create",
        schema: getSchema(),
    })
    nextTick(() => {})
}

function handleSuccessSubmit() {
    setModalValue({
        visible: false,
    })
    reload()
}
</script>
<style lang="scss"></style>
