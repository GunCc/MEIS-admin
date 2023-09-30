<script lang="tsx">
import { PropType, computed, defineComponent, unref } from "vue"
import { FormItemSchemas } from "../types/form"
import { Nullable } from "vitest"

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
    setup(props, _) {
        const getSchema = computed(() => {
            return {
                class: "w-full",
                ...props.schema,
            }
        })
        function getContext() {
            const { field, componentProps } = unref(getSchema)

            // const Comp = componentMap.get(component || "Input") as ReturnType<
            //     typeof defineComponent
            // >

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
                ...unref(getSchema),
            }

            const CompAttr = {
                ...onEvent,
                ...componentProps,
            }

            return (
                <el-form-item {...formItemAttr}>
                    <el-input
                        {...CompAttr}
                        v-model={props.formModal[field]}
                    ></el-input>
                </el-form-item>
            )
        }

        return () => <>{getContext()}</>
    },
})
</script>
