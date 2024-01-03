<template>
    <LayoutHeader />
    <div class="flex">
        <LayoutSider />
        <div class="flex-1 layout--default-content" >
            <LayoutMutipleHeader />
            <LayoutContent />
        </div>
    </div>
</template>
<script lang="ts">
import LayoutHeader from "./header/index.vue"
import LayoutMutipleHeader from "./header/MutipleHeader.vue"


import LayoutSider from "./sider/index.vue"
import LayoutContent from "./content/index.vue"
export default defineComponent({
    name: "DefaultLayout",
    components: {
        LayoutHeader,
        LayoutSider,
        LayoutContent,
        LayoutMutipleHeader
    },
})
</script>
<style lang="scss" scoped>
.layout--default-content{
    width: calc(100% - 220px);
}
</style>
