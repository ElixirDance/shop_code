<template>
    <div class="body-menu-mask" v-if="menusStore.childMenuShow" @click="menusStore.childMenuShow = !menusStore.childMenuShow"></div>
    <div class="page_left_menu" :class="[menusStore.childMenuShow ? 'child-menu-show' : 'child-menu-hide']">
        <div class="page_left_menu_content">
            <div class="head_logo" v-if="menusStore.childMenuShow">
                <img
                    v-if="themeInfo.navTheme === 'light'"
                    class="logo_img"
                    :src="(licensedData.adminLightLogo && licensedData.adminLightLogo !== null) ? imageFormat(licensedData.adminLightLogo) : logoBlue"
                />
                <img
                    v-if="themeInfo.navTheme === 'dark'"
                    class="logo_img"
                    :src="(licensedData.adminLightLogo && licensedData.adminLightLogo !== null) ? imageFormat(licensedData.adminLightLogo) : logoWhite"
                />
            </div>
            <div class="head_logo" v-else>
                <img
                    v-if="themeInfo.navTheme === 'light'"
                    class="logo_img_mini"
                    :src="(licensedData.adminLightLogo && licensedData.adminLightLogo !== null) ? imageFormat(licensedData.adminLightLogo) : logoMini"
                />
                <img
                    v-if="themeInfo.navTheme === 'dark'"
                    class="logo_img_mini"
                    :src="(licensedData.adminLightLogo && licensedData.adminLightLogo !== null) ? imageFormat(licensedData.adminLightLogo) : logoMiniWhite"
                />
            </div>
            <perfect-scrollbar class="main-menu">
                <div class="menu_list" :class="themeInfo.navTheme" ref="menu">
                    <el-menu :default-active="authoritySn" :collapse="!menusStore.childMenuShow" :unique-opened="themeInfo.uniqueOpened">
                        <template v-for="item in menus" :key="item.authorityId">
                            <el-sub-menu v-if="item.children.length && item.isShow" :index="item.authoritySn">
                                <template #title>
                                    <i :class="item.authorityIco"></i>
                                    <span>{{ item.authorityName }}</span>
                                </template>
                                <template v-for="child in item.children">
                                    <el-sub-menu class="sub-menu-2" v-if="child.children && child.children.length && child.isShow" :index="child.authoritySn">
                                        <template #title>
                                            <span>{{ child.authorityName }}</span>
                                        </template>
                                        <template v-for="grandchild in child.children" :key="grandchild.authorityId">
                                            <el-menu-item :index="grandchild.authoritySn" @click="actionPush(grandchild)">
                                                <template #title>
                                                    <span>{{ grandchild.authorityName }}</span>
                                                </template>
                                            </el-menu-item>
                                        </template>
                                    </el-sub-menu>
                                    <el-menu-item class="sub-menu-2" v-else-if="child.isShow" :index="child.authoritySn" @click="actionPush(child)">
                                        <template #title>
                                            <span>{{ child.authorityName }}</span>
                                        </template>
                                    </el-menu-item>
                                </template>
                            </el-sub-menu>
                            <el-menu-item v-else-if="item.isShow" :index="item.authoritySn" @click="actionPush(item)">
                                <template #title>
                                    <i :class="item.authorityIco"></i>
                                    <span>{{ item.authorityName }}</span>
                                </template>
                            </el-menu-item>
                        </template>
                    </el-menu>
                </div>
            </perfect-scrollbar>

            <div class="icon_menu" @click="menusStore.childMenuShow = !menusStore.childMenuShow">
                <i class="open-menu-btn icon-zhankai iconfont"></i>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, watchEffect, onMounted, nextTick, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useMenusStore } from "@/store/menu";
