<template>
    <view>
        <tig-layout :needSafeTop="true" safeTopBgColor="#f5f5f5">
            <view class="businessCard-box">
                <view class="card-box">
                    <view class="card-img">
                        <tig-image :src="userInfo.avatar"></tig-image>
                    </view>
                    <view class="card-box-content">
                        <view class="card-box-content-text">
                            <view class="card-box-content-text-mobile">{{ userInfo.mobile }}</view>
                            <view class="card-box-content-text-name">{{ userInfo.nickname }}</view>
                        </view>
                        <view class="card-box-content-qrcode">
                            <image style="height: 100%; width: 100%" :src="qrcodeImg"></image>
                        </view>
                    </view>
                </view>
                <view class="card-menu">
                    <block v-for="(item, index) in menuList" :key="index">
                        <view class="card-menu-item" @click="handleMenuClick(index)">
                            <image class="card-menu-item-icon" :src="item.icon"></image>
                            <view class="card-menu-item-text">{{ $t(item.name) }}</view>
                        </view>
                    </block>
                </view>
            </view>
        </tig-layout>
        <guide v-model="showGuide"></guide>
        <businessCardPoster :qrcodeImg="qrcodeImg" :userInfo="userInfo" v-if="showPoster" v-model="showPoster"></businessCardPoster>
        <tig-qrcode ref="qrcodeRef" :immediatelyCreate="true" :value="link" :margin="10" :show="false" @success="qrcodeSuccess"></tig-qrcode>
    </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onReady } from "@dcloudio/uni-app";
import guide from "@/components/product/guide.vue";
import businessCardPoster from "./src/businessCardPoster.vue";
import { useConfigStore } from "@/store/config";
import { staticResource } from "@/utils";

const configStore = useConfigStore();

const userInfo = ref(uni.getStorageSync("userInfo"));

const link = computed(() => {
    return `${configStore.baseInfo.h5Domain}/pages/salesman/salesmanCard?&salesmanId=${userInfo.value?.salesman?.salesmanId}`;
});

const qrcodeRef = ref();
const qrcodeImg = ref<string>("");
const showGuide = ref(false);
const showPoster = ref(false);
const menuList = [
    {
        name: "编辑名片",
        icon: staticResource("salesman/businessCardEdit.png")
    },
    {
        name: "发送给朋友",
        icon: staticResource("salesman/businessCardWechat.png")
    },
    {
        name: "保存到相册",
        icon: staticResource("salesman/businessCardPic.png")
    }
];
onReady(() => {
    qrcodeRef.value?.drawQrcode();
});

const qrcodeSuccess = (e: string) => {
    qrcodeImg.value = e;
};
const handleMenuClick = (index: number) => {
    switch (index) {
        case 0:
            uni.navigateTo({
                url: "/pages/salesman/personalInfo"
            });
            break;
        case 1:
            showGuide.value = true;
            break;
        case 2:
            showPoster.value = true;
            break;
    }
};
</script>

<style lang="scss" scoped>
.businessCard-box {
    padding: 25rpx;

    .card-box {
        padding: 40rpx;
        background-color: #fff;
        border-radius: 20rpx;
        box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);

        .card-img {
            width: 100%;
            height: 550rpx;
        }

        .card-box-content {
            padding: 72rpx 0 30rpx 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .card-box-content-text {
                .card-box-content-text-mobile {
                    margin-bottom: 18px;
                    line-height: 30px;
                    font-size: 24px;
                    font-weight: 500;
                }
                .card-box-content-text-name {
                    font-size: 12px;
                    line-height: 16px;
                    color: #969799;
                }
            }

            .card-box-content-qrcode {
                width: 260rpx;
                height: 260rpx;
            }
        }
    }

    .card-menu {
        display: flex;
        justify-content: space-around;
        margin-top: 70rpx;

        .card-menu-item {
            display: flex;
            flex-direction: column;
            align-items: center;

            .card-menu-item-icon {
                width: 68rpx;
                height: 68rpx;
            }

            .card-menu-item-text {
                margin-top: 12rpx;
                font-size: 24rpx;
            }
        }
    }
}
</style>
