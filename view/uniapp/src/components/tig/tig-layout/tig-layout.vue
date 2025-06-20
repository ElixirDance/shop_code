<template>
    <view class="layout" :class="{ 'not-zh': !isZh && isOverseas() }" :style="{ ...cssVariable }">
        <template v-if="needSafeTop">
            <view class="safe-top-box"></view>
        </template>

        <template v-if="title">
            <tig-navbar :title="title"> </tig-navbar>
        </template>

        <slot></slot>

        <template v-if="tabbarStore.currentActiveValue === -1 && needSafeBottom">
            <view class="layout-safe-bottom"></view>
        </template>

        <view v-show="tabbarStore.currentActiveValue > -1">
            <tig-tabbar></tig-tabbar>
        </view>

        <template v-if="(configStore.XClientType === 'miniProgram' || configStore.XClientType === 'wechat') && configStore.openWechatRegister === 1">
            <tig-wechart-login @loginSuccess="$emit('loginSuccess')"></tig-wechart-login>
        </template>

        <tig-statistic-log
            ref="statisticLogRef"
            :immediateLog="immediateLog"
            :productId="productId"
            :shopId="shopId"
            :shopCategoryId="shopCategoryId"
        ></tig-statistic-log>
    </view>
</template>

<script setup lang="ts">
// #ifdef MP-WEIXIN
defineOptions({
    options: { virtualHost: true }
});
// #endif

import { useTabbarStore } from "@/store/tabbar";
import { useConfigStore } from "@/store/config";
import { useThemeStore } from "@/store/theme";
import { computed, ref } from "vue";
import { useSafeAreaInsets, useSaveTopBoxHeight } from "@/hooks";
import { useI18nStore } from "@/store/i18n";
import { isOverseas } from "@/utils";

const props = defineProps({
    needSafeTop: {
        type: Boolean,
        default: false
    },
    needSafeBottom: {
        type: Boolean,
        default: true
    },
    safeTopBgColor: {
        type: String,
        default: "#fff"
    },
    productId: {
        type: [Number, String],
        default: ""
    },
    shopId: {
        type: [Number, String],
        default: ""
    },
    shopCategoryId: {
        type: [Number, String],
        default: ""
    },
    immediateLog: {
        type: Boolean,
        default: true
    },
    title: {
        type: String,
        default: ""
    }
});

const emit = defineEmits(["loginSuccess"]);

const tabbarStore = useTabbarStore();
const configStore = useConfigStore();
const themeStore = useThemeStore();
const i18nStore = useI18nStore();
const isZh = computed(() => {
    if (isOverseas()) {
        return i18nStore.defaultLocaleCode.includes("zh");
    } else {
        return true;
    }
});

// #ifdef  H5
configStore.setH5Title();
// #endif

const { safeBottom } = useSafeAreaInsets();
const { height } = useSaveTopBoxHeight();

const cssVariable = computed(() => {
    return {
        ...themeStore.themeStyle,
        "--tabbar-height": tabbarStore.tabbarHeight,
        "--safe-bottom": `${safeBottom.value}px`,
        "--safe-top": `${height.value}px`,
        "--nav-height": `${configStore.navHeight}rpx`
    };
});

const statisticLogRef = ref();
const handleLog = () => {
    statisticLogRef.value?.__commonLog();
};

defineExpose({
    handleLog,
    isZh
});
</script>

<style lang="scss" scoped>
.layout {
    max-width: 100%;
    overflow: hidden;

    .layout-safe-bottom {
        width: 100%;
        height: 0;
        padding-top: var(--safe-bottom);
    }
}
.safe-top-box {
    height: var(--safe-top);
    background: v-bind("props.safeTopBgColor");
}
</style>