import type { MainMenu } from "@/types/common/common.d";
import { useLicensedStore } from "@/store/licensed";
import { imageFormat } from "@/utils/format";
import logoWhite from "@/style/images/logo_white.png";
import logoBlue from "@/style/images/logo_blue2.png";
import logoMini from "@/style/images/logo_mini.png";
import logoMiniWhite from "@/style/images/logo_mini_white.png";
import { useThemeStore } from "@/store/theme";
const { themeInfo } = useThemeStore();
const licensedStore = useLicensedStore();
const licensedData = licensedStore.licensedData;
const menusStore = useMenusStore();
// 路由
const router = useRouter();
const store = useMenusStore();
const authoritySn = ref<any>("");
// 菜单
const menus = computed<MainMenu[]>(() => store.mainMenu as MainMenu[]);
onMounted(() => {
    authoritySn.value = router.currentRoute.value.name;
});
// 跳转页面
const actionPush = (menu: any) => {
    if (window.innerWidth <= 756) {
        if (!menu.blank) {
            router.push("/" + menu.routeLink);
        } else {
            window.open("/" + menu.routeLink, "_blank");
        }
        menusStore.menuActive = false;
    } else {
        if (!menu.blank) {
            router.push("/" + menu.routeLink);
        } else {
            window.open("/" + menu.routeLink, "_blank");
        }
        nextTick();
        menusStore.childMenuShow = true;
    }
};
interface Permission {
    authorityId: number;
    isShow: number;
    authoritySn: string;
    authorityName: string;
    parentId: number;
    authorityIco: string;
    routeLink: string;
    childAuth: Array<{ authName: string; authSn: string }>;
    children?: Permission[];
    current?: boolean;
}
const findAuthoritySnByRoute = (permissions: Permission[], currentPath: any): string => {
    // 确保后面的 routeLink 在比较时包含正确的前导 /
    // 如果 currentPath 不以 / 开头，添加 /
    if (!currentPath.startsWith("/")) {
        currentPath = "/" + currentPath;
    }
    for (const permission of permissions) {
        // 检查当前权限的 routeLink 是否与当前路径匹配
        const fullRouteLink = "/" + permission.routeLink; // 添加前导 /
        if (fullRouteLink === currentPath) {
            return permission.authoritySn;
        }
        // 如果有子权限，则递归查找
        if (permission.children && permission.children.length > 0) {
            const authoritySn = findAuthoritySnByRoute(permission.children, currentPath);
            if (authoritySn) {
                return authoritySn; // 找到匹配的 authoritySn
            }
        }
    }
    return "";
};
// 监听路由的变化
watchEffect(() => {
    authoritySn.value = router.currentRoute.value.name;
});
</script>
<style lang="less" scoped>
.page_left_menu {
    width: 208px;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    box-shadow: 2px 0 8px rgba(29, 35, 41, 0.05);
    background-color: var(--tig-menu-bg);
    overflow: hidden;
    .page_left_menu_content {
        height: 100%;
        width: 100%;
        position: relative;
        -webkit-font-smoothing: initial;
        .head_logo {
            width: 100%;
            .logo_img {
                width: 120px;
                margin: 15px 0px 10px 11px;
            }
            .logo_img_mini {
                width: 27px;
                margin-left: 11px;
                margin-top: 16px;
            }
        }
        .main-menu {
            height: calc(100% - 105px);
            i {
                font-size: 18px;
                margin-right: 15px;
                color: var(--tig-menu-text-color);
            }
        }
        :deep(.el-sub-menu) {
            & > .el-menu {
                padding: 5px;
            }
            .el-sub-menu__title {
                &:hover {
                    background-color: transparent;
                }
            }
        }
        .light {
            &::-webkit-scrollbar-thumb {
                background: #ccccce;
                border-radius: 3px;
                -webkit-box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.05);
            }
            &::-webkit-scrollbar-track {
                background: #ededed;
                border-radius: 3px;
                -webkit-box-shadow: inset 0 0 5px rgba(37, 37, 37, 0.05);
            }
            :deep(.el-menu-item) {
                &:hover {
                    color: var(--tig-primary);
                    background-color: transparent;
                }
                &.is-active {
                    color: var(--tig-menu-text-color);
                    background-color: var(--tig-menu-active-bg);
                }
            }
            :deep(.el-menu-item.is-active) {
                color: var(--tig-primary);
            }
            :deep(.el-sub-menu.is-active) {
                .el-sub-menu__title {
                    color: var(--tig-primary);
                    i {
                        color: var(--tig-primary);
                    }
                }
                .el-sub-menu {
                    .el-sub-menu__title {
                        color: var(--tig-menu-text-color);
                        i {
                            color: var(--tig-menu-text-color);
                        }
                    }
                }
                .el-sub-menu.is-active {
                    .el-sub-menu__title {
                        color: var(--tig-primary);
                        i {
                            color: var(--tig-primary);
                        }
                    }
                }
            }
            :deep(.el-sub-menu) {
                & > .el-menu {
                    background-color: rgba(0, 0, 0, 0.02);
                }
            }
        }
        .dark {
            &::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
                -webkit-box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.05);
            }
            &::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 3px;
                -webkit-box-shadow: inset 0 0 5px rgba(37, 37, 37, 0.05);
            }
            :deep(.el-menu-item) {
                color: rgba(255, 255, 255, 0.65);
                &:hover {
                    color: #fff;
                    background-color: transparent;
                }
                &.is-active {
                    color: var(--tig-menu-text-color);
                    background-color: var(--tig-menu-active-bg);
                }
            }
            :deep(.el-sub-menu) {
                & > .el-menu {
                    background-color: #000c17;
                }
            }
        }
        :deep(.el-menu) {
            border-right: none;
            background-color: rgba(0, 0, 0, 0);
            display: flex;
            flex-direction: column;
            gap: 5px;
            box-sizing: border-box;
        }
        :deep(.el-sub-menu__title) {
            color: var(--tig-menu-text-color);
            height: 50px;
            font-size: 14px;
            -webkit-font-smoothing: initial;
            i {
                margin-left: -5px;
            }
        }
        :deep(.el-menu-item) {
            border-radius: 5px;
            height: 40px;
            font-size: 14px;
            &.is-active {
                color: #fff;
                background-color: var(--tig-menu-active-bg);
            }
        }
        .icon_menu {
            width: 208px;
            height: 48px;
            position: absolute;
            bottom: 0px;
            left: 0;
            display: flex;
            align-items: center;
            i {
                color: var(--tig-menu-text-color);
                margin-left: 16px;
            }
            &:hover {
                background-color: var(--tig-menu-active-bg);
            }
        }
    }
}
// .child-menu-show {
//     transition: all 0.3s;
//     width: 208px;
// }
// .child-menu-hide {
//     transition: all 0.3s;
//     width: 48px;
// }
.child-menu-show {
    transition:
        width 0.3s,
        opacity 0.3s;
    width: 208px;
}
.child-menu-hide {
    transition:
        width 0.3s,
        opacity 0.3s;
    width: 48px;
}
@media only screen and (max-width: 756px) {
    .page_left_menu {
        z-index: 1999;
        .icon_menu {
            display: none !important;
        }
    }
    .body-menu-mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1998;
    }
    .child-menu-show {
        transition: all 0.2s;
        width: 208px;
    }
    .child-menu-hide {
        transition: all 0.2s;
        width: 0px;
        .head_logo {
            display: none;
        }
    }
}
</style>
