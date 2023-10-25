<template>
    <div>
        <el-button
            v-for="item in getButtonList"
            :key="item.handle"
            :type="item.type"
            :size="item.size"
            @click="item.handle"
        >
            {{ item.title }}
        </el-button>
        <BasicModal v-bind="getBasicModal" @before-close="handleBeforeClose">
            <template #header> {{ getModalHeader }} </template>
            <template #default>
                <BasicEditForm :schemas="editSchemas"> </BasicEditForm>
            </template>
            <!-- <template #footer>
                <slot name="footer"></slot>
            </template> -->
        </BasicModal>
    </div>
</template>
<script lang="ts">
import { propTypes } from "@/utils/propTypes"
import { ButtonProps } from "element-plus"
import { PropType } from "vue"
import { BasicModal, useWarnMessage } from "@c/Modal/index"
import { isArray } from "lodash"
import BasicEditForm from "./BasicEdit.vue"
import { FormItemSchemas } from "@/components/Form/src/types/form"
interface ActionButtonSetting extends Partial<ButtonProps> {
    title: string
    handle: (...args) => void
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
        editSchemas: {
            type: Array as PropType<FormItemSchemas[]>,
        },
    },
    emits: ["action-edit"],
    components: {
        BasicModal,
        BasicEditForm,
    },
    setup(props, { emit }) {
        const visible = ref<boolean>(false)
        const headerTitle = ref<string>("")
        const getBasicModal = computed(() => {
            return {
                width: "640px",
                appendToBody: true,
                visible: unref(visible),
            }
        })
        const getActionColumnBind = computed(() => {
            const { label } = props
            return {
                label,
            }
        })

        // 获取弹窗头部
        const getModalHeader = computed(() => {
            return unref(headerTitle)
        })
        const getButtonList = computed((): ActionButtonSetting[] => {
            const { buttonList } = props
            if (!isArray(buttonList) || buttonList.length == 0) {
                return [
                    {
                        title: "编辑",
                        type: "primary",
                        size: "small",
                        handle: defaultHandleEdit,
                    },
                    {
                        title: "删除",
                        type: "danger",
                        size: "small",
                        handle: defaultHandleRemove,
                    },
                ]
            }
            return buttonList
        })
        function defaultHandleRemove() {
            const { row } = props
            headerTitle.value = "删除操作"
            useWarnMessage({
                title: "删除",
                context: `您确定删除这个${row?.nickname}这个用户嘛？`,
            })
        }
        function defaultHandleEdit() {
            const { row } = props
            visible.value = true
            headerTitle.value = "编辑操作"
            emit("action-edit", row)
        }
        function handleBeforeClose() {
            visible.value = false
        }
        return {
            getModalHeader,
            getBasicModal,
            defaultHandleRemove,
            getActionColumnBind,
            getButtonList,
            handleBeforeClose,
        }
    },
})
</script>
<style lang="scss"></style>
