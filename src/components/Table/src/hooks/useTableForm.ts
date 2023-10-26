import { BasicFormProps } from "@/components/Form/src/types/form"
import { BasicTableProps, FetchParams } from "./../types/index"

interface useTableFormContext {
    getProps: ComputedRef<BasicTableProps>
    handleFetch: (opt?: FetchParams) => Promise<any>
}

export function useTableForm({ getProps, handleFetch }: useTableFormContext) {
    const getFormSetting = computed(() => {
        const { formSettings } = unref(getProps)
        return {
            inline: true,
            ...formSettings,
        } as BasicFormProps
    })

    // 表单搜索
    function handleSearchInfoChange(info: Recordable) {
        handleFetch({ searchInfo: info, page: 1 })
    }

    return {
        handleSearchInfoChange,
        getFormSetting,
    }
}
