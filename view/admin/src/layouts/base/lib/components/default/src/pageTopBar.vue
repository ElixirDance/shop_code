<template>
    <div class="page-top" :class="{ 'shop-admin': adminType === 'merchant' }">
        <div class="page-top-warp"  :class="{dark: themeInfo.navTheme === 'dark' }">
            <div class="top-bar-left">
                <div class="top-bar-item wap-show" @click="menusStore.menuActive = !menusStore.menuActive">
                    <span class="open-menu-btn icon-zhankai iconfont"></span>
                </div>
                <div class="top-bar-item wap-show">
                    <a class="wap-refresh-btn icon-shuaxin iconfont" href="javascript:;" onclick="location.reload();"></a>
                </div>
                <div class="top-bar-item wap-show" style="display: none">
                    <a class="wap-openShop-btn icon-wangdianwaibao iconfont" :href="urlFormat('/')" target="_blank"></a>
                </div>
                <div v-if="adminType === 'shop'" class="shop-tit">
                    <h2>
                        当前店铺: {{ shopInfo.shopTitle }}
                    </h2>
                    <div class="label" v-if="shopInfo.status === 0">
                        {{ shopInfo.statusText }}
                    </div>
                    <div class="label green" v-else>
                        {{ shopInfo.statusText }}
                    </div>
                </div>
                <div v-else v-click-outside="onClickOut">
                    <div class="top-bar-item top-bar-search-warp">
                        <div class="top-bar-search">
                            <TigInput
                                v-model="keyword"
                                style="width: 300px"
                                placeholder="在这里查找功能，一键直达"
                                :prefix-icon="Search"
                                @input="onInput"
                                @blur="onBlur"
                            />
                        </div>
                    </div>
                    <div class="search-menu-con" v-show="isShow">
                        <div class="search-menu-title">搜索结果</div>
                        <div class="search-menu-list">
                            <div class="menu-item" v-for="item in searchMenu" @click="toPage(item.routeLink)">
                                <p>{{ item.authorityName }}</p>
                            </div>
                            <div class="empty" v-if="searchMenu.length < 1">没有搜索到栏目！</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="top-bar-right">
                <div class="top-bar-item mr10">
                    <!-- <div class="auth-img">
                        <router-link v-if="adminType!=='shop'" :to="{ path: '/setting/licensed/index' }">
                            <img :src="isShowAvatar()" style="height: 25px;margin-top: 2px;">
                        </router-link>
                    </div> -->
                </div>
                <MsgCount></MsgCount>
                <div class="top-bar-item openShop-btn">
                    <a class="top-bar-btn" :href="urlFormat('/')" target="_blank"><i class="iconfont icon-guanli"></i><span>查看店铺</span></a>
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
                                <div class="admin-user-name">
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
                                    <router-link v-if="adminType==='shop'" :to="{ path: '/merchant_setting/shop_team' }">
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
                                        <template v-if="adminType==='shop'">
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
import { useLicensedStore } from "@/store/licensed"
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
import { useThemeStore } from "@/store/theme";
import { ThemeTogglePopup } from "@/components/themetogglepopup";
const { themeInfo } = useThemeStore();
const adminType = ref(localStorage.getItem("adminType"));
const router = useRouter();
//用来判断版权logo的
const licensedStore = useLicensedStore();
const menusStore = useMenusStore();
interface searchFrom {
    authorityName: string;
    routeLink: string;
}
const keyword = ref("");
const searchMenu = ref<searchFrom[]>([]);
const isShow = ref(false);
const onInput = async (e: any) => {
    try {
        const result: any = await getSearchMenu({ keyword: keyword.value });
        searchMenu.value = result;
        if (keyword.value) {
            isShow.value = true;
        }
    } catch (error: any) {
        message.error(error.message);
    }
};
const toPage = (routeLink: string) => {
    isShow.value = false;
    keyword.value = "";
    searchMenu.value = [];
    router.push({
        path: "/" + routeLink
    });
};
const onBlur = () => {
    if (keyword.value == "") {
        isShow.value = false;
    }
};
const onClickOut = () => {
    isShow.value = false;
};

