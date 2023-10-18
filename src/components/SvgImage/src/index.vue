<template>
    <div>
        <svg
            aria-hidden="true"
            :class="`icon ${styleClass}`"
            style="cursor: pointer"
        >
            <use :xlink:href="`#icon-${name}`"></use>
        </svg>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue"
export default defineComponent({
    name: "SvgImage",
    props: {
        name: {
            require: true,
            type: String as PropType<string>,
        },
        styleClass: {
            type: String as PropType<string>,
        },
    },
})
</script>
<style lang="scss" >

</style>
