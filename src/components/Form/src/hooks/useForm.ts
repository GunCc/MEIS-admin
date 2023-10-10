import { ref, unref, watch } from "vue"
import {
    BasicFormProps,
    FormActionType,
    FormItemSchemas,
    ReturnUseFormType,
} from "../types/form"
import { Nullable } from "vitest"

export function useForm(props?: BasicFormProps): ReturnUseFormType {
    const formEl = ref<Nullable<FormActionType>>()

    function getForm() {
        const form = unref(formEl)
        if (!form) {
            console.error("form没有实例化！")
            return
        }
        return form
    }

    function register(instance?: FormActionType) {
        console.log(instance)
        formEl.value = instance
        watch(
            () => props,
            () => props && getForm()?.setProps(props),
            {
                immediate: true,
                deep: true,
            }
        )
    }

    const actions: FormActionType = {
        setProps: (props: Partial<BasicFormProps>) => {
            getForm()?.setProps(props)
        },
        setFormSchemas: (schemas: FormItemSchemas[]) => {
            getForm()?.setFormSchemas(schemas)
        },
        getFormValues: (): Recordable => {
            return getForm()?.getFormValues() as Recordable
        },
        validate: async (valid?: any): Promise<Recordable> => {
            const form = await getForm()
            return form?.validate(valid)
        },
    }
    return [register, actions]
}
