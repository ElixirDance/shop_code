<template>
    <view
        :class="'module-ad-con module-ad-con-' + ' ad-radio_style__' + module.radioStyle"
        :style="frameFormat.boxPadding + frameFormat.boxPaddingTop + frameFormat.boxPaddingBottom"
    >
        <view class="module-ad-content" :style="module.backgroundColor + module.boxRadius">
            <commonTitle v-if="module.title.showTitle == 1" :module="module.title"></commonTitle>
            <block v-if="module.picList">
                <view class="image-ad-warp image-hotarea-warp" :style="frameFormat.innerPadding">
                    <view class="image-ad-con">
                        <block v-for="(item, index) in module.picList" :key="item.picId">
                            <view class="image-ad-item">
                                <view class="item-content" :style="format.imgPadding">
                                    <view class="item-content-hotatrea">
                                        <tig-image class="item-img-bg" :src="item.picUrl" mode="widthFix"></tig-image>
                                        <block v-if="item.hotarea">
                                            <view
                                                v-for="(subItem, index) in item.hotarea"
                                                :key="index"
                                                @click="subItem.link && redirect({ url: urlFormat(subItem.link) })"
                                                class="image-hotarea-link"
                                                :data-width="subItem.width"
                                                :data-height="subItem.height"
                                                :data-left="subItem.pageX"
                                                :data-top="subItem.pageY"
                                                :style="subItem.position"
                                            >
                                                <text class="area_box_con_text">{{ subItem.link.name }}</text>
                                            </view>
                                        </block>
                                    </view>
                                </view>
                            </view>
                        </block>
                    </view>
                </view>
            </block>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import commonTitle from "@/components/modules/commonTitle/index.vue";
import { formatFrame } from "@/components/modules";
import { imageFormat, urlFormat } from "@/utils/format";
import { redirect } from "@/utils";
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
</script>
<style>
/*热图广告*/
.image-hotarea-warp .image-ad-item {
    width: 100%;
    position: relative;
}
.image-hotarea-warp .image-ad-item .item-content-hotatrea {
    position: relative;
    width: 100%;
    display: flex;
}
.image-hotarea-warp .image-ad-item .item-img-bg {
    width: 100%;
}
.image-hotarea-warp .image-ad-item .image-hotarea-link {
    position: absolute;
}
.image-hotarea-warp .image-ad-item .image-hotarea-link .area_box_con_text {
    display: none;
}
</style>
