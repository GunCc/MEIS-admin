<template>
    <div class="bg-white p-5 shadow">
        <!-- 搜索表格 -->
        <BasicForm
            @register="registerTableForm"
            v-if="getProps.formSettings"
            v-bind="getFormSetting"
        ></BasicForm>
        <div class="text-lg font-weight-bold mb-5">
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
        <Pagination class="mt-5 text-right" v-bind="getPaginationProps" />
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

export default defineComponent({
    name: "BasicTable",
    emits: ["register", "fetch-success"],
    components: {
        Pagination,
        BasicForm,
    },
    setup(props, { emit }) {
        const innerTableProps = ref<Partial<BasicTableProps>>()

        // const paginationRef = ref<Partial<BasicTableProps>>()
        // const loadingRef = ref<boolean>(false);

        // 使用form表单进行搜索
        const [registerTableForm] = useForm()
        const getProps = computed(() => {
            return {
                ...props,
                ...unref(innerTableProps),
            } as BasicTableProps
        })

        const getTableProps = computed(() => {
            return {
                data: unref(getDataSource),
            }
        })
        // 修改props
        function setProps(props: Partial<BasicTableProps>) {
            console.log("调用", props)
            innerTableProps.value = { ...unref(innerTableProps), ...props }
        }

        // 获取数据资源
        const { getDataSource } = useDataSource({
            emit,
            getProps,
        })

        // 获取column
        const { getColumn, getVialdColumn } = useTableColumn({
            getProps,
        })

        // 获取分页数据
        const { getPaginationProps } = usePagination()

        // 表格使用form表单
        const { getFormSetting } = useTableForm({ getProps })

        const actions: TableActions = {
            setProps,
            getVialdColumn,
        }

        onMounted(() => {
            emit("register", actions)
        })
        return {
            setProps,
            getProps,
            getTableProps,
            getPaginationProps,
            getColumn,
            registerTableForm,
            getFormSetting,
        }
    },
})
</script>
<style lang="scss"></style>