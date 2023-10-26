<template>
    <div class="bg-white p-5 shadow dark:bg-gray-900 m-5 mb-0" ref="tableElRef">
        <!-- 搜索表格 -->
        <BasicForm
            ref="formElRef"
            @register="registerTableForm"
            @submit="handleSearchInfoChange"
            v-if="getProps.formSettings"
            v-bind="getFormSetting"
        ></BasicForm>

        <div class="text-lg font-weight-bold pb-5 table-title">
            {{ getProps.title || "表格" }}
        </div>

        <el-table v-bind="getTableProps">
            <el-table-column
                v-for="item in getColumn"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
            >
                <template
                    #default="scope"
                    v-if="Object.keys($slots).includes(item.prop)"
                >
                    <slot :name="item.prop" v-bind="scope || {}"></slot>
                </template>
            </el-table-column>
        </el-table>

        <div class="table-footer pt-5">
            <Pagination
                @page-change="handlePageChange"
                class="text-right"
                v-bind="getPaginationProps"
                v-if="getProps.showPagination"
            />
        </div>
    </div>
</template>
<script lang="ts">
import { BasicTableProps } from "./types/index"
import { TableActions } from "./types/actions"
import { useDataSource } from "./hooks/useDataSource"
import { usePagination } from "./hooks/usePagination"
import { useTableColumn } from "./hooks/useTableColumn"
import { useTableForm } from "./hooks/useTableForm"
import { Pagination } from "@c/Pagination/index"
import { BasicForm, useForm } from "@c/Form/index"
import { useTableScroll } from "./hooks/useTableScroll"
import { propTypes } from "@/utils/propTypes"

export default defineComponent({
    name: "BasicTable",
    emits: ["register", "fetch-success"],
    components: {
        Pagination,
        BasicForm,
    },
    props: {
        showSearchForm: propTypes.bool.def(true),
        showPagination: propTypes.bool.def(true),
    },
    setup(props, { emit }) {
        // 获取 table 对象
        const tableElRef = ref(null)
        const formElRef = ref(null)

        const innerTableProps = ref<Partial<BasicTableProps>>()

        // const paginationRef = ref<Partial<BasicTableProps>>()
        // const loadingRef = ref<boolean>(false);

        // 使用form表单进行搜索
        const [registerTableForm, formActions] = useForm()
        const getProps = computed(() => {
            return {
                ...props,
                ...unref(innerTableProps),
            } as BasicTableProps
        })

        const getTableProps = computed(() => {
            return {
                height: unref(getTableHeight),
                data: unref(getDataSource),
            }
        })
        // 修改props
        function setProps(props: Partial<BasicTableProps>) {
            console.log("调用", props)
            innerTableProps.value = { ...unref(innerTableProps), ...props }
        }

        // 获取column
        const { getColumn, getVialdColumn } = useTableColumn({
            getProps,
        })

        // 获取分页数据
        const { getPaginationProps, setPagination } = usePagination({
            getProps,
        })

        // 获取数据资源
        const { getDataSource, handlePageChange, handleFetch } = useDataSource({
            emit,
            getProps,
            setPagination,
            getPaginationProps,
            getFormValues: formActions.getFormValues,
        })
        // 表格使用form表单
        const { getFormSetting, handleSearchInfoChange } = useTableForm({
            getProps,
            handleFetch,
        })

        // 表格滚动和高度
        const { getTableHeight } = useTableScroll({
            getProps,
            tableElRef,
            formElRef,
        })

        const actions: TableActions = {
            setProps,
            getVialdColumn,
        }

        onMounted(() => {
            emit("register", actions)
        })
        return {
            tableElRef,
            formElRef,
            setProps,
            getProps,
            getTableProps,
            getPaginationProps,
            getColumn,
            registerTableForm,
            getFormSetting,
            handlePageChange,
            handleSearchInfoChange,
        }
    },
})
</script>
<style lang="scss"></style>
