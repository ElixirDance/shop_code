<template>
    <tig-layout title="账户安全">
        <view class="profile-edit-main">
            <view class="profile-edit-content">
                <view v-if="hasMobile" class="item">
                    <view class="title">
                        <view>{{ $t("请输入") }}</view>
                        <view class="info">{{ mobile.replace(/(\d{2})\d*(\d{4})$/, "$1*****$2") }}</view>
                        <view>{{ $t("收到的短信验证码") }}</view>
                    </view>
                </view>
                <template v-else>
                    <view class="item">
                        <view class="title">
                            <view>{{ $t("您还未绑定手机号，请输入手机号绑定") }}</view>
                        </view>
                    </view>
                    <view class="item special-item line">
                        <uni-easyinput
                            :inputBorder="false"
                            :value="mobile"
                            class="uni-input item-input"
                            :placeholder="$t('请输入手机号')"
                            primaryColor="rgb(192, 196, 204)"
                            @input="inputMobile"
                        ></uni-easyinput>
                    </view>
                </template>

                <view class="flex align-center">
                    <view class="item line">
                        <uni-easyinput
                            :inputBorder="false"
                            :value="mobileCode"
                            focus
                            class=""
                            :placeholder="$t('手机短信验证码')"
                            primaryColor="rgb(192, 196, 204)"
                            @input="inputMobileCode"
                        />
                    </view>
                    <VerificationCode
                        v-if="hasMobile"
                        style="height: 65rpx"
                        v-model:isChecked="isChecked"
                        v-model:mobile="mobile"
                        v-model:verify-token-data="verifyToken"
                        :requestApi="sendMobileCodeByMobileValidate"
                        @mobileErrorCallback="mobileErrorCallback"
                    ></VerificationCode>

                    <VerificationCode
                        v-else
                        style="height: 65rpx"
                        v-model:isChecked="isChecked"
                        v-model:mobile="mobile"
                        v-model:verify-token-data="verifyToken"
                        :requestApi="sendMobileCodeByMobileMobile"
                        @mobileErrorCallback="mobileErrorCallback"
                    ></VerificationCode>
                </view>

                <view class="item" style="height: 60rpx">
                    <tig-button :disabled="isRegisterDisabled" class="next" @click="onNext">{{ $t("下一步") }}</tig-button>
                </view>
            </view>

            <view class="profile-edit-content">
                <view class="btn-item">
                    <view class="title">
                        <view class="big-title">{{ $t("为什么要进行身份验证") }}？</view>
                    </view>
                    <view class="info">1. {{ $t("为保障您的账户信息安全，在变更账户中的重要信息时需要进行身份验证，感谢您的理解和支持") }}。</view>
                    <view class="info">2. {{ $t("验证身份遇到问题？您可以通知我们的客服，我们将尽快联系您") }}。</view>
                </view>
            </view>
        </view>
    </tig-layout>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import VerificationCode from "@/components/verificationCode/index.vue";
import { mobileMobile, mobileValidate, sendMobileCodeByMobileMobile, sendMobileCodeByMobileValidate } from "@/api/user/security";
import { onLoad } from "@dcloudio/uni-app";

const inputMobileCode = (e: any) => {
    mobileCode.value = e;
};

const inputMobile = (e: any) => {
    mobile.value = e;
};

const mobileCode = ref("");
const mobile = ref("");
const verifyToken = ref("");
const isChecked = ref(true);
const hasMobile = ref(false);
onLoad((options: any) => {
    if (options.mobile) {
        hasMobile.value = true;
        mobile.value = options.mobile;
    } else {
        hasMobile.value = false;
    }
});
const isRegisterDisabled = computed(() => {
    return !mobileCode.value || !verifyToken.value;
});

const mobileErrorCallback = (msg: string) => {
    uni.showToast({
        title: msg,
        duration: 1500,
        icon: "none"
    });
};

const onNext = async () => {
    try {
        let temp = {
            mobile: mobile.value,
            code: mobileCode.value
        };
        console.log(hasMobile.value);
        if (hasMobile.value) {
            await mobileValidate({ ...temp });
        } else {
            await mobileMobile({ ...temp });
        }
        let url = "/pages/user/security/newPhone";
        uni.navigateTo({
            url
        });
    } catch (error: any) {
        uni.showToast({
            title: error.message,
            icon: "none"
        });
    } finally {
    }
};
</script>
<style lang="scss" scoped>
.profile-edit-main {
    padding: 30rpx;

    .profile-edit-content {
        background-color: #fff;
        border-radius: 15rpx;
        padding: 20rpx;
        margin-bottom: 30rpx;
        display: flex;
        flex-direction: column;
        gap: 16rpx;

        .item {
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            margin: 20rpx;

            &.special-item {
                width: 600rpx;
            }

            .next {
                width: 100%;
                height: 100%;
            }

            .title {
                font-size: 24rpx;
                display: flex;
                gap: 16rpx;

                .info {
                    color: #999999;
                }
            }
        }

        .btn-item {
            display: flex;
            flex-direction: column;
            margin: 20rpx;
            font-size: 24rpx;
            gap: 16rpx;

            .big-title {
                font-size: 28rpx;
            }

            .info {
                color: #999999;
            }
        }

        .line {
            padding-bottom: 10rpx;
            border-bottom: 1px solid #dfdfdf;
            width: 390rpx;
        }
    }
}
</style>
