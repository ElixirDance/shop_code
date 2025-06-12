<template>
    <div class="body-menu-mask"></div>
    <div class="main-warp" :class="[menusStore.childMenuShow ? 'child-menu-show' : 'child-menu-hide']">
        <div class="page-grid-content" :class="`admin-${themeInfo.navTheme}`">
            <pageTabs v-if="!$route.meta.is404 && themeInfo.isMultiLabel"></pageTabs>
            <pageHeader v-if="!$route.meta.is404"></pageHeader>
            <router-view :key="appStore.routerKey"></router-view>
            <pageFooter v-if="!$route.meta.is404"></pageFooter>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import pageHeader from "../../../pageHeader.vue";
import pageFooter from "../../../pageFooter.vue";
import pageTabs from "../../../pageTabs.vue";
import { useMenusStore } from "@/store/menu";
import { useAppStore } from "@/store/app";
import { useThemeStore } from "@/store/theme";
const appStore = useAppStore();
const adminType = ref(localStorage.getItem("adminType"));
const menusStore = useMenusStore();
const { themeInfo } = useThemeStore();
</script>
<style lang="less" scoped>
.main-warp {
    position: absolute;
    // height: 100%;
    z-index: 10;
    left: 208px;
    right: 0;
}
.page-grid-content {
    margin-top: 60px;
}
.child-menu-show {
    transition: left 0.3s;
    left: 208px;
}
.child-menu-hide {
    transition: left 0.3s;
    left: 48px;
}
.child-menu-show,
.child-menu-hide {
    will-change: left;
}

.main-layout-box {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    z-index: 2;
    background: #fff;
    bottom: 0;
    overflow-y: auto;
}

@media only screen and (max-width: 767px) {
    .main-warp {
        left: 0 !important;
        padding-top: 0px !important;
    }
}
</style>
