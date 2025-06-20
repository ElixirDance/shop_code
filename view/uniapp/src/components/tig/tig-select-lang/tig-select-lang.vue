<template>
    <view class="tig-select-lang">
        <view class="lang-box" @click.stop="handleclickLang">
            <slot>
                <view class="lang-icon-box">
                    <view class="iconfont-h5 icon-diqiu">
                        <text class="iconfont-h5 icon-sanjiaoright"></text>
                    </view>
                </view>
            </slot>
        </view>

        <tig-popup v-model:show="show" :zIndex="9999">
            <view class="lang-content">
                <view class="lang-list">
                    <view class="lang-title">{{ $t("选择语言") }}</view>
                    <up-radio-group :modelValue="i18nStore.defaultLocaleCode" placement="column" iconPlacement="right" @change="handleChange">
                        <scroll-view scroll-y="true" class="lang-scroll">
                            <view class="lang-list-content">
                                <block v-for="item in i18nStore.langList" :key="item.id">
                                    <view class="lang-item">
                                        <up-radio activeColor="var(--general)" :name="item.localeCode" :label="item.language + ' - ' + item.localeCode">
                                        </up-radio>
                                    </view>
                                </block>
                            </view>
                        </scroll-view>
                    </up-radio-group>
                </view>
                <tig-fixed-placeholder height="50px" backgroundColor="#fff">
                    <view class="currency-box" @click="handleclickCurrency"
                        >{{ $t("当前货币") }}
                        <text class="currency-box-unit">{{ currencyStore.currentCurrencyData.symbol + "-" + currencyStore.currentCurrencyData.name }}</text>
                        <text class="currency-box-text">{{ $t("去切换") }}</text>
                    </view>
                </tig-fixed-placeholder>
            </view>
        </tig-popup>
        <up-picker
            :show="showCurrency"
            keyName="label"
            :columns="[columns]"
            @cancel="showCurrency = false"
            confirmColor="var(--general)"
            @confirm="handleConfirm"
            :defaultIndex="[defaultIndex]"
            :cancelText="$t('取消')"
            :confirmText="$t('确认')"
            :closeOnClickOverlay="true"
            @close="showCurrency = false"
        ></up-picker>
    </view>
</template>
<script setup lang="ts">
import { useI18nStore } from "@/store/i18n";
import { useCurrencyStore } from "@/store/currency";
import { computed, nextTick, ref } from "vue";
import { currFullPath } from "@/utils";
const i18nStore = useI18nStore();
const currencyStore = useCurrencyStore();
const showCurrency = ref(false);

const columns = computed(() => {
    return currencyStore.currencyList.map((item) => {
        return {
            label: item.symbol + " - " + item.name,
            ...item
        };
    });
});
const defaultIndex = computed(() => {
    return currencyStore.currencyList.findIndex((item) => item.id === currencyStore.currentCurrencyData.id);
});
const show = ref(false);
const handleclickLang = () => {
    show.value = true;
};
const handleclickCurrency = () => {
    show.value = false;
    nextTick(() => {
        showCurrency.value = true;
    });
};

const reload = () => {
    const page = currFullPath();
    uni.reLaunch({
        url: page
    });
};

const handleChange = async (val: any) => {
    await i18nStore.getLangData(val);
    reload();
};
const handleConfirm = (val: any) => {
    // console.log("val", val);
    currencyStore.setDefaultData(val.value[0]);
    // console.log('currencyStore.currentCurrencyData', currencyStore.currentCurrencyData)
    reload();
};

defineExpose({
    handleclickLang
});
</script>

<style lang="scss" scoped>
.lang-content {
    height: 50vh;
}
.lang-box {
    .lang-icon-box {
        display: flex;
        align-items: center;
        height: 100%;
        margin-bottom: 5px;
        .icon-diqiu {
            font-size: 55rpx;
            color: #fff;
            position: relative;
            padding-right: 40rpx;

            .icon-sanjiaoright {
                font-size: 20rpx;
                color: #fff;
                font-weight: bold;
                position: absolute;
                bottom: 2rpx;
                right: 20rpx;
                transform: rotate(90deg);
            }
        }
    }
}

.lang-list {
    .lang-title {
        height: 100rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        font-weight: 500;
        color: #000;
    }
    .lang-scroll {
        height: calc(100% - 100rpx);

        .lang-list-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0 25rpx;

            .lang-item {
                width: 100%;
                border-bottom: 1px solid #e5e5e5;
                margin-top: 20rpx;
                box-sizing: content-box;
                padding-bottom: 10rpx;

                &:last-child {
                    border: none;
                }
            }
        }
    }
}

.currency-box {
    height: inherit;
    display: flex;
    align-items: center;
    font-size: 28rpx;
    font-weight: 500;
    padding-left: 25rpx;
    color: #000;

    .currency-box-unit {
        padding-left: 8rpx;
    }

    .currency-box-text {
        color: var(--general);
        padding-left: 8rpx;
    }
}
</style>
