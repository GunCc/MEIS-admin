<template>
    <div>
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
        <BasicModal
            v-bind="getBasicModal"
            v-model:visible="visible"
            @before-close="handleBeforeClose"
        >
            <template #header>
                {{ getBasicModal.title }}
            </template>
            <template #default>
                <BasicEditForm
                    :schemas="schemasSetting"
                    @form-submit="handleFormSubmit"
                >
                </BasicEditForm>
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
import { TableActionInstance } from "./types"
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
        schemasSetting: {
            type: Array as PropType<FormItemSchemas[]>,
        },
        editButtonSetting: {
            type: Object as PropType<ActionButtonSetting>,
            default: () => {},
        },
        removeButtonSetting: {
            type: Object as PropType<ActionButtonSetting>,
            default: () => {},
        },
    },
    emits: ["action-edit", "action-remove", "register", "form-submit"],
    components: {
        BasicModal,
        BasicEditForm,
    },
    setup(props, { emit }) {
        const visible = ref<Boolean>(false)
        const basicModalProps = ref<Recordable>({})
        const getBasicModal = computed(() => {
            return {
                title: "标题",
                width: "640px",
                appendToBody: true,
                ...unref(basicModalProps),
            }
        })
        const getActionColumnBind = computed(() => {
            const { label } = props
            return {
                label,
            }
        })

        const getButtonList = computed((): ActionButtonSetting[] => {
            const { buttonList, editButtonSetting, removeButtonSetting } = props
            if (!isArray(buttonList) || buttonList.length == 0) {
                return [
                    Object.assign(
                        {
                            title: "编辑",
                            type: "primary",
                            size: "small",
                            handle: defaultHandleEdit,
                        },
                        editButtonSetting
                    ),
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
            const { row } = props
            setEditModalProps({
                title: "删除操作",
            })
            useWarnMessage({
                title: "删除",
                context: `您确定删除嘛？`,
                successFn: () => {
                    emit("action-remove", row)
                },
            })
        }
        function defaultHandleEdit() {
            const { row } = props
            // handleSetVisible()
            setEditModalProps({
                title: "编辑操作",
            })
            emit("action-edit", row)
        }
        function handleBeforeClose() {
            // visible.value = false
        }

        function handleSetVisible(flag: boolean = true) {
            visible.value = flag
        }

        function setEditModalProps(props: Recordable) {
            basicModalProps.value = {
                ...unref(basicModalProps),
                ...props,
            }
        }

        function handleFormSubmit(data: Recordable) {
            emit("form-submit", data)
        }

        const action: TableActionInstance = {
            setEditModalProps,
            handleSetVisible,
        }

        onMounted(() => {
            emit("register", action)
        })
        return {
            visible,
            getBasicModal,
            defaultHandleRemove,
            getActionColumnBind,
            getButtonList,
            handleBeforeClose,
            handleFormSubmit,
        }
    },
})
</script>
<style lang="scss"></style>
