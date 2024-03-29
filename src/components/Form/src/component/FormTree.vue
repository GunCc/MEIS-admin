<template>
    <el-tree
        ref="treeRef"
        v-bind="getTreeOptions"
        @check="handleCheck"
        @check-change="handleCheckChange"
    >
    </el-tree>
</template>
<script lang="ts">
import { propTypes } from "@/utils/propTypes"
import { PropType } from "vue"
import { get, isFunction } from "lodash"
import { useTimeoutFn } from "@/hooks/core/useTimeout"
import { TreeComponentProps } from "element-plus/es/components/tree/src/tree.type"
import { ElTree } from "element-plus"
import { error } from "@/utils/log"

interface OptionsItem {
    value: string
    label: string
    children: Recordable[]
    disabled?: boolean
}

interface TreeCheckObject {
    checkedKeys: number[]
    checkedNodes: Recordable[]
    halfCheckedNodes: Recordable[]
    halfCheckedKeys: number[]
}

interface TreeOptions extends TreeComponentProps {}

export default defineComponent({
    name: "FormTree",
    props: {
        modelValue: {
            type: Array as PropType<number[] | string[]>,
            default: () => [],
        },
        // 如果异步请求
        api: {
            type: Function as PropType<(arg?: Recordable) => Promise<any>>,
            default: null,
        },
        // 请求api传参
        params: propTypes.any.def({}),
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
        TreeOptions: {
            type: Object as PropType<Partial<TreeOptions>>,
            default: () => ({}),
        },
    },
    emits: ["change"],
    setup(props, { emit }) {
        const treeRef = ref<InstanceType<typeof ElTree>>()
        const options = ref<Recordable[]>([])
        const checkValues = ref<any[]>([])
        const checkType = ref<boolean>(false)

        // 获取options数据
        const getOptions = computed(() => {
            return computedToGetOptions(unref(options))
        })

        // 选项框的默认属性
        const getTreeOptions = computed(() => {
            const { TreeOptions } = props
            return {
                class: "w-100",
                data: unref(getOptions),
                ...TreeOptions,
            }
        })

        // 点击节点复选框之后触发
        function handleCheck(current: Recordable, treeObj: TreeCheckObject) {
            const { checkedKeys } = treeObj

            let ids = getTreeNode(current)
            let values = unref(checkType)
                ? [...new Set([...checkedKeys, ...ids])]
                : checkedKeys.filter(item => !ids.includes(item))
            checkValues.value = values
            emit("change", unref(checkValues))
        }

        // 当前选中节点变化时触发的事件
        function handleCheckChange(_: Recordable, isCheck: boolean) {
            checkType.value = isCheck
        }

        // 获取点击对象的所有子节点
        function getTreeNode(
            node: Recordable | Recordable[],
            ids: number[] = []
        ): number[] {
            const { valueField, childField } = props
            // 如果是数组
            if (Array.isArray(node)) {
                node.forEach(item => {
                    getTreeNode(item, ids)
                })
            } else {
                ids.push(node[valueField])
                if (node[childField] && node[childField].length != 0)
                    getTreeNode(node[childField], ids)
            }

            return ids
        }

        function setCheckedKeys(values: number[] | string[]) {
            nextTick(() => {
                treeRef.value!.setCheckedKeys(values, false)
            })
        }
        function resetChecked() {
            treeRef.value!.setCheckedKeys([], false)
        }

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

        watch(
            () => props.modelValue,
            () => {
                setCheckedKeys(props.modelValue)
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
            treeRef,
            getOptions,
            getTreeOptions,
            handleCheck,
            handleCheckChange,
            setCheckedKeys,
            resetChecked,
        }
    },
})
</script>
<style lang="scss"></style>
