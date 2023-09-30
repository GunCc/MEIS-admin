import { FormItemProps, FormProps } from "element-plus"
import { componentType } from "../../componentMap"

type RegisterFn = () => void

export type ReturnUseFormType = [RegisterFn, FormActionType]

export interface BasicFormProps extends Partial<FormProps> {
    schemas: FormItemSchemas[]
}

// form表单中的操作函数
export interface FormActionType {
    setProps: (props: Partial<BasicFormProps>) => void
    setFormSchemas: (props: FormItemSchemas[]) => void
    getFormValues: () => Recordable
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
}
