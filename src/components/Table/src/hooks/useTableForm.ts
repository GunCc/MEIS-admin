import { BasicFormProps } from "@/components/Form/src/types/form"
import { Slots } from "vue"
import { BasicTableProps, FetchParams } from "./../types/index"

interface useTableFormContext {
    getProps: ComputedRef<BasicTableProps>
    handleFetch: (opt?: FetchParams) => Promise<any>
    slots: Slots
}

export function useTableForm({
    getProps,
    handleFetch,
    slots,
}: useTableFormContext) {
    const getFormSetting = computed(() => {
        const { formSettings } = unref(getProps)
        return {
            inline: true,
            ...formSettings,
        } as BasicFormProps
    })

    // 获取表单的插槽项目
    const getFormSoltKeys: ComputedRef<string[]> = computed(() => {
        const keys = Object.keys(slots)

        return keys
            .map(item => (item.startsWith("form-") ? item : null))
            .filter(Boolean) as string[]
    })

    // 表单搜索
    function handleSearchInfoChange(info: Recordable) {
        handleFetch({ searchInfo: info, page: 1 })
    }

    // 消除slot key中的form字段
    function replaceFormSlotKey(key: string) {
        if (!key) return ""
        return key?.replace?.(/form\-/, "") ?? ""
    }

    return {
        getFormSoltKeys,
        replaceFormSlotKey,
        handleSearchInfoChange,
        getFormSetting,
    }
}
