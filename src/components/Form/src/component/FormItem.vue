<script lang="tsx">
import { PropType, computed, defineComponent, unref } from "vue"
import { FormItemSchemas } from "../types/form"
import { Nullable } from "vitest"
import { isFunction, merge } from "lodash"
import { componentMap } from "../../componentMap"

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
    setup(props, {}) {
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
            const {
                field,
                componentProps,
                renderComponentContent,
                formItemProps,
                component,
                col = { span: 24 },
            } = unref(getSchema)

            const onEvent = {
                onChange: (...args: Nullable<Recordable>[]) => {
                    const [e] = args
                    const target = e ? e.target : null
                    const value = target ? target.value : e
                    props.setFormModel(field, value)
                },
            }

            const formItemAttr = {
                prop: field,
                ...merge(formItemProps),
                ...unref(getSchema),
            }

            const Comp = componentMap.get(component || "Input") as ReturnType<
                typeof defineComponent
            >

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
                <el-col {...col}>
                    <el-form-item {...formItemAttr}>
                        <Comp {...CompAttr} v-model={props.formModal[field]}>
                            {compSlot}
                        </Comp>
                    </el-form-item>
                </el-col>
            )
        }

        return () => <>{getContext()}</>
    },
})
</script>
