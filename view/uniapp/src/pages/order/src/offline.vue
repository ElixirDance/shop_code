<template>
    <view class="offline-warp">
        <view class="offline-menu">
            <view class="offline-menu-item" :class="{ active: activeName === '银行汇款' }" @click="handleTabsActive('银行汇款')">{{ $t("银行汇款") }}</view>
            <view class="offline-menu-item" :class="{ active: activeName === '企业汇款' }" @click="handleTabsActive('企业汇款')">{{ $t("企业汇款") }}</view>
        </view>
        <block v-if="activeName === '银行汇款'">
            <view class="offline-content">
                <rich-text :nodes="offlinePaymentList?.offlinePayBank"></rich-text>
            </view>
        </block>
        <block v-if="activeName === '企业汇款'">
            <view class="offline-content">
                <rich-text :nodes="offlinePaymentList?.offlinePayCompany"></rich-text>
            </view>
        </block>
    </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { OfflinePaymentList } from "@/types/order/pay";

interface Props {
    offlinePaymentList: OfflinePaymentList;
}
const props = defineProps<Props>();

const handleTabsActive = (str: string) => {
    activeName.value = str;
};
const activeName = ref("银行汇款");
</script>

<style lang="scss" scoped>
.offline-warp {
    border-radius: 20rpx;
    padding: 10rpx;
    background-color: #fff;
    margin: 20rpx 0 0;
    overflow: hidden;

    .offline-menu {
        height: 100rpx;
        width: 100%;
        background-color: #fff;
        display: flex;
        align-items: center;
        box-sizing: content-box;
        margin-bottom: 15rpx;
        border-bottom: 1px solid #f5f5f5;

        .offline-menu-item {
            flex: 1;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28rpx;
            color: #999;
            position: relative;

            &.active {
                color: #333;
                font-weight: bold;

                &:after {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    height: 5rpx;
                    width: 80rpx;
                    background-color: var(--general);
                    border-radius: 10rpx;
                }
            }
        }
    }
}
.offline-content {
    padding: 20rpx;
    line-height: 45rpx;
}
</style>
