<template>
    <div ref="wrapperRef">
        <div class="overflow-hidden" :style="contentStyle">
            <slot />
        </div>
    </div>
</template>
<script lang="ts">
import { useCalcContentHeight } from "@/hooks/web/useCalcContentHeight"
import { CSSProperties } from "vue"

export default defineComponent({
    name: "PageWrapper",
    setup() {
        const wrapperRef = ref(null)
        const { contentHeight } = useCalcContentHeight(wrapperRef)

        const contentStyle = computed((): CSSProperties => {
            const height = `${unref(contentHeight)}px`

            return {
                minHeight: height,
                height,
            }
        })
        return {
            wrapperRef,
            contentHeight,
            contentStyle,
        }
    },
})
</script>
<style lang="scss"></style>
