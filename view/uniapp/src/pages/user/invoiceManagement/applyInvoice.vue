<template>
    <tig-layout title="发票申请">
        <view class="invoice-popup-content">
            <view class="invoice-typemenu">
                <view class="invoice-explain">
                    {{ $t("我公司依法开具发票，请您按照税法规定使用发票。根据现行税收政策，部分公司提供数电票") }},
                    {{
                        $t(
                            "数电（专用发票）法律效力与现有增值税专用发票相同;如商品由第三方卖家销售，发票类型和内容将由该卖家决定，发票由卖家开具并提供。如您为企业采购，需要多单合并开具或批量提交发票可注册企业用户"
                        )
                    }}；<text class="main-color">{{ $t("使用礼品卡支付部分的金额，不支持开发票") }}</text>
                </view>
                <view class="invoice-typemenu-item" :class="{ active: formState.invoiceType === 1 }" @click="handleInvoiceType(1)">{{ $t("普通发票") }}</view>
                <view class="invoice-typemenu-item" :class="{ active: formState.invoiceType === 2 }" @click="handleInvoiceType(2)">{{
                    $t("增值税专用发票")
                }}</view>
            </view>

            <view class="invoice-formState">
                <uni-forms ref="formRef" :modelValue="formState" :rules="rules" label-width="170rpx">
                    <block v-if="formState.invoiceType === 1">
                        <uni-forms-item :label="$t('发票抬头')" name="name">
                            <view class="item-layout">
                                <up-radio-group v-model="formState.titleType" placement="row">
                                    <up-radio :customStyle="{ marginRight: '22rpx' }" :name="1" activeColor="var(--general)" :label="$t('个人')"></up-radio>
                                    <up-radio :name="2" activeColor="var(--general)" :label="$t('企业')"></up-radio>
                                </up-radio-group>
                            </view>
                        </uni-forms-item>
                        <block v-if="formState.titleType == 1">
                            <uni-forms-item :label="$t('个人名称')" name="companyName" :rules="[{ required: true, errorMessage: $t('个人名称不能为空') }]">
                                <uni-easyinput
                                    primaryColor="rgb(192, 196, 204)"
                                    :inputBorder="false"
                                    v-model="formState.companyName"
                                    :placeholder="$t('请输入个人名称')"
                                />
                            </uni-forms-item>
                        </block>
                        <block v-else>
                            <uni-forms-item :label="$t('企业名称')" name="companyName" :rules="[{ required: true, errorMessage: '企业名称不能为空' }]">
                                <uni-easyinput
                                    primaryColor="rgb(192, 196, 204)"
                                    :inputBorder="false"
                                    v-model="formState.companyName"
                                    :placeholder="$t('请输入企业名称')"
                                />
                            </uni-forms-item>
                            <uni-forms-item :label="$t('纳税人识号')" name="companyCode">
                                <uni-easyinput
                                    primaryColor="rgb(192, 196, 204)"
                                    :inputBorder="false"
                                    v-model="formState.companyCode"
                                    :placeholder="$t('请输入纳税人识号')"
                                />
                            </uni-forms-item>
                            <uni-forms-item :label="$t('单位地址')" name="companyAddress">
                                <uni-easyinput
                                    primaryColor="rgb(192, 196, 204)"
                                    :inputBorder="false"
                                    v-model="formState.companyAddress"
                                    :placeholder="$t('请输入单位地址')"
                                />
                            </uni-forms-item>
                            <uni-forms-item :label="$t('单位电话')" name="companyPhone">
                                <uni-easyinput
                                    primaryColor="rgb(192, 196, 204)"
                                    :inputBorder="false"
                                    v-model="formState.companyPhone"
                                    :placeholder="$t('请输入单位电话')"
                                />
                            </uni-forms-item>
                            <uni-forms-item :label="$t('开户银行')" name="companyBank">
                                <uni-easyinput
                                    primaryColor="rgb(192, 196, 204)"
                                    :inputBorder="false"
                                    v-model="formState.companyBank"
                                    :placeholder="$t('请输入开户银行')"
                                />
                            </uni-forms-item>
                            <uni-forms-item :label="$t('银行账户')" name="companyAccount">
                                <uni-easyinput
                                    primaryColor="rgb(192, 196, 204)"
                                    :inputBorder="false"
                                    v-model="formState.companyAccount"
                                    :placeholder="$t('请输入银行账户')"
                                />
                            </uni-forms-item>
                        </block>
                        <uni-forms-item :label="$t('收票人手机')" name="mobile">
                            <uni-easyinput
                                primaryColor="rgb(192, 196, 204)"
                                :inputBorder="false"
                                v-model="formState.mobile"
                                :placeholder="$t('请输入收票人手机')"
                            />
                        </uni-forms-item>
                        <uni-forms-item :label="$t('收票人邮箱')" name="email">
                            <uni-easyinput
                                primaryColor="rgb(192, 196, 204)"
                                :inputBorder="false"
                                v-model="formState.email"
                                :placeholder="$t('请输入收票人邮箱')"
                            />
                        </uni-forms-item>
                    </block>
                    <block v-else-if="formState.invoiceType === 2 && invoiceStatus">
                        <uni-forms-item :label="$t('单位名称')">
                            <view class="disabled-text">
                                {{ formState.companyName }}
                            </view>
                        </uni-forms-item>
                        <uni-forms-item :label="$t('纳税人识别码')">
                            <view class="disabled-text">
                                {{ formState.companyCode }}
                            </view>
                        </uni-forms-item>
                        <uni-forms-item :label="$t('注册地址')">
                            <view class="disabled-text">
                                {{ formState.companyAddress }}
                            </view>
                        </uni-forms-item>
                        <uni-forms-item :label="$t('注册电话')">
                            <view class="disabled-text">
                                {{ formState.companyPhone }}
                            </view>
                        </uni-forms-item>
                        <uni-forms-item :label="$t('开户银行')">
                            <view class="disabled-text">
                                {{ formState.companyBank }}
                            </view>
                        </uni-forms-item>
                        <uni-forms-item :label="$t('银行账户')">
                            <view class="disabled-text">
                                {{ formState.companyAccount }}
                            </view>
                        </uni-forms-item>
                        <uni-forms-item :label="$t('收票人手机')" name="mobile">
                            <uni-easyinput
                                primaryColor="rgb(192, 196, 204)"
                                :inputBorder="false"
                                v-model="formState.mobile"
                                :placeholder="$t('请输入收票人手机')"
                            />
                        </uni-forms-item>
                        <uni-forms-item :label="$t('收票人邮箱')" name="email">
                            <uni-easyinput
                                primaryColor="rgb(192, 196, 204)"
                                :inputBorder="false"
                                v-model="formState.email"
                                :placeholder="$t('请输入收票人邮箱')"
                            />
                        </uni-forms-item>
                    </block>
                    <block v-else>
                        <view class="notPass">
                            <view
                                >{{ $t("您还未通过增票资质申请，暂时无法开具增值税专用发票") }}
                                <text class="notPassBtn" @click="handleApply">{{ $t("去申请") }}</text></view
                            >
                        </view>
                    </block>
                </uni-forms>
            </view>
        </view>
        <tig-fixed-placeholder backgroundColor="#fff">
            <view class="btn-box">
                <tig-button :disabled="formState.invoiceType === 2 && !invoiceStatus" @click="onSubmit"> {{ $t("提交") }}</tig-button>
            </view>
        </tig-fixed-placeholder>
    </tig-layout>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { getInvoiceStatus, getCheckInvoice } from "@/api/order/invoice";
