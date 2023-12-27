<template>
    <div>
        <slot name="before-action" v-bind="{ value: row }"></slot>
        <el-button
            v-for="item in getButtonList"
            :key="item.handle"
            :type="item.type"
            :size="item.size"
            :disabled="item.disabled"
            @click="item.handle"
        >
            {{ item.title }}
        </el-button>
        <slot name="before-after" v-bind="{ value: row }"></slot>
    </div>
</template>
<script lang="ts">
import { propTypes } from "@/utils/propTypes"
import { ButtonProps } from "element-plus"
import { PropType } from "vue"
import { useWarnMessage } from "@c/Modal/index"
import { isArray, isFunction } from "lodash"
import { TableActionInstance } from "./types"
interface ActionButtonSetting extends Partial<ButtonProps> {
    title?: string | ((...args: any) => string)
    context?: string | ((...args: any) => string)
    handle?: (...args) => void
}
export default defineComponent({
    name: "TableColumnAction",
    props: {
        label: propTypes.string.def("操作"),
        row: {
            type: Object,
        },
        buttonList: {
            type: Array as PropType<ActionButtonSetting[]>,
            default: () => [],
        },
        removeButtonSetting: {
            type: Object as PropType<ActionButtonSetting>,
            default: () => {},
        },
    },
    emits: ["action-remove", "register"],
    components: {},
    setup(props, { emit }) {
        const getActionColumnBind = computed(() => {
            const { label } = props
            return {
                label,
            }
        })

        const getButtonList = computed((): ActionButtonSetting[] => {
            const { buttonList, removeButtonSetting } = props
            if (!isArray(buttonList) || buttonList.length == 0) {
                return [
                    Object.assign(
                        {
                            title: "删除",
                            type: "danger",
                            size: "small",
                            handle: defaultHandleRemove,
                        },
                        removeButtonSetting
                    ),
                ]
            }
            return buttonList
        })
        function defaultHandleRemove() {
            const { row, removeButtonSetting } = props
            const { title = "删除", context = "您确定删除嘛？" } =
                removeButtonSetting
            useWarnMessage({
                title: isFunction(title) ? title(row) : title,
                context: isFunction(context) ? context(row) : context,
                successFn: () => {
                    emit("action-remove", row)
                },
            })
        }
        function handleBeforeClose() {}

        const action: TableActionInstance = {}

        onMounted(() => {
            emit("register", action)
        })
        return {
            defaultHandleRemove,
            getActionColumnBind,
            getButtonList,
            handleBeforeClose,
        }
    },
})
</script>
<style lang="scss"></style>
