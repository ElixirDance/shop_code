<template>
    <view
        :class="
            'module-ad-con module-image_ad ' +
            ' ad-pic_type__' +
            module.picType +
            ' ad-pic_page_type__' +
            module.picPageType +
            ' ad-radio_style__' +
            module.picRadioStyle +
            ' '
        "
        v-if="module.picList.length > 0"
        :style="frameFormat.boxPadding + frameFormat.boxPaddingTop + frameFormat.boxPaddingBottom"
    >
        <view class="module-ad-content" :style="frameFormat.backgroundColor + ' ' + frameFormat.boxRadius">
            <commonTitle v-if="module.title.showTitle == 1" :module="module.title"></commonTitle>
            <block v-if="module.picList && module.picList.length > 0">
                <block v-if="module.picType == 2">
                    <view class="image-ad-warp" :style="frameFormat.innerPadding">
                        <view class="image-ad-con">
                            <block v-if="columns == 1">
                                <tig-swiper
                                    :class="{ 'uni-swiper-dot-box': module.picPageType == 3 }"
                                    :mode="mode"
                                    :color="module.picPageType == 3 ? '#fff' : ''"
                                    :selectColor="selectColor"
                                    v-model="module.picList"
                                    :height="swiperHeight"
                                >
                                    <template v-slot:default="{ item }">
                                        <view :style="{ height: swiperHeight + 'rpx' }" class="image-ad-item">
                                            <view
                                                class="item-content"
                                                :style="format.imgPadding"
                                                @click="item.picLink && redirect({ url: urlFormat(item.picLink) })"
                                            >
                                                <view class="item-img-a">
                                                    <image style="width: 100%; height: 100%" :src="imageFormat(item.picUrl)" @load="loadImage"></image>
                                                </view>
                                            </view>
                                        </view>
                                    </template>
                                </tig-swiper>
                            </block>
                            <block v-else>
                                <tig-swiper
                                    :class="{ 'uni-swiper-dot-box': module.picPageType == 3 }"
                                    :mode="mode"
                                    :color="module.picPageType == 3 ? '#fff' : ''"
                                    :selectColor="selectColor"
                                    v-model="swiperList"
                                    :height="swiperHeight"
                                >
                                    <template v-slot:default="{ item }">
                                        <view class="swiper-main" :style="{ height: swiperHeight + 'rpx' }">
                                            <view class="image-ad-item" v-for="(subItem, index) in item" :key="index">
                                                <view class="item-content" :style="format.imgPadding">
                                                    <view class="item-img-a">
                                                        <image style="width: 100%; height: 100%" :src="imageFormat(subItem.picUrl)" @load="loadImage"></image>
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                    </template>
                                </tig-swiper>
                            </block>
                        </view>
                    </view>
                </block>
                <block v-else>
                    <view class="image-ad-warp" :style="frameFormat.innerPadding">
                        <view class="image-ad-con">
                            <template v-if="module.picList" v-for="(pic, picIndex) in module.picList" :key="picIndex">
                                <view class="image-ad-item">
                                    <view class="item-content" :style="format.imgPadding" @click="pic.picLink && redirect({ url: urlFormat(pic.picLink) })">
                                        <view class="item-img-a" :url="pic.picLink ? pic.picLink.link : ''">
                                            <tig-image class="item-img" :src="pic.picUrl" mode="widthFix"></tig-image>
                                        </view>
                                    </view>
                                </view>
                            </template>
                        </view>
                    </view>
                </block>
            </block>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { ref, computed, watchEffect, onUnmounted } from "vue";
import commonTitle from "@/components/modules/commonTitle/index.vue";
import { formatFrame } from "@/components/modules";
import { imageFormat, urlFormat } from "@/utils/format";
import { redirect } from "@/utils/index";

const props = defineProps({
    module: {
        type: Object,
        default: () => ({})
    }
});
const frameFormat = computed(() => {
    return formatFrame(props.module.frame ?? {});
});

const format = computed(() => {
    return {
        imgPadding: "padding:" + props.module?.imgPadding + "px;"
    };
});
const selectColor = computed(() => {
    return props.module.swiperPageColor || "#333";
});

const mode = computed(() => {
    return props.module.picPageType == 1 ? "default" : "dot";
});
const columns = computed(() => {
    return props.module.swiperPreView || 1;
});
const swiperHeight = ref(150);
const loadEnd = ref(false);

const loadImage = (e: any) => {
    const { height, width } = e.detail;
    computeImgHeight(height, width);
};

const computeImgHeight = (height: number, width: number) => {
    const screenWidth = uni.getSystemInfoSync().windowWidth;
    if (width > height) {
        swiperHeight.value = ((screenWidth * height) / width) * 1.7;
    } else if (width == height) {
        swiperHeight.value = height;
    } else {
        swiperHeight.value = ((screenWidth * height) / height) * 1.7;
    }
    loadEnd.value = true;
};

const swiperList = ref<any[]>([]);
const getSwiperList = () => {
    swiperList.value = [];
    let itemNum = props.module.swiperPreView || 1;
    let swiperListNum = Math.ceil(props.module.picList.length / itemNum);
    for (let index = 0; index < swiperListNum; index++) {
        swiperList.value.push(props.module.picList.slice(index * itemNum, (index + 1) * itemNum));
    }
};
onUnmounted(() => {
    uni.offWindowResize(windowResizeCallback);
});
const windowResizeCallback = (res: any) => {
    uni.getImageInfo({
        src: imageFormat(props.module.picList[0].picUrl),
        success: (e: any) => {
            computeImgHeight(e.height, e.width);
        }
    });
};
uni.onWindowResize(windowResizeCallback);

