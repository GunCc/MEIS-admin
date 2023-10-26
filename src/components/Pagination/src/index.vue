<template>
    <el-pagination
        class="meis-pagination"
        v-bind="getProps"
        v-model:current-page="currentPage"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
    />
</template>
<script lang="ts">
import { propTypes } from "@/utils/propTypes"

export default defineComponent({
    name: "BasicPagination",
    props: {
        small: propTypes.bool.def(false),
        background: propTypes.bool.def(true),
        pageSize: propTypes.number,
        defaultPageSize: propTypes.number,
        total: propTypes.number.def(0),
        layout: propTypes.string,
        current: propTypes.number.def(1),
    },
    emits: ["page-change"],
    setup(props, { emit }) {
        const currentPage = ref<number>(1)
        const getProps = computed(() => {
            return {
                ...props,
            }
        })
        watch(
            () => props.current,
            () => (currentPage.value = props.current),
            {
                immediate: true,
            }
        )
        function handleCurrentChange(page: number) {
            emit("page-change", page)
        }
        function handleSizeChange(page: number) {
            currentPage.value = page
        }
        return {
            handleSizeChange,
            currentPage,
            handleCurrentChange,
            getProps,
        }
    },
})
</script>
<style lang="scss"></style>
