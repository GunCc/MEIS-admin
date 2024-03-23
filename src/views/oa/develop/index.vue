<template>
    <PageWrapper>
        <basic-table @register="register">
            <template #action-before>
                <el-button type="success" @click="handleCreateTrain">
                    添加
                </el-button>
            </template>
            <template #is_apart="{ row }">
                <el-switch
                    :model-value="row.is_apart ? true : false"
                    @change="bool => handleTableSwitch(bool, row)"
                ></el-switch>
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
                            @click="handleEditTrain(value)"
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
import { getList, removeTrain, updateTrain } from "@/api/v1/oa/train"
import { getAllList } from "@/api/v1/oa/personnel"
import { TableColumnAction } from "@c/TableAction"
import { clone, isFunction, keys, pick } from "lodash"
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
    title: "培训管理",
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
            label: "培训人员",
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
            prop: "train_name",
            label: "培训名称",
            width: 260,
            canViald: true,
        },
        {
            prop: "train_desc",
            label: "培训说明",
            width: 260,
            canViald: true,
        },
        {
            prop: "is_apart",
            label: "是否参加",
            width: 100,
            canViald: true,
            columnToForm: {
                slot: "is_apart",
            },
        },
        {
            prop: "reason",
            label: "原因",
            width: 260,
            canViald: true,
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
            return `确定删除${row.personnel.name}培训吗？删除后将无法恢复，如果以后还需再次使用建议执行冻结操作。`
        },
    }
})

async function handleActionDelete(row) {
    try {
        await removeTrain(row)
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

// 表格switch变化
async function handleTableSwitch(bool, row) {
    try {
        let is_apart = bool ? 1 : 0
        if (is_apart == row.is_apart) return
        let form = {
            ...clone(row),
            is_apart,
        }
        await updateTrain(form)
        reload()
    } catch (err) {
        error(err as string)
    }
}

function handleEditTrain(row) {
    setModalValue({
        visible: true,
        title: "编辑培训",
        row,
        schema: getSchema(row),
    })
}

function handleCreateTrain() {
    setModalValue({
        visible: true,
        title: "创建培训",
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
