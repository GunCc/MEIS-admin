<template>
    <PageWrapper>
        <basic-table @register="register">
            <template #action-before>
                <el-button type="success" @click="handleCreateAttendance">
                    添加
                </el-button>
            </template>
            <template #role_ids="{ row }">
                {{ row.roles.map(item => item.comment).join(",") }}
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
                            @click="handleEditAttendance(value)"
                        >
                            编辑
                        </el-button>
                        <el-button
                            type="warning"
                            size="small"
                            @click="handleResetPasswordUser(value)"
                        >
                            重置密码
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
import {
    getList,
    removeAttendance,
    updateAttendance,
} from "@/api/v1/oa/attendance"
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
    title: "员工管理",
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
            return `确定删除${row.nickname}员工吗？删除后将无法恢复，如果以后还需再次使用建议执行冻结操作。`
        },
    }
})

async function handleActionDelete(row) {
    try {
        await removeAttendance(row)
        reload()
    } catch (err) {
        error(err as string)
    }
}

function passwordVaild(_: any, __: any, callback: any) {
    setTimeout(() => {
        callback(new Error("Please input digits"))
    }, 100)
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

function handleEditAttendance(row) {
    setModalValue({
        visible: true,
        title: "编辑员工",
        row,
        schema: getSchema(row),
    })
}

function handleCreateAttendance() {
    setModalValue({
        visible: true,
        title: "创建员工",
        row: "create",
        schema: getSchema(),
    })
    nextTick(() => {})
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
        await updateAttendance(form)
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
