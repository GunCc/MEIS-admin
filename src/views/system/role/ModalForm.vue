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
import { flattenArray, repetitionArray } from "@/utils/helper"
import { BasicForm, useForm } from "@c/Form"
import { clone, isObject } from "lodash"
import { PropType } from "vue"
import { error } from "@/utils/log"
export default defineComponent({
    name: "RoleModalForm",
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
            { resetFields, setFormSchemas, getFormField, clearValidate },
        ] = useForm({
            validateOnSubmit: false,
            labelWidth: "110px",
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
                form.menus_ids = repetitionArray(flattenArray(form.menus_ids))
                form.enable = unref(enableValue) ? 1 : 0
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
