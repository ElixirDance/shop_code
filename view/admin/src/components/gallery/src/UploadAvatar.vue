<template>
    <template v-if="avatarType">
        <div class="avatar-type">
            <FormAddGallery v-if="!loading" v-model:photo="avatar"></FormAddGallery>
        </div>
        <div class="extra">不想上传头像？<span class="tips" @click="toggle">点击这里</span>一键选用系统默认头像。</div>
    </template>
    <template v-else>
        <div class="avatar-type">
            <DefaultAvatar v-if="!loading" v-model:avatar="avatar"></DefaultAvatar>
        </div>
        <div class="extra">还在使用系统默认头像？<span class="tips" @click="toggle">点击这里</span>上传你的个性头像。</div>
    </template>
</template>
<script setup lang="ts">

import { DefaultAvatar, FormAddGallery } from "@/components/gallery";

const avatarType = defineModel<any>("avatarType", { type: Number, default: true });
const avatar = defineModel<any>("avatar", { type: String, default: "" });
const props = defineProps({
    loading: {
        type: Boolean,
        default: true
    }
});
const toggle = () => {
    avatar.value = "";
    avatarType.value = !avatarType.value;
};
</script>
<style scoped lang="less">
.avatar-type {
    display: flex;
    flex-direction: row;
    gap: 10px;
    width: 100%;
    align-items: center;
}

.tips {
    color: #1456f0;
    margin-right: 2px;
    cursor: pointer;
}
</style>
