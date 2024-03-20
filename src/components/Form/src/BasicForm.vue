<template>
    <el-form ref="formElRef" v-bind="getFormProps">
        <el-row class="w-full">
            <template v-for="schema in getSchema" :key="schema.field">
                <FormItem
                    :schema="schema"
                    :form-modal="formModel"
                    :set-form-model="setFormModelField"
                    @enter-press="handleFormItemEnterPress"
                >
                    <template
                        #[item]="data"
                        v-for="item in Object.keys($slots)"
                    >
                        <slot :name="item" v-bind="data || {}"></slot>
                    </template>
                </FormItem>
            </template>

            <FormActionItem
                v-bind="getActionProps"
                v-if="getActionProps.isShow"
            >
                <template
                    v-for="item in [
                        'action-before',
                        'action-center',
                        'action-after',
                    ]"
                    #[item]="data"
                >
                    <slot :name="item" v-bind="data || {}" />
                </template>
            </FormActionItem>
        </el-row>
    </el-form>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref, reactive, onMounted } from "vue"
import { BasicFormProps, FormActionType } from "./types/form"
import { Nullable } from "vitest"
import { useFormValues } from "./hooks/useFormValues"
import FormItem from "./component/FormItem.vue"
import { useFormEvents } from "./hooks/useFormEvents"
import { useActionEvents } from "./hooks/useActionEvents"
import { createFormContext } from "./hooks/useFormContext"
import { FormInstance } from "element-plus"
import FormActionItem from "./component/FormAction.vue"
import { basicProps } from "./props"
import { NEXT_DEFAULT_BYTE, NEXT_FORMAT_DEFAULT_BYTE } from "../const"
export default defineComponent({
    name: "BasicForm",
    emits: ["register", "reset", "submit", "enter-press"],
    components: {
        FormItem,
        FormActionItem,
    },
    props: basicProps,
    setup(props, { attrs, emit }) {
        // form 实例
        const formElRef = ref<Nullable<FormActionType | FormInstance>>(null)
        // 内部参数
        const innerFormProps = ref<Partial<BasicFormProps>>({})
        // 默认时候的表单
        const defaultValueRef = ref<Recordable>({})
        // form表单绑定的数据
        const formModel = reactive<Recordable>({})

        
        // 获取配置
        const getProps = computed(() => {
            return {
                ...attrs,
                ...props,
                ...unref(innerFormProps),
            } as BasicFormProps
        })

        const getSchema = computed(() => {
            let { schemas = [] } = unref(getProps)

            schemas = schemas.map(item => {
                const {
                    isNestData,
                    nestByte = NEXT_DEFAULT_BYTE,
                    nestReplaceByte = NEXT_FORMAT_DEFAULT_BYTE,
                } = item

                if (isNestData) {
                    var reg = new RegExp("\\" + nestByte, "g")
                    item.field = item.field.replace(reg, nestReplaceByte)
                }
                return item
            })
            return schemas
        })

        const { getFormProps, initForm } = useFormValues({
            getProps,
            formModel,
            getSchema,
            defaultValueRef,
        })
        // 修改props
        async function setProps(
            formProps: Partial<BasicFormProps>
        ): Promise<void> {
            innerFormProps.value = {
                ...(unref(innerFormProps) || {}),
                ...formProps,
            }
        }
        const {
            setFormSchemas,
            getFormValues,
            validate,
            validateField,
            getFormField,
            resetFields,
            handleSubmit,
            clearValidate,
            setFieldsValue,
        } = useFormEvents(emit, {
            getProps,
            setProps,
            initForm,
            formModel,
            formElRef: formElRef as Ref<FormActionType>,
            defaultValueRef,
            getSchema,
        })

        // 修改表单model
        function setFormModelField(key: string, value: any) {
            formModel[key] = value
        }

        // input回车事件
        function handleFormItemEnterPress(key: string, value: any) {
            emit("enter-press", { key, value })
        }

        // 获取 action 配置
        const { getActionProps } = useActionEvents({
            getProps,
        })

        const formAction: FormActionType = {
            setProps,
            setFormSchemas,
            getFormValues,
            validate,
            validateField,
            getFormField,
            clearValidate,
            resetFields,
            setFieldsValue,
        }

        // 创建 action 函数
        createFormContext({
            resetAction: resetFields,
            submitAction: handleSubmit,
        })

        onMounted(() => {
            emit("register", formAction)
            initForm()
        })
        return {
            formElRef,
            getProps,
            getFormProps,
            getSchema,
            formModel,
            setFormModelField,
            getActionProps,
            handleFormItemEnterPress,
        }
    },
})
</script>
<style lang="less" scoped></style>
