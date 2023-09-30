import { computed } from "vue"
import { BasicFormProps, FormItemSchemas } from "../types/form"

interface UseFormValuesContext {
    getProps: ComputedRef<BasicFormProps>
    formModel: Recordable
    getSchema: ComputedRef<FormItemSchemas[]>
}

export function useFormValues({
    getProps,
    formModel,
    getSchema,
}: UseFormValuesContext) {
    // 表单参数
    const getFormProps = computed(() => {
        return {
            ...unref(getProps),
            model: formModel,
        }
    })

    function initForm() {
        const schemas = unref(getSchema)
        const obj: Recordable = {}
        schemas.forEach(item => {
            obj[item.field] = item.defaultValue || ""
        })
        Object.assign(formModel, obj)
    }
    return { getFormProps, initForm }
}
