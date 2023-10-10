import { FormInstance } from "element-plus"
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

    return {
        setFormSchemas,
        getFormValues,
        validate,
    }
}
