<template>
    <el-select v-bind="getSelectOptions" v-model="state">
        <el-option
            v-for="item in getOptions"
            :key="item[valueField]"
            :label="item.label"
            :value="item[valueField]"
        >
        </el-option>
    </el-select>
</template>
<script lang="ts">
import { propTypes } from "@/utils/propTypes"
import { useFormItem } from "@/hooks/components/useFormItem"
import { PropType } from "vue"

interface OptionsItem {
    value: string
    label: string
    disabled?: boolean
}

export default defineComponent({
    name: "FormSelect",
    props: {
        value: [Array, Object, String, Number],
        // 如果异步请求
        api: {
            type: Function as PropType<(arg?: Recordable) => Promise<any>>,
            default: null,
        },
        // 请求api传参
        params: propTypes.any.def({}),
        selectOptions: {
            type: Object as PropType<Recordable>,
            default: () => {},
        },
        // 是否立即请求
        immediate: propTypes.bool.def(true),
        // 是否总是加载
        alwaysLoad: propTypes.bool.def(false),
        // label字段
        labelField: propTypes.string.def("label"),
        // value字段
        valueField: propTypes.string.def("value"),
        // 如果不是请求 -- 数据源
        dataSource: {
            type: Array as PropType<Recordable[]>,
            default: () => [],
        },
    },
    setup(props) {
        const options = ref<Recordable[]>([])

        const [state] = useFormItem(props)

        // 选项框的默认属性
        const getSelectOptions = computed(() => {
            const { selectOptions } = props
            return {
                ...selectOptions,
            }
        })
        // 获取options数据
        const getOptions = computed(() => {
            const { labelField, valueField } = props

            return unref(options).map(item => {
                item.value = item[valueField]
                item.label = item[labelField]
                return item
            }) as OptionsItem[]
        })

        watch(
            () => props.dataSource,
            () => {
                options.value = props.dataSource
            },
            {
                immediate: true,
                deep: true,
            }
        )

        return {
            state,
            getOptions,
            getSelectOptions,
        }
    },
})
</script>
<style lang="scss"></style>