import { orderInvoiceInsert, orderInvoiceUpdate } from "@/api/user/invoiceManagemen";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const formState = reactive({
    titleType: 1, // 抬头类型
    invoiceType: 1, // 发票类型
    companyName: "",
    mobile: "",
    email: "",
    companyCode: "",
    companyAddress: "",
    companyPhone: "",
    companyBank: "",
    companyAccount: ""
});

const rules = {
    companyCode: {
        rules: [{ required: true, errorMessage: t("纳税人识号不能为空!") }]
    },
    companyAddress: {
        rules: [{ required: true, errorMessage: t("单位地址不能为空!") }]
    },
    companyPhone: {
        rules: [{ required: true, errorMessage: t("单位电话不能为空!") }]
    },
    companyBank: {
        rules: [{ required: true, errorMessage: t("开户银行不能为空!") }]
    },
    companyAccount: {
        rules: [{ required: true, errorMessage: t("银行账户不能为空!") }]
    },
    mobile: {
        rules: [{ required: true, errorMessage: t("手机不能为空!") }]
    }
};
const orderId = ref(0);

const clearFormState = () => {
    formState.companyName = "";
    formState.mobile = "";
    formState.email = "";
    formState.companyCode = "";
    formState.companyAddress = "";
    formState.companyPhone = "";
    formState.companyBank = "";
    formState.companyAccount = "";
};
const radioChange = (evt: any) => {
    formState.titleType = evt.detail.value;
    console.log(formState.titleType);
    return;
    clearFormState();
    __getCheckInvoice();
};

