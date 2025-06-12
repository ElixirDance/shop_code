<template>
    <div class="displayRow">
        <div v-if="picThumb" class="orderImage">
            <el-image style="width: 50px; height: 50px" :src="imageFormat(picThumb)" fit="cover" />
        </div>
        <div>
            <a :href="url" class="color999 alink" target="_blank">
                {{ productName }}
            </a>
        </div>
        <br/>
        <el-tag v-if="productType === 0" disable-transitions effect="plain" size="small" type="danger">虚拟产品
        </el-tag>
    </div>
</template>
<script lang="ts" setup>

import {imageFormat} from "@/utils/format";

const props = defineProps({
    productId: Number,
    productType: {
        type: Number,
        define: 1
    },
    url: String,
    picThumb: String,
    productName: String,
});

</script>
<style lang="less" scoped>
.displayRow {
    display: flex;
    flex-direction: row;
    gap: 8px;


    .color999 {
        color: #666666;
    }
    .alink{line-height: 22px;display: block;}
    .orderImage {
        min-width: 50px;
        min-height: 50px;
        max-width: 50px;
        max-height: 50px;
        border: 1px solid #eee;
        margin-top: 5px;
    }
}


</style>
