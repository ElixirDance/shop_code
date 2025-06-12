<template>
    <div class="page-top">
        <div class="page-top-warp">
            <div class="top-bar-right">
                <div class="top-bar-item mr10">
                    <div class="auth-img">
                        <router-link v-if="adminType !== 'shop'" :to="{ path: '/setting/licensed/index' }">
                            <img :src="isShowAvatar()" style="height: 25px; margin-top: 2px" />
                        </router-link>
                    </div>
                </div>
                <MsgCount></MsgCount>
                <div class="top-bar-item openShop-btn">
                    <a class="top-bar-btn" :href="urlFormat('/')" target="_blank"
                        ><i class="iconfont icon-guanli"></i><span v-if="themeInfo.layout !== 'top'">查看店铺</span></a
                    >
                </div>
                <div class="top-bar-item top-bar-user" id="dropdown-memu">
                    <a-dropdown>
                        <div class="admin-user-warp">
                            <a class="top-bar-btn" href="javascript:;">
                                <span class="admin-user-photo" v-if="adminType!=='shop'">
                                    <template v-if="extractContent(String(userInfo.avatar))=='def'">
                                        <img :src="returnAvatar(userInfo.avatar)" />
                                    </template>
                                    <template v-else>
                                        <img :src="imageFormat(userInfo.avatar)" />
                                    </template>
                                </span>
                                <span class="admin-user-photo" v-if="adminType=='shop'">
                                    <template v-if="extractContent(String(shopInfo.shopLogo))=='def'">
                                        <img :src="returnAvatar(shopInfo.shopLogo)" />
                                    </template>
                                    <template v-else>
                                        <img :src="imageFormat(shopInfo.shopLogo)" />
                                    </template>
                                </span>
                                <div class="admin-user-name" v-if="themeInfo.layout !== 'top'">
                                    {{ /^1[3-9]\d{9}$/.test(userInfo.username) ? userInfo.username.replace(/(\d{3})\d{4}/, "$1****") : userInfo.username }}
                                </div>
                                <i class="iconfont icon-xiala"></i>
                            </a>
                        </div>
                        <template #overlay>
                            <div class="dropdown-memu top-bar-memu">
                                <div class="entrance-list">
                                    <router-link :to="{ path: '/authority/account_editing/index' }">
                                        <p class="entrance lyecs-openPage">
                                            <i class="iconfont icon-gerenshezhi" style="font-size: 22px"></i>
                                            <span>管理账号</span>
                                        </p>
                                    </router-link>
                                    <p class="entrance" @click="clearCache">
                                        <i class="iconfont icon-qingchuhuancun" style="font-size: 22px"></i>
                                        <span>清除缓存</span>
                                    </p>
                                    <router-link v-if="adminType === 'shop'" :to="{ path: '/merchant_setting/shop_team' }">
                                        <p class="entrance lyecs-openPage">
                                            <i class="iconfont icon-quanxian" style="font-size: 22px"></i>
                                            <span>店铺设置</span>
                                        </p>
                                    </router-link>
                                    <router-link v-else :to="{ path: '/setting/config/base' }">
                                        <p class="entrance lyecs-openPage">
                                            <i class="iconfont icon-quanxian" style="font-size: 22px"></i>
                                            <span>后台设置</span>
                                        </p>
                                    </router-link>
                                </div>
                                <div>
                                    <div class="admin_exit">
                                        <template v-if="adminType === 'shop'">
                                            <a @click="switchShop"><span>切换店铺</span></a>
                                            <span style="color: #f0f2f5">｜</span>
                                        </template>
                                        <a @click="onLogout"><span>退出登录</span></a>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </a-dropdown>
                </div>
            </div>
        </div>
    </div>
    <el-dialog class="page-top" :show-close="false" :z-index="12" v-model="dialogVisible" width="500px">
        <SelectShop v-if="dialogVisible" @closePopup="closePopup" :isIndex="true" :username="userInfo.username"></SelectShop>
    </el-dialog>
</template>
<script setup lang="ts">
import { isShowAvatar } from "@/utils/authorize";
import { ref, reactive, computed, onMounted } from "vue";
import { useUserStore } from "@/store/user";
import { useConfigStore } from "@/store/config";
import { useMenusStore } from "@/store/menu";
import { useCategoryStore } from "@/store/category";
import { useLicensedStore } from "@/store/licensed";
import { notification } from "ant-design-vue";
import { urlFormat, imageFormat } from "@/utils/format";
import { Search } from "@element-plus/icons-vue";
import { getSearchMenu } from "@/api/panel/adminMsg";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { extractContent, getAssetsFile } from "@/utils/util";
import { Image } from "@/components/image";
import { cleanUp } from "@/api/common/common";
import { ClickOutside as vClickOutside } from "element-plus";
import SelectShop from "@/components/merchant/SelectShop.vue";
import { updateMenu } from "@/utils/menus";
import type { MainMenu } from "@/types/common/common.d";
import { returnAvatar } from "@/utils/avatar";
import MsgCount from "../../../src/MsgCount.vue";
const adminType = ref(localStorage.getItem("adminType"));
import { useThemeStore } from "@/store/theme";
const { themeInfo } = useThemeStore();
const router = useRouter();
//用来判断版权logo的
const licensedStore = useLicensedStore();
const menusStore = useMenusStore();


