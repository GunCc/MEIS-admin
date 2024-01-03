<template>
    <div class="meis--mutiple-header bg-white">
        <MutipleTabs />
    </div>
</template>
<script lang="ts">
import MutipleTabs from "../tabs/index.vue"
// 标签头部
export default defineComponent({
    name: "LayoutMutipleHeader",
    components: {
        MutipleTabs,
    },
    setup() {
        return {}
    },
})
</script>
<style lang="scss">
.meis--mutiple-header{
    
}
</style>
