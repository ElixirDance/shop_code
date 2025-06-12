<template>
    <div class="select-shop-warp" :class="{ 'have-bor': !isIndex }">
        <div class="warp-info" v-if="!createShopFlag">
            <div class="back-btn">
                <div v-if="!isIndex" class="bark" @click="back()"><i class="iconfont-admin icon-zuojiantou-copy"></i>返回</div>
                <div class="right-item">
                    <el-button v-if="isIndex" @click="createShopFlag = true" type="primary">创建新店铺</el-button>
                </div>
            </div>
            <div class="title-name">
                <div class="left-title">您可以进入以下管理后台</div>
            </div>
            <div class="sub-title-name" v-if="userinfo && userinfo?.username">
                <span>{{ userinfo?.username }}</span>
                已绑定了以下店铺，您可以进入以下任一店铺
            </div>
            <a-spin :spinning="loading" style="width: 100%; margin-top: 100px; height: 200px" />
            <div v-if="!loading && adminType === 'admin'" class="shop-list">
                <div @click="toIndex(0)" class="shop-item" style="border-color: #ffeac7; background-color: #fff4e6; color: #4e4e4e">
                    <div class="left-item">
                        <img class="left-image" src="@/assets/logo/shop_logo_b.png" alt="" />
                        <div class="left-info">
                            <div class="left-title">
                                管理后台 <span v-if="userinfo && userinfo.username && userinfo.username !== ''">（{{ userinfo?.username }}）</span>
                            </div>
                        </div>
                    </div>
                    <div class="right-item">
                        <span class="iconfont-admin icon-login-youjiantou"></span>
                    </div>
                </div>
            </div>
            <div v-if="myShopList.length > 0" class="shop-list shop-list-min-height">
                <div v-if="!loading" @click="toIndex(item.shopId)" v-for="item in myShopList" class="shop-item">
                    <div class="left-item">
                        <el-image class="left-image" :src="shopLogo"></el-image>
                        <div class="left-info">
                            <div class="left-title">{{ item.shopTitle }}</div>
                        </div>
                    </div>
                    <div class="right-item">
                        <span class="iconfont-admin icon-login-youjiantou"></span>
                    </div>
                </div>
            </div>
            <div v-if="!loading && myShopList.length == 0 && adminType != 'admin'" class="shop-list shop-list-min-height">
                <el-empty description="您还没有已绑定的店铺哦～" />
            </div>
        </div>
        <div v-else>
            <el-form label-width="70" ref="formRef" :model="formState" class="demo-ruleForm" status-icon>
                <el-form-item :rules="[{ required: true, message: '店铺名称不能为空!' }]" label="店铺名称" prop="shopTitle">
                    <TigInput classType="tig-form-input" v-model="formState.shopTitle" />
                </el-form-item>
                <el-form-item label="店铺logo" prop="shopLogo">
                    <FormAddGallery v-model:photo="formState.shopLogo"></FormAddGallery>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="onSubmit()"> 创建 </el-button>
                    <el-button @click="createShopFlag = false">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script setup lang="ts">
