<template>
    <div class="body-menu-mask" v-if="menusStore.childMenuShow" @click="menusStore.childMenuShow = !menusStore.childMenuShow"></div>
    <div class="page_left_menu" :class="[menusStore.childMenuShow ? 'child-menu-show' : 'child-menu-hide']">
        <div class="page_left_menu_content">
            <perfect-scrollbar class="main-menu">
                <div class="menu_list" ref="menu">
                    <el-menu :default-active="authoritySn" :collapse="!menusStore.childMenuShow" :unique-opened="themeInfo.uniqueOpened">
                        <template v-for="item in menus" :key="item.authorityId">
                            <!-- 渲染子菜单 -->
                            <el-sub-menu v-if="item.children.length && item.isShow" :index="item.authoritySn">
                                <template #title>
                                    <i :class="item.authorityIco"></i>
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
                            <!-- 渲染普通菜单项 -->
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
    // height: 100vh;
    height: calc(100vh - 60px);
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 100;
    box-shadow: 2px 0 8px rgba(29, 35, 41, 0.05);
    background-color: #ffffff;
    overflow: hidden;
    .page_left_menu_content {
        height: 100%;
        width: 100%;
        position: relative;
        -webkit-font-smoothing: initial;
        .main-menu {
            height: calc(100% - 50px);
            // flex: 1 1 0%;
            // overflow: hidden auto;
            // box-sizing: border-box;
            // &::-webkit-scrollbar {
            //     width: 6px;
            //     height: 6px;
            // }
            // &::-webkit-scrollbar-thumb {
            //     background: #ccccce;
            //     border-radius: 3px;
            //     -webkit-box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.05);
            // }
            // &::-webkit-scrollbar-track {
            //     background: #ededed;
            //     border-radius: 3px;
            //     -webkit-box-shadow: inset 0 0 5px rgba(37, 37, 37, 0.05);
            // }
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
                        color: #000000e0;
                        i {
                            color: #000000e0;
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
            i {
                font-size: 18px;
                margin-right: 15px;
                color: #000000e0;
            }
        }
        :deep(.el-menu) {
            border-right: none;
            background-color: rgba(0, 0, 0, 0);
        }
        :deep(.el-sub-menu__title) {
            color: #000000e0;
            font-size: 14px;
            height: 50px;
            -webkit-font-smoothing: initial;
            i {
                margin-left: -5px;
            }
        }
        :deep(.el-menu) {
            .el-menu {
                .el-sub-menu .el-sub-menu__title {
                    padding-left: 40px;
                    height: 40px;
                    margin: 5px;
                    border-radius: 5px;
                }
            }
        }
        :deep(.el-sub-menu .el-sub-menu__title) {
            &:hover {
                background-color: var(--tig-item-active-bg);
            }
        }
        :deep(.el-menu-item) {
            margin: 5px;
            border-radius: 5px;
            height: 40px;
            color: #000000e0;
            font-size: 14px;
            &:hover {
                background-color: var(--tig-item-active-bg);
            }
        }
        :deep(.el-menu-item.is-active) {
            background-color: var(--tig-item-active-bg);
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
                color: #000000e0;
                margin-left: 16px;
            }
            &:hover {
                background-color: var(--tig-item-active-bg);
            }
        }
    }
}
.child-menu-show {
    transition: all 0.2s;
    width: 208px;
}
.child-menu-hide {
    transition: all 0.2s;
    width: 48px;
}
</style>
