<template>
    <view>
        <view class="overlay">
            <block v-if="currentData.pics && currentData.pics.length > 1">
                <view class="bottom-choose-box">
                    <uni-transition
                        :styles="{ width: '100%', height: 'inherit', backgroundColor: '#fff', 'border-radius': '30rpx 30rpx 0 0' }"
                        :mode-class="['fade', 'slide-bottom']"
                        :show="modelValue"
                    >
                        <view class="bottom-choose">
                            <view class="bottom-choose-title"> {{ $t("选择图片，生成对应海报") }} </view>
                            <view class="chose-ico">
                                <uni-icons type="closeempty" size="24" color="#c8c9cc" @click="$emit('update:modelValue', false)"></uni-icons>
                            </view>
                            <view class="choose-img">
                                <up-radio-group v-model="currentIndex" placement="column">
                                    <scroll-view class="list-box" scroll-x="true">
                                        <view class="list-content">
                                            <block v-for="(item, index) in currentData.pics" :key="item.picId">
                                                <view class="list-item" @click="handlePic(index)">
                                                    <up-radio
                                                        :customStyle="{ marginBottom: '8px', position: 'absolute', top: 0, right: '14rpx', zIndex: 9 }"
                                                        label=""
                                                        activeColor="#2da641"
                                                        :name="index"
                                                        @change=""
                                                    >
                                                    </up-radio>
                                                    <tig-image :src="item.picUrl"></tig-image>
                                                </view>
                                            </block>
                                        </view>
                                    </scroll-view>
                                </up-radio-group>
                            </view>
                        </view>
                    </uni-transition>
                </view>
            </block>
            <view class="poster-box">
                <view class="preview-wrap">
                    <view class="poster-wrap">
                        <view class="poster-img">
                            <image style="height: 100%" :src="posterPics[currentIndex]"></image>
                        </view>
                    </view>
                    <view class="preview-icon" v-if="currentData.pics && currentData.pics.length === 1">
                        <uni-icons type="close" size="36" color="#fff" @click="$emit('update:modelValue', false)"></uni-icons>
                    </view>
                    <view class="preview-text" @longpress.stop="handleSave(posterPics[currentIndex])">{{ $t("长按图片保存至相册") }}</view>
                </view>
            </view>
            <canvas class="canvas-content" id="myCanvas" canvas-id="myCanvas"></canvas>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, onMounted, nextTick } from "vue";
import { imageFormat } from "@/utils/format";
import { staticResource, getImageInfo, saveImageToAlbum } from "@/utils";
import { useSafeAreaInsets } from "@/hooks";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const instance = getCurrentInstance();
const userInfo = uni.getStorageSync("userInfo");
const { safeBottom } = useSafeAreaInsets();
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    currentData: {
        type: Object,
        default: () => {}
    },
    qrcodePath: {
        type: String,
        default: ""
    }
});
const emits = defineEmits(["update:modelValue"]);
const currentIndex = ref(0);
const imgHeight = ref(0);
const boxHeght = ref(0);
const posterPics = ref([]);
const CONTAINERWIDTH = 300;

const getImgHeight = async (url: string) => {
    try {
        const res = await getImageInfo(imageFormat(url));
        imgHeight.value = calculateProportionalHeight(res.width, res.height).height;
        boxHeght.value = imgHeight.value + 90;
    } catch (error) {
        console.error(error);
    }
};
const handlePic = (index: number) => {
    currentIndex.value = index;

    createPoster();
};
const calculateProportionalHeight = (originalWidth: number, originalHeight: number, containerWidth?: number) => {
    containerWidth = containerWidth || CONTAINERWIDTH;
    let newHeight = (originalHeight * containerWidth) / originalWidth;
    return { width: containerWidth, height: newHeight };
};

