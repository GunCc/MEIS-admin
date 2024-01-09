<template>
    <div>
        <el-menu
            v-bind="getProps"
            @open="handleOpen"
            @close="handleClose"
            @select="handleSelect"
        >
            <template v-for="item in getProps.items" :key="item.path">
                <BasicMenuItem
                    :path="item.path"
                    :children="item.children || []"
                    :title="item.title"
                ></BasicMenuItem>
            </template>
        </el-menu>
    </div>
</template>
<script lang="ts">
import { ref, computed } from "vue"
import { useMenuEvents } from "./hooks/menuEvents"
import { basicProps } from "./props"
import BasicMenuItem from "./components/BasicMenuItem.vue"

export default defineComponent({
    name: "BasicMenu",
    emit: ["menuHandleOpen", "menuHandleClose"],
    props: basicProps,
    components: { BasicMenuItem },
    setup(props, { emit }) {
        const isCollapse = ref(false)
        const { handleOpen, handleClose, handleSelect } = useMenuEvents({
            emit,
        })

        const route = useRoute()

        const getProps = computed(() => {
            return {
                ...props,
                defaultActive: route.path,
                collapse: unref(isCollapse),
            }
        })
        return {
            getProps,
            handleOpen,
            handleClose,
            handleSelect,
        }
    },
})
</script>
<style lang="scss"></style>