import shopLogo from "@/assets/logo/shop_logo.png";
import { imageFormat } from "@/utils/format";
import { onMounted, ref, shallowRef } from "vue";
import { createShop, getShopMyShop } from "@/api/merchant/shop";
import { useUserStore } from "@/store/user";
import { useConfigStore } from "@/store/config";
import { useMenusStore } from "@/store/menu";
import { useThemeStore } from "@/store/theme";
import { message, notification } from "ant-design-vue";
import { useRouter } from "vue-router";
import { updateMenu } from "@/utils/menus";
import type { MainMenu } from "@/types/common/common.d";
import { FormAddGallery } from "@/components/gallery";
import { isMerchant, isPro } from "@/utils/version";
import dayjs from "dayjs";
const props = defineProps({
    isIndex: {
        type: Boolean,
        default: false
    },
    selectShopFlag: {
        type: Boolean,
        default: false
    }
});
const formState = ref({
    shopTitle: "",
    shopLogo: ""
});
const formLoading = ref(false);
// 表单通过验证后提交
const onSubmit = async () => {
    await formRef.value.validate();
    try {
        formLoading.value = true;
        const result = await createShop({ ...formState.value });
        message.success("创建成功");
        createShopFlag.value = false;
        await _getShopMyShop();
    } catch (error: any) {
        message.error(error.message);
    } finally {
        formLoading.value = false;
    }
};
const loading = ref(true);
const formRef = shallowRef();
const createShopFlag = ref(false);
const emit = defineEmits(["closePopup", "update:selectShopFlag"]);
const router = useRouter();
const toIndex = async (shopId: number) => {
    localStorage.setItem("shopId", String(shopId));
    if (shopId === 0) {
        localStorage.setItem("adminType", "admin");
    } else {
        localStorage.setItem("adminType", "shop");
    }
    const userStore = useUserStore() as any;
    const configStore = useConfigStore();
    const menusStore = useMenusStore();
    const themeStore = useThemeStore();
    // 更新后台设置项
    userStore.updateUserInfo();
    configStore.updateConfig();
    if (isPro()) {
        themeStore.getThemeInfo();
    }
    notification["success"]({
        message: "登录成功",
        placement: "top",
        duration: 1.5,
        description: "您好，欢迎回来"
    });
    if (props.isIndex) {
        //关闭弹窗
        emit("closePopup");
    }
    // 切换到商铺选择页面
    let mainMenu = (await updateMenu()) as MainMenu[];
    menusStore.mainMenu = mainMenu;
    router.push("/" + (mainMenu ? mainMenu[0].routeLink : "404"));
    localStorage.setItem("lastOpenTime", String(dayjs().unix()));
    setTimeout(() => {
        location.reload();
    }, 500);
};
const { logout } = useUserStore();
const back = () => {
    emit("update:selectShopFlag", false);
    logout();
};
const myShopList = ref<any[]>([]);
const userinfo = ref({
    username: ""
});
const adminType = ref<any>("");
const _getShopMyShop = async () => {
    try {
        loading.value = true;
        const result = await getShopMyShop();
        if (result.shop.records) {
            myShopList.value = result.shop.records;
        }
        if (result.userinfo) {
            userinfo.value = result.userinfo;
        }
    } catch (error: any) {
        // message.error(error.message);
    } finally {
        loading.value = false;
    }
};
onMounted(() => {
    const accessToken = localStorage.getItem("accessToken");
    adminType.value = localStorage.getItem("adminType");
    if (accessToken && isMerchant()) {
        _getShopMyShop();
    } else {
        loading.value = false;
    }
});
</script>
<style scoped lang="less">
.select-shop-warp {
    background-color: #ffffff;
    padding: 20px 30px;
    box-sizing: border-box;

    .warp-info {
        display: flex;
        flex-direction: column;
        gap: 16px;
        .back-btn {
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            .bark {
                display: flex;
                align-items: center;
                font-size: 16px;
                font-weight: 600;
                gap: 2px;
                cursor: pointer;
                i {
                    font-size: 14px;
                    padding-right: 5px;
                }
            }
        }

        .title-name {
            display: flex;
            justify-content: space-between;
            .bark {
                display: flex;
                align-items: center;
                font-size: 14px;
                font-weight: 600;
                gap: 2px;
                cursor: pointer;
            }

            .left-title {
                font-size: 22px;
                font-weight: bold;
            }

            .right-item {
                font-size: 14px;
            }
        }

        .sub-title-name {
            font-size: 14px;
            line-height: 1.5;

            & > span {
                font-weight: bold;
            }
        }

        .shop-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            .shop-item {
                cursor: pointer;
                border: 0.6px solid #e0e0e0;
                padding: 10px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                border-radius: 10px;

                .left-item {
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 14px;

                    .left-image {
                        width: 60px;
                        height: 60px;
                        border-radius: 10px;
                    }

                    .left-info {
                        display: flex;
                        flex-direction: column;
                        gap: 14px;

                        .left-title {
                            font-size: 16px;
                            font-weight: bold;
                        }

                        .left-name {
                            display: flex;
                            align-items: center;
                            font-size: 14px;
                            color: #5b5b5b;
                            font-weight: 500;
                        }
                    }
                }

                .right-item {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
        .shop-list-min-height {
            min-height: 200px;
        }

        .admin-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            .shop-item {
                cursor: pointer;
                border: 0.6px solid #e0e0e0;
                padding: 10px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                border-radius: 10px;

                .left-item {
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 14px;

                    .left-image {
                        width: 60px;
                        height: 60px;
                        border-radius: 10px;
                    }

                    .left-info {
                        display: flex;
                        flex-direction: column;
                        gap: 14px;

                        .left-title {
                            font-size: 16px;
                            font-weight: bold;
                        }

                        .left-name {
                            display: flex;
                            align-items: center;
                            font-size: 14px;
                            color: #5b5b5b;
                            font-weight: 500;
                        }
                    }
                }

                .right-item {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
    }
}

@media only screen and (max-width: 767px) {
    .select-shop-warp {
        padding: 0;
    }
}
</style>
