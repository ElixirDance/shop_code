<template>
    <div class="module-ad-con">
        <div class="pc-module-box" style="height:100px">
            <div class="title">分类商品 - 窄</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, defineModel } from 'vue';
import { ModuleType, PcCatProductType } from '@/types/decorate/decorate.d';
import { mergeDefaultModule } from '@/views/decorate/decorate/src/modules/'
const defaultModule = ref({
    categoryId: 0,
    shortTitle: '',
    enTitle: '',
    color: '',
    color2: '',
    logo: {
        'picUrl': '',
        'picThumb': '',
    },
    picList: [],
    picList2: [],
})
const module = defineModel<ModuleType & PcCatProductType>('module');
mergeDefaultModule(module.value, defaultModule.value)
</script>
<style lang="less" scoped></style>