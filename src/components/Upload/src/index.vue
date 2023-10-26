<template>
    <div>
        <el-upload v-bind="getUploadOptions">
            <el-icon><Plus /></el-icon>
        </el-upload>
    </div>
</template>
<script lang="ts">
import { propTypes } from "@/utils/propTypes"
import { PropType } from "vue"
import { Plus } from "@element-plus/icons-vue"
export default defineComponent({
    name: "BasicploadFile",
    components: {
        Plus,
    },
    props: {
        method: propTypes.string.def("post"),
        multiple: propTypes.bool.def(true),
        data: {
            type: Object as PropType<Recordable | Fn>,
        },
        name: propTypes.string.def("file"),
        showFileList: propTypes.bool.def(true),
        accept: propTypes.string,
        listType: {
            type: String as PropType<"text" | "picture" | "picture-card">,
            default: "picture-card",
        },
        autoUpload: propTypes.bool.def(true),
    },
    setup(props) {
        const { VITE_HTTP_URL } = import.meta.env

        const getUploadOptions = computed(() => {
            return {
                action: VITE_HTTP_URL + "/resource/upload",
                ...props,
            }
        })
        return {
            getUploadOptions,
        }
    },
})
</script>
<style lang="scss"></style>
