<template>
    <div class="header-title-warp">
        <div class="breadcrumb">
            <ul>
                <li>
                    <a href="#"><span class="breadcrumb-span">首页</span></a
                    ><span class="breadcrumb-separator">/</span>
                </li>
                <li v-if="routerMatched[1]">
                    <span class="breadcrumb-span">{{ removeSuffix(routerMatched[1].meta.title) }}</span
                    ><span class="breadcrumb-separator">/</span>
                </li>
                <li v-if="routerMatched[2]">
                    <span class="breadcrumb-span">{{ removeSuffix(routerMatched[2].meta.title) }}</span>
                </li>
            </ul>
        </div>
        <div class="page-header-heading">
            <div class="page-header-heading-left">
                <span class="page-header-heading-title" v-if="!routerMatched[2].meta.isShowInHeader">{{ removeSuffix(title) }}</span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAppStore } from "@/store/app";
import { removeSuffix } from "@/utils/authorize";
const appStore = useAppStore();
const router = useRouter();
const title = ref("");
const routerMatched = ref(<any>[]);

routerMatched.value = router.currentRoute.value.matched;
// 监听路由的变化
watchEffect(() => {
    title.value = appStore.getHeaderTitle;
    routerMatched.value = router.currentRoute.value.matched;
});
</script>
<style lang="less">
/*头部通用标题和导航*/
.header-title-warp {
    padding: 16px 20px 0 20px;
    background-color: #ffffff;
}

.header-title-warp .breadcrumb {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.85);
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
}

.header-title-warp .breadcrumb ul {
    display: flex;
}

.header-title-warp .breadcrumb span.breadcrumb-span {
    color: #666;
}

.header-title-warp .breadcrumb > ul > li:last-child span.breadcrumb-span {
    color: #ccc;
}

.header-title-warp .breadcrumb .breadcrumb-separator {
    margin: 0 8px;
    color: rgba(0, 0, 0, 0.45);
}

.header-title-warp .breadcrumb > span:last-child .breadcrumb-separator {
    display: none;
}

.header-title-warp .page-header-heading {
    display: flex;
    justify-content: space-between;
    padding-bottom: 5px;
}

.header-title-warp .breadcrumb + .page-header-heading {
    margin-top: 8px;
}

.header-title-warp .page-header-heading-left {
    display: flex;
    align-items: center;
    margin: 4px 0;
    overflow: hidden;
}

.header-title-warp .page-header-heading-title {
    margin-right: 12px;
    margin-bottom: 0;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    font-size: 20px;
    line-height: 32px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

@media only screen and (max-width: 767px) {
    .header-title-warp {
        padding-top: 20px;
    }
}
</style>
