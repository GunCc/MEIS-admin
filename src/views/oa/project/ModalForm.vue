<template>
    <basic-form @register="registerForm" @submit="handleSubmit">
        <template #status>
            <el-switch v-model="enableValue"></el-switch>
        </template>
    </basic-form>
</template>
<script lang="ts">
import { updateProject, createProject } from "@/api/v1/oa/project"
import { FormItemSchemas } from "@/components/Form/src/types/form"
import { BasicForm, useForm } from "@c/Form"
import { clone, isObject } from "lodash"
import { PropType } from "vue"
import { error } from "@/utils/log"
export default defineComponent({
    name: "ModelUserForm",
    components: { BasicForm },
    props: {
        row: {
            type: [String, Object] as PropType<Recordable | "create">,
            default: "create",
        },
        schemaSetting: {
            type: Array as PropType<FormItemSchemas[]>,
            default: () => [],
        },
        // 修改表单值
        handleSetModalValue: {
            type: Function as PropType<(values: Recordable) => Promise<void>>,
        },
    },
    setup(props, { emit }) {
        const enableValue = ref<boolean>(false)

        const [
            registerForm,
            {
                resetFields,
                setFormSchemas,
                clearValidate,
                setFieldsValue,
            },
        ] = useForm({
            validateOnSubmit: false,
            labelWidth: "80px",
            submitOnReset: false,
        })

        async function handleSubmit(values) {
            const { row } = props
            try {
                let form = clone(values)
                const isObj = isObject(row)
                const api = isObj ? updateProject : createProject
                form = {
                    ...(isObj && row),
                    ...form,
                }
                form.status = unref(enableValue) ? 1 : 0
                await api(form)
                clearForm()
                emit("success-submit")
            } catch (err) {
                error(err as string)
            }
        }

        function clearForm() {
            enableValue.value = false
            resetFields()
        }

        async function init() {
            clearValidate()
            setFormSchemas(props.schemaSetting)
            let row = props.row as Recordable
            enableValue.value = !!row?.status
        }

        watch(
            () => props.schemaSetting,
            () => {
                nextTick(() => {
                    init()
                })
            },
            {
                immediate: true,
                deep: true,
            }
        )

        return { registerForm, handleSubmit, enableValue, setFieldsValue }
    },
})
</script>
<style lang="scss"></style>
