<template>
    <tig-layout title="发票详情">
        <view class="invoiceInfo">
            <view class="invoiceInfo-status">
                <view class="">{{ $t("审核状态") }}：</view>
                <view class="special-text">{{ formatText }}</view>
            </view>
            <view class="invoiceInfo-content">
                <view class="invoiceInfo-content-item">
                    <view class="item-label">{{ $t("金额") }}:</view>
                    <view class="item-value"> <format-price :showText="false" :isBottom="false" :priceData="invoiceData.amount"></format-price></view>
                </view>
                <view class="invoiceInfo-content-item">
                    <view class="item-label">{{ $t("订单编号") }}:</view>
                    <view class="item-value"> {{ invoiceData.orderSn }}</view>
                </view>
                <block v-if="invoiceData.invoiceType == 1">
                    <view class="invoiceInfo-content-item">
                        <view class="item-label">{{ $t("发票抬头") }}:</view>
                        <view class="item-value">{{ invoiceData.titleType == 1 ? $t("个人") : $t("企业") }}</view>
                    </view>
                    <view class="invoiceInfo-content-item">
                        <view class="item-label">{{ invoiceData.titleType == 1 ? $t("个人姓名") : $t("企业名称") }}</view>
                        <view class="item-value">{{ invoiceData.companyName }}</view>
                    </view>
                    <block v-if="invoiceData.titleType == 2">
                        <view class="invoiceInfo-content-item">
                            <view class="item-label">{{ $t("纳税人识号") }}:</view>
                            <view class="item-value">{{ invoiceData.companyCode }}</view>
                        </view>
                        <view class="invoiceInfo-content-item">
                            <view class="item-label">{{ $t("单位地址") }}:</view>
                            <view class="item-value">{{ invoiceData.companyAddress }}</view>
                        </view>
                        <view class="invoiceInfo-content-item">
                            <view class="item-label">{{ $t("单位电话") }}:</view>
                            <view class="item-value">{{ invoiceData.companyPhone }}</view>
                        </view>
                        <view class="invoiceInfo-content-item">
                            <view class="item-label">{{ $t("开户银行") }}:</view>
                            <view class="item-value">{{ invoiceData.companyBank }}</view>
                        </view>
                        <view class="invoiceInfo-content-item">
                            <view class="item-label">{{ $t("银行账户") }}:</view>
                            <view class="item-value">{{ invoiceData.companyAccount }}</view>
                        </view>
                    </block>
                </block>
                <block v-if="invoiceData.invoiceType == 2">
                    <view class="invoiceInfo-content-item">
                        <view class="item-label">{{ $t("单位名称") }}:</view>
                        <view class="item-value">
                            {{ invoiceData.companyName }}
                        </view>
                    </view>
                    <view class="invoiceInfo-content-item">
                        <view class="item-label">{{ $t("纳税识别码") }}:</view>
                        <view class="item-value">
                            {{ invoiceData.companyCode }}
                        </view>
                    </view>
                    <view class="invoiceInfo-content-item">
                        <view class="item-label">{{ $t("注册地址") }}:</view>
                        <view class="item-value">
                            {{ invoiceData.companyAddress }}
                        </view>
                    </view>
                    <view class="invoiceInfo-content-item">
                        <view class="item-label">{{ $t("注册电话") }}:</view>
                        <view class="item-value">
                            {{ invoiceData.companyPhone }}
                        </view>
                    </view>
                    <view class="invoiceInfo-content-item">
                        <view class="item-label">{{ $t("开户银行") }}:</view>
                        <view class="item-value">
                            {{ invoiceData.companyBank }}
                        </view>
                    </view>
                    <view class="invoiceInfo-content-item">
                        <view class="item-label">{{ $t("银行账户") }}:</view>
                        <view class="item-value">
                            {{ invoiceData.companyAccount }}
                        </view>
                    </view>
                </block>
                <view class="invoiceInfo-content-item">
                    <view class="item-label">{{ $t("收票人邮箱") }}:</view>
                    <view class="item-value">{{ invoiceData.email }}</view>
                </view>
                <view class="invoiceInfo-content-item">
                    <view class="item-label">{{ $t("收票人手机") }}:</view>
                    <view class="item-value">{{ invoiceData.mobile }}</view>
                </view>
            </view>

            <tig-fixed-placeholder backgroundColor="#fff">
                <view class="btn-box">
                    <tig-button @click="onSubmit"> {{ $t("重新申请") }} </tig-button>
                </view>
            </tig-fixed-placeholder>
        </view>
    </tig-layout>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { computed, ref } from "vue";
import type { OrderListInvoiceData } from "@/types/user/order";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const invoiceData = ref<OrderListInvoiceData>({} as OrderListInvoiceData);

onLoad((options) => {
    if (options && options.invoiceData) {
        invoiceData.value = JSON.parse(decodeURIComponent(options.invoiceData));
    }
});
const formatText = computed(() => {
    switch (invoiceData.value.status) {
        case 0:
            return t("待审核");
        case 1:
            return t("通过");
        default:
            return t("失败/作废");
    }
});
const onSubmit = () => {
    uni.redirectTo({
        url: "/pages/user/invoiceManagement/applyInvoice?type=update&orderId=" + invoiceData.value.orderId
    });
};
</script>

<style lang="scss" scoped>
.btn-box {
    padding: 25rpx;
}
.invoiceInfo {
    padding: 20rpx;

    .invoiceInfo-status {
        display: flex;
        border: 1px solid #efd7a0;
        background: #fefee3;
        padding: 20px 10px 20px 20px;
        margin-bottom: 20rpx;
    }

    .invoiceInfo-content {
        padding: 20rpx;
        background-color: #fff;
        border-radius: 20rpx;

        .invoiceInfo-content-item {
            display: flex;
            border-bottom: 1px solid #f5f5f5;
            padding: 30rpx 0;

            &:last-child {
                border-bottom: none;
                padding-bottom: 0;
            }

            &:first-child {
                padding-top: 0;
            }
            .item-label {
                width: 160rpx;
                text-align: end;
                font-weight: bold;
            }
            .item-value {
                padding-left: 20rpx;
            }
        }
    }
}

.special-text {
    color: var(--general);
}
</style>
