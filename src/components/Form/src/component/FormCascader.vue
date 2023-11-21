<template>
    <el-cascader v-bind="getCascaderOptions" v-model="state"> </el-cascader>
</template>
<script lang="ts">
import { propTypes } from "@/utils/propTypes"
import { useFormItem } from "@/hooks/components/useFormItem"
import { PropType } from "vue"
import { get, isFunction } from "lodash"
import { useTimeoutFn } from "@/hooks/core/useTimeout"
import { CascaderProps } from "element-plus/es/components/cascader-panel/src/node"
import { CascaderInstance } from "element-plus"
import { error } from "@/utils/log"

interface OptionsItem {
    value: string
    label: string
    children: Recordable[]
    disabled?: boolean
}

interface CascaderOptionsContext extends CascaderInstance {}
interface CascaderPropContext extends CascaderProps {}

export default defineComponent({
    name: "FormCascader",
    props: {
        value: [Array, Object, String, Number],
        // 如果异步请求
        api: {
            type: Function as PropType<(arg?: Recordable) => Promise<any>>,
            default: null,
        },
        // 请求api传参
        params: propTypes.any.def({}),
        cascaderOptions: {
            type: Object as PropType<Partial<CascaderOptionsContext>>,
            default: () => {},
        },
        cascaderProps: {
            type: Object as PropType<Partial<CascaderPropContext>>,
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
        // 数据字段
        listField: propTypes.string.def("list"),
        // 孩子字段
        childField: propTypes.string.def("children"),
        // 如果不是请求 -- 数据源
        dataSource: {
            type: Array as PropType<Recordable[]>,
            default: () => [],
        },
    },
    setup(props) {
        const options = ref<Recordable[]>([])
        // const emitData = ref<any[]>([])

        const [state] = useFormItem(props)

        // 获取options数据
        const getOptions = computed(() => {
            return computedToGetOptions(unref(options))
        })

        // 选项框的默认属性
        const getCascaderOptions = computed(() => {
            const { cascaderOptions, cascaderProps } = props
            return {
                class: "w-100",
                ...cascaderOptions,
                props: cascaderProps,
                options: unref(getOptions),
            }
        })

        function computedToGetOptions(info: Recordable[]) {
            const { labelField, valueField, childField } = props
            return info.map(item => {
                item.value = item[valueField]
                item.label = item[labelField]
                if (item[childField] && item[childField].length > 0) {
                    item.children = computedToGetOptions(item[childField])
                } else item.children = []
                return item
            }) as OptionsItem[]
        }

        async function fetch() {
            const { api, params, listField } = props
            try {
                const res = await api(params)
                let list = get(res, listField)
                options.value = list
            } catch (err) {
                error(err as string)
            }
        }

        watch(
            () => props.dataSource,
            () => {
                !isFunction(props.api) && (options.value = props.dataSource)
            },
            {
                immediate: true,
                deep: true,
            }
        )

        onMounted(() => {
            useTimeoutFn(() => {
                const { immediate, api } = props
                immediate && isFunction(api) && fetch()
            }, 16)
        })

        return {
            state,
            getOptions,
            getCascaderOptions,
        }
    },
})
</script>
<style lang="scss"></style>
