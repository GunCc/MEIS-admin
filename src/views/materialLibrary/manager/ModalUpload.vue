<template>
    <basic-form @register="registerForm" @submit="handleSubmit">
        <template #fileSlot>
            <BasicUploadFile v-model="uploadImageList" />
        </template>
    </basic-form>
</template>
<script lang="ts">
import { ResourceType } from "@/api/model/upload/request"
import { BasicForm, useForm } from "@c/Form"
import { PropType } from "vue"
import { BasicUploadFile } from "@c/Upload"
import { clone } from "lodash"
import { fileBindType } from "@/api/v1/system/upload"
export default defineComponent({
    name: "ManagerModalUpload",
    components: { BasicForm, BasicUploadFile },
    props: {
        uploadTypes: {
            type: Array as PropType<ResourceType[]>,
            default: () => [],
        },
    },
    setup(props, { emit }) {
        const uploadImageList = ref<Recordable[]>([])
        const [registerForm, { resetFields }] = useForm({
            submitOnReset: false,
            schemas: [
                {
                    label: "分类",
                    field: "type_id",
                    component: "Select",
                    componentProps: {
                        class: "w-100",
                        dataSource: props.uploadTypes,
                        labelField: "name",
                        valueField: "id",
                    },
                },
                {
                    label: "文件",
                    field: "files",
                    slot: "fileSlot",
                },
            ],
        })

        async function handleSubmit(values) {
            try {
                const form = clone(values)
                form.files = unref(uploadImageList).map(item => item.id)
                await fileBindType(form)
                clearForm()
                emit("upload-submit")
            } catch (error) {
                console.error(error)
            }

            console.log("提交", values)
        }

        function clearForm() {
            uploadImageList.value = []
            resetFields()
        }

        return { registerForm, uploadImageList, handleSubmit }
    },
})
</script>
<style lang="scss"></style>
