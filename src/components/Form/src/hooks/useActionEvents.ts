import { BasicFormProps } from "../types/form"

interface useActionEventsContext {
    getProps: ComputedRef<BasicFormProps>
}

export function useActionEvents({ getProps }: useActionEventsContext) {
    const getActionProps = computed(() => {
        const { actionColOptions = { span: 24 } } = unref(getProps)
        return {
            buttonClass: "ml-auto",
            size: "default",
            actionColOptions,
        }
    })
    return {
        getActionProps,
    }
}