watchEffect(() => {
    if (columns.value > 1 && props.module.picList && props.module.picList.length > 0) {
        getSwiperList();
    }
});
</script>
<style lang="scss" scoped>
.swiper-main {
    height: 100%;
    display: grid;
    grid-template-columns: repeat(v-bind("columns"), 1fr);
    box-sizing: border-box;
    width: 100%;
}

.module-image_ad .module-ad-content {
    overflow: hidden;
}
.image-ad-warp {
    position: relative;
}
.image-ad-warp .image-ad-con {
    display: flex;
    flex-wrap: wrap;
}
.image-ad-warp .image-ad-con .image-ad-item .item-img {
    width: 100%;
    height: 100%;
}
.ad-pic_type__1 .image-ad-warp .image-ad-con {
    flex-wrap: wrap;
}
.ad-pic_type__1 .image-ad-warp .image-ad-con .image-ad-item {
    width: 100%;
}

.ad-pic_type__2 .image-ad-warp {
    overflow: hidden;
    height: 100%;
}
.ad-pic_type__2 .image-ad-warp .image-ad-con {
    display: block;
    flex-wrap: nowrap;
    padding: 0 !important;
    height: 100%;
}
.ad-pic_type__2 .image-ad-warp swiper {
    height: 100%;
    position: relative;
    overflow: hidden;
}
.ad-pic_type__2 .image-ad-warp .image-ad-con .image-ad-item {
    flex: none;
    width: 100%;
    height: 100%;
}
.ad-pic_type__2 .image-ad-warp .image-ad-con .image-ad-item .item-content {
    height: 100%;
    box-sizing: border-box;
}
.ad-pic_type__2 .image-ad-warp .image-ad-con .item-img-a {
    overflow: hidden;
    display: block;
    height: 100%;
}

.ad-pic_type__2.ad-pic_page_type__1 .image-ad-warp .swiper-pagination-con {
    position: absolute;
    bottom: 30rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}
.ad-pic_type__2.ad-pic_page_type__1 .image-ad-warp .swiper-pagination {
    display: inline-block;
    width: 24rpx;
    border-radius: 0;
    height: 4rpx;
    margin: 0 2rpx;
    background: #000;
    opacity: 0.2;
}
.ad-pic_type__2.ad-pic_page_type__1 .image-ad-warp .swiper-pagination.active {
    opacity: 1;
    background-color: #fff;
}
.ad-pic_type__2.ad-pic_page_type__2 .image-ad-warp .swiper-pagination-con {
    position: absolute;
    bottom: 30rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}
.ad-pic_type__2.ad-pic_page_type__2 .image-ad-warp .swiper-pagination {
    margin: 0 6rpx;
    background: #333;
    width: 12rpx;
    height: 12rpx;
    display: inline-block;
    border-radius: 100%;
    background: #000;
    opacity: 0.2;
}
.ad-pic_type__2.ad-pic_page_type__2 .image-ad-warp .swiper-pagination.active {
    opacity: 1;
}
.ad-pic_type__2.ad-pic_page_type__3 .image-ad-warp .swiper-pagination-con {
    text-align: center;
    right: 0;
    position: absolute;
    width: 110rpx;
    bottom: 20rpx;
}
.ad-pic_type__2.ad-pic_page_type__3 .image-ad-warp .swiper-pagination {
    position: absolute;
    text-align: center;
    z-index: 10;
    bottom: 0;
    left: 0;
    width: 100%;
}
.ad-pic_type__2.ad-pic_page_type__3 .image-ad-warp .swiper-pagination {
    text-align: right;
    background: #000;
    opacity: 0.3;
    border-radius: 200rpx;
    padding: 2rpx 10rpx;
    display: inline-block;
    width: auto;
    color: #fff;
    font-size: 24rpx;
}

.ad-pic_type__3 .image-ad-warp {
    overflow: hidden;
}
.ad-pic_type__3 .image-ad-warp .image-ad-con {
    flex-wrap: nowrap;
    overflow-x: scroll;
    margin-bottom: -40rpx;
    padding-bottom: 40rpx !important;
    -webkit-overflow-scrolling: touch;
}
.ad-pic_type__3 .image-ad-warp .image-ad-con .image-ad-item {
    flex: none;
    width: 80%;
}
.ad-pic_type__4 .image-ad-warp {
    overflow: hidden;
}
.ad-pic_type__4 .image-ad-warp .image-ad-con {
    flex-wrap: nowrap;
    overflow-x: scroll;
    margin-bottom: -40rpx;
    padding-bottom: 40rpx !important;
    -webkit-overflow-scrolling: touch;
}
.ad-pic_type__4 .image-ad-warp .image-ad-con .image-ad-item {
    flex: none;
    width: 40%;
}
.ad-pic_type__5 .image-ad-warp .image-ad-con {
    flex-wrap: wrap;
}
.ad-pic_type__5 .image-ad-warp .image-ad-con .image-ad-item {
    width: 50%;
}
.ad-pic_type__6 .image-ad-warp .image-ad-con {
    flex-wrap: wrap;
}
.ad-pic_type__6 .image-ad-warp .image-ad-con .image-ad-item {
    width: 33.33333%;
}
.ad-pic_type__7 .image-ad-warp .image-ad-con {
    flex-wrap: wrap;
}
.ad-pic_type__7 .image-ad-warp .image-ad-con .image-ad-item {
    width: 25%;
}
.ad-radio_style__2 .image-ad-warp .image-ad-con .item-img-a {
    border-radius: 16rpx;
    overflow: hidden;
    display: block;
    height: 100%;
}
</style>
