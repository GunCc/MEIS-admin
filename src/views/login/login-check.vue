<template>
    <div class="h-100vh w-full flex items-center">
        <div
            class="container mx-auto max-w-xl rounded-xl overflow-hidden shadow"
        >
            <div
                class="bg-gray-800 text-white p-5 text-center text-4xl font-bold bg-gradient-to-b from-green-400 to-blue-500"
            >
                M E I S
            </div>
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
                            class="w-6 h-6 mx-2 dark:fill-slate-200 fill-white"
                            style="cursor: pointer"
                        >
                            <use xlink:href="#icon-jinrujiantou"></use>
                        </svg>
                    </div>
                    <div
                        class="flex items-center justify-center py-8 divide-x divide-gray-500"
                    >
                        <div class="text-center px-4 text-sm text-gray-600">
                            还没注册
                        </div>
                        <div class="text-center px-4 text-sm text-gray-600">
                            忘记密码？
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

type LoginRole = "Teacher" | "Student"

const roleMap = new Map<LoginRole, FormItemSchemas[]>()

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
])

const [regitserForm, { setFormSchemas, getFormValues }] = useForm({
    schemas: roleMap.get("Teacher") as FormItemSchemas[],
})
function handleChangeRole(role: LoginRole) {
    console.log(roleMap.get(role))
    setFormSchemas(roleMap.get(role) as FormItemSchemas[])
}
function handleSubmit() {
    console.log("getFormValues", getFormValues())
}
</script>
<style lang="scss" scoped></style>
