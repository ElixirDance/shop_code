<template>
    <div class="footer">
        <!-- <span>{{ licensedStore.licensedData.shopCompany }}</span>
        <span v-if="licensedStore.licensedData.versionInfoHidden == 0">{{ licensedStore.licensedData.versionType }} v{{ licensedStore.licensedData.version }}</span> -->
    </div>
</template>
<script setup lang="ts">
import { useLicensedStore } from "@/store/licensed";
const licensedStore = useLicensedStore();
</script>
<style lang="less">
.footer {
    text-align: center;
    padding: 10px 0 70px 0;
    color: #333;
    span{
        margin-right: 5px;
    }
}
</style>
