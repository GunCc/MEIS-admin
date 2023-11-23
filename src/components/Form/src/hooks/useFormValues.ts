import { computed } from "vue"
import { BasicFormProps, FormItemSchemas } from "../types/form"
import { cloneDeep, isBoolean } from "lodash"
import { isNullOrUnDef } from "@/utils/is"
import { deepMerge } from "@/utils"
import { tryConstructObject } from "./../../helper"

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
            let field = item.field
            const {
                defaultValue,
             
            } = item

            if (!isNullOrUnDef(defaultValue)) {
                obj[field] = defaultValue
            }
        })
        Object.assign(formModel, obj)
        defaultValueRef.value = cloneDeep(obj)
    }
    return { getFormProps, initForm }
}

