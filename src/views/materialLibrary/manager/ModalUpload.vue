<template>
    <basic-form @register="registerForm"> </basic-form>
</template>
<script lang="ts">
import { ResourceType } from "@/api/model/upload/request"
import { BasicForm, useForm } from "@c/Form"
import { PropType } from "vue"
export default defineComponent({
    name: "ManagerModalUpload",
    components: { BasicForm },
    props: {
        uploadTypes: {
            type: Array as PropType<ResourceType[]>,
            default: () => [],
        },
    },
    setup(props) {
        const [registerForm] = useForm({
            schemas: [
                {
                    label: "分类",
                    field: "type",
                    component: "Select",
                    componentProps: {
                        dataSource: props.uploadTypes,
                        labelField: "name",
                        valueField: "key",
                    },
                },
            ],
        })
        return { registerForm }
    },
})
</script>
<style lang="scss"></style>
