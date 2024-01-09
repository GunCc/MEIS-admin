<template>
    <basic-form @register="registerForm" @submit="handleSubmit">
        <template #hidden>
            <el-switch v-model="hiddenSwitchValue"></el-switch>
        </template>
        <template #keepAlive>
            <el-switch v-model="keepAliveSwitchValue"></el-switch>
        </template>
        <template #affix>
            <el-switch v-model="affixSwitchValue"></el-switch>
        </template>
    </basic-form>
</template>
<script lang="ts">
import { updateMenu, createMenu } from "@/api/v1/system/menu"
import { FormItemSchemas } from "@/components/Form/src/types/form"
import { BasicForm, useForm } from "@c/Form"
import { clone, isObject } from "lodash"
import { PropType } from "vue"
import { error } from "@/utils/log"
import { userStore } from "@/store/modules/user"
export default defineComponent({
    name: "MenuModalForm",
    components: { BasicForm },
    props: {
        row: {
            type: [String, Object] as PropType<Recordable | "create">,
            default: "create",
        },
        schemaSetting: {
            type: Array as PropType<FormItemSchemas[]>,
            default: () => [],
        },
    },
    setup(props, { emit }) {
        const keepAliveSwitchValue = ref<boolean>(true)
        const hiddenSwitchValue = ref<boolean>(true)
        const affixSwitchValue = ref<boolean>(false)
        const useUserApp = userStore()

        const [
            registerForm,
            { resetFields, setFormSchemas, getFormField, clearValidate },
        ] = useForm({
            validateOnSubmit: false,
            labelWidth: "120px",
            submitOnReset: false,
        })

        async function handleSubmit(values) {
            const { row } = props
            try {
                let form = clone(values)
                const isObj = isObject(row)
                const api = isObj ? updateMenu : createMenu
                form = {
                    ...(isObj && row),
                    ...form,
                }
                form.p_id = form.p_id[form.p_id.length - 1]
                form.hidden = unref(hiddenSwitchValue)
                form.meta.keepAlive = unref(keepAliveSwitchValue)
                form.meta.affix = unref(affixSwitchValue)
                await api(form)
                // 操作完要更新路由信息
                await useUserApp.handleLoginAfter(false)
                clearForm()
                emit("success-submit")
            } catch (err) {
                error(err as string)
            }
        }

        function clearForm() {
            hiddenSwitchValue.value = true
            keepAliveSwitchValue.value = true
            affixSwitchValue.value = false
            resetFields()
        }

        async function init() {
            clearValidate()
            setFormSchemas(props.schemaSetting)
            await nextTick()
            let hiddenValue = await getFormField("hidden")
            let keepAliveValue = await getFormField("meta%keepAlive")
            let affixValue = await getFormField("meta%affix")
            console.log("affixValue", affixValue)
            hiddenSwitchValue.value = props.row != "create" ? hiddenValue : true
            affixSwitchValue.value =
                props.row != "create" ? !!affixValue : false
            keepAliveSwitchValue.value =
                props.row != "create" ? keepAliveValue : true
        }

        watch(
            () => props.schemaSetting,
            () => {
                nextTick(() => {
                    init()
                })
            },
            {
                immediate: true,
                deep: true,
            }
        )

        return {
            registerForm,
            handleSubmit,
            keepAliveSwitchValue,
            hiddenSwitchValue,
            affixSwitchValue,
        }
    },
})
</script>
<style lang="scss"></style>
