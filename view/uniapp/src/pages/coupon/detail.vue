<template>
    <tig-layout ref="layoutRef">
        <template v-if="detailData">
            <!-- #ifdef MP-WEIXIN -->
            <tig-navbar title="优惠券"></tig-navbar>
            <!-- #endif -->
            <view class="coupon-detail-title">
                <view class="detail-title-box">
                    <template v-if="layoutRef && layoutRef.isZh">
                        <image class="img-box" :src="staticResource('coupon/coupon-bg1.png')"></image>
                    </template>
                    <template v-else>
                        <view class="img-box-con">
                            <image class="img-box" :src="staticResource('coupon/overseas-coupon-bg.png')"> </image>
                            <view class="img-box-text">{{ $t("用券买 更划算") }}</view>
                        </view>
                    </template>

                    <view class="coupon-box">
                        <view class="coupon-item">
                            <view class="left">
                                <template v-if="detailData.couponType === 2">
                                    <view class="zhekou-box">
                                        <view class="zhekou"> {{ detailData.couponDiscount }}</view>
                                        <view class="zhe">{{ $t("折") }}</view>
                                    </view>
                                </template>
                                <template v-else>
                                    <format-price
                                        :showText="false"
                                        :currencyStyle="{ selfAlign: 'end', fontSize: '24rpx' }"
                                        :decimalsStyle="{ selfAlign: 'end', fontSize: '28rpx' }"
                                        :fontStyle="{ fontSize: '48rpx', lineHeight: 1 }"
                                        :priceData="detailData.couponMoney"
                                    ></format-price>
                                </template>

                                <view class="left-name line1">{{ detailData.couponName }}</view>
                            </view>
                            <view class="middle">
                                <view class="middle-title">{{ $t("优惠券") }}</view>
                                <view class="sub" v-if="detailData.sendType === 1"> {{ $t("有效期") }}：{{ detailData.useEndDate }} </view>
                                <view class="sub" v-if="detailData.sendType === 0 && detailData.delayDay > 0">
                                    <template v-if="isOverseas()">
                                        {{ $t("领券{0}天后生效，有效期{1}天", [detailData.delayDay, detailData.useDay]) }}
                                    </template>
                                    <template v-else>
                                        {{ `领券${detailData.delayDay}天后生效，有效期${detailData.useDay}天` }}
                                    </template>
                                </view>
                                <view class="sub" v-if="detailData.sendType === 0 && detailData.delayDay === 0">
                                    <template v-if="isOverseas()">
                                        {{ $t("领券当日起{0}天内可用", [detailData.useDay]) }}
                                    </template>
                                    <template v-else>
                                        {{ `领券当日起${detailData.useDay}天内可用` }}
                                    </template>
                                </view>
                            </view>
                            <view class="coupon-btn" :class="{ disabled: couponStatus === '已领取' }" @click="handleSubmit"> {{ $t(couponStatus) }} </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="sticky">
                <view class="coupon-menu">
                    <view class="coupon-search" @click="handleToSearch">
                        <view class="coupon-search-box">
                            <template v-if="!filterParams.keyword">
                                <view class="search-text"> <text class="iconfont-h5 icon-sousuo sousuo-icon"></text>{{ $t("搜索") }} </view>
                            </template>
                            <template v-else>
                                <view class="search-text is-value"> <text class="iconfont-h5 icon-sousuo sousuo-icon"></text>{{ filterParams.keyword }} </view>
                            </template>
                        </view>
                    </view>
                    <view class="coupon-content">
                        <view
                            @click="onChangeTab(item)"
                            class="coupon-item"
                            :class="{ active: tabIndex === item.value }"
                            v-for="(item, index) in tabList"
                            :key="index"
                        >
                            <text>{{ $t(item.label) }}</text>
                            <view class="price-ico-box flex flex-column" v-show="item.value === 'price'">
                                <text class="iconfont-h5 icon-shangjiantou price-icon" :class="{ order: tabIndex === 'price' && item.order === 'asc' }"></text>
                                <text class="iconfont-h5 icon-xiajiantou price-icon" :class="{ order: tabIndex === 'price' && item.order === 'desc' }"></text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <template v-if="productList.length > 0">
                <view class="product-list">
                    <view class="product-item" v-for="item in productList" :key="item.productId">
                        <view class="item-left" @click="handleToDetail(item.productId!)">
                            <tig-image :src="item.picThumb"></tig-image>
                            <view class="product-status-box">
                                <view v-if="item.productStock == 0 || item.productStatus == 0" class="outsale">{{
                                    item.productStock == 0 ? $t("已售罄") : $t("已下架")
                                }}</view>
                            </view>
                        </view>
                        <view class="item-right">
                            <view class="item-right-title line2" @click="handleToDetail(item.productId!)">
                                {{ item.productName }}
                            </view>
                            <view class="item-right-price">
                                <format-price
                                    :showText="false"
                                    :decimalsStyle="{
                                        fontSize: '24rpx',
                                        fontWeight: 'bold'
                                    }"
                                    :currencyStyle="{
                                        fontSize: '23rpx',
                                        fontWeight: 'bold'
                                    }"
                                    :fontStyle="{ fontSize: '32rpx' }"
                                    :priceData="item.productPrice"
                                ></format-price>
                            </view>
                            <view class="buy_icon">
                                <view class="buy_btn" @click="handleBuy(item)">
                                    <template v-if="item.isCheck">
                                        <up-loading-icon mode="circle"></up-loading-icon>
                                    </template>
                                    <template v-else>
                                        <text class="iconfont-h5 icon-gouwuche3 buy_btn_icon"></text>
                                    </template>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </template>
            <template v-if="!loading && total === 0">
                <empty-box text="好狠的筛选条件啊，把相关的商品都埋没了！"></empty-box>
            </template>
            <tig-fixed-placeholder backgroundColor="#fff">
                <view class="btn-box">
                    <view class="btn-box-left">
                        <view class="left-text"> {{ $t("合计") }}： </view>
                        <view class="total-money">
                            <format-price
                                :showText="false"
                                :decimalsStyle="{
                                    fontSize: '26rpx'
                                }"
                                :currencyStyle="{
                                    fontSize: '23rpx'
                                }"
                                :fontStyle="{ fontSize: '36rpx' }"
                                :priceData="discountAmount.productPrice.toString()"
                            ></format-price>
                        </view>
                    </view>
                    <view class="btn-box-right" @click="handleToCart">{{ $t("去购物车") }}</view>
                    <view class="tip line2">{{ tipText }}</view>
                </view>
            </tig-fixed-placeholder>
            <specification
                ref="specificationRef"
                v-model="productId"
                @addCardSucceed="getAddCardSucceed"
                @loadEnd="loadEnd"
                @close="handleClose"
            ></specification>
            <tig-back-top :scrollTop="scrollTop" :bottom="90"></tig-back-top>
        </template>
    </tig-layout>
