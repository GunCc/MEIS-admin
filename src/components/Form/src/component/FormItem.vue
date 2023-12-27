<script lang="tsx">
import { PropType, computed, defineComponent, unref } from "vue"
import { FormItemSchemas } from "../types/form"
import { Nullable } from "vitest"
import { isFunction, merge } from "lodash"
import { componentMap } from "../../componentMap"
import { getSlot } from "@/utils/helper/tsxhelper"

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
    emits: ["enter-press"],
    setup(props, { slots, emit }) {
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

        function renderItem() {
            const {
                field,
                formItemProps,
                slot,
                render,
                col = { span: 24 },
            } = unref(getSchema)

            const getContent = () => {
                return slot
                    ? getSlot(slots, slot, unref(getValues))
                    : render
                    ? render(unref(getValues))
                    : renderComponent()
            }

            const formItemAttr = {
                prop: field,
                ...merge(formItemProps),
                ...unref(getSchema),
            }

            return (
                <el-col {...col}>
                    <el-form-item {...formItemAttr}>
                        {getContent()}
                    </el-form-item>
                </el-col>
            )
        }

        function renderComponent() {
            const { componentProps, renderComponentContent, component, field } =
                unref(getSchema)
            const Comp = componentMap.get(component || "Input") as ReturnType<
                typeof defineComponent
            >
            const onEvent = {
                onChange: (...args: Nullable<Recordable>[]) => {
                    const [e] = args
                    const target = e ? e.target : null
                    const value = target ? target.value : e
                    props.setFormModel(field, value)
                },
                onkeydown: (...args: Nullable<Recordable>[]) => {
                    const [e] = args
                    const target = e ? e.target : null
                    const keyCode = e ? e.keyCode : null
                    const value = target ? target.value : e
                    if (keyCode == 13)
                        emit("enter-press", {
                            field,
                            value,
                        })
                },
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
                <Comp {...CompAttr} v-model={props.formModal[field]}>
                    {compSlot}
                </Comp>
            )
        }

        return () => {
            const { renderColContent } = props.schema

            const values = unref(getValues)

            function getContext() {
                return renderColContent
                    ? renderColContent(values)
                    : renderItem()
            }
            return <>{getContext()}</>
        }
    },
})
</script>
