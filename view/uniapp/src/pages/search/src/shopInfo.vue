<template>
    <view class="shop-info-box" v-if="shopInfo && Object.keys(shopInfo).length > 0">
        <view class="shop-info">
            <view class="shop-title" @click="handleLink(`/pages/shop/index?shopId=${shopInfo.shopId}`)">
                <view class="shop-logo">
                    <tig-image :src="shopInfo.shopLogo"></tig-image>
                </view>
                <view class="shop-title-text line1">{{ shopInfo.shopTitle }} </view>
                <view class="shop-btn">
                    <tig-button class="btn" :plain="true" :plainMainColor="true" @click="handleLink(`/pages/shop/index?shopId=${shopInfo.shopId}`)">
                        {{ $t("进店") }}
                    </tig-button>
                </view>
            </view>
            <view class="shop-desc">
                <text class="shop-info-text">上架商品：{{ shopInfo.listingCount }}</text>
                <text class="shop-info-text">店铺收藏：{{ shopInfo.collectCount }}</text>
            </view>
            <view class="shop-product">
                <scroll-view scroll-x="true">
                    <view class="shop-product-scroll">
                        <template v-for="item in shopInfo.listingProduct" :key="item.productId">
                            <view class="shop-product-image" @click="handleLink(`/pages/product/index?id=${item.productId}`)">
                                <tig-image :src="item.picUrl"></tig-image>
                                <view class="product-price">
                                    <format-price
                                        :fontStyle="{ fontSize: '24rpx' }"
                                        :currencyStyle="{
                                            fontSize: '20rpx'
                                        }"
                                        :decimalsStyle="{
                                            fontSize: '22rpx'
                                        }"
                                        :priceData="item.productPrice"
                                    ></format-price>
                                </view>
                            </view>
                        </template>
                    </view>
                </scroll-view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { watch, ref } from "vue";
import { getShopList } from "@/api/shop/shop";
import type { shopListItem } from "@/types/shop/shop";

const props = defineProps({
    keyword: {
        type: String,
        default: ""
    }
});

const shopInfo = ref<shopListItem>({} as shopListItem);

const getShopData = async () => {
    try {
        const result = await getShopList({ keyword: props.keyword, size: 1 });
        shopInfo.value = result.records[0];
    } catch (error) {
        console.error(error);
    }
};

watch(
    () => props.keyword,
    (val) => {
        if (val) {
            getShopData();
        }
    },
    {
        immediate: true
    }
);

const handleLink = (url: string) => {
    if (!url) return;
    uni.navigateTo({
        url
    });
};
</script>

<style lang="scss" scoped>
.shop-info-box {
    padding: 0 20rpx;
    margin-top: 20rpx;
}
.shop-info {
    background-color: #fff;
    overflow: hidden;
    border-radius: 12rpx;
    padding: 15rpx;
    width: 100%;
    .shop-title {
        width: 100%;
        display: flex;
        align-items: center;
        position: relative;
        .shop-logo {
            width: 80rpx;
            height: 80rpx;
            border-radius: 15rpx;
            overflow: hidden;
            border: 1px solid #eee;
        }

        .shop-title-text {
            padding-left: 15rpx;
            max-width: 500rpx;
        }

        .shop-btn {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);

            .btn {
                height: 45rpx;
                width: 100rpx;
            }
        }
    }
    .shop-desc {
        font-size: 24rpx;
        color: #999;
        padding: 20rpx 0;

        .shop-info-text {
            &:first-child {
                padding-right: 18rpx;
            }
        }
    }

    .shop-product {
        width: 100%;

        .shop-product-scroll {
            white-space: nowrap;
            display: flex;
            column-gap: 16rpx;

            .shop-product-image {
                flex-shrink: 0;
                width: 250rpx;
                height: 250rpx;
                border-radius: 6rpx;
                overflow: hidden;
                position: relative;
                .product-price {
                    position: absolute;
                    z-index: 9;
                    right: 0;
                    bottom: 10rpx;
                    padding: 5rpx 15rpx;
                    color: #fff;
                    background-color: rgba(0, 0, 0, 0.5);
                    border-radius: 30rpx;
                }
            }
        }
    }
}
</style>
