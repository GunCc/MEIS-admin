import { FormInstance, FormItemProp } from "element-plus"
import { Arrayable } from "vitest"
import { BasicFormProps, FormItemSchemas } from "../types/form"
import { FormActionType } from "./../types/form"
import { cloneDeep, isArray, isString } from "lodash"

interface UseFormEventsContext {
    getProps: ComputedRef<BasicFormProps>
    setProps: (props: Partial<BasicFormProps>) => Promise<void>
    initForm: () => void
    formModel: Recordable
    formElRef: Ref<FormActionType>
    defaultValueRef: Ref<Recordable>
}

export function useFormEvents(
    emit: EmitType,
    {
        getProps,
        setProps,
        initForm,
        formModel,
        formElRef,
        defaultValueRef,
    }: UseFormEventsContext
) {
    async function setFormSchemas(schemas: FormItemSchemas[]) {
        await setProps({
            ...getProps,
            schemas,
        })
        initForm && initForm()
    }

    // 获取表单数据
    function getFormValues(): Recordable {
        return unref(formModel)
    }

    // 获取表单中某个字段的值
    function getFormField(fields: string[] | string): any {
        if (isString(fields)) {
            return unref(formModel)[fields]
        } else {
            let res: any
            for (let key in unref(formModel)) {
                console.log(key, unref(formModel)[key])
                if (fields.includes(key)) {
                    res[key] = unref(formModel)[key]
                }
            }
            return res
        }
    }

    // 表单校验
    async function validate() {
        return await unref(formElRef)?.validate()
    }

    // 表单校验特定字段
    async function validateField(item?: Arrayable<FormItemProp>) {
        await unref(formElRef)?.validateField(item)
    }

    // 表单校验特定字段
    async function clearValidate(item?: Arrayable<FormItemProp>) {
        await unref(formElRef)?.clearValidate(item)
    }

    // 表单点击提交事件
    async function handleSubmit(e?: Event): Promise<void> {
        e && e.preventDefault()
        const formEl = unref(formElRef)
        if (!formEl) return
        try {
            await validate()
            const res = getFormValues()
            emit("submit", res)
        } catch (error: any) {
            if (error?.outOfDate === false && error?.errorFields) {
                return
            }
            throw new Error(error)
        }
    }

    // 表单重置
    async function resetFields(): Promise<void> {
        const { submitOnReset } = unref(getProps)
        const formEl = unref(formElRef)
        if (!formEl) return

        Object.keys(formModel).forEach(key => {
            const defaultValue = cloneDeep(defaultValueRef.value[key])
            formModel[key] = defaultValue || ""
        })

        nextTick(() => clearValidate())

        emit("reset", toRaw(formModel))

        submitOnReset && handleSubmit()
    }

    return {
        getFormField,
        validateField,
        setFormSchemas,
        getFormValues,
        validate,
        handleSubmit,
        resetFields,
        clearValidate,
    }
}
