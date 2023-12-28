<template>
    <div class="h-100vh flex flex-col">
        <LoginWrapHeader />

        <div class="w-full flex items-center flex-1 justify-center">
            <div
                class="flex justify-center shadow rounded-xl bg-white "
            >
                <div class="lg:block hidden border-solid border-gray-200 border-right">
                    <img src="@/assets/logo.png" alt="" class="2xl:w-700px 2xl:h-700px w-500px h-500px"  />
                </div>
                <div class="p-10  flex justify-center flex-col 2xl:w-700px  2xl:h-700px w-500px h-500px">
                    <h1 class="mb-10 text-2xl font-bold">管理员登陆</h1>
                    <BasicForm
                        @register="regitserForm"
                        @enter-press="handleSubmit"
                    ></BasicForm>
                    <div
                        class="rounded-full w-14 h-14 bg-blue-500 mx-auto flex items-center justify-center mt-10"
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
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
import { FormItemSchemas } from "@/components/Form/src/types/form"
import { BasicForm, useForm } from "@c/Form"
import LoginHeader from "./components/LoginHeader.vue"
import LoginWrapHeader from "./components/LoginWrapHeader.vue"
import { getCaptcha } from "@/api/v1/system/base"
import { CaptchaValue } from "@/api/model/base/response"
import { Nullable } from "vitest"
import { Login } from "@/api/model/base/request"
import { userStore } from "@/store/modules/user"
import { error } from "@/utils/log"

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
    } catch (err) {
        console.log("失败", err)
        // 失败后要重新获取image
        await getCaptchaImage()
        error(err as string)
    }
}
onMounted(() => {
    getCaptchaImage()
})

async function getCaptchaImage() {
    try {
        const res = await getCaptcha()
        captcha.value = res
    } catch (err) {
        error(err as string)
    }
}
</script>
<style lang="scss" scoped></style>
