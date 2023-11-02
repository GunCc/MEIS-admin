<template>
    <div>
        <el-button type="success" size="small" @click="handleAdd"
            >添加</el-button
        >
        <BasicTable @register="register" :autoHeight="false">
            <template #action="{ row }">
                <TableColumnAction
                    :row="row"
                    :edit-button-setting="getButtonSetting(row)"
                    :remove-button-setting="getButtonSetting(row)"
                    :schemas-setting="schemasSetting"
                    @register="registerTableAction"
                    @action-edit="handleActionEdit"
                    @action-remove="handleActionDelete"
                    @form-submit="handleFormSubmit"
                />
            </template>
        </BasicTable>
    </div>
</template>
<script lang="ts">
import { BasicTable, useTable } from "@c/Table/index"
import {
    getFileType,
    removeFileType,
    updateFileType,
    addFileType,
} from "@/api/v1/system/upload"
import { TableColumnAction, useTableAction } from "@c/TableAction"
import { ResourceType } from "@/api/model/upload/request"

export default defineComponent({
    name: "ManagerModalType",
    components: { BasicTable, TableColumnAction },
    setup() {
        const modalType = ref<"edit" | "add">("edit")
        const rowRef = ref<Recordable>({})
        const [registerTableAction, { handleSetVisible, setEditModalProps }] =
            useTableAction()

        const [register, { getVialdColumn, reload }] = useTable({
            api: getFileType,
            immediate: true,
            showShadow: false,
            showSearchForm: false,
            showPagination: false,
            tableClass: "",
            column: [
                {
                    prop: "id",
                    label: "id",
                },
                {
                    prop: "name",
                    label: "分类名",
                    canViald: true,
                },
                {
                    prop: "action",
                    label: "操作",
                },
            ],
            afterFetch: async (items: Recordable[]) => {
                items.unshift({
                    id: "-1",
                    name: "全部",
                })
                return items
            },
        })

        const getButtonSetting = computed(() => row => {
            return {
                disabled: row.id == "-1" ?? true,
            }
        })
        let schemasSetting = ref<Recordable[]>([])

        function handleActionEdit(row) {
            modalType.value = "edit"
            rowRef.value = row
            handleSetVisible()
            schemasSetting.value = getVialdColumn().map(item => {
                let key = item.prop
                return {
                    label: item.label,
                    field: item.prop,
                    defaultValue: row[key],
                }
            })
        }

        async function handleActionDelete(row) {
            try {
                await removeFileType({
                    id: row.id,
                })
                await reload()
            } catch (error) {
                console.error(error)
            }
        }

        function handleAdd() {
            modalType.value = "add"
            handleSetVisible()
            setEditModalProps({
                title: "添加分类",
            })
            schemasSetting.value = getVialdColumn().map(item => {
                return {
                    label: item.label,
                    field: item.prop,
                    defaultValue: "",
                }
            })
        }

        async function handleFormSubmit(data: Recordable) {
            try {
                const getApi =
                    unref(modalType) == "edit" ? updateFileType : addFileType
                let params = {
                    ...data,
                    [unref(modalType) == "edit" ? "id" : ""]:
                        unref(modalType) == "edit" ? unref(rowRef).id : "",
                } as ResourceType
                await getApi(params)
                handleSetVisible(false)
                await reload()
            } catch (error) {
                console.error(error)
            }
        }

        return {
            register,
            getButtonSetting,
            schemasSetting,
            handleActionEdit,
            handleActionDelete,
            handleAdd,
            registerTableAction,
            handleFormSubmit,
        }
    },
})
</script>
<style lang="scss"></style>
