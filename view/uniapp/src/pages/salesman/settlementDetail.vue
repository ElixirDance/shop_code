<template>
    <view class="settle-detai">
        <view class="settle-detai-header">已结算</view>
        <view class="settle-detai-step">
            <up-steps :current="current" activeColor="#38f">
                <up-steps-item :itemStyle="{ color: '#969799', 'font-size': '24rpx' }" v-for="(item, index) in stepList" :key="index" :title="item.title">
                </up-steps-item>
            </up-steps>
        </view>
        <view class="settle-detai-desc">
            <view class="desc-title">交易完成结算</view>
            <view class="desc-item">
                <text>1.</text>
                <text>商家发货，如果买家不主动确认收货，也不发起售后维权，7 天后系统自动确认收货，交易完成，佣金自动结算。</text>
            </view>
            <view class="desc-item">
                <text>2.</text>
                <text>商家发货后，买家如果在7天内发起售后维权，结算时间会延长至维权结束且交易完成。</text>
            </view>
            <view class="desc-item">
                <text>3.</text>
                <text>结算方式以交易完成时商家配置的方式为准。</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { staticResource } from "@/utils";
const stepList = ref([
    {
        title: "卖家付款",
        time: "2023-01-01 12:00:00"
    },
    {
        title: "商家发货",
        time: "2023-01-01 12:00:00"
    },
    {
        title: "交易完成",
        time: "2023-01-01 12:00:00"
    },
    {
        title: "佣金结算",
        time: "2023-01-01 12:00:00"
    }
]);
const current = ref(0);
const settleDetaiBg = computed(() => {
    return `url(${staticResource("salesman/settlementDetailBack.png")})`;
});
</script>

<style lang="scss" scoped>
.settle-detai {
    padding: 0 24rpx;
    background-image: v-bind(settleDetaiBg);
    background-repeat: no-repeat;
    background-size: 100%;

    .settle-detai-header {
        padding: 40rpx 0;
        font-size: 36rpx;
        font-weight: 700;
        color: #fff;
        display: flex;
        align-items: flex-start;
    }

    .settle-detai-step {
        padding: 58rpx 16rpx 40rpx;
        background-color: #fff;
        border-radius: 8rpx;
    }

    .settle-detai-desc {
        padding: 32rpx 16rpx;
        background-color: #fff;
        margin-top: 24rpx;
        border-radius: 8rpx;

        .desc-title {
            font-size: 28rpx;
            font-weight: 700;
        }

        .desc-item {
            color: #969799;
            font-size: 24rpx;
            margin-top: 16rpx;
            display: flex;
        }
    }
}
</style>
