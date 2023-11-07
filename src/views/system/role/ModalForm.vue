<template>
    <basic-form @register="registerForm" @submit="handleSubmit">
        <template #enable>
            <el-switch v-model="enableValue"></el-switch>
        </template>
    </basic-form>
</template>
<script lang="ts">
import { updateRole, createRole } from "@/api/v1/system/role"
import { FormItemSchemas } from "@/components/Form/src/types/form"
import { BasicForm, useForm } from "@c/Form"
import { clone, isObject } from "lodash"
import { PropType } from "vue"
export default defineComponent({
    name: "ManagerModalUpload",
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
    },
    setup(props, { emit }) {
        const enableValue = ref<boolean>(false)

        const [
            registerForm,
            {
                resetFields,
                setFormSchemas,
                getFormField,
                validateField,
                clearValidate,
                getFormValues
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
                const api = isObj ? updateRole : createRole
                form = {
                    ...(isObj && row),
                    ...form,
                }
                form.enable = unref(enableValue) ? 1 : 0
                if (
                    (form.password || form.passwords) &&
                    form.password != form.passwords
                ) {
                    await validateField(["password", "passwords"])
                }
                await api(form)
                clearForm()
                emit("success-submit")
            } catch (error) {
                console.error(error)
            }

            console.log("提交", values)
        }

        function clearForm() {
            enableValue.value = false
            resetFields()
        }

        async function init() {
            clearValidate()
            setFormSchemas(props.schemaSetting)
            console.log("123",await getFormValues())
            enableValue.value = !!(await getFormField("enable"))
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

        return { registerForm, handleSubmit, enableValue }
    },
})
</script>
<style lang="scss"></style>
