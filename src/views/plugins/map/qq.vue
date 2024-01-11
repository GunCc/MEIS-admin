<template>
    <PageWrapper>
        <AppMap :map-url="QQ_MAP_URL" map-type="QQ"></AppMap>
    </PageWrapper>
</template>
<script lang="ts" setup>
import { PageWrapper } from "@c/PageWrapper/index"
const QQ_MAP_URL =
    "https://map.qq.com/api/gljs?v=1.exp&key=BTSBZ-WBX3Z-44OXU-77ETE-GHV7H-TZBZB"
import { AppMap } from "@c/Map/index"
</script>
<style lang="scss"></style>