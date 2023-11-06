<template>
    <div ref="wrapperRef" >
        <div
            class="overflow-hidden"
            :style="getContentStyle"
            :class="getContentClass"
        >
            <slot />
        </div>
    </div>
</template>
<script lang="ts">
import { useCalcContentHeight } from "@/hooks/web/useCalcContentHeight"
import { CSSProperties } from "vue"
import { propTypes } from "@/utils/propTypes"

export default defineComponent({
    name: "PageWrapper",
    props: {
        contentClass: propTypes.string,
    },
    setup(props) {
        const wrapperRef = ref(null)
        const { contentHeight } = useCalcContentHeight(wrapperRef)

        const getContentStyle = computed((): CSSProperties => {
            const height = `${unref(contentHeight)}px`

            return {
                minHeight: height,
                height,
                maxWidth:`calc(100vw - 220px)`
            }
        })
        const getContentClass = computed(() => {
            const { contentClass } = props
            return [contentClass]
        })
        return {
            wrapperRef,
            contentHeight,
            getContentStyle,
            getContentClass,
        }
    },
})
</script>
<style lang="scss"></style>
