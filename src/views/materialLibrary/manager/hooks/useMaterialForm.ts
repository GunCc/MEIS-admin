import { BasicFormProps, FormItemSchemas } from "@/components/Form/src/types/form"

export function useMaterialForm() {
    const getSchemas = computed((): FormItemSchemas[] => {
        return [
            {
                field: "keyword",
                label: "关键字",
                col: {
                    span: 6,
                },
                formItemProps: {
                    class: "mb-0",
                },
                componentProps: {
                    placeholder: "请输入关键字",
                },
            },
        ]
    })

    const getFormProps = computed((): BasicFormProps => {
        return {
            inline: true,
            schemas: unref(getSchemas),
            actionColOptions: {
                span: 18,
            },
        }
    })
    return {
        getFormProps,
    }
}
