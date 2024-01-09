<template>
    <el-sub-menu :index="path" v-if="children && children.length != 0">
        <template #title>
            <span>{{ title }}</span>
        </template>

        <template v-for="child in children" :key="child.path">
            <BasicMenuItem
                :path="child.path"
                :children="child.children || []"
                :title="child.title"
            ></BasicMenuItem>
        </template>
    </el-sub-menu>
    <el-menu-item :index="path" v-else>
        <template #title>
            <span>{{ title }}</span>
        </template>
    </el-menu-item>
</template>
<script lang="ts">
import { propTypes } from "@/utils/propTypes"

export default defineComponent({
    name: "BasicMenuItem",
    props: {
        title: propTypes.string.def(""),
        path: propTypes.string.def(""),
        children: {
            type: Array as PropType<MenuItem[]>,
            default: () => [] as MenuItem[],
        },
    },
})
</script>
<style lang="scss"></style>
