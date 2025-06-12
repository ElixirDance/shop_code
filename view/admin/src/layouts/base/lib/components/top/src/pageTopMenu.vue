<template>
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
            <div class="menu_list" :class="themeInfo.navTheme">
                <div style="width: 100%; position: absolute">
                    <el-menu
                        :default-active="authoritySn"
                        mode="horizontal"
                        :popper-class="'el-top-menu-popper ' + (themeInfo.navTheme === 'light' ? 'popper-light' : 'popper-dark')"
                        ellipsis
                        text-color="var(--tig-menu-text-color)"
                    >
                        <template v-for="item in menus" :key="item.authorityId">
                            <el-sub-menu class="" v-if="item.children.length && item.isShow" :index="item.authoritySn">
                                <template #title>
                                    <i :class="item.authorityIco + ' child-ico'"></i>
                                    <span>{{ item.authorityName }}</span>
                                </template>
                                <template v-for="child in item.children">
                                    <el-sub-menu v-if="child.children && child.children.length && child.isShow" :index="child.authoritySn">
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
                                    <el-menu-item v-else-if="child.isShow" :index="child.authoritySn" @click="actionPush(child)">
                                        <template #title>
                                            <span>{{ child.authorityName }}</span>
                                        </template>
                                    </el-menu-item>
                                </template>
                            </el-sub-menu>
                            <el-menu-item v-else-if="item.isShow" :index="item.authoritySn" @click="actionPush(item)">
                                <template #title>
                                    <i :class="item.authorityIco + 'child-ico'"></i>
                                    <span>{{ item.authorityName }}</span>
                                </template>
                            </el-menu-item>
                        </template>
                    </el-menu>
                </div>
            </div>
            <div class="fold_btn">
                <pageTopBar></pageTopBar>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import pageTopBar from "./pageTopBar.vue";
import { ref, watchEffect, onMounted, nextTick, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useMenusStore } from "@/store/menu";
import type { MainMenu } from "@/types/common/common.d";
import { useLicensedStore } from "@/store/licensed";
import { imageFormat } from "@/utils/format";
import logoWhite from "@/style/images/logo_white.png";
import logoBlue from "@/style/images/logo_blue2.png";
import logoMini from "@/style/images/logo_mini.png";
import { Fold } from "@element-plus/icons-vue";
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
    width: 100vw;
    height: 48px;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.12);
    transition:
        background 0.3s,
        width 0.2s;
    background-color: var(--tig-menu-bg);
    overflow: hidden;
    .page_left_menu_content {
        display: flex;
        flex-wrap: nowrap;
        .head_logo {
            width: 100px;
            padding-right: 20px;
            padding-left: 20px;
            display: flex;
            flex-shrink: 0;
            align-items: center;
            .logo_img {
                max-height: 40px;
                max-width: 100%;
                display: block;
            }
        }
        .fold_btn {
            flex-shrink: 0;
            padding-right: 20px;
        }
        .menu_list {
            flex-grow: 1;
            position: relative;
            :deep(.el-menu--horizontal) {
                height: 48px;
                .el-sub-menu__title {
                    padding: 0 16px;
                }
            }
            :deep(.el-sub-menu .el-sub-menu__icon-arrow) {
                display: none;
            }
            :deep(.el-menu--horizontal.el-menu) {
                border: none !important;
            }
            :deep(.el-menu--horizontal > .el-sub-menu.is-active .el-sub-menu__title) {
                border-bottom: none;
            }
            :deep(.el-menu--horizontal > .el-sub-menu .el-sub-menu__title) {
                border-bottom: none;
            }
            :deep(.el-sub-menu__title) {
                height: 48px;
            }

            :deep(.el-menu) {
                .el-sub-menu {
                    .el-sub-menu__title {
                        color: var(--tig-menu-text-color);
                        height: 48px;
                        font-size: 14px;
                        -webkit-font-smoothing: initial;
                        i {
                            font-size: 18px;
                            margin-right: 10px;
                        }
                    }
                    &:hover {
                        .el-sub-menu__title {
                            color: var(--tig-primary);
                            i {
                                color: var(--tig-primary) !important;
                            }
                        }
                    }
                    &.is-active {
                        .el-sub-menu__title {
                            color: var(--tig-primary) !important;
                            background-color: var(--tig-menu-active-bg) !important;
                            i {
                                color: var(--tig-primary) !important;
                            }
                        }
                    }
                }
            }
            &.dark {
                :deep(.el-menu) {
                    background-color: var(--tig-menu-bg);
                    .el-sub-menu {
                        .el-sub-menu__title {
                            color: rgba(255, 255, 255, 0.65);
                        }
                        &:hover {
                            .el-sub-menu__title {
                                background-color: transparent !important;
                                color: #fff;
                                i {
                                    color: #fff !important;
                                }
                            }
                        }
                        &.is-active {
                            .el-sub-menu__title {
                                color: #fff !important;
                                background-color: var(--tig-menu-active-bg) !important;
                                i {
                                    color: #fff !important;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>

<style lang="less">
.el-top-menu-popper {
    border-radius: 9px !important;
    -webkit-font-smoothing: inherit;
    .el-menu--popup {
        border-radius: 8px;
        padding: 10px;
        .el-menu-item,
        .el-sub-menu {
            padding: 0;
            font-size: 14px;
            height: 40px;
            line-height: 40px;
            padding-left: 16px;
            padding-right: 0;
            border-radius: 4px;
            .el-sub-menu__title {
                font-size: 14px;
                padding-left: 0;
                padding-right: 0;
                background-color: transparent;
                .el-sub-menu__icon-arrow {
                }
            }
            &:hover {
                color: var(--tig-primary);
                background-color: transparent;
            }
            &.is-active {
                color: var(--tig-primary);
                background-color: var(--tig-menu-active-bg);
            }
        }
    }
    &.popper-dark {
        .el-menu--popup {
            background-color: var(--tig-menu-bg);
            .el-menu-item,
            .el-sub-menu {
                color: rgba(255, 255, 255, 0.65);
                background-color: var(--tig-menu-bg);
                .el-sub-menu__title {
                    color: rgba(255, 255, 255, 0.65);
                }
                &:hover {
                    color: #fff;
                    background-color: transparent;
                    .el-sub-menu__title {
                        color: #fff;
                    }
                }
                &.is-active {
                    color: #fff;
                    background-color: var(--tig-menu-active-bg);
                    .el-sub-menu__title {
                        color: #fff;
                        .el-sub-menu__icon-arrow {
                        }
                    }
                }
            }
        }
    }
    .child-ico {
        margin-right: 5px;
    }
}
</style>
