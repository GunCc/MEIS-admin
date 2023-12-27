<template>
    <el-row class="w-100" :gutter="12">
        <el-col v-bind="colOptions" v-for="item in imageList" :key="item">
            <BasicImage wrap-class="rounded overflow-hidden" :src="item" />
        </el-col>
        <el-col v-bind="colOptions">
            <div class="w-full relative" style="padding-top: 100%">
                <el-upload
                    ref="uploadRef"
                    class="top-0 bottom-0 left-0 right-0 absolute border rounded border-dashed border-gray-100 flex items-center justify-center hover:border-blue-500"
                    v-bind="getUploadOptions"
                >
                    <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" /> -->
                    <el-icon class="avatar-uploader-icon"><Plus /> </el-icon>
                </el-upload>
            </div>
        </el-col>
    </el-row>
</template>
<script lang="ts">
import { propTypes } from "@/utils/propTypes"
import { Plus } from "@element-plus/icons-vue"
import { UploadInstance } from "element-plus"
import { PropType } from "vue"
const { VITE_HTTP_URL } = import.meta.env
import { MEIS_http } from "@/utils/http"
import { ColEx } from "../types"
import { error } from "@/utils/log"

import { BasicImage } from "@c/Image/index"

export default defineComponent({
    name: "FormUpload",
    props: {
        headers: {
            type: Object as PropType<Recordable>,
        },
        method: propTypes.string.def("post"),
        multiple: propTypes.bool.def(true),
        data: {
            type: [Object, Function] as PropType<
                Record<string, any> | Awaitable<Record<string, any>> | Fn
            >,
        },
        withCredentials: propTypes.bool.def(false),
        name: propTypes.string.def("file"),
        showFileList: propTypes.bool.def(false),
        drag: propTypes.bool.def(false),
        accept: propTypes.string,
        limit: propTypes.number,
        disabled: propTypes.bool.def(false),
        autoUpload: propTypes.bool.def(true),
        listType: {
            type: String as PropType<"text" | "picture" | "picture-card">,
        },
        fileList: {
            type: Array,
            default: () => [],
        },
        colOptions: {
            type: Object as PropType<ColEx>,
            default: () => ({ span: 6 }),
        },
    },
    components: { Plus, BasicImage },
    setup(props) {
        const uploadRef = ref<UploadInstance>()
        const imageList = ref<string[]>([])
        const getUploadOptions = computed(() => {
            return {
                onSuccess: handleSuccess,
                ...props,
                action: VITE_HTTP_URL + "/resource/upload",
            }
        })

        async function handleSuccess(response: any) {
            try {
                const res = await MEIS_http.uploadFile(response)
                imageList.value = [
                    ...unref(imageList),
                    `${VITE_HTTP_URL}/${res.url}`,
                ]
            } catch (err) {
                error(err as string)
            }
        }

        return {
            imageList,
            uploadRef,
            getUploadOptions,
        }
    },
})
</script>
<style lang="scss"></style>