const { logout, updateUserInfo } = useUserStore();
const userInfo = computed(() => useUserStore().userInfo);
const shopInfo = computed(() => useUserStore().shopInfo);
const unreadMsg = ref(0);
// 清除缓存
const clearCache = async () => {
    try {
        const result = await cleanUp();
        const configStore = useConfigStore();
        // 更新后台设置项
        updateUserInfo();
        configStore.updateConfig();
        menusStore.mainMenu = await updateMenu() as MainMenu[];
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
const switchShop = ()=>{
    dialogVisible.value = true;
}
const closePopup=()=>{
    dialogVisible.value = false;
}
//预览图片
onMounted(() => {
    licensedStore._getLicensed()
})
</script>
<style lang="less" scoped>
.page-top {
    background: #eef2ff;
    clear: both;
    font-size: 12px;
    height: 60px;
    position: fixed;
    top: 0;
    left: 108px;
    right: 0;
    z-index: 100;
    border-bottom: 1px solid #f0f2f5;
    box-sizing: border-box;
}

.page-top-warp {
    background: #fff;
    border-radius: 20px 0 0 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.dark{
    border-radius: 0;
}

.dis_block {
    display: block;
}

.page-top .notice_box {
    background: #fff;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.12);
    position: absolute;
    right: 0;
    width: 200px;
    top: 50px;
    display: none;
    border-radius: 9px;
    padding: 20px 10px;
}

.page-top .notice_box .notice_bar {
    height: 20px;
    line-height: 20px;
    padding: 10px 15px;
    font-size: 14px;
    color: #333;
    font-weight: bold;
}

.page-top .notice_box a {
    line-height: 26px;
    color: #222;
    display: block;
    padding: 7px 15px;
    font-size: 13px;
    border-radius: 5px;
}

.page-top .notice_box a:hover {
    background: rgba(61, 127, 255, 0.06);
}

.page-top .notice_box .noc-warn {
    background: #f9243f;
    width: 19px;
    height: 19px;
    border-radius: 3px;
    position: absolute;
    right: 15px;
    margin-top: 4px;
    text-align: center;
    line-height: 19px;
    color: #333;
}

.page-top .notice_box .notice-arrow {
    border-bottom: 6px solid #fff;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    left: 193px;
    position: absolute;
    top: -6px;
    display: none;
}

.page-top .notice_box .notice_data_null {
    padding: 10px;
    text-align: center;
    font-size: 16px;
}

.dropdown-memu {
    background-color: #ffffff;
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
    color: #333;
    height: 80px;
    text-align: center;
    width: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.dropdown-memu .entrance-list p:hover {
    background: #f5f5f5;
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
    padding: 0 16px;
    margin-right: 10px;
    font-size: 14px;
    color: #788d9b;
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
    background: #f7f7f7;
}

.top-bar-item .top-bar-btn .admin-user-photo img {
    width: 26px;
    height: 26px;
    border-radius: 26px;
    margin-right: 10px;
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

.top-bar-search {
    position: relative;
    margin: 0 0 0 30px;
    :deep(.el-input__wrapper) {
        background: #f2f4f7;
        box-shadow: 0 0 0 1px #f2f4f7 inset;
        border: 1px solid #f2f4f7;
        border-radius: 15px;
        font-size: 13px;
    }
    :deep(.el-input__wrapper.is-focus) {
        box-shadow: 0 0 0 1px var(--tig-primary) inset;
    }
    :deep(.el-input__wrapper i) {
        color: #98a9cc;
        font-size: 14px;
    }
}

.top-bar-search input.top-bar-search-input {
    background: #f2f4f7;
    border: 1px solid #f2f4f7;
    border-radius: 15px;
    padding: 10px;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    padding-left: 30px;
    width: 300px;
}

.top-bar-search i {
    color: #98a9cc;
    position: absolute;
    left: 10px;
    top: 8px;
    font-size: 14px;
}
.wap-show {
    display: none;
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
.shop-tit{
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: end;
    .label{
        display: inline-block;
        padding: 1px 3px;
        color: var(--tig-red-text-color);
        border: 1px solid var(--tig-red-text-color);
        border-radius:2px;
        margin-left: 10px;
    }
    .green{
        color: #53a42b;
        border: 1px solid #53a42b;
    }
}
@media only screen and (max-width: 767px) {
    .page-top {
        left: 0;
        min-width: 100%;
    }
    .wap-show {
        display: block;
    }
    .openShop-btn {
        display: none;
    }
    .open-menu-btn {
        padding: 0 20px;
        display: block;
        line-height: 58px;
        cursor: pointer;
        color: #333;
    }
    .page-top-warp {
        border-radius: 0;
    }
    .page-top-warp .wap-refresh-btn {
        padding: 0 20px;
        display: block;
        line-height: 55px;
        cursor: pointer;
        font-size: 20px;
        color: #333;
    }
    .page-top-warp .wap-openShop-btn {
        padding: 0 20px;
        display: block;
        line-height: 55px;
        cursor: pointer;
        font-size: 20px;
        color: #333;
    }
    .page-top-warp .clearCache-btn {
        display: none;
    }
    .top-bar-search-warp {
        display: none;
    }
    .top-bar-item .top-bar-btn {
        word-break: keep-all;
        margin: 0;
        padding-left: 10px;
    }
    .top-bar-user {
        margin-left: 10px;
        margin-right: 10px;
        .admin-user-name {
            max-width: 60px;
        }
    }
    .shop-tit{
        display: none;
    }
}
.shop-admin {
    &.page-top {
        background-color: #030021;
    }
}

</style>
<style>
body .page-top .el-dialog__header{
    display: none;
}
</style>
