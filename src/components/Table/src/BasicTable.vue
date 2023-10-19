<template>
    <div class="bg-white p-5 shadow">
        <div class="text-lg font-weight-bold mb-5">
            {{ getProps.title || "表格" }}
        </div>

        <el-table v-bind="getTableProps">
            <el-table-column prop="date" label="Date" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="address" label="Address" />
        </el-table>
        <Pagination class="mt-5 text-right" v-bind="getPaginationProps" />
    </div>
</template>
<script lang="ts">
import { BasicTableProps } from "./types/index"
import { TableActions } from "./types/actions"
import { useDataSource } from "./hooks/useDataSource"
import { usePagination } from "./hooks/usePagination"
import { Pagination } from "@c/Pagination/index"

export default defineComponent({
    name: "BasicTable",
    emits: ["register"],
    components: {
        Pagination,
    },
    setup(props, { emit }) {
        const innerTableProps = ref<Partial<BasicTableProps>>()
        // const loadingRef = ref<boolean>(false);
        const getProps = computed(() => {
            return {
                ...props,
                ...unref(innerTableProps),
            } as BasicTableProps
        })

        const getTableProps = computed(() => {
            return {
                data: [],
            }
        })
        // 修改props
        function setProps(props: Partial<BasicTableProps>) {
            console.log("调用", props)
            innerTableProps.value = { ...unref(innerTableProps), ...props }
        }

        // 获取数据资源
        const {} = useDataSource({
            getProps,
        })

        // 获取分页数据
        const { getPaginationProps } = usePagination()

        const actions: TableActions = {
            setProps,
        }

        onMounted(() => {
            emit("register", actions)
        })
        return {
            setProps,
            getProps,
            getTableProps,
            getPaginationProps,
        }
    },
})
</script>
<style lang="scss"></style>
