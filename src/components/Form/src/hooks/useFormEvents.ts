import { FormInstance, FormItemProp } from "element-plus"
import { Arrayable } from "vitest"
import { BasicFormProps, FormItemSchemas } from "../types/form"
import { FormActionType } from "./../types/form"
import { cloneDeep, isArray, isString, isUndefined } from "lodash"
import { handleInputNumberValue, tryConstructArray } from "../../helper"
import { tryConstructObject } from "./../../helper"

interface UseFormEventsContext {
    getProps: ComputedRef<BasicFormProps>
    setProps: (props: Partial<BasicFormProps>) => Promise<void>
    initForm: () => void
    formModel: Recordable
    formElRef: Ref<FormActionType>
    defaultValueRef: Ref<Recordable>
    getSchema: ComputedRef<FormItemSchemas[]>
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
        getSchema,
    }: UseFormEventsContext
) {
    async function setFormSchemas(schemas: FormItemSchemas[]) {
        await setProps({
            schemas,
        })

        initForm && initForm()
    }

    // 获取表单数据
    function getFormValues(): Recordable {
        return unref(formModel)
    }

    // 获取表单中某个字段的值
    async function getFormField(fields: string[] | string) {
        if (isString(fields)) {
            return unref(formModel)[fields]
        } else {
            let res: any
            for (let key in unref(formModel)) {
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
        const { validateOnSubmit } = unref(getProps)
        e && e.preventDefault()
        const formEl = unref(formElRef)
        if (!formEl) return
        try {
            validateOnSubmit && (await validate())
            const res = unref(formModel)
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

    // 修改表单的值
    async function setFieldsValue(values: Recordable): Promise<void> {
        // 获取字段
        const fields = unref(getSchema)
            .map(item => item.field)
            .filter(Boolean)

        const delimiter = "."
        const nestKeyArray = fields.filter(
            item => String(item).indexOf(delimiter) >= 0
        )
        const validKeys: string[] = []

        fields.forEach(key => {
            const schema = unref(getSchema).find(item => item.field === key)
            let value = values[key]

            const hasKey = Reflect.has(values, key)

            value = handleInputNumberValue(schema?.component, value)
            const { componentProps } = schema || {}
            let _props = componentProps as any
            if (typeof componentProps === "function") {
                _props = _props({ formModel: unref(formModel) })
            }

            const constructValue =
                tryConstructArray(key, values) ||
                tryConstructObject(key, values)

            // 0和'' 允许通过
            if (hasKey || !!constructValue) {
                const fieldValue = constructValue || value
                // 如果是时间组件
                // if (itemIsDateType(key)) {
                //     if (Array.isArray(fieldValue)) {
                //         const arr: any[] = []
                //         for (const ele of fieldValue) {
                //             arr.push(ele ? dateUtil(ele) : null)
                //         }
                //         unref(formModel)[key] = arr
                //     } else {
                //         unref(formModel)[key] = fieldValue
                //             ? _props?.valueFormat
                //                 ? fieldValue
                //                 : dateUtil(fieldValue)
                //             : null
                //     }
                // } else {
                //     unref(formModel)[key] = fieldValue
                // }
                unref(formModel)[key] = fieldValue
                if (_props?.onChange) {
                    _props?.onChange(fieldValue)
                }
                validKeys.push(key)
            } else {
                nestKeyArray.forEach((nestKey: string) => {
                    try {
                        const value = nestKey
                            .split(".")
                            .reduce((out, item) => out[item], values)
                        if (!isUndefined(value)) {
                            unref(formModel)[nestKey] = unref(value)
                            validKeys.push(nestKey)
                        }
                    } catch (e) {
                        // key 不存在
                        if (!isUndefined(defaultValueRef.value[nestKey])) {
                            unref(formModel)[nestKey] = cloneDeep(
                                unref(defaultValueRef.value[nestKey])
                            )
                        }
                    }
                })
            }
        })
        validateField(validKeys).catch(_ => {})
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
        setFieldsValue,
    }
}
