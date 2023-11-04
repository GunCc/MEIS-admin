<template>
    <div>
        <el-button type="success" size="small" @click="handleAdd">
            添加
        </el-button>
        <BasicTable @register="register" :autoHeight="false">
            <template #action="{ row }">
                <TableColumnAction
                    :row="row"
                    :remove-button-setting="getButtonSetting(row)"
                    @action-remove="handleActionDelete"
                >
                    <template #before-action="{ value }">
                        <el-button
                            size="small"
                            type="primary"
                            @click="handleActionEdit(value)"
                        >
                            编辑
                        </el-button>
                    </template>
                </TableColumnAction>
            </template>
        </BasicTable>

        <BasicModal v-bind="unref(getBasicModal)" v-model:visible="visible">
            <template #header>
                {{ getBasicModal.title }}
            </template>
            <template #default>
                <basic-form
                    @register="registerForm"
                    :schemas="getSchemasSetting"
                    @submit="handleFormSubmit"
                >
                </basic-form>
            </template>
        </BasicModal>
    </div>
</template>
<script lang="ts">
import { BasicTable, useTable } from "@c/Table/index"
import { TableColumnAction } from "@c/TableAction"
import { BasicForm, useForm } from "@c/Form"
import { useModalType } from "./hooks/useModalType"
import { ResourceType } from "@/api/model/upload/request"

export default defineComponent({
    name: "ManagerModalType",
    components: { BasicTable, TableColumnAction, BasicForm },
    props: {
        uploadTypes: {
            type: Array as PropType<ResourceType[]>,
            default: () => [],
        },
    },
    setup(props, { emit }) {
        const visible = ref<boolean>(false)

        const [registerForm, { setFormSchemas }] = useForm()

        const [register, { getVialdColumn, setProps }] = useTable({
            dataSource: props.uploadTypes,
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

        const {
            getBasicModal,
            getSchemasSetting,
            handleActionDelete,
            handleActionEdit,
            handleAdd,
            handleFormSubmit,
        } = useModalType(setVisible, getVialdColumn, setFormSchemas, emit)

        const getButtonSetting = computed(() => row => {
            return {
                disabled: row.id == "-1" ?? true,
            }
        })

        watch(
            () => props.uploadTypes,
            val => {
                setProps({
                    dataSource: val,
                })
            },
            {
                immediate: true,
                deep: true,
            }
        )

        function setVisible(flag: boolean = true) {
            visible.value = flag
        }

        return {
            visible,
            register,
            registerForm,
            getButtonSetting,
            getSchemasSetting,
            getBasicModal,
            handleActionDelete,
            handleActionEdit,
            handleAdd,
            handleFormSubmit,
        }
    },
})
</script>
<style lang="scss"></style>