const createPoster = async () => {
    await getImgHeight(props.currentData.pics[currentIndex.value].picUrl);
    let context = uni.createCanvasContext("myCanvas", instance);
    if (posterPics.value[currentIndex.value]) return;
    const avatarSrc = userInfo.avatar ? imageFormat(userInfo.avatar) : staticResource("user/defaultAvatar.jpg");
    context.draw(); //清空原来的画图内容
    context.setFillStyle("#ffffff");
    context.fillRect(0, 0, CONTAINERWIDTH, boxHeght.value);
    try {
        context.draw(false, async () => {
            const avatarRes = await getImageInfo(avatarSrc);
            context.save();
            context.beginPath();
            context.arc(30, imgHeight.value + 35, 22, 0, 2 * Math.PI);
            context.clip();
            context.drawImage(avatarRes.path, 8, imgHeight.value + 12, 45, 45);
            context.restore();
            setTimeout(() => {
                context.draw(true, async () => {
                    const currentPicRes = await getImageInfo(imageFormat(props.currentData.pics[currentIndex.value].picUrl));
                    context.drawImage(
                        currentPicRes.path,
                        0,
                        0,
                        calculateProportionalHeight(currentPicRes.width, currentPicRes.height).width,
                        calculateProportionalHeight(currentPicRes.width, currentPicRes.height).height
                    );
                    context.draw(true, async () => {
                        const qrcodeRes = await getImageInfo(props.qrcodePath);
                        // 绘制二维码
                        context.drawImage(qrcodeRes.path, CONTAINERWIDTH - 80, boxHeght.value - 80, 70, 70);
                        // 绘制文字
                        context.setFontSize(13);
                        context.setFillStyle("#000000");
                        context.fillText(userInfo.mobile, 58, imgHeight.value + 33);
                        context.setFontSize(11);
                        context.setFillStyle("#999999");
                        context.fillText(`${t("这个真不错，推荐你也来看看")}`, 58, imgHeight.value + 48);
                        setTimeout(() => {
                            context.draw(true, () => {
                                createFilePath();
                            });
                        }, 50);
                    });
                });
            }, 50);
        });
    } catch (error) {
        console.error(error);
    }
};

const createFilePath = () => {
    uni.canvasToTempFilePath(
        {
            // 这里修改保存的图片格式
            fileType: "jpg",
            canvasId: "myCanvas",
            quality: 1,
            destWidth: CONTAINERWIDTH * 2,
            destHeight: boxHeght.value * 2,
            success: function (res) {
                posterPics.value[currentIndex.value] = res.tempFilePath;
            },
            fail: (err) => {
                uni.showToast({
                    title: JSON.stringify(err),
                    icon: "none",
                    duration: 3000
                });
                console.log(err);
            }
        },
        instance?.proxy
    );
};

const handleSave = (tempFilePath: string) => {
    uni.showModal({
        title: t("提示"),
        content: t("确定要保存分享海报吗？"),
        success: function (res) {
            if (res.confirm) {
                // 保存本地
                // #ifdef H5
                uni.previewImage({
                    urls: [tempFilePath]
                });
                // #endif
                // #ifdef APP-PLUS||MP-WEIXIN
                saveImageToAlbum(tempFilePath)
                    .then((res) => {
                        uni.showToast({
                            title: t("保存成功"),
                            icon: "none"
                        });
                    })
                    .catch((err) => {
                        uni.showToast({
                            title: t("保存失败"),
                            icon: "none"
                        });
                        console.error(err);
                    });
                // #endif
            }
        }
    });
};
onMounted(() => {
    nextTick(() => {
        createPoster();
    });
});
</script>

<style lang="scss" scoped>
.overlay {
    width: 100vw;
    height: 100vh;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 88;
    top: 0;
    left: 0;

    .bottom-choose-box {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;

        .bottom-choose {
            height: 100%;
            width: 100%;
            position: relative;
            height: 300rpx;
            overflow: hidden;
            box-sizing: content-box;
            padding-bottom: v-bind("safeBottom + 20 + 'rpx'");
            .bottom-choose-title {
                margin: 0 auto;
                padding: 16px 0;
                font-weight: 400;
                font-size: 14px;
                line-height: 18px;
                text-align: center;
                color: #323233;
            }

            .chose-ico {
                position: absolute;
                z-index: 1;
                color: #c8c9cc;
                font-size: 22px;
                top: 12px;
                right: 14px;
            }
        }

        .list-box {
            height: 200rpx;
            width: 100%;

            .list-content {
                width: 100%;
                height: 100%;
                padding: 0 25rpx;
                white-space: nowrap;
                .list-item {
                    width: 216rpx;
                    height: 200rpx;
                    padding-right: 16rpx;
                    position: relative;
                    display: inline-block;
                }
            }
        }
    }

    .poster-box {
        position: fixed;
        max-height: 100%;
        background-color: #fff;
        top: 353.5px;
        left: 50%;
        z-index: 9;
        transform: translate3d(-50%, -50%, 0);

        .preview-wrap {
            position: relative;
            .preview-icon {
                position: absolute;
                top: -75rpx;
                right: -20rpx;
            }

            .preview-text {
                position: absolute;
                bottom: -70rpx;
                left: 50%;
                transform: translateX(-50%);
                font-size: 24rpx;
                color: #fff;
            }
        }

        .poster-wrap {
            max-height: 532px;
            overflow: auto;

            .poster-img {
                height: v-bind("boxHeght + 'px'");
                width: 100%;
            }
        }
    }

    .canvas-content {
        position: fixed;
        top: 0;
        left: 0;
        width: 300px;
        height: v-bind("boxHeght + 'px'");
        top: -9999px;
        left: -9999px;
    }
}
</style>
