<template>
    <view class="page-content">
        <tig-layout title="消息列表">
            <view class="thanos-layout conversation-list-layout">
                <view class="thanos-layout-main-content">
                    <view class="thanos-waterfall conversation-list-wrap">
                        <template v-if="msgList.length > 0">
                            <view class="main-list" v-for="(item, index) in msgList" :key="index">
                                <view
                                    @click="handleLink(`/pages/im/index?shopId=${item.shopId}&conversationId=${item.conversationId}`)"
                                    class="wapim-conversation-item"
                                >
                                    <figure class="bg-pic circle-bg-pic thanos-figure thanos-hairline--surround conversation-figure">
                                        <view
                                            class="bg-pic-content"
                                            :style="{
                                                backgroundImage: `url(${
                                                    item.shop ? imageFormat(item.shop.shopLogo) : imageFormat(configStore.baseInfo.icoImg)
                                                })`
                                            }"
                                        ></view>
                                    </figure>
                                    <view class="wapim-conversation-item-content thanos-hairline--bottom">
                                        <view class="shop-name thanos-ellipsis">{{ item.shop ? item.shop.shopTitle : configStore.baseInfo.shopTitle }}</view>
                                        <view class="last-message thanos-ellipsis" v-if="item.lastMessage[0].messageType == 'text'">
                                            <view class="ellipsis" v-html="item.lastMessage[0].content.content"></view>
                                        </view>
                                        <view class="last-message thanos-ellipsis" v-else>[{{ item.lastMessage[0].messageTypeText }}]</view>
                                    </view>
                                    <view class="wapim-conversation-item-right">
                                        <span class="last-time">{{ item.lastUpdateTime }}</span>
                                    </view>
                                </view>
                            </view>
                        </template>
                        <template v-if="msgList.length === 0 && isLoadEnd">
                            <view class="thanos-waterfall-finish-desc">{{ $t("已经没有更多消息了") }}</view>
                        </template>
                    </view>
                </view>
            </view>
        </tig-layout>
    </view>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import { onShow, onReachBottom } from "@dcloudio/uni-app";
import { getConversation } from "@/api/im/im";
import { imageFormat } from "@/utils/format";
import { useConfigStore } from "@/store/config";

const configStore = useConfigStore();

const filterParams = reactive({
    page: 1,
    size: 15
});
const total = ref(0);
const isLoadEnd = ref(false);
const msgList = ref<any[]>([]);
const _getConversation = async () => {
    try {
        const result = await getConversation(filterParams);
        msgList.value = result.records;
        total.value = result.total;
    } catch (error: any) {
    } finally {
        isLoadEnd.value = true;
    }
};
const handleLink = (url: string) => {
    uni.navigateTo({
        url: url
    });
};
onShow(() => {
    _getConversation();
});
onReachBottom(() => {
    if (filterParams.page < Math.ceil(total.value / filterParams.size)) {
        filterParams.page++;
        _getConversation();
    }
});
</script>
<style scoped lang="scss">
.page-content {
    height: 100%;
    color: #333;
    width: 100%;
}

.thanos-layout {
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    height: 100%;

    .thanos-layout-main-content {
        flex: 1;
        overflow: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        justify-content: flex-start;
    }

    .thanos-layout-footer {
        min-height: 100rpx;
    }
}

.wapim-conversation-list-banner {
    padding: 14rpx 0;
    position: relative;
    background-color: #fff;
    text-align: center;
    line-height: 52rpx;
}

.bg-pic {
    display: inline-block;
    width: 90rpx;
    height: 90rpx;
    overflow: hidden;
    margin: 0;

    .bg-pic-content {
        background-size: cover;
        width: 100%;
        height: 100%;
        background-position: center center;
        border-radius: 50%;
    }
}

.conversation-list-wrap .main-list {
    min-width: 640rpx;

    .wapim-conversation-item {
        display: flex;
        padding: 10rpx 0;
        padding-left: 30rpx;
        background-color: #fff;
        align-items: center;
        height: auto;

        .conversation-figure {
            width: 88rpx;
            height: 88rpx;
            border: none;
            margin: 0;
            border-radius: 50%;
            flex-shrink: 0;
        }
    }
}

.wapim-conversation-item {
    position: relative;

    .wapim-conversation-item-content {
        padding: 12rpx;
        width: 100%;

        .shop-name {
            font-size: 32rpx;
            color: #333;
            line-height: 48rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 60vw;
        }

        .last-message {
            font-size: 24rpx;
            color: #999;
            line-height: 40rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }

    .wapim-conversation-item-right {
        position: absolute;
        top: 20rpx;
        right: 30rpx;
        font-size: 20rpx;
        color: #999;
        line-height: 48rpx;
    }
}

.thanos-waterfall-finish-desc {
    font-size: 24rpx;
    text-align: center;
    color: #666;
    margin: 24rpx 0;
}

.thanos-hairline--bottom::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    pointer-events: none;
    box-sizing: border-box;
    border: 0 solid #e5e5e5;
    border-bottom-width: 2rpx;
    :deep(.emoji) {
        vertical-align: sub;
        cursor: default;
        height: 40rpx;
        margin: 0 4rpx;
    }
}
.thanos-hairline--bottom {
    .last-message {
        margin-top: 10rpx;
        .ellipsis {
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        :deep(.emoji) {
            vertical-align: sub;
            cursor: default;
            height: 40rpx;
            margin: 0 4rpx;
        }
    }
}
</style>
