<template>
    <div class="h-100vh flex flex-col">
        <LoginWrapHeader />

        <div class="w-full flex-1 flex items-center">
            <div
                class="container mx-auto max-w-xl rounded-xl overflow-hidden shadow"
            >
                <LoginHeader />
                <div class="bg-white">
                    <div class="form-wrap p-10">
                        <BasicForm @register="regitserForm"></BasicForm>
                        <div
                            class="rounded-full w-14 h-14 bg-blue-500 mx-auto flex items-center justify-center"
                            @click="handleSubmit"
                        >
                            <svg
                                aria-hidden="true"
                                class="w-6 h-6 mx-2 dark:fill-slate-80 fill-white"
                                style="cursor: pointer"
                            >
                                <use xlink:href="#icon-jinrujiantou"></use>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
import { FormItemSchemas } from "@/components/Form/src/types/form"
import { BasicForm, useForm } from "@c/Form"
import LoginHeader from "./components/LoginHeader.vue"
import LoginWrapHeader from "./components/LoginWrapHeader.vue"
import { getCaptcha, login } from "@/api/v1/system/base"
import { CaptchaValue } from "@/api/model/base/response"
import { Nullable } from "vitest"
import { Login } from "@/api/model/base/request"
import { userStore } from "@/store/modules/user"

const captcha = ref<Nullable<CaptchaValue>>(null)

const [regitserForm, { getFormValues }] = useForm({
    labelWidth: 100,
    showAction: false,
    schemas: [
        {
            label: "管理员账号",
            field: "account",
            rules: [{ required: true, message: "请输入管理员账号" }],
            componentProps: {
                placeholder: "请输入管理员账号",
            },
        },
        {
            label: "管理员密码",
            field: "password",
            rules: [{ required: true, message: "请输入验证码" }],
            componentProps: {
                type: "password",
                placeholder: "请输入你的密码",
                showPassword: true,
            },
        },
        {
            label: "验证码",
            field: "captcha",
            rules: [{ required: true, message: "请输入验证码" }],
            componentProps: {
                placeholder: "请输入你的验证码",
            },
            renderComponentContent: () => {
                return {
                    append: () =>
                        h("img", {
                            width: 80,
                            height: 30,
                            src: unref(captcha)?.image_path,
                            onClick: getCaptchaImage,
                        }),
                }
            },
        },
    ] as FormItemSchemas[],
})

async function handleSubmit() {
    try {
        const useUserStore = userStore()
        const params = getFormValues() as Login
        params.captcha_id = unref(captcha)?.captcha_id || ""
        await useUserStore.handleLogin(params)
    } catch (error) {
        // 失败后要重新获取image
        await getCaptchaImage()
        console.error(error)
    }
}
onMounted(() => {
    getCaptchaImage()
})

async function getCaptchaImage() {
    try {
        const res = await getCaptcha()
        captcha.value = res
    } catch (error) {
        console.error(error)
    }
}
</script>
<style lang="scss" scoped></style>
