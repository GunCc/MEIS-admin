<template>
    <PageWrapper>
        <basic-table @register="register">
            <template #action-before>
                <el-button type="success" @click="handleCreateUser">
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
import { getList, removeUser, updateUser } from "@/api/v1/system/user"
import { TableColumnAction } from "@c/TableAction"
import { keys, pick } from "lodash"
import { keysOf } from "element-plus/es/utils"
import { FormItemSchemas } from "@/components/Form"

import ModalForm from "./ModalForm.vue"
import { clone } from "lodash"

interface ModalProps {
    title: string
    schema: FormItemSchemas[]
    row: Recordable | "create"
}

const visible = ref<boolean>(false)

const modalProps = ref<ModalProps>({
    title: "",
    schema: [],
    row: "create",
})

const getModalProps = computed(() => {
    return unref(modalProps)
})

// const getEnable = computed(() => row => {
//     return row.enable
// })

function setModalValue(values: Partial<ModalProps & { visible: boolean }>) {
    let innerModalProps = pick(values, keys(unref(modalProps)))
    modalProps.value = {
        ...unref(modalProps),
        ...innerModalProps,
    }
    visible.value = !!values.visible
}

const [register, { getVialdColumn, reload }] = useTable({
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
            width: 300,
        },
        {
            prop: "email",
            label: "邮箱",
            canViald: true,
            width: 220,
        },
        {
            prop: "nickname",
            label: "昵称",
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
            width: 80,
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
            width: 160,
        },
    ],
})
let schemasSetting = ref<Recordable[]>([])

const actionRemoveSetting = computed(() => {
    return {
        context: row => {
            return `确定删除${row.nickname}用户吗？删除后将无法恢复，如果以后还需再次使用建议执行冻结操作。`
        },
    }
})

async function handleActionDelete(row) {
    try {
        await removeUser(row)
        reload()
    } catch (error) {
        console.error(error)
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
    schemas.push(
        ...([
            {
                label: `${row ? "修改" : ""}密码`,
                field: "password",
                defaultValue: "",
                rules: [{ validator: passwordVaild, message: "密码不一致" }],
                componentProps: {
                    type: "password",
                    placeholder: `如果要${row ? "修改" : ""}密码请输入你的密码`,
                    showPassword: true,
                    validateEvent: false,
                },
            },
            {
                label: "确认密码",
                field: "passwords",
                defaultValue: "",
                rules: [{ validator: passwordVaild, message: "密码不一致" }],
                componentProps: {
                    type: "password",
                    placeholder: "请再次输入你的密码",
                    showPassword: true,
                    validateEvent: false,
                },
            },
        ] as FormItemSchemas[])
    )
    return schemas
}

function handleEditUser(row) {
    setModalValue({
        visible: true,
        title: "编辑用户",
        row,
        schema: getSchema(row),
    })
}

function handleCreateUser() {
    setModalValue({
        visible: true,
        title: "创建用户",
        row: "create",
        schema: getSchema(),
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
        await updateUser(form)
        reload()
    } catch (error) {
        console.error(error)
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
