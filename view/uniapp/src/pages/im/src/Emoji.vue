<template>
    <div class="picker_body">
        <div class="emojipicker">
            <div class="list">
                <div class="item" v-for="(item, index) in emojiElements" :key="item.id" @click="insertEmoji(item.name)">
                    <span
                        ><span class="byte-tooltip__wrapper"><emojiImage class="image" :id="item.id" /></span
                    ></span>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import emojiImage from "./emojiImage.vue";
import emojiElements from "./emojiElements";
const emit = defineEmits(["insertEmoji"]);
const insertEmoji = (emoji: string) => {
    emit("insertEmoji", emoji);
};
</script>
<style lang="scss" scoped>
.picker_body {
    width: 100%;
}
.emojipicker .list {
    padding-left: 24rpx;
    padding-bottom: 24rpx;
    display: grid;
    grid-template-columns: repeat(8, 60rpx);
    grid-gap: 16rpx 24rpx;
}
.emojipicker .list .item {
    position: relative;
    width: 60rpx;
    height: 60rpx;
    margin-bottom: 16rpx;
    margin-right: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.emojipicker .list .item .image {
    transform: translateZ(0);
    transition: transform 0.3s;
    display: block;
    height: 56rpx;
    width: 56rpx;
}
.emojipicker .list .item:hover .image {
    transform: translateZ(0) scale(1.28);
}
</style>