const { logout, updateUserInfo } = useUserStore();
const userInfo = computed(() => useUserStore().userInfo);
const shopInfo = computed(() => useUserStore().shopInfo);
// 清除缓存
const clearCache = async () => {
    try {
        const result = await cleanUp();
        const configStore = useConfigStore();
        // 更新后台设置项
        updateUserInfo();
        configStore.updateConfig();
        menusStore.mainMenu = (await updateMenu()) as MainMenu[];
        notification["success"]({
            message: "缓存已清除",
            description: "缓存清除后可刷新页面更新效果"
        });
    } catch (error: any) {
        message.error(error.message);
    }
};
const onLogout = async () => {
    logout();
};
const dialogVisible = ref(false);
const switchShop = () => {
    dialogVisible.value = true;
};
const closePopup = () => {
    dialogVisible.value = false;
};
//预览图片
onMounted(() => {
    licensedStore._getLicensed();
});
</script>
<style lang="less" scoped>
.page-top {
    clear: both;
    font-size: 12px;
    height: 48px;
    width: 250px;
}

.page-top-warp {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.dis_block {
    display: block;
}

.dropdown-memu {
    background-color: var(--tig-menu-bg);
    color: var(--tig-menu-text-color);
    box-shadow:
        0 6px 16px 0 rgba(0, 0, 0, 0.08),
        0 3px 6px -4px rgba(0, 0, 0, 0.12),
        0 9px 28px 8px rgba(0, 0, 0, 0.05);
    font-size: 12px;
    border-radius: 9px;
    position: relative;
    top: -5px;
}

.dropdown-memu .entrance-list {
    margin: 8px 0;
    overflow: hidden;
    padding: 8px 15px;
    width: 240px;
    display: flex;
    align-items: center;
}

.dropdown-memu .entrance-list p {
    border-radius: 2px;
    color: var(--tig-menu-text-color);
    height: 80px;
    text-align: center;
    width: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.dropdown-memu .entrance-list p:hover {
    background: var(--tig-menu-active-bg);
}

.dropdown-memu .entrance-list .page-top i {
    color: #788d9b;
    display: block;
    font-size: 20px;
    height: 40px;
    line-height: 40px;
    margin: 8px auto 4px;
    width: 40px;
    display: block;
}

.dropdown-memu .admin_exit {
    border-top: 1px solid #f5f5f5;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dropdown-memu .admin_exit a {
    line-height: 40px;
    padding: 0 10px;
    flex: 1;
    text-align: center;
    color: var(--tig-menu-text-color);
}

.page-top .more-memu {
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    position: absolute;
    font-size: 18px;
    width: 202px;
    padding: 0;
    display: none;
}

.page-top .more-memu a {
    display: block;
    float: left;
    width: 100px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    font-size: 12px;
    border-right: 1px solid #f1f1f1;
}

.page-top .more-memu a.odd {
    border-right: 0;
    width: 101px;
}

.page-top .more-memu a:hover {
    background: #f64747;
    color: #fff;
}

.search-menu-con {
    right: auto !important;
    left: 30px !important;
    top: 40px;
    background-clip: padding-box;
    background-color: #ffffff;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.12);
    font-size: 12px;
    position: absolute;
    border-radius: 9px;
}

.search-menu-con .empty {
    padding: 0;
}

.search-menu-con .search-menu-title {
    padding: 20px 20px 0 20px;
    color: #333;
}

.search-menu-con .search-menu-list {
    padding: 20px;
    width: 350px;
    display: flex;
    flex-wrap: wrap;
}

.search-menu-con .search-menu-list .menu-item {
    margin: 0 12px 12px 0;
    padding: 10px 18px;
    border-radius: 9px;
    background: #f7f8fa;
    cursor: pointer;
    display: inline-block;
    color: #666;
    font-size: 13px;
}
.search-menu-con .search-menu-list .menu-item a {
    color: #666;
}

.top-bar-left {
    display: flex;
    position: relative;
}

.top-bar-right {
    float: right;
    display: flex;
    align-items: center;
}

.top-bar-item {
    position: relative;
    display: flex;
    align-items: center;
}

.top-bar-item .top-bar-btn {
    display: block;
    height: 40px;
    padding: 0 5px;
    margin-right: 0px;
    font-size: 14px;
    color: var(--tig-menu-text-color);
    text-align: center;
    transition:
        background 0.2s ease 0s,
        color 0.2s ease 0s;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    position: relative;
}

.top-bar-item .top-bar-btn:hover {
    background: var(--tig-menu-active-bg);
}

.top-bar-item .top-bar-btn .admin-user-photo img {
    width: 26px;
    height: 26px;
    border-radius: 26px;
}

.top-bar-item .top-bar-btn i {
    padding: 0 3px;
    font-size: 18px;
}

.top-bar-item .top-bar-btn i.fs-18 {
    font-size: 18px;
}

.top-bar-item .top-bar-btn .noc_count {
    background: #ff9900;
    padding: 4px 7px;
    border-radius: 6px;
    vertical-align: top;
    margin-left: 4px;
}

.top-bar-item .top-bar-btn .admin_msg-count {
    position: absolute;
    right: 58px;
    top: 5px;
    font-size: 12px;
    color: #fff;
    background-color: #f33;
    line-height: 14px;
    padding: 0 5px;
    border-radius: 8px;
    border: 1px solid #fff;
}

.top-bar-user {
    .admin-user-name {
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        word-break: keep-all;
        max-width: 100px;
    }
}
</style>
<style>
body .page-top .el-dialog__header {
    display: none;
}
</style>
