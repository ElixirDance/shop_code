<template>
    <tig-layout title="商品评价">
        <view class="product-comment-card">
            <view class="comment-item" v-for="(item, index) in commentList" :key="index">
                <view class="user-info flex justify-between align-center">
                    <view class="user-name flex align-center">
                        <view class="head_logo">
                            <image :src="imageFormat(item?.avatar || '')" />
                        </view>
                        <view>
                            <text>{{ item.username }}</text>
                            <uni-rate :value="item.commentRank" :readonly="true" size="14" color="#bfbfbf" active-color="#ffa800"></uni-rate>
                        </view>
                    </view>
                    <view class="time">{{ item.addTime }}</view>
                </view>
                <view class="tags flex-wrap">
                    <view class="tag" v-for="(tag, tagIndex) in item.commentTag" :key="tagIndex">{{ tag }}</view>
                </view>
                <view class="user-content">
                    {{ item.content }}
                </view>
                <view class="user-imgs flex-wrap align-center">
                    <image
                        v-for="(pic, picIndex) in item.showPics"
                        :key="picIndex"
                        mode="aspectFit"
                        :src="imageFormat(pic.picThumb)"
                        @click="imagePreview(imageFormat(pic?.picUrl || ''))"
                    ></image>
                </view>
            </view>
        </view>
        <view class="loading-box" v-if="page > 1">
            <view class="bottomLoading" v-if="loading"><image lazy-load class="loading" :src="staticResource('common/loading.gif')"></image></view>
        </view>
        <view class="loading-box">
            <view v-if="commentList.length < 1">{{ $t("暂无评价") }}</view>
        </view>
    </tig-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { imageFormat } from "@/utils/format";
import { onLoad, onReachBottom, onUnload } from "@dcloudio/uni-app";
import { getCommentList } from "@/api/product/product";
import type { CommentItem } from "@/types/product/product";
import { staticResource } from "@/utils";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const loading = ref(false);
const commentList = ref<CommentItem[]>([]);
const page = ref<number>(1);
const size = ref(10);
const total = ref(0);
const loaded = ref(false);
const imagePreview = (url: string) => {
    uni.previewImage({
        urls: [url]
    });
};
const _getCommentList = async () => {
    if (page.value > 1) {
        loaded.value = true;
    }
    uni.showLoading({
        title: t("加载中")
    });
    try {
        const result = await getCommentList(productId.value, {
            type: 1,
            size: size.value,
            page: page.value
        });
        commentList.value = [...commentList.value, ...result.records];
        total.value = result.total;
    } catch (error: any) {
        uni.showToast({
            title: error.message,
            icon: "none"
        });
    } finally {
        loaded.value = false;
        uni.hideLoading();
    }
};
const productId = ref<any>("");
onLoad((option) => {
    if (option) {
        const { id } = option;
        if (id) {
            productId.value = id;
            _getCommentList();
        }
    }
});
onReachBottom(() => {
    if (page.value < Math.ceil(total.value / size.value)) {
        page.value++;
        _getCommentList();
    }
});

// 关闭预览图片
onUnload(() => {
    // #ifdef  H5 || APP
    uni.closePreviewImage();
    // #endif
});
</script>

<style lang="scss" scoped>
.product-comment-card {
    background-color: #fff;
    padding: 20rpx 20rpx 0 20rpx;
    border-top: 1rpx solid #eee;
    .comment-item {
        border-bottom: 1rpx solid #eee;
        padding-bottom: 20rpx;
        padding-top: 20rpx;
        .user-info {
            .user-name {
                font-size: 24rpx;
                .head_logo {
                    margin-right: 20rpx;
                    image {
                        width: 60rpx;
                        height: 60rpx;
                        border-radius: 100rpx;
                    }
                }
            }
            .time {
                font-size: 24rpx;
                color: $tig-color-grey;
            }
        }
        .tags {
            margin-top: 20rpx;
            .tag {
                background: #eee none repeat scroll 0 0;
                margin-bottom: 12rpx;
                margin-right: 8rpx;
                padding: 6rpx 12rpx;
                border-radius: 2px;
                font-size: 11px;
                color: #666;
            }
        }
        .user-content {
            margin: 20rpx 0;
            font-size: 26rpx;
        }
        .user-imgs {
            image {
                width: 150rpx;
                height: 150rpx;
                margin-right: 15rpx;
                margin-bottom: 15rpx;
                border: 1px solid #eee;
            }
        }
    }
}
.loading-box {
    padding: 30rpx;
    font-size: 24rpx;
}
</style>
