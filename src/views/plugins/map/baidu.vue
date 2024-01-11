<template>
    <PageWrapper>
        <AppMap :map-url="BD_MAP_URL" map-type="BAIDU"></AppMap>
    </PageWrapper>
</template>
<script lang="ts" setup>
import { PageWrapper } from "@c/PageWrapper/index"
const BD_MAP_URL =
    "https://api.map.baidu.com/getscript?v=3.0&type=webgl&ak=3RZkVCy5V459FGemo05NmQZ72b8WI8a8&services=&t=20210201100830&s=1"
import { AppMap } from "@c/Map/index"
</script>
<style lang="scss"></style>
