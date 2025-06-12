<template>
    <div cls="page-box">
        <div clsss="left">
            <pageLeftMenu></pageLeftMenu>
        </div>
        <div clsss="right">
            <pageTopBar></pageTopBar>
            <pageContainer> </pageContainer>
        </div>
    </div>
</template>

<script setup lang="ts">
import pageTopBar from "./src/pageTopBar.vue";
import pageContainer from "./src/pageContainer.vue";
import pageLeftMenu from "./src/pageLeftMenu.vue";
</script>
<style lang="less">
html, body {
    background-color: #f2f4f7;
}
</style>
