<template>
    <PageWrapper>
        <basic-table @register="register">
            <template #action-before>
                <el-button type="success" @click="handleCreateRole">
                    添加
                </el-button>
            </template>
            <template #enable="{ row }">
                <el-switch
                    :model-value="row.enable ? true : false"
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
                            type="warning"
                            size="small"
                            @click="handleRoleBindMenus(value)"
                        >
                            绑定菜单
                        </el-button>
                        <el-button
                            type="primary"
                            size="small"
                            @click="handleEditRole(value)"
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
                <component
                    :is="getModalProps.component"
                    @success-submit="handleSuccessSubmit"
                    :schema-setting="getModalProps.schema"
                    :row="getModalProps.row"
                ></component>
            </template>
        </BasicModal>
    </PageWrapper>
</template>
<script lang="ts" setup>
import { BasicTable, useTable } from "@c/Table/index"
import { PageWrapper } from "@c/PageWrapper/index"
import { getList, removeRole, updateRole } from "@/api/v1/system/role"
import { TableColumnAction } from "@c/TableAction"
import { keys, pick } from "lodash"
import { keysOf } from "element-plus/es/utils"
import { FormItemSchemas } from "@/components/Form"

import ModalForm from "./ModalForm.vue"
import RoleBindMenusModalForm from "./ModalBindMenus.vue"
import { clone } from "lodash"
import { error } from "@/utils/log"
interface ModalProps {
    title: string
    schema: FormItemSchemas[]
    row: Recordable | "create"
    component: Component
}

const visible = ref<boolean>(false)

const modalProps = ref<ModalProps>({
    title: "",
    schema: [],
    row: "create",
    component: ModalForm,
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
    title: "角色管理",
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
            label: "id",
            width: 80,
        },
        {
            prop: "name",
            label: "角色名",
            canViald: true,
            width: 100,
        },
        {
            prop: "enable",
            label: "是否冻结",
            canViald: true,
            columnToForm: {
                slot: "enable",
            },
        },
        {
            prop: "comment",
            label: "备注",
            canViald: true,
            width: 200,
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
let schemasSetting = ref<Recordable[]>([])

const actionRemoveSetting = computed(() => {
    return {
        context: row => {
            return `确定删除${row.name}角色吗？删除后将无法恢复，如果以后还需再次使用建议执行冻结操作。`
        },
    }
})

async function handleActionDelete(row) {
    try {
        await removeRole(row)
        reload()
    } catch (err) {
        error(err as string)
    }
}

function passwordVaild(rule: any, value: any, callback: any) {
    setTimeout(() => {
        callback(new Error("Please input digits"))
    }, 100)
}

function getSchema(row?: Recordable): FormItemSchemas[] {
    let schemas = getVialdColumn().map(item => {
        let key = item.prop
        return {
            ...item,
            label: item.label,
            field: item.prop,
            defaultValue: row ? row[key] : "",
        }
    }) as FormItemSchemas[]
    return schemas
}

function handleEditRole(row) {
    setModalValue({
        visible: true,
        title: "编辑角色",
        row,
        schema: getSchema(row),
        component: markRaw(ModalForm),
    })
}

function handleRoleBindMenus(row) {
    setModalValue({
        visible: true,
        title: "编辑角色",
        row,
        schema: getSchema(row),
        component: markRaw(RoleBindMenusModalForm),
    })
}

function handleCreateRole() {
    setModalValue({
        visible: true,
        title: "创建角色",
        row: "create",
        schema: getSchema(),
        component: markRaw(ModalForm),
    })
}

// 表格switch变化
async function handleTableSwitch(bool, row) {
    try {
        let enable = bool ? 1 : 0
        if (enable == row.enable) return
        let form = {
            ...clone(row),
            enable,
        }
        await updateRole(form)
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
