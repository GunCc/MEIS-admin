<template>
    <PageWrapper>
        <AppMap :map-url="A_MAP_URL" map-type="GAODE"></AppMap>
    </PageWrapper>
</template>
<script lang="ts" setup>
import { PageWrapper } from "@c/PageWrapper/index"
const A_MAP_URL =
    "https://webapi.amap.com/maps?v=2.0&key=2c542e01056bcb4a6bd8985b3e211197"
import { AppMap } from "@c/Map/index"
</script>
<style lang="scss"></style>
