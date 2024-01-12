<template>
    <basic-form @register="registerForm" @submit="handleSubmit"> </basic-form>
</template>
<script lang="ts">
import { bindRoleMenus } from "@/api/v1/system/role"
import { BasicForm, useForm } from "@c/Form"
import { clone } from "lodash"
import { PropType } from "vue"
import { getList as getAllList } from "@/api/v1/system/menu"
import { error } from "@/utils/log"
import { userStore } from "@/store/modules/user"
export default defineComponent({
    name: "RoleBindMenusModalForm",
    components: { BasicForm },
    props: {
        row: {
            type: Object as PropType<Recordable>,
            default: () => ({}),
        },
    },
    setup(props, { emit }) {
        const useUserApp = userStore()

        const [registerForm, { setFieldsValue }] = useForm({
            validateOnSubmit: false,
            labelWidth: "50px",
            submitOnReset: false,
            schemas: [
                {
                    label: "路由",
                    field: "menu_ids",
                    component: "Tree",
                    componentProps: {
                        api: getAllList,
                        immediate: true,
                        labelField: "name",
                        valueField: "id",
                        cascaderProps: {
                            multiple: true,
                        },
                        selectOptions: {
                            multiple: true,
                        },
                        TreeOptions: {
                            checkStrictly: true,
                            nodeKey: "id",
                            showCheckbox: true,
                        },
                    },
                },
            ],
        })

        async function handleSubmit(values) {
            const { row = {} } = props
            try {
                let form = clone(values)
                form.role_id = row.role_id
                await bindRoleMenus(form)
                // 操作完要更新路由信息
                await useUserApp.handleLoginAfter(false)
                emit("success-submit")
            } catch (err) {
                error(err as string)
            }
        }

        async function init() {
            const { row } = props
            let menu_ids = row?.menus?.map(item => item.id) || []
            setFieldsValue({
                menu_ids,
            })
        }

        watch(
            () => props.row,
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

        return { registerForm, handleSubmit }
    },
})
</script>
<style lang="scss"></style>
