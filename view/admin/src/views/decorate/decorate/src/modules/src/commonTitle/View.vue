<template>
    <template v-if="title.showTitle">
        <div :class="'image-ad-title ad-title_style__' + title.titleStyle" :style="titleFormat.titleBackground + titleFormat.titleRadius">
            <div class="image-ad-title-l">
                <img
                    v-if="title?.titleBackgroundPic && title?.titleBackgroundPic.picThumb"
                    class="image-ad-title-img"
                    :src="imageFormat(title?.titleBackgroundPic.picThumb)"
                    alt=""
                    srcset=""
                />
                <div class="image-ad-title-h" :style="'color: ' + title.titleColor">{{ title.titleText }}</div>
                <div class="image-ad-title-d" :style="'color: ' + title.descColor">{{ title.descText }}</div>
            </div>
            <template v-if="title.showMore">
                <div class="image-ad-title-r">
                    <div class="more-link" url="{{title.moreLink ? title.moreLink.link : ''}}" :style="{ color: title?.moreColor }">
                        <text>查看更多</text>
                        <text class="module_ico module-ico-youjiantou"></text>
                    </div>
                </div>
            </template>
        </div>
    </template>
</template>
<script lang="ts" setup>
import { ref, computed, Ref } from "vue";
import { imageFormat } from "@/utils/format";
import { ModuleTitleType } from "@/types/decorate/decorate.d";
import { mergeDefaultModule, defaultTitle, formatTitle } from "@/views/decorate/decorate/src/modules/";
// 在modules加入要使用的模块
const title = defineModel<ModuleTitleType>("modelValue") as Ref<ModuleTitleType>;
const titleFormat = computed(() => {
    return formatTitle(title.value);
});
</script>

<style scoped>
.image-ad-title-img {
    width: 30px;
    height: 30px;
    margin-right: 5px;
}
</style>
