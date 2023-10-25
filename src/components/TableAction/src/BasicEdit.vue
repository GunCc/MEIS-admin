<template>
    <BasicForm @register="registerForm"></BasicForm>
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
    setup(props) {
        const getSchemas = computed(() => {
            return props.schemas || ([] as FormItemSchemas[])
        })
        const [registerForm] = useForm({
            schemas: unref(getSchemas),
        })
        return {
            registerForm,
        }
    },
})
</script>
<style lang="scss"></style>
