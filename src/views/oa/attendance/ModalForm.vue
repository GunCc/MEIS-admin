<template>
    <basic-form @register="registerForm" @submit="handleSubmit">
        <template #grand_time="{ model, field }">
            <el-date-picker
                class="w-full"
                v-model="model[field]"
                type="month"
                placeholder="选择时间"
                value-format="YYYY-MM"
            />
        </template>
    </basic-form>
</template>
<script lang="ts">
import { createAttendance, updateAttendance } from "@/api/v1/oa/attendance"
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
                getFormField,
                clearValidate,
                setFieldsValue,
            },
        ] = useForm({
            validateOnSubmit: false,
            labelWidth: "130px",
            submitOnReset: false,
        })

        async function handleSubmit(values) {
            const { row } = props
            try {
                let form = clone(values)
                const isObj = isObject(row)
                const api = isObj ? updateAttendance : createAttendance
                form = {
                    ...(isObj && row),
                    ...form,
                }
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

        return { registerForm, handleSubmit, enableValue, setFieldsValue }
    },
})
</script>
<style lang="scss"></style>
