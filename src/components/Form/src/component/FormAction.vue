<template>
    <el-col v-bind="getActionCol">
        <el-form-item class="w-full">
            <div :class="buttonClass">
                <slot name="action-before" />
                <el-button v-bind="getBasicProps" @click="resetAction">
                    重置
                </el-button>
                <slot name="action-center" />
                <el-button
                    v-bind="getBasicProps"
                    type="primary"
                    @click="submitAction"
                >
                    确认
                </el-button>
                <slot name="action-after" />
            </div>
        </el-form-item>
    </el-col>
</template>
<script lang="ts">
import { propTypes } from "@/utils/propTypes"
import { PropType } from "vue"
import { useFormContext } from "../hooks/useFormContext"
import { ColEx } from "../types"

export default defineComponent({
    name: "FormAction",
    props: {
        buttonClass: propTypes.string,
        size: {
            type: String as PropType<"large" | "default" | "small">,
            default: "small",
        },
        actionColOptions: {
            type: Object as PropType<Partial<ColEx>>,
        },
    },
    setup(props) {
        console.log("action", props)
        const getBasicProps = computed(() => {
            const { size } = props
            return {
                size,
            }
        })
        const getActionCol = computed(() => {
            const { actionColOptions } = props
            return {
                ...actionColOptions,
            }
        })
        return {
            getActionCol,
            getBasicProps,
            ...useFormContext(),
        }
    },
})
</script>
<style lang="scss"></style>
