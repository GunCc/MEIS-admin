<template>
    <PageWrapper content-class="p-5 ">
        <div class="bg-white p-5 mb-5 shadow" ref="wrapperElRef">
            <BasicForm @register="register" ref="formElRef">
                <template #action-center>
                    <el-button type="success">添加</el-button>
                </template>
            </BasicForm>
            <el-scrollbar :height="unref(getWrapHeight)">
                <div>
                    <el-row>
                        <el-col
                            :sm="8"
                            :md="6"
                            :lg="4"
                            :xl="3"
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
        </div>
    </PageWrapper>
</template>
<script lang="ts" setup>
import { PageWrapper } from "@c/PageWrapper/index"
import { Pagination } from "@c/Pagination/index"
import { BasicImage } from "@c/Image/index"
import { SvgIcon } from "@c/SvgIcon/index"

import { BasicForm, useForm } from "@c/Form/index"
import { useMaterialForm, useMaterial } from "./index"
const { getFormProps } = useMaterialForm()
const [register] = useForm(unref(getFormProps))
const wrapperElRef = ref(null)
const formElRef = ref(null)
const { getWrapHeight } = useMaterial(wrapperElRef, formElRef)
</script>
<style lang="scss"></style>
