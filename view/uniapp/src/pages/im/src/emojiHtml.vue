<template>
    <rich-text :nodes="html"></rich-text>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import emojiElements from "./emojiElements";
const props = defineProps({
    content: {
        type: String,
        default: ""
    }
});
const html = ref("");
html.value = replaceNamesWithIds(props.content, emojiElements);
function replaceNamesWithIds(input: string, elements: { name: string; id: string }[]): string {
    const regex = new RegExp(`(${elements.map((e) => e.name).join("|")})`, "g");
    return input.replace(/\[|\]/g, "").replace(regex, (match) => {
        const foundElement = elements.find((element) => element.name === match);
        return foundElement ? "<img class='emoji' src='http://oss.tigshop.com/official/emoji/" + foundElement.id + ".png'>" : match;
    });
}
</script>

<style lang="scss" scoped>
.emoji {
    width: 40rpx;
    height: 40rpx;
}
</style>
