<template>
    <div class="h-100vh flex flex-col">
        <HeaderWrap />
        <div class="w-full flex-1 flex items-center">
            <div
                class="container mx-auto max-w-xl rounded-xl overflow-hidden shadow"
            >
                <LoginHeader />
                <div class="bg-white pt-8">
                    <div class="form-wrap px-10">
                        <BasicForm @register="regitserForm"></BasicForm>
                        <div
                            class="rounded-full w-14 h-14 bg-blue-500 mx-auto flex items-center justify-center"
                            @click="handleSubmit"
                        >
                            <svg
                                aria-hidden="true"
                                class="w-6 h-6 mx-2 dark:fill-slate-200 fill-white"
                                style="cursor: pointer"
                            >
                                <use xlink:href="#icon-jinrujiantou"></use>
                            </svg>
                        </div>
                        <div
                            class="flex items-center justify-center py-8 divide-x divide-gray-500"
                        >
                            <div
                                class="text-center px-4 text-sm text-gray-600"
                                style="cursor: pointer"
                            >
                                忘记密码？
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { FormItemSchemas } from "@/components/Form/src/types/form"
import { BasicForm, useForm } from "@c/Form"
import LoginHeader from "./LoginHeader.vue"
import { HeaderWrap } from "@c/HeaderWrap"
import { FormRules } from "element-plus"

const [regitserForm, { setFormSchemas, getFormValues, validate }] = useForm({
    labelWidth: 100,
    labelPosition: "left",
    labelSuffix: "：",
    schemas: [
        {
            label: "昵称",
            field: "nickname",
            rules: [{ required: true, message: "昵称不能为空" }],
            componentProps: {
                placeholder: "请输入你的昵称",
            },
        },
        {
            label: "密码",
            field: "password",
            rules: [{ required: true, message: "密码不能为空" }],
            componentProps: {
                type: "password",
                placeholder: "请输入你的密码",
                showPassword: true,
            },
        },
        {
            label: "确认密码",
            field: "passwords",
            rules: [{ required: true, message: "请再次确定密码" }],
            componentProps: {
                placeholder: "请再次输入你的密码",
                showPassword: true,
            },
        },
        {
            label: "邮箱",
            field: "email",
            rules: [{ required: true, message: "请输入邮箱" }],
            componentProps: {
                placeholder: "请输入你的邮箱",
            },
        },
        {
            label: "验证码",
            field: "captcha",
            rules: [{ required: true, message: "请输入验证码" }],
            componentProps: {
                placeholder: "请输入你的验证码",
            },
        },
    ] as FormItemSchemas[],
})

async function handleSubmit() {
    console.log("getFormValues", getFormValues())
    console.log("校验", await validate())
}
</script>
<style lang="scss" scoped></style>
