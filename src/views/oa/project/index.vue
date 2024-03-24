<template>
    <PageWrapper>
        <basic-table @register="register">
            <template #action-before>
                <el-button type="success" @click="handleCreateUser">
                    添加
                </el-button>
            </template>
            <template #status="{ row }">
                <el-switch
                    :model-value="row.status ? true : false"
                    @change="bool => handleTableSwitch(bool, row)"
                ></el-switch>
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
                            @click="handleEditUser(value)"
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
import { getList, removeProject, updateProject } from "@/api/v1/oa/project"
import { TableColumnAction } from "@c/TableAction"
import { isFunction, keys, pick } from "lodash"
import { FormItemSchemas } from "@/components/Form"

import ModalForm from "./ModalForm.vue"
import { clone } from "lodash"
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
    title: "项目管理",
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
            prop: "project_name",
            label: "项目名",
            width: 260,
            canViald: true,
        },
        {
            prop: "project_desc",
            label: "项目描述",
            width: 260,
            canViald: true,
        },
        {
            prop: "end_time",
            label: "结束时间",
            canViald: true,
            width: 260,
            columnToForm: {
                component: "DatePicker",
                componentProps: {
                    type: "datetime",
                },
            },
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
            return `确定删除${row.project_name}项目吗？删除后将无法恢复，如果以后还需再次使用建议执行冻结操作。`
        },
    }
})

async function handleActionDelete(row) {
    try {
        await removeProject(row)
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

function handleEditUser(row) {
    setModalValue({
        visible: true,
        title: "编辑项目",
        row,
        schema: getSchema(row),
    })
}

function handleCreateUser() {
    setModalValue({
        visible: true,
        title: "创建项目",
        row: "create",
        schema: getSchema(),
    })
    nextTick(() => {})
}

// 表格switch变化
async function handleTableSwitch(bool, row) {
    try {
        let status = bool ? 1 : 0
        if (status == row.status) return
        let form = {
            ...clone(row),
            status,
        }
        await updateProject(form)
        reload()
    } catch (err) {
        error(err as string)
    }
}

function handleSuccessSubmit() {
    setModalValue({
        visible: false,
    })
    reload()
}
</script>
<style lang="scss"></style>
