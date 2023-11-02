<template>
    <BasicForm @register="registerForm" @submit="handleSubmit"></BasicForm>
</template>
<script lang="ts">
import { FormItemSchemas } from "@/components/Form/src/types/form"
import { BasicForm, useForm } from "@c/Form/index"
import { PropType } from "vue"
export default defineComponent({
    name: "BasicActionEditForm",
    components: {
        BasicForm,
    },
    props: {
        schemas: {
            type: Array as PropType<FormItemSchemas[]>,
        },
    },
    emits: ["form-submit"],
    setup(props, { emit }) {
        const getSchemas = computed(() => {
            return props.schemas || ([] as FormItemSchemas[])
        })
        const [registerForm, { setFormSchemas }] = useForm({
            schemas: unref(getSchemas),
        })
        watch(
            () => props.schemas,
            () => setFormSchemas(props.schemas || []),
            {
                deep: true,
            }
        )
        function handleSubmit(data: Recordable) {
            emit("form-submit", data)
        }
        return {
            handleSubmit,
            registerForm,
        }
    },
})
</script>
<style lang="scss"></style>
