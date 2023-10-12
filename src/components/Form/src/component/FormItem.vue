<script lang="tsx">
import { PropType, computed, defineComponent, unref } from "vue"
import { FormItemSchemas, RenderCallbackParams } from "../types/form"
import { Nullable } from "vitest"
import { isFunction } from "lodash"

export default defineComponent({
    name: "FormItem",
    props: {
        schema: {
            type: Object as PropType<FormItemSchemas>,
            default: () => ({}),
        },
        formModal: {
            type: Object as PropType<Recordable>,
            default: () => ({}),
        },
        setFormModel: {
            type: Function as PropType<(key: string, value: any) => void>,
            default: null,
        },
    },
    setup(props, {  }) {
        const getSchema = computed(() => {
            return {
                class: "w-full",
                ...props.schema,
            }
        })

        // 获取数据
        const getValues = computed(() => {
            const { formModal } = props
            const schema = unref(getSchema)

            return {
                field: schema.field,
                schema: schema,
                values: {
                    ...formModal,
                } as Recordable,
                model: formModal,
            }
        })

        function getContext() {
            const { field, componentProps, renderComponentContent } =
                unref(getSchema)

            const onEvent = {
                onChange: (...args: Nullable<Recordable>[]) => {
                    const [e] = args
                    const target = e ? e.target : null
                    const value = target ? target.value : e
                    console.log(field, value)
                    props.setFormModel(field, value)
                },
            }

            const formItemAttr = {
                prop: field,
                ...unref(getSchema),
            }

            const CompAttr = {
                ...onEvent,
                ...componentProps,
            }

            const compSlot = isFunction(renderComponentContent)
                ? { ...renderComponentContent(unref(getValues)) }
                : {
                      default: () => renderComponentContent,
                  }

            return (
                <el-form-item {...formItemAttr}>
                    <el-input {...CompAttr} v-model={props.formModal[field]}>
                        {compSlot}
                    </el-input>
                </el-form-item>
            )
        }

        return () => <>{getContext()}</>
    },
})
</script>