const invoiceStatus = ref(false);
const __getInvoiceStatus = async () => {
    try {
        const result = await getInvoiceStatus();
        if (result && Object.keys(result).length > 0) {
            invoiceStatus.value = true;
        } else {
            invoiceStatus.value = false;
        }
    } catch (error) {
        console.error(error);
    } finally {
    }
};

const __getCheckInvoice = async () => {
    try {
        const result = await getCheckInvoice({
            invoiceType: formState.invoiceType,
            titleType: formState.titleType
        });

        if (result.item) {
            if (formState.invoiceType === 1 && formState.titleType === 1) {
                formState.companyName = result.item.companyName;
                formState.mobile = result.item.mobile;
                formState.email = result.item.email;
            } else {
                formState.companyCode = result.item.companyCode;
                formState.companyName = result.item.companyName;
                formState.companyAddress = result.item.companyAddress;
                formState.companyPhone = result.item.companyPhone;
                formState.companyBank = result.item.companyBank;
                formState.companyAccount = result.item.companyAccount;
            }
            formState.mobile = result.item.mobile;
            formState.email = result.item.email;
        }
    } catch (error) {
        console.error(error);
    }
};

const handleInvoiceType = (type: number) => {
    formState.invoiceType = type;
    if (type === 2) {
        formState.titleType = 2;
    } else {
        formState.titleType = 1;
    }
    clearFormState();
    __getCheckInvoice();
};

const formRef = ref();

const __orderInvoiceInsert = async () => {
    try {
        const data = {
            ...formState,
            id: orderId.value
        };
        await orderInvoiceInsert(data);
        uni.redirectTo({
            url: "/pages/user/invoiceManagement/index?type=list"
        });
    } catch (error) {
        console.error(error);
    } finally {
    }
};
const __orderInvoiceUpdate = async () => {
    try {
        const data = {
            ...formState,
            id: orderId.value
        };
        await orderInvoiceUpdate(data);
        uni.redirectTo({
            url: "/pages/user/invoiceManagement/index?type=list"
        });
    } catch (error) {
        console.error(error);
    } finally {
    }
};
const submitStatus = ref("insert");
const onSubmit = () => {
    formRef.value
        .validate()
        .then((res: any) => {
            if (submitStatus.value === "insert") {
                __orderInvoiceInsert();
            } else {
                __orderInvoiceUpdate();
            }
        })
        .catch((err: any) => {
            console.log("表单错误信息：", err);
        });
};

onLoad((options) => {
    if (options) {
        if (options.type) {
            submitStatus.value = options.type;
        }
        if (options.orderId) {
            orderId.value = options.orderId;
        }
    }
});

onShow(() => {
    __getInvoiceStatus();
    __getCheckInvoice();
});

const handleApply = () => {
    uni.redirectTo({
        url: "/pages/user/invoiceManagement/index?type=invoice"
    });
};
</script>

<style lang="scss" scoped>
.btn-box {
    padding: 25rpx;
}
.item-layout {
    display: flex;
    align-items: center;
    height: 100%;
}

.notPass {
    padding: 10rpx 0;
    line-height: 40rpx;

    .notPassBtn {
        color: var(--general);
    }
}

.main-color {
    color: var(--general);
}
.invoice-popup-content {
    padding: 30rpx;
    background-color: #fff;
    margin: 10rpx 30rpx;
    margin-top: 25rpx;
    border-radius: 20rpx;
    padding-bottom: 2rpx;

    .invoice-typemenu {
        padding-bottom: 10rpx;
        border-bottom: 1rpx solid #eee;
        margin-bottom: 20rpx;
        .invoice-typemenu-item {
            background: #f2f2f2;
            color: #282828;
            padding: 13rpx 36rpx;
            border-radius: 50rpx;
            font-size: 25rpx;
            display: inline-block;
            margin-right: 28rpx;
            margin-bottom: 10rpx;

            &.active {
                color: #fff;
                background-color: var(--general);
            }
        }

        .invoice-explain {
            padding: 20rpx 0;
            font-size: 24rpx;
            line-height: 35rpx;
            color: #999;

            .red {
                color: #ff3700;
            }
        }
    }
}

.disabled-text {
    height: 100%;
    line-height: 68rpx;
    font-size: 24rpx;
    width: 450rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

:deep(.uni-forms-item) {
    margin-bottom: 30rpx;
}
:deep(.uni-forms-item__error) {
    top: 90%;
    left: 18rpx;
}
:deep(.uni-easyinput__placeholder-class) {
    font-size: 26rpx;
}
:deep(.uni-forms-item__label) {
    font-size: 26rpx;
}
</style>
