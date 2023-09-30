import { BasicFormProps, FormItemSchemas } from "../types/form"

interface UseFormEventsContext {
    getProps: ComputedRef<BasicFormProps>
    setProps: (props: Partial<BasicFormProps>) => Promise<void>
    initForm: () => void
    formModel: Recordable
}

export function useFormEvents({
    getProps,
    setProps,
    initForm,
    formModel,
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
        return {}
    }

    return {
        setFormSchemas,
        getFormValues,
    }
}
