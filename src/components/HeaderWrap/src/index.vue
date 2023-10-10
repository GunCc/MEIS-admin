<template>
    <div class="h-12 bg-slate-800 w-full">
        <slot />
    </div>

</template>

<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
    name: "HeaderWrap",
})
</script>
