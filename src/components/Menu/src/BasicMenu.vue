<template>
    <div>
        <el-menu
            v-bind="getProps"
            @open="handleOpen"
            @close="handleClose"
            @select="handleSelect"
        >
            <template v-for="item in getProps.items" :key="item.key">
                <el-sub-menu
                    :index="item.key"
                    v-if="item.children && item.children.length != 0"
                >
                    <template #title>
                        <span>{{ item.title }}</span>
                    </template>

                    <template
                        v-for="child in item.children"
                        :key="child.key"
                    >
                        <el-menu-item :index="child.key">
                            <span>{{ child.title }}</span>
                        </el-menu-item>
                    </template>
                </el-sub-menu>
                <el-menu-item :index="item.key" v-else>
                    <template #title>
                        <span>{{ item.title }}</span>
                    </template>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>
<script lang="ts">
import { ref, computed } from "vue"
import { useMenuEvents } from "./hooks/menuEvents"
import { basicProps } from "./props"
export default defineComponent({
    name: "BasicMenu",
    emit: ["menuHandleOpen", "menuHandleClose"],
    props: basicProps,
    setup(props, { emit }) {
        const isCollapse = ref(false)
        const { handleOpen, handleClose, handleSelect } = useMenuEvents({
            emit,
        })

        const route = useRoute();

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
