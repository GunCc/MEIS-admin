<template>
    <el-form ref="formElRef" v-bind="getFormProps">
        <el-row class="w-full">
            <template v-for="schema in getSchema" :key="schema.field">
                <FormItem
                    :schema="schema"
                    :form-modal="formModel"
                    :set-form-model="setFormModelField"
                >
                    <template
                        #[item]="data"
                        v-for="item in Object.keys($slots)"
                    >
                        <slot :name="item" v-bind="data || {}"></slot>
                    </template>
                </FormItem>
            </template>
        </el-row>
    </el-form>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref, reactive, onMounted } from "vue"
import { BasicFormProps, FormActionType } from "./types/form"
import { Nullable } from "vitest"
import { useFormValues } from "./hooks/useFormValues"
import { mergeData } from "@/utils/helper"
import FormItem from "./component/FormItem.vue"
import { useFormEvents } from "./hooks/useFormEvents"
import { FormInstance } from "element-plus"
export default defineComponent({
    name: "BasicForm",
    emits: ["register"],
    components: {
        FormItem,
    },
    setup(props, { attrs, emit }) {
        // form 实例
        const formElRef = ref<Nullable<FormActionType | FormInstance>>(null)
        // 内部参数
        const innerFormProps = ref<Partial<BasicFormProps>>({})
        const getProps = computed(() => {
            return {
                ...attrs,
                ...props,
                ...unref(innerFormProps),
            } as BasicFormProps
        })
        // form表单绑定的数据
        const formModel = reactive<Recordable>({})

        const getSchema = computed(() => {
            const { schemas = [] } = unref(getProps)
            return schemas
        })

        const { getFormProps, initForm } = useFormValues({
            getProps,
            formModel,
            getSchema,
        })
        // 修改props
        async function setProps(
            formProps: Partial<BasicFormProps>
        ): Promise<void> {
            innerFormProps.value = mergeData(
                unref(innerFormProps) || {},
                formProps
            )
        }
        const { setFormSchemas, getFormValues, validate, validateField } =
            useFormEvents({
                getProps,
                setProps,
                initForm,
                formModel,
                formElRef: formElRef as Ref<FormActionType>,
            })

        // 修改表单model
        function setFormModelField(key: string, value: any) {
            formModel[key] = value
        }

        const formAction: FormActionType = {
            setProps,
            setFormSchemas,
            getFormValues,
            validate,
            validateField,
        }

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
        }
    },
})
</script>
<style lang="less" scoped></style>
