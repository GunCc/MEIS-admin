import { FormInstance, FormItemProp } from "element-plus"
import { Arrayable } from "vitest"
import { BasicFormProps, FormItemSchemas } from "../types/form"
import { FormActionType } from "./../types/form"

interface UseFormEventsContext {
    getProps: ComputedRef<BasicFormProps>
    setProps: (props: Partial<BasicFormProps>) => Promise<void>
    initForm: () => void
    formModel: Recordable
    formElRef: Ref<FormActionType>
}

export function useFormEvents({
    getProps,
    setProps,
    initForm,
    formModel,
    formElRef,
}: UseFormEventsContext) {
    async function setFormSchemas(schemas: FormItemSchemas[]) {
        await setProps({
            ...getProps,
            schemas,
        })
        initForm && initForm()
    }

    // 获取表单数据
    function getFormValues(): Recordable {
        console.log(formModel)
        return unref(formModel)
    }

    // 表单校验
    async function validate() {
        return await formElRef.value.validate()
    }

    // 表单校验特定字段
    async function validateField(item?: Arrayable<FormItemProp>) {
        return await formElRef.value.validateField(item)
    }

    return {
        validateField,
        setFormSchemas,
        getFormValues,
        validate,
    }
}
