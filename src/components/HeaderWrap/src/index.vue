<template>
    <div class="h-12 w-full border-bottom border-gray-100 border-solid bg-white">
        <slot />
    </div>

</template>

<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
    name: "HeaderWrap",
})
</script>