</template>

<script setup lang="ts">
import { onLoad, onReachBottom, onShow, onUnload } from "@dcloudio/uni-app";
import { ref, reactive, computed } from "vue";
import { getMyCouponInfo, addCoupon, getCouponDiscount } from "@/api/coupon/coupon";
import type { CouponDetailItem, DiscountAmountData } from "@/types/coupon/coupon";
import { getCategoryProduct } from "@/api/search/search";
import type { ProductList } from "@/types/search/search";
import { redirect, staticResource } from "@/utils";
import specification from "@/components/product/specification.vue";
import { useScrollTop } from "@/hooks/index";
import { useI18n } from "vue-i18n";
import { isOverseas } from "@/utils";

const { t } = useI18n();
const { scrollTop } = useScrollTop();

const detailData = ref<CouponDetailItem>({} as CouponDetailItem);

const id = ref<number>();

const layoutRef = ref();

const getDetail = async () => {
    uni.showLoading({
        title: t("加载中")
    });
    try {
        if (id.value) {
            const result = await getMyCouponInfo({ id: id.value });
            detailData.value = result;
        }
    } catch (error) {
        console.error(error);
    } finally {
        uni.hideLoading();
    }
};

const couponStatus = computed(() => {
    if (detailData.value.limitNum === 0) {
        if (detailData.value.isReceive === 1) {
            return "已领取";
        } else {
            return "马上领";
        }
    } else {
        if (detailData.value.isReceive === 0) {
            return "马上领";
        } else if (detailData.value.receiveNum >= detailData.value.limitNum) {
            return "已领取";
        } else {
            return "再次领取";
        }
    }
});

