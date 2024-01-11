<template>
    <PageWrapper>
        <AppMap :map-url="BD_MAP_URL" map-type="BAIDU"></AppMap>
    </PageWrapper>
</template>
<script lang="ts" setup>
import { PageWrapper } from "@c/PageWrapper/index"
const BD_MAP_URL =
    "https://api.map.baidu.com/api?v=1.0&&type=webgl&ak=3RZkVCy5V459FGemo05NmQZ72b8WI8a8"
import { AppMap } from "@c/Map/index"
</script>
<style lang="scss"></style>
