<template>
    <div class="flex base-content" :class="themeInfo.layout !== 'default' ? `admin-${themeInfo.navTheme}` : ''">
        <div class="main-content" :style="{ marginTop: headerHeight, height: `calc(100vh - ${headerHeight})` }">
            <div class="flex" style="height: 100%">
                <perfect-scrollbar class="left-menu" :options="{ suppressScrollX: true }">
                    <LeftMenu></LeftMenu>
                </perfect-scrollbar>
                <perfect-scrollbar class="content" id="scrollContainer" :options="{ suppressScrollX: true }">
                    <pageHeader></pageHeader>
                    <router-view></router-view>
                    <pageFooter></pageFooter>
                </perfect-scrollbar>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { useThemeStore } from "@/store/theme";
const { themeInfo } = useThemeStore();
import LeftMenu from "./src/LeftMenu.vue";
import pageFooter from "@/layouts/base/lib/pageFooter.vue";
import pageHeader from "@/layouts/base/lib/pageHeader.vue";
const headerHeight = ref(""); // 顶部容器高度
watch(
    themeInfo,
    () => {
        headerHeight.value = `${themeInfo.isMultiLabel ? 111 : 60}px`;
    },
    { immediate: true }
);
</script>
<style lang="less" scoped>
.base-content {
    .main-content {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        box-sizing: border-box;
        background-color: #ffffff;
        z-index: 999;
        .left-menu {
            overflow: hidden;
            background-color: #fff;
            padding: 15px 10px 10px;
        }
        .content {
            flex: 1;
            padding-right: 30px;
            background-color: #fff;
            border-left: 1px solid #eee;
            :deep(.el-input__wrapper){
                max-width: 350px !important;
                .el-input__inner{
                    flex-grow: 0;
                }
            }
            :deep(.el-select){
                max-width: 363px !important;
            }
            :deep(.el-textarea){
                max-width: 370px !important;
                min-width: 370px !important;
            }
            :deep(.el-input-group){
                max-width: 370px !important;
            }
        }
    }
}
.admin-dark {
    .main-content {
        background-color: #f2f4f7;
    }
}

</style>
