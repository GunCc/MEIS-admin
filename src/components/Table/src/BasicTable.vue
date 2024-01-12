<template>
    <div
        class="bg-white dark:bg-gray-900"
        :class="`${getProps.showShadow && 'shadow'} ${getProps.tableClass}`"
        ref="tableElRef"
    >
        <!-- 搜索表格 -->
        <BasicForm
            ref="formElRef"
            @register="registerTableForm"
            @submit="handleSearchInfoChange"
            v-bind="getFormSetting"
            v-if="getProps.showSearchForm"
        >
            <template
                v-for="item in [
                    `action-before`,
                    'action-center',
                    'action-after',
                ]"
                #[item]="scope"
            >
                <slot :name="item" v-bind="scope || {}"></slot>
            </template>
            <template #[item]="data" v-for="item in getFormSoltKeys">
                <slot :name="item" v-bind="data || {}"></slot>
            </template>
        </BasicForm>

        <div
            class="text-lg font-weight-bold pb-5 table-title"
            v-if="getProps.title"
        >
            {{ getProps.title || "表格" }}
        </div>

        <el-table
            v-bind="getTableProps"
            style="width: 100%"
            v-loading="getLoading"
        >
            <el-table-column
                v-for="item in getColumnView"
                :key="item.prop"
                v-bind="item"
            >
                <template
                    #default="scope"
                    v-if="Object.keys($slots).includes(item.prop as string)"
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
import { useLoading } from "./hooks/useLoading"
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
        autoHeight: propTypes.bool.def(true),
        showSearchForm: propTypes.bool.def(true),
        showPagination: propTypes.bool.def(true),
        showShadow: propTypes.bool.def(true),
        tableClass: propTypes.string.def("p-5 m-5 mb-0"),
        rowKey: propTypes.string.def("id"),
    },
    setup(props, { emit, slots }) {
        // 获取 table 对象
        const tableElRef = ref(null)
        const formElRef = ref(null)

        const innerTableProps = ref<Partial<BasicTableProps>>()

        // const paginationRef = ref<Partial<BasicTableProps>>()
        // const loadingRef = ref<boolean>(false);

        const getProps = computed(() => {
            return {
                ...props,
                ...unref(innerTableProps),
            } as BasicTableProps
        })

        const getTableProps = computed(() => {
            const { autoHeight } = unref(getProps)
            return {
                ...unref(getProps),
                height: autoHeight ? unref(getTableHeight) : null,
                data: unref(getDataSource),
            }
        })
        // 修改props
        function setProps(props: Partial<BasicTableProps>) {
            innerTableProps.value = { ...unref(innerTableProps), ...props }
        }

        // 使用loading
        const { setLoading, getLoading } = useLoading()

        // 使用form表单进行搜索
        const [registerTableForm, formActions] = useForm()

        // 获取column
        const { getVialdColumn, getColumnView } = useTableColumn({
            getProps,
        })

        // 获取分页数据
        const { getPaginationProps, setPagination } = usePagination({
            getProps,
        })

        // 获取数据资源
        const {
            getDataSource,
            handlePageChange,
            handleFetch,
            reload,
            getTableDataSource,
            getTableRawDataSource,
        } = useDataSource({
            emit,
            getProps,
            setPagination,
            getPaginationProps,
            getFormValues: formActions.getFormValues,
            setLoading,
        })
        // 表格使用form表单
        const {
            getFormSetting,
            handleSearchInfoChange,
            getFormSoltKeys,
            replaceFormSlotKey,
        } = useTableForm({
            getProps,
            handleFetch,
            slots,
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
            reload,
            getTableDataSource,
            getTableRawDataSource,
            // getDataSource
        }

        onMounted(() => {
            emit("register", actions)
        })
        return {
            tableElRef,
            formElRef,
            getLoading,
            setProps,
            getProps,
            getTableProps,
            getPaginationProps,
            getColumnView,
            registerTableForm,
            getFormSetting,
            handlePageChange,
            handleSearchInfoChange,
            getFormSoltKeys,
            replaceFormSlotKey,
        }
    },
})
</script>
<style lang="scss"></style>
