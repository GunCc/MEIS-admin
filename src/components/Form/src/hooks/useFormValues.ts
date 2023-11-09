import { computed } from "vue"
import { BasicFormProps, FormItemSchemas } from "../types/form"
import { cloneDeep, isBoolean } from "lodash"
import { isNullOrUnDef } from "@/utils/is"
import { deepMerge } from "@/utils"

interface UseFormValuesContext {
    getProps: ComputedRef<BasicFormProps>
    formModel: Recordable
    getSchema: ComputedRef<FormItemSchemas[]>
    defaultValueRef: Ref<Recordable>
}

export function useFormValues({
    getProps,
    formModel,
    getSchema,
    defaultValueRef,
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
        let obj: Recordable = {}
        schemas.forEach(item => {
            const { defaultValue } = item

            if (!isNullOrUnDef(defaultValue)) {
                obj[item.field] = defaultValue
                // formModel[item.field] = defaultValue
            }
        })
        Object.assign(formModel, obj)
        defaultValueRef.value = cloneDeep(obj)
    }
    return { getFormProps, initForm }
}
