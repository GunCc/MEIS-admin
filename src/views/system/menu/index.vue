<template>
    <PageWrapper>
        <basic-table @register="register">
            <template #action-before>
                <el-button type="success" @click="handleCreateUser">
                    添加
                </el-button>
            </template>

            <template #meta_keepAlive="{ row }">
                {{ row.keepAlive ? "是" : "否" }}
            </template>

            <template #p_id="{ row }">
                {{ row.p_id == 0 ? "一级" : row.name }}
            </template>

            <template #hidden="{ row }">
                {{ row.hidden ? "显示" : "隐藏" }}
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
import { getList, removeMenu, updateMenu } from "@/api/v1/system/menu"
import { TableColumnAction } from "@c/TableAction"
import { cloneDeep, isFunction, keys, pick } from "lodash"
import { keysOf } from "element-plus/es/utils"
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

const modalProps = ref<ModalProps>({
    title: "",
    schema: [],
    row: "create",
})

const formModel = reactive<Recordable>({})

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

const [register, { getVialdColumn, reload, getTableDataSource }] = useTable({
    title: "菜单管理",
    api: getList,
    immediate: true,
    defaultExpandAll: true,
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
            prop: "p_id",
            label: "父级菜单",
            canViald: true,
            width: 200,
            columnToForm: {
                component: "Select",
                componentProps: {
                    alwaysLoad: true,
                    dataSource: handleGetSource,
                    labelField: "name",
                    valueField: "id",
                },
            },
        },
        {
            prop: "id",
            label: "id",
            width: 80,
        },

        {
            prop: "name",
            label: "菜单名",
            canViald: true,
            width: 100,
        },
        {
            prop: "path",
            label: "路径",
            canViald: true,
            width: 120,
        },
        {
            prop: "component",
            label: "路由映射组件",
            canViald: true,
            width: 200,
        },
        {
            prop: "hidden",
            label: "是否显示",
            canViald: true,
            columnToForm: {
                slot: "hidden",
            },
        },
        {
            prop: "meta.sort",
            label: "排序",
            canViald: true,
            width: 80,
            columnToForm: {
                isNestData: true,
                defaultValue: "50",
                value: row => {
                    return row.meta.sort
                },
            },
        },
        {
            prop: "meta.title",
            label: "标题",
            canViald: true,
            width: 80,
            columnToForm: {
                isNestData: true,
                value: row => {
                    return row.meta.title
                },
            },
        },
        {
            prop: "meta.keepAlive",
            label: "缓存",
            canViald: true,
            width: 80,
            isTransitionToDelimiter: true,
            columnToForm: {
                slot:"keepAlive",
                isNestData: true,
                value: row => {
                    return row.meta.keepAlive
                },
            },
        },
        {
            prop: "meta.icon",
            label: "图标",
            canViald: true,
            width: 80,
            columnToForm: {
                isNestData: true,
                value: row => {
                    return row.meta.icon
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
            width: 160,
        },
    ],
})
let schemasSetting = ref<Recordable[]>([])

const actionRemoveSetting = computed(() => {
    return {
        context: row => {
            return `确定删除${row.name}菜单吗？`
        },
    }
})

function handleGetSource(): Recordable[] {
    const values = cloneDeep(getTableDataSource())
    values.unshift({
        id: 0,
        name: "一级菜单",
    })
    return values
}

async function handleActionDelete(row) {
    try {
        await removeMenu(row)
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
        let { defaultValue = "", value, isNestData } = item
        let nValue = (row && isFunction(value) && value(row)) ?? value

        if (row && !isNestData) defaultValue = row[key]

        if (row && nValue) defaultValue = nValue

        return {
            ...item,
            label: item.label,
            field: item.prop,
            defaultValue,
        }
    }) as FormItemSchemas[]
    return schemas
}

function handleEditUser(row) {
    setModalValue({
        visible: true,
        title: "编辑菜单",
        row,
        schema: getSchema(row),
    })
}

function handleCreateUser() {
    setModalValue({
        visible: true,
        title: "创建菜单",
        row: "create",
        schema: getSchema(),
    })
}

function handleSuccessSubmit() {
    setModalValue({
        visible: false,
    })
    reload()
}
</script>
<style lang="scss"></style>
