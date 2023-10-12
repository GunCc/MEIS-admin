import { FormItemProps, FormProps, FormInstance, FormItemProp } from "element-plus"
import { componentType } from "../../componentMap"
import { Arrayable, Nullable } from "vitest"
import { Slot } from "vue"

type RegisterFn = () => void

export type ReturnUseFormType = [RegisterFn, FormActionType]

export interface BasicFormProps extends Partial<FormProps> {
    schemas: FormItemSchemas[]
}

// 插槽返回的数据

export interface RenderCallbackParams {
    schema: FormItemSchemas;
    values: Recordable;
    model: Recordable;
    field: string;
  }
  

// form表单中的操作函数
export interface FormActionType extends Partial<FormInstance> {
    setProps: (props: Partial<BasicFormProps>) => void
    setFormSchemas: (props: FormItemSchemas[]) => void
    getFormValues: () => Recordable
    // 表单校验
    validate: () => Promise<any>
    // 表单验证特定字段
    validateField:(item?: Arrayable<FormItemProp>)=> Promise<any>
}

// 表单布局
export interface FormItemSchemas extends Partial<FormItemProps> {
    // 字段名
    field: string

    // 默认值
    defaultValue?: any
    // 组件
    component?: componentType
    // 组件参数
    componentProps?: Recordable
    // 组件定制渲染
    renderComponentContent?:
        | ((renderCallbackParams: RenderCallbackParams) => any)
        | VNode
        | VNode[]
        | string
}
