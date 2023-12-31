<template>
    <el-select
        v-bind="getSelectOptions"
        @visible-change="handleSelectVisible"
        v-model="state"
    >
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
import { get, isFunction } from "lodash"
import { useTimeoutFn } from "@/hooks/core/useTimeout"
import { error } from "@/utils/log"

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
        // 数据字段
        listField: propTypes.string.def("list"),
        // 如果不是请求 -- 数据源
        dataSource: {
            type: [Array, Function] as PropType<
                Recordable[] | (() => Recordable[])
            >,
            default: () => [],
        },
    },
    setup(props) {
        const options = ref<Recordable[]>([])
        // const emitData = ref<any[]>([])

        const [state] = useFormItem(props)

        // 选项框的默认属性
        const getSelectOptions = computed(() => {
            const { selectOptions } = props
            return {
                class: "w-100",
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

        function handleSelectVisible(visible) {
            if (visible) {
                if (props.alwaysLoad) {
                    const { dataSource, api } = props
                    if (isFunction(api)) fetch()
                    else
                        options.value = isFunction(dataSource)
                            ? dataSource()
                            : dataSource
                }
            }
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
                const { dataSource, api } = props
                if (isFunction(api)) return
                options.value = isFunction(dataSource)
                    ? dataSource()
                    : dataSource
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
            getSelectOptions,
            handleSelectVisible,
        }
    },
})
</script>
<style lang="scss"></style>
