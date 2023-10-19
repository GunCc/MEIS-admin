<template>
    <div>
        <el-button
            v-for="item in buttonList"
            :key="item.handle"
            :type="item.type"
            :size="item.size"
        >
            {{ item.title }}
        </el-button>
    </div>
</template>
<script lang="ts">
import { propTypes } from "@/utils/propTypes"
import { ButtonProps } from "element-plus"
import { PropType } from "vue"
interface ActionButtonSetting extends Partial<ButtonProps> {}
export default defineComponent({
    name: "TableColumnAction",
    props: {
        label: propTypes.string.def("操作"),
        row: {
            type: Object,
        },
        buttonList: {
            type: Array as PropType<ActionButtonSetting[]>,
            default: () => [
                {
                    title: "编辑",
                    type: "primary",
                    size: "small",
                },
                {
                    title: "删除",
                    type: "danger",
                    size: "small",
                },
            ],
        },
    },
    setup(props) {
        const getActionColumnBind = computed(() => {
            const { label } = props
            return {
                label,
            }
        })
        return {
            getActionColumnBind,
        }
    },
})
</script>
<style lang="scss"></style>
