<template>
    <PageWrapper content-class="p-5 ">
        <div class="bg-white p-5 mb-5 shadow" ref="wrapperElRef">
            <BasicForm @register="register" ref="formElRef">
                <template #action-center>
                    <el-button type="success" @click="handleAddImage">
                        添加
                    </el-button>
                </template>
            </BasicForm>
            <div class="material-header flex items-center justify-between pb-4">
                <div class="flex items-center">
                    <span class="text-sm text-gray-700">分类：</span>
                    <CustomTabs
                        v-bind="getCustomOptions"
                        v-model="getCurrent"
                    />
                </div>

                <div>
                    <el-button type="info" @click="handleTypeEdit">
                        分类编辑
                    </el-button>
                </div>
            </div>
            <el-scrollbar :height="unref(getWrapHeight)">
                <div>
                    <el-row>
                        <el-col
                            v-bind="getImageColOptions"
                            v-for="item in 30"
                            :key="item"
                        >
                            <div class="mr-5">
                                <BasicImage
                                    wrap-class="rounded overflow-hidden"
                                    src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                                />
                                <div
                                    class="dark:text-gray-100 text-sm py-3 flex items-center justify-center text-gray-700"
                                >
                                    图片名字
                                    <SvgIcon
                                        icon-name="bianji"
                                        icon-class="w-5 h-5"
                                    />
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-scrollbar>
            <Pagination class="pt-5"></Pagination>
            <BasicModal v-model:visible="visible" width="500px">
                <template #header> {{ getModalProps.title }}</template>
                <template #default>
                    <component
                        :is="getModalProps.component"
                        :upload-types="unref(getUploadFiles)"
                        @change="uploadFiledReload"
                    >
                    </component>
                </template>
            </BasicModal>
        </div>
    </PageWrapper>
</template>
<script lang="ts" setup>
import { PageWrapper } from "@c/PageWrapper/index"
import { Pagination } from "@c/Pagination/index"
import { BasicImage } from "@c/Image/index"
import { SvgIcon } from "@c/SvgIcon/index"

import { BasicForm, useForm } from "@c/Form/index"
import {
    useMaterialForm,
    useMaterial,
    useCustomTabs,
    useMaterialList,
    useUploadType,
} from "./hooks/index"
import { BasicModal } from "@c/Modal/index"
import { CustomTabs } from "@c/Tabs/index"
import { ResourceType } from "@/api/model/upload/request"

const formElRef = ref(null)
const wrapperElRef = ref(null)
const visible = ref<boolean>(false)
const modelProps = ref<Recordable>({
    title: "添加图片",
})

const getModalProps = computed({
    get: () => unref(modelProps),
    set: val => {
        modelProps.value = { ...unref(modelProps), ...val }
    },
})

// 素材库上传文件类型控制
const { getUploadFiles, reload: uploadFiledReload } = useUploadType()
// 素材库搜索控件
const { getFormProps } = useMaterialForm()
// 素材库高度控制
const { getWrapHeight } = useMaterial(wrapperElRef, formElRef)
// 素材库获取图片资源
const { getImageColOptions, handleAddImage } = useMaterialList(
    handleOpen,
    getModalProps
)
// 素材库获取Tabs控件
const { getCurrent, getCustomOptions, handleTypeEdit } = useCustomTabs(
    handleOpen,
    getModalProps,
    getUploadFiles
)

defineExpose({
    getCurrent,
    getCustomOptions,
    handleTypeEdit,
    getImageColOptions,
    handleAddImage,
})
const [register] = useForm(unref(getFormProps))

function handleOpen() {
    visible.value = true
}
</script>
<style lang="scss"></style>
