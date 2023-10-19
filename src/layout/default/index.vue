<template>
    <LayoutHeader />
    <div class="flex">
        <LayoutSider />
        <div>
            <LayoutContent />
        </div>
    </div>
</template>
<script lang="ts">
import LayoutHeader from "./header/index.vue"
import LayoutSider from "./sider/index.vue"
import LayoutContent from "./content/index.vue"
export default defineComponent({
    name: "DefaultLayout",
    components: {
        LayoutHeader,
        LayoutSider,
        LayoutContent,
    },
})
</script>
<style lang="less" scoped></style>
