<template>
    <pageTopBar></pageTopBar>
    <pageLeftMenu></pageLeftMenu>
    <pageContainer>
        <router-view />
    </pageContainer>
</template>

<script setup lang="ts">
import pageLeftMenu from "./src/pageLeftMenu.vue";
import pageTopBar from "./src/pageTopBar.vue";
import pageContainer from "./src/pageContainer.vue";
</script>
<style lang="less">
html, body {
    background-color: #fff;
}
</style>