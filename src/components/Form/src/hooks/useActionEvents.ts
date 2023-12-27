import { BasicFormProps } from "../types/form"

interface useActionEventsContext {
    getProps: ComputedRef<BasicFormProps>
}

export function useActionEvents({ getProps }: useActionEventsContext) {
    const getActionProps = computed(() => {
        const { actionColOptions = { span: 24 }, showAction = true } =
            unref(getProps)
        return {
            isShow: showAction,
            buttonClass: "ml-auto",
            size: "default",
            actionColOptions,
        } as Recordable
    })
    return {
        getActionProps,
    }
}
