<template>
    <svg aria-hidden="true" class="inline-block" :class="iconClass">
        <use :xlink:href="`#icon-${iconName}`" v-bind="getIconProps"></use>
    </svg>
</template>
<script lang="ts">
import { propTypes } from "@/utils/propTypes"

export default defineComponent({
    name: "SvgIcon",
    props: {
        iconClass: propTypes.string,
        iconName: propTypes.string,
        pointer: propTypes.bool.def(true),
    },
    setup(props) {
        const getIconProps = computed(() => {
            const { pointer } = props
            const style = {
                cursor: pointer ? "pointer" : "none",
            }
            return {
                style,
            }
        })
        return {
            getIconProps,
        }
    },
})
</script>
<style lang="scss"></style>
