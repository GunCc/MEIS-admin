<template>
    <basic-form @register="registerForm" @submit="handleSubmit">
        <template #hidden>
            <el-switch v-model="enableValue"></el-switch>
        </template>
    </basic-form>
</template>
<script lang="ts">
import { updateMenu, createMenu } from "@/api/v1/system/menu"
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
        const enableValue = ref<boolean>(true)

        const [
            registerForm,
            {
                resetFields,
                setFormSchemas,
                getFormField,
                validateField,
                clearValidate,
            },
        ] = useForm({
            validateOnSubmit: false,
            labelWidth: "120px",
            submitOnReset: false,
        })

        async function handleSubmit(values) {
            const { row } = props
            try {
                let form = clone(values)
                const isObj = isObject(row)
                const api = isObj ? updateMenu : createMenu
                form = {
                    ...(isObj && row),
                    ...form,
                }
                form.hidden = unref(enableValue)
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

        }

        function clearForm() {
            enableValue.value = true
            resetFields()
        }

        async function init() {
            clearValidate()
            setFormSchemas(props.schemaSetting)
            await nextTick()
            let enable = await getFormField("hidden")
            enableValue.value = props.row != "create" ? enable : true
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
