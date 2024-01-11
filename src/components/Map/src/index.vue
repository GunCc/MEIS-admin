<template>
    <div ref="wrapRef" v-bind="getMapAttr">
        {{ success ? "地图加载成功" : "地图加载失败" }}
    </div>
</template>
<script lang="ts">
import { basicProps } from "./props"
import { AppMap } from "./types"

export default defineComponent({
    name: "AppMap",
    props: basicProps,
    setup(props, {}) {
        const wrapRef = ref<HTMLDivElement | null>(null)

        const map = new AppMap(props.mapUrl, props.mapType)
        const { toPromise, success } = map.getScript()

        const getMapAttr = computed(() => {
            const { width, height } = props
            // auto 代表自适应
            return {
                style: {
                    width,
                    height,
                },
            }
        })

        async function initMap() {
            await toPromise()
            await nextTick()
            const wrapEl = unref(wrapRef)
            if (!wrapEl) return

            const { initMap } = map.init(wrapEl) || {}
            initMap && initMap()
            // const AMap = (window as any).AMap
            // new AMap.Map(wrapEl)
        }

        onMounted(() => {
            initMap()
        })

        return {
            success,
            wrapRef,
            getMapAttr,
        }
    },
})
</script>
<style lang="scss">
.map--height-auto {
    // height:calc(100vh - )
}
</style>
