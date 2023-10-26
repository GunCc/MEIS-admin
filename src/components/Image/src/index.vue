<template>
    <div
        class="bg-black w-full relative"
        :class="wrapClass"
        style="padding-top: 100%"
    >
        <el-image
            class="top-0 bottom-0 left-0 right-0"
            style="position: absolute"
            v-bind="getImageProps"
        />
    </div>
</template>
<script lang="ts">
import { propTypes } from "@/utils/propTypes"
import { ImageProps } from "element-plus"
import { PropType } from "vue"

export default defineComponent({
    name: "BasicImage",
    props: {
        src: propTypes.string,
        wrapClass: propTypes.string,
        imageClass: propTypes.string,
        imageOption: {
            type: Object as PropType<ImageProps>,
            default: () => {},
        },
    },
    setup(props) {
        const getImageProps = computed(() => {
            const { src, imageOption = { fit: "cover" }, imageClass } = props
            return {
                ...imageOption,
                class: imageClass,
                src,
            }
        })
        return { getImageProps }
    },
})
</script>
<style lang="scss"></style>