onLoad((options) => {
    uni.$on("coupon-search-return", (val: any) => {
        filterParams.keyword = val;
        filterParams.keyword = val;
        resetList();
        __getCategoryProduct();
    });
    if (options) {
        if (options.id) {
            id.value = Number(options.id);
            filterParams.couponId = id.value;
        }
        if (options.shopId) {
            filterParams.shopId = Number(options.shopId);
        }

        __getCategoryProduct();
    }
});

onUnload(() => {
    uni.$off("coupon-search-return");
});

onShow(() => {
    if (id.value) {
        getDetail();
        __getCouponDiscount();
    }
});

const handleSubmit = async () => {
    if (couponStatus.value === "已领取") {
        return uni.showToast({
            title: t("已领取"),
            icon: "none",
            duration: 1500
        });
    }

    try {
        if (id.value) {
            const result = await addCoupon({ couponId: id.value });
            getDetail();
            uni.showToast({
                title: t("领取成功"),
                duration: 1500
            });
        }
    } catch (error: any) {
        uni.showToast({
            title: error.message,
            icon: "none",
            duration: 1500
        });
        console.error(error);
    }
};

interface FilterParams {
    page: number;
    size: number;
    sort: string;
    order: string;
    keyword: string;
    couponId: number;
    shopId?: number;
}
const filterParams = reactive<FilterParams>({
    //初始化用于查询的参数
    page: 1,
    size: 20,
    sort: "",
    order: "asc",
    keyword: "",
    couponId: 0
});
const tabIndex = ref("default");
const tabList = ref([
    {
        label: "默认",
        value: "default"
    },
    {
        label: "销量",
        value: "sale"
    },
    {
        label: "价格",
        value: "price",
        order: "desc"
    }
]);
const resetList = () => {
    productList.value = [];
    filterParams.page = 1;
};
const onChangeTab = (item: any) => {
    if (item.value == "price") {
        item.order = item.order === "desc" ? "asc" : "desc";
    } else {
        item.order = "";
    }
    tabIndex.value = item.value;
    filterParams.sort = item.value;
    filterParams.order = item.order;
    resetList();
    __getCategoryProduct();
};

const total = ref(0);
const loading = ref(true);
const productList = ref<ProductList[]>([]);

const __getCategoryProduct = async () => {
    try {
        const productInfo = await getCategoryProduct({ ...filterParams });
        total.value = productInfo.total;
        productInfo.records.forEach((item) => (item.isCheck = false));
        productList.value = [...productList.value, ...productInfo.records];
    } catch (error: any) {
        uni.showToast({
            title: error.message,
            icon: "none"
        });
    } finally {
        loading.value = false;
    }
};

const handleToSearch = () => {
    uni.navigateTo({
        url: "/pages/coupon/search"
    });
};

const handleSearch = () => {
    resetList();
    __getCategoryProduct();
};

const discountAmount = ref<DiscountAmountData>({
    minOrderAmount: "0",
    couponMoney: "0",
    productPrice: "0",
    discountMoney: "0",
    couponUnit: 0,
    quantityCount: 0
});

