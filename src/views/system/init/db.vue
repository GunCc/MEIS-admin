<template>
    <div class="h-100vh flex flex-col">
        <div class="w-full flex-1 flex items-center">
            <div
                class="container mx-auto max-w-xl rounded-xl overflow-hidden shadow"
            >
                <div class="bg-white">
                    <div class="form-wrap p-10">
                        <h1 class="text-2xl font-bold text-center pb-10">
                            数据库初始化
                        </h1>
                        <BasicForm
                            @register="regitserForm"
                            @enter-press="handleSubmit"
                        ></BasicForm>
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
import { getCaptcha } from "@/api/v1/system/base"
import { CaptchaValue } from "@/api/model/base/response"
import { Nullable } from "vitest"
import { Login } from "@/api/model/base/request"
import { userStore } from "@/store/modules/user"
import { error } from "@/utils/log"

import { useAppStore } from "@/store/modules/app"
const captcha = ref<Nullable<CaptchaValue>>(null)

const [regitserForm, { getFormValues }] = useForm({
    labelWidth: 120,
    showAction: false,
    schemas: [
        {
            label: "数据库类型",
            field: "dbType",
            component: "Select",
            componentProps: {
                placeholder: "请选择数据库类型（默认Mysql，目前只支持Mysql）",
                dataSource: () => {
                    return [
                        {
                            id: "mysql",
                            value: "Mysql",
                        },
                    ]
                },
            },
        },
        {
            label: "服务器地址",
            field: "host",
            componentProps: {
                placeholder: "请输入服务器地址（默认127.0.0.1）",
            },
        },
        {
            label: "数据库连接端口",
            field: "port",
            componentProps: {
                placeholder: "请输入数据库连接端口（默认3306）",
            },
        },
        {
            label: "数据库用户名",
            field: "userName",
            rules: [{ required: true, message: "请输入数据库用户名" }],
            componentProps: {
                placeholder: "请输入数据库用户名",
            },
        },
        {
            label: "数据库密码",
            field: "password",
            componentProps: {
                type: "password",
                placeholder: "请输入数据库密码（默认为空）",
            },
        },
        {
            label: "数据库名",
            field: "dbName",
            rules: [{ required: true, message: "请输入数据库名" }],
            componentProps: {
                placeholder: "请输入数据库名（若数据库不存在，即自动创建）",
            },
        },
    ] as FormItemSchemas[],
})

async function handleSubmit() {
    try {
        const appStore = useAppStore()
        const params = getFormValues() as InitDB
        await appStore.handleInitDB(params)
        
    } catch (err) {
        error(err as string)
    }
}
</script>
<style lang="scss" scoped></style>
