<template>
    <router-view>
        <template #default="{ Component, route }">
            <transition mode="out-in" appear>
                <keep-alive>
                    <component :is="Component" :key="route.fullPath" />
                </keep-alive>
            </transition>
        </template>
    </router-view>
</template>
<script>
export default {}
</script>
<style lang="scss"></style>