const tipText = computed(() => {
    let text = "";
    if (Number(discountAmount.value.productPrice) == 0) {
        text = t(`快去选购商品参与优惠活动`);
    } else if (discountAmount.value.couponUnit === 1) {
        if (Number(discountAmount.value.productPrice) > Number(discountAmount.value.minOrderAmount)) {
            // text = `已满足优惠条件，用券下单立减${discountAmount.value.discount_money}元`;
            text = isOverseas()
                ? t(`已满足优惠条件，用券下单立减{0}元`, [discountAmount.value.discountMoney])
                : `已满足优惠条件，用券下单立减${discountAmount.value.discountMoney}元`;
        } else {
            // text = `还需${Number(discountAmount.value.min_order_amount) - Number(discountAmount.value.product_price)}元，即可用券下单立减${
            //     discountAmount.value.discount_money
            // }元，快去选购商品参与优惠活动`;
            text = isOverseas()
                ? t(`还需{0}元，即可用券下单立减{1}元，快去选购商品参与优惠活动`, [
                      Number(discountAmount.value.minOrderAmount) - Number(discountAmount.value.productPrice),
                      discountAmount.value.discountMoney
                  ])
                : `还需${Number(discountAmount.value.minOrderAmount) - Number(discountAmount.value.productPrice)}元，即可用券下单立减${
                      discountAmount.value.discountMoney
                  }元，快去选购商品参与优惠活动`;
        }
    } else {
        if (Number(discountAmount.value.quantityCount) >= Number(discountAmount.value.minOrderAmount)) {
            // text = `已满足优惠条件，用券下单立减${discountAmount.value.discount_money}元`;
            text = isOverseas()
                ? t(`已满足优惠条件，用券下单立减{0}元`, [discountAmount.value.discountMoney])
                : `已满足优惠条件，用券下单立减${discountAmount.value.discountMoney}元`;
        } else {
            // text = `还差${Number(discountAmount.value.min_order_amount) - Number(discountAmount.value.quantity_count)}件，即可用券下单立减${
            //     discountAmount.value.discount_money
            // }元，快去选购商品参与优惠活动`;
            text = isOverseas()
                ? t(`还差{0}件，即可用券下单立减{1}元，快去选购商品参与优惠活动`, [
                      Number(discountAmount.value.minOrderAmount) - Number(discountAmount.value.quantityCount),
                      discountAmount.value.discountMoney
                  ])
                : `还差${Number(discountAmount.value.minOrderAmount) - Number(discountAmount.value.quantityCount)}件，即可用券下单立减${
                      discountAmount.value.discountMoney
                  }元，快去选购商品参与优惠活动`;
        }
    }

    return text;
});
const __getCouponDiscount = async () => {
    try {
        const result = await getCouponDiscount(id.value!);
        discountAmount.value = result;
    } catch (error: any) {
        uni.showToast({
            title: error.message,
            icon: "none"
        });
        console.error(error);
    }
};

const handleToCart = () => {
    redirect({ url: "/pages/cart/index" });
};

const handleToDetail = (id: number) => {
    uni.navigateTo({
        url: `/pages/product/index?id=${id}`
    });
};

const couponBg = computed(() => {
    return `url(${staticResource("coupon/coupon-bg2.png")})`;
});

onReachBottom(() => {
    if (filterParams.page < Math.ceil(total.value / filterParams.size)) {
        filterParams.page++;
        __getCategoryProduct();
    }
});

const productId = ref(0);
const specificationRef = ref();
const currentItem = ref<AnyObject>({});

const handleBuy = (item: any) => {
    if (item.isCheck) return;
    productId.value = item.productId;
    item.isCheck = true;
    currentItem.value = item;
};
const loadEnd = () => {
    specificationRef.value.handleShowPopup();
    currentItem.value.isCheck = false;
};
const handleClose = () => {
    productId.value = 0;
};

const getAddCardSucceed = () => {
    __getCouponDiscount();
};
</script>

<style>
page {
    /* #ifdef MP-WEIXIN */
    background-color: #fff;
    /* #endif */
}
</style>

<style lang="scss" scoped>
page {
    background-color: #fff;
}

.img-box {
    width: 100%;
    height: 441rpx;
    position: relative;
}

.img-box-con {
    position: relative;
    .img-box-text {
        font-size: 34rpx;
        color: #fff;
        position: absolute;
        top: 0;
        font-weight: bold;
        top: 25%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        text-align: center;
    }
}
.sticky {
    position: sticky;
    top: 0;
    z-index: 10;
    // #ifdef MP-WEIXIN
    top: var(--nav-height);
    // #endif
}

.coupon-detail-title {
    position: relative;
    .detail-title-box {
        position: relative;
        margin-bottom: -26rpx;
    }

    .coupon-box {
        position: absolute;
        bottom: 64rpx;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .coupon-item {
            background-image: v-bind(couponBg);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            height: 157rpx;
            width: calc(100% - 62rpx);
            border-radius: 18rpx;
            display: flex;
            position: relative;

            .left {
                flex: 207;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #e73222;
                font-size: 20rpx;

                .left-name {
                    padding-top: 5rpx;
                    max-width: 145rpx;
                }

                .zhekou-box {
                    display: flex;
                    flex-direction: row;
                    font-weight: bold;
                    justify-content: center;
                    align-items: flex-end;

                    .zhekou {
                        font-size: 48rpx;
                        line-height: 1; /* 添加这行 */
                    }

                    .zhe {
                        margin-left: 8rpx;
                        font-size: 24rpx;
                        self-align: end; /* 添加这行 */
                    }
                }
            }

            .middle {
                flex: 479;
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: center;
                font-size: 24rpx;
                padding-left: 28rpx;
                line-height: 38rpx;

                .middle-title {
                    font-size: 26rpx;
                    color: #5c3333;
                }
            }
        }
    }
}

