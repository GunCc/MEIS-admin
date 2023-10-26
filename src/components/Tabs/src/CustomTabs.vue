<template>
    <div class="flex items-center">
        <div
            class="px-4 py-1 mx-2 rounded text-sm"
            style="cursor: pointer;"
            :class="current == item.key ? 'bg-sky-500 text-white' : ' '"
            v-for="item in list"
            :key="item.key"
            @click="() => handleChange(item)"
        >
            {{ item.name }}
        </div>
    </div>
</template>
<script lang="ts">
import { PropType } from "vue"
import { customTabsProps } from "./types/index"
export default defineComponent({
    name: "CustomTabs",
    props: {
        modelValue: {
            type: [String, Number] as PropType<string | number>,
        },
        list: {
            type: Array as PropType<customTabsProps[]>,
        },
    },
    emits: ["tabs-click", "update:modelValue"],
    setup(props, { emit }) {
        const current = ref<string | number>()
        watch(
            () => props.modelValue,
            () => {
                current.value = props.modelValue
            },
            { immediate: true }
        )
        function handleChange(item: customTabsProps) {
            emit("update:modelValue", item.key)
            emit("tabs-click", item)
        }
        return {
            handleChange,
            current,
        }
    },
})
</script>
<style lang="scss"></style>
