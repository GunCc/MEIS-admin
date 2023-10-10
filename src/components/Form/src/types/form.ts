import { FormItemProps, FormProps, FormInstance } from "element-plus"
import { componentType } from "../../componentMap"
import { Nullable } from 'vitest';

type RegisterFn = () => void

export type ReturnUseFormType = [RegisterFn, FormActionType]

export interface BasicFormProps extends Partial<FormProps> {
    schemas: FormItemSchemas[]
}

// form表单中的操作函数
export interface FormActionType extends Partial<FormInstance> {
    setProps: (props: Partial<BasicFormProps>) => void
    setFormSchemas: (props: FormItemSchemas[]) => void
    getFormValues: () => Recordable
    // 表单校验
    validate: (valid?: any) => Promise<any>
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
