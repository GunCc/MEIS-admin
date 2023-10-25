import { BasicFormProps } from "@/components/Form/src/types/form"
import { BasicTableProps } from "./../types/index"

interface useTableFormContext {
    getProps: ComputedRef<BasicTableProps>
}

export function useTableForm({ getProps }: useTableFormContext) {
    const getFormSetting = computed(() => {
        const { formSettings } = unref(getProps)
        return {
            inline: true,
            ...formSettings,
        } as BasicFormProps
    })

    return {
        getFormSetting,
    }
}
