<template>
    <basic-form @register="registerForm" @submit="handleSubmit"> </basic-form>
</template>

<script lang="ts">
import { BasicForm, useForm } from "@c/Form"
import { PropType } from "vue"
import { updateFile } from "@/api/v1/system/upload"
import { clone } from "lodash"
import { error } from "@/utils/log"

export default defineComponent({
    name: "ManagerModalImageEdit",
    components: { BasicForm },
    props: {
        currentImageInfo: {
            type: Object as PropType<Recordable>,
            default: () => ({}),
        },
    },
    emits: ["update-success"],
    setup(props, { emit }) {
        const [registerForm, { setFormSchemas }] = useForm({
            submitOnReset: false,
            schemas: [
                {
                    label: "文件名",
                    field: "name",
                    defaultValue: props.currentImageInfo.name,
                },
            ],
        })

        watch(
            () => props.currentImageInfo,
            () => {
                setFormSchemas([
                    {
                        label: "文件名",
                        field: "name",
                        defaultValue: props.currentImageInfo.name,
                    },
                ])
            },
            {
                deep: true,
            }
        )

        async function handleSubmit(values) {
            try {
                let form = clone(values)
                form.id = props.currentImageInfo.id
                await updateFile(form)
                emit("update-success", form)
            } catch (err) {
                error(err as string)
            }
        }

        return { registerForm, handleSubmit }
    },
})
</script>
<style lang="scss"></style>