.coupon-btn {
    position: absolute;
    opacity: 1;
    color: rgb(255, 255, 255);
    background: linear-gradient(90deg, rgb(255, 96, 52) 0%, rgb(238, 10, 36) 100%);
    border: none;
    width: 100rpx;
    height: 44rpx;
    line-height: 44rpx;
    font-size: 20rpx;
    text-align: center;
    border-radius: var(--theme-radius-button, 15px);
    top: 58rpx;
    right: 24rpx;

    &.disabled {
        background: #e7e7e7;
        color: #999999;
    }
}

.sub {
    font-size: 22rpx;
    color: rgba(92, 51, 51, 0.6);
    max-width: 335rpx;
    padding-top: 5rpx;
}

.not-zh {
    .coupon-btn {
        width: 150rpx;
    }
    .sub {
        max-width: 270rpx;
    }
}

.coupon-menu {
    background-color: #fff;
    padding: 30rpx 25rpx 0;
    border-radius: 20rpx 20rpx 0 0;
    z-index: 88;
    position: relative;

    .coupon-search-box {
        height: 68rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        .search-text {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: start;
            height: 100%;
            border-radius: 36rpx;
            background-color: #f7f8fa;
            font-size: 26rpx;
            color: #c8c9cc;
            padding: 0 25rpx;

            .sousuo-icon {
                padding-right: 6rpx;
            }
        }
        .is-value {
            color: #333;
            .sousuo-icon {
                color: #c8c9cc;
            }
        }
    }

    .coupon-content {
        padding: 20rpx;
        display: flex;

        .coupon-item {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26rpx;
            color: #969799;

            &.active {
                color: #f44;
            }

            .price-icon {
                font-size: 10rpx;
                color: #969799;
                padding-left: 5rpx;

                &.order {
                    color: #f44;
                }

                &:first-child {
                    padding-bottom: 5rpx;
                }
            }
        }
    }
}

.product-list {
    padding: 10rpx 25rpx;
    background-color: #fff;
    margin-bottom: 120rpx;
    display: flex;
    flex-direction: column;
    row-gap: 20rpx;

    .product-item {
        display: flex;
        .item-left {
            width: 171rpx;
            height: 171rpx;
            border-radius: 10rpx;
            overflow: hidden;
            position: relative;
        }

        .item-right {
            width: calc(100% - 171rpx);
            padding-left: 10rpx;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            .item-right-title {
                font-size: 24rpx;
                color: #333;
            }
            .item-right-price {
                color: rgb(238, 10, 36);
                font-weight: 600;
            }
            .buy_icon {
                position: absolute;
                right: 0;
                bottom: 0;
                color: #f23f53;
                .buy_btn_icon {
                    font-size: 40rpx;
                }
            }
        }
    }
}

.btn-box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 25rpx;
    position: relative;

    .btn-box-left {
        display: flex;
        align-items: center;

        .total-money {
            color: rgb(238, 10, 36);
        }
    }

    .btn-box-right {
        min-width: 180rpx;
        padding: 0 10rpx;
        height: 70rpx;
        font-size: 26rpx;
        border-radius: 36rpx !important;
        background-image: -webkit-linear-gradient(left, #ff6034, #ee0a24);
        background-image: linear-gradient(90deg, #ff6034, #ee0a24);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tip {
        padding: 10rpx;
        position: absolute;
        max-height: 110rpx;
        line-height: 45rpx;
        background-color: #fffbe8;
        color: #ed6a0c;
        top: 0;
        left: 0;
        width: 100vw;
        font-size: 24rpx;
        transform: translateY(-100%);
        text-align: center;
    }
}

.product-status-box {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .outsale {
        width: 50%;
        height: 50%;
        line-height: 180rpx;
        background: rgba(0, 0, 0, 0.4);
        font-size: 22rpx;
        color: #ffffff;
        letter-spacing: 0;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
