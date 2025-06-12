<template>
    <pageTopMenu></pageTopMenu>
    <pageContainer>
        <router-view />
    </pageContainer>
</template>

<script setup lang="ts">
import pageContainer from "./src/pageContainer.vue";
import pageTopMenu from "./src/pageTopMenu.vue";
</script>
<style lang="less">
html, body {
    background-color: #f2f4f7;
}
</style>