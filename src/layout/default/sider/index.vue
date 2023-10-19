<template>
    <div class="bg-white dark:bg-gray-900">
        <Menu> </Menu>
    </div>
</template>
<script>
import Menu from "../menu/index.vue"
export default defineComponent({
    name: "LayoutSider",
    components: {
        Menu,
    },
})
</script>
<style lang="scss"></style>
