<template>
    <div class="h-100vh flex flex-col">
        <HeaderWrap />
        <div class="w-full flex-1 flex items-center">
            <div
                class="container mx-auto max-w-xl rounded-xl overflow-hidden shadow"
            >
                <LoginHeader />
                <div class="bg-white">
                    <div
                        class="flex items-center justify-center py-8 divide-x divide-gray-500"
                    >
                        <div
                            class="text-center px-4 text-sm text-gray-600 flex"
                            style="cursor: pointer"
                            @click="() => handleChangeRole('Student')"
                        >
                            <svg aria-hidden="true" class="w-6 h-6 mx-2">
                                <use xlink:href="#icon-putongxuesheng"></use>
                            </svg>
                            我是学生
                        </div>
                        <div
                            class="text-center px-4 text-sm text-gray-600 flex"
                            style="cursor: pointer"
                            @click="() => handleChangeRole('Teacher')"
                        >
                            <svg aria-hidden="true" class="w-6 h-6 mx-2">
                                <use xlink:href="#icon-laoshi"></use>
                            </svg>
                            我是老师
                        </div>
                    </div>
                    <div class="form-wrap px-10">
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
                        <div
                            class="flex items-center justify-center py-8 divide-x divide-gray-500"
                        >
                            <div
                                class="text-center px-4 text-sm text-gray-600"
                                style="cursor: pointer"
                                @click="handleGo('/register')"
                            >
                                还没注册
                            </div>
                            <div
                                class="text-center px-4 text-sm text-gray-600"
                                style="cursor: pointer"
                                @click="handleGo('/forgetPassword')"
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
import { ref, onMounted } from "vue"
import { FormItemSchemas } from "@/components/Form/src/types/form"
import { BasicForm, useForm } from "@c/Form"
import LoginHeader from "./components/LoginHeader.vue"
import { HeaderWrap } from "@c/HeaderWrap"
import { useGo } from "@/hooks/web/usePage"
import { getCaptcha } from "@/api/v1/base"
import { CaptchaValue } from "@/api/model/base/response"
import { Nullable } from "vitest"

const go = useGo()

type EducationLoginRole = "Teacher" | "Student"

const roleMap = new Map<EducationLoginRole, FormItemSchemas[]>()

const captcha = ref<Nullable<CaptchaValue>>(null)

roleMap.set("Teacher", [
    {
        label: "学校名称",
        field: "schoolName",
    },
    {
        label: "教师编号",
        field: "teacherNo",
    },
    {
        label: "账号密码",
        field: "password",
    },
    {
        label: "验证码",
        field: "code",
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
                        style:"margin:-20px",
                        src: unref(captcha)?.image_path,
                        onClick: getCaptchaImage,
                    }),
            }
        },
    },
])

roleMap.set("Student", [
    {
        label: "学校名称",
        field: "schoolName",
    },
    {
        label: "学生学号",
        field: "teacherNo",
    },
    {
        label: "账号密码",
        field: "password",
    },
    {
        label: "验证码",
        field: "code",
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
])

const [regitserForm, { setFormSchemas, getFormValues }] = useForm({
    schemas: roleMap.get("Teacher") as FormItemSchemas[],
})
function handleChangeRole(role: EducationLoginRole) {
    setFormSchemas(roleMap.get(role) as FormItemSchemas[])
}
function handleSubmit() {
    console.log("getFormValues", getFormValues())
}
onMounted(() => {
    getCaptchaImage()
})

async function getCaptchaImage() {
    try {
        const res = await getCaptcha()
        captcha.value = res
        console.log(res)
    } catch (error) {
        console.error(error)
    }
}

function handleGo(path) {
    go({
        path,
    })
}
</script>
<style lang="scss" scoped></style>
