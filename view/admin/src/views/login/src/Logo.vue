<template>
    <div class="login-page-left">
        <!-- <a class="top-bar-btn" target="_blank" href="https://www.tigshop.com" title="起始页" style="padding: 0 3px" v-if="licensedData">
            <img v-if="!licensedData.adminLightLogo || licensedData.adminLightLogo == null" style="margin: 10px" height="40" src="~@/style/images/logo2.png" />
            <img v-else style="margin: 10px" height="40" :src="imageFormat(licensedData.adminLightLogo)" />
        </a> -->
    </div>
</template>
<script lang="ts" setup>
import { onMounted,ref } from "vue";
import { getLicensed } from "@/api/setting/licensed";
import {message} from "ant-design-vue";
import { imageFormat } from "@/utils/format";
import { useConfigStore } from "@/store/config";
const licensedData = ref();
const configStore = useConfigStore();
const _getLicensed = async () => {
    try {
        const result = await getLicensed();
        licensedData.value = result;
    } catch (error: any) {
        message.error(error.message);
    } finally {
    }
};
onMounted( async () => {
    await configStore.updateConfig();
    await _getLicensed()
});
</script>

<style lang="less" scoped>
.login-page-left {
    background: url("@/style/images/login-page-bg.png") center;
    background-size: cover;
    flex: 1.5;
    position: relative;
    height: 100%;
}
@media only screen and (max-width: 767px) {
    .page-container {
        flex-wrap: wrap;
        display: block;
        .login-page-left {
            height: 80px;
            background: #fff;
            padding-top: 20px;
            text-align: center;
            img {
                height: 50px;
            }
        }
    }
}
</style>
