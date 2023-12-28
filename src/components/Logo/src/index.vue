<template>
    <div class="meis-logo" :style="getLogoStyle"></div>
</template>
<script lang="ts">
import { propTypes } from "@/utils/propTypes"
export default defineComponent({
    name: "Logo",
    props: {
        width: propTypes.string.def("120px"),
        height: propTypes.string.def("50px"),
    },
    setup(props) {
        const getLogoStyle = computed(() => {
            const { width, height } = props
            return {
                width,
                height,
            }
        })

        return {
            getLogoStyle,
        }
    },
})
</script>
<style lang="scss">
.meis-logo {
    background-size: cover;
    background-image: url("@/assets/logo_big_title.png");
    background-repeat: no-repeat;
    background-position: center 54%;
}
</style>
