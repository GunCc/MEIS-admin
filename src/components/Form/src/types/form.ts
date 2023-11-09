import {
    FormItemProps,
    FormProps,
    FormInstance,
    FormItemProp,
} from "element-plus"
import { ComponentType } from "../../componentMap"
import { Arrayable, Nullable } from "vitest"
import { ColEx } from "./index"
import { Slot } from "vue"

type RegisterFn = () => void

export type ReturnUseFormType = [RegisterFn, FormActionType]

export interface BasicFormProps extends Partial<FormProps> {
    schemas?: FormItemSchemas[]
    // 是否显示操作按钮
    showAction?: boolean
    // 操作按钮的位置配置
    actionColOptions?: Partial<ColEx>
    // 是否在点击重置按钮的时候也请求表单
    submitOnReset?: boolean
    // 提交时是否校验
    validateOnSubmit?: boolean
}

// 插槽返回的数据

export interface RenderCallbackParams {
    schema: FormItemSchemas
    values: Recordable
    model: Recordable
    field: string
}

// form表单中的操作函数
export interface FormActionType extends Partial<FormInstance> {
    setProps: (props: Partial<BasicFormProps>) => void
    setFormSchemas: (props: FormItemSchemas[]) => void
    getFormValues: () => Recordable
    // 获取指定字段值
    getFormField: (fields: string[] | string) => Promise<any>
    // 表单校验
    validate: () => Promise<any>
    // 表单验证特定字段
    validateField: (item?: Arrayable<FormItemProp>) => Promise<any>
    // 清除表单校验项
    clearValidate: (props?: Arrayable<FormItemProp>) => void
    resetFields: (props?: Arrayable<FormItemProp>) => void
    setFieldsValue: (values: Recordable) => Promise<void>
}

// 表单布局
export interface FormItemSchemas extends Partial<FormItemProps> {
    // 字段名
    field: string
    // slot 自定义插槽在input中
    slot?: string
    // 布局
    col?: Partial<ColEx>
    // 默认值
    defaultValue?: any
    // 组件
    component?: ComponentType
    // 组件参数
    componentProps?: Recordable
    // formItem 参数
    formItemProps?: Recordable
    // 组件内部定制渲染
    renderComponentContent?:
        | ((renderCallbackParams: RenderCallbackParams) => any)
        | VNode
        | VNode[]
        | string
    render?: (
        renderCallbackParams: RenderCallbackParams
    ) => VNode | VNode[] | string
    // 插槽jsx自定义
    renderColContent?: (
        renderCallbackParams: RenderCallbackParams
    ) => VNode | VNode[] | string
}
