<template>
    <div class="left-menu">
        <template v-for="item in linkList" :key="item.title">
            <div class="item" v-if="item.isShow">
                <div class="tit">
                    {{ item.title }}
                </div>
                <div class="children">
                    <template v-for="child in item.children" :key="child.title">
                        <div class="label" @click="toPage(item.url, child.point)" v-if="child.isShow" :class="{ active: child.point == activeKey }">
                            {{ child.title }}
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { isB2b, isOverseas } from "@/utils/version";
const route = useRoute();
const activeKey = ref(route.query.point || "storeInformation");

onMounted(async () => {
    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("urlchange", handleUrlChange);
});
const router = useRouter();
const toPage = (url: string, point: string) => {
    router.push({ path: url, query: { point } });
    activeKey.value = point
};
function handleUrlChange() {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.get("point"))
    const point = urlParams.get("point");
    if (point) {
        activeKey.value = point || "storeInformation";
    }
}
const linkList = [
    {
        title: "基础设置",
        url: "/setting/config/base/base-basic",
        isShow: true,
        children: [
            {
                title: "店铺信息",
                point: "storeInformation",
                isShow: true
            },
            {
                title: "全局设置",
                point: "globalSettings",
                isShow: true
            },
            {
                title: "备案信息",
                point: "filingInformation",
                isShow: true
            },
            {
                title: "登录注册",
                point: "register",
                isShow: true
            }
        ]
    },
    {
        title: "商品设置",
        url: "/setting/config/base/base-product",
        isShow: true,
        children: [
            {
                title: "基础设置",
                point: "basicProductSettings",
                isShow: true
            },
            {
                title: "显示相关",
                point: "showRelated",
                isShow: true
            },
            {
                title: "其他设置",
                point: "otherSettings",
                isShow: true
            }
        ]
    },
    {
        title: "购物设置",
        url: "/setting/config/base/base-shopping",
        isShow: true,
        children: [
            {
                title: "全局设置",
                point: "globalShoppingSettings",
                isShow: true
            },
            {
                title: "订单设置",
                point: "orderSettings",
                isShow: true
            },
            {
                title: "积分设置",
                point: "pointsSetting",
                isShow: true
            },
            {
                title: "发票设置",
                point: "invoiceSettings",
                isShow: true
            },
            {
                title: "退换货设置",
                point: "returnAndExchangeSettings",
                isShow: true
            }
        ]
    },
    {
        title: "通知设置",
        url: "/setting/config/base/base-notice",
        isShow: true,
        children: [
            {
                title: "短信设置",
                point: "SMSSettings",
                isShow: true
            },
            {
                title: "邮箱通知",
                point: "emailNotification",
                isShow: true
            }
        ]
    },
    {
        title: "显示设置",
        url: "/setting/config/base/base-indicate",
        isShow: true,
        children: [
            {
                title: "通用设置",
                point: "generalSetup",
                isShow: true
            },
            {
                title: "地区设置",
                point: "regionalSettings",
                isShow: true
            },
            {
                title: "分类显示",
                point: "categoryDisplay",
                isShow: true
            }
        ]
    },
    {
        title: "客服设置",
        url: "/setting/config/base/base-service",
        isShow: true,
        children: [
            {
                title: "客服设置",
                point: "customerServiceSettings",
                isShow: true
            },
            {
                title: "客服信息",
                point: "customerServiceInformation",
                isShow: true
            }
        ]
    },
    {
        title: "接口设置",
        url: "/setting/config/base/base-interface",
        isShow: true,
        children: [
            {
                title: "微信公众号",
                point: "weChatofficialaccount",
                isShow: true
            },
            {
                title: "微信小程序",
                point: "weChatMiniProgram",
                isShow: true
            },
            {
                title: "微信APP支付",
                point: "weChatAppPayment",
                isShow: true
            },
            {
                title: "ICO图标",
                point: "ICOicon",
                isShow: true
            },
            {
                title: "存储设置",
                point: "storageSettings",
                isShow: true
            },
            {
                title: "多语言设置",
                point: "multilingualSettings",
                isShow: isOverseas() ? true : false
            }
        ]
    },
    {
        title: "认证设置",
        url: "/setting/config/base/base-authentication",
        isShow: isB2b() ? true : false,
        children: [
            {
                title: "会员认证设置",
                point: "membershipAuthenticationSettings",
                isShow: true
            }
        ]
    }
];

</script>
<style lang="less" scoped>
.left-menu {
    z-index: 99;
    width: 180px;
    .item {
        margin-bottom: 15px;
        border-bottom: 1px solid #f2f2f280;
        .tit {
            color: #999;
            font-size: 12px;
            margin-bottom: 10px;
            padding-left: 8px;
        }
        .children {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-bottom: 10px;
            .label {
                width: 43%;
                padding: 10px 0;
                padding-left: 8px;
                font-size: 12px;
                border-radius: 2px;
                margin-bottom: 5px;
                cursor: pointer;
                &:hover {
                    background-color: var(--tig-item-active-bg);
                    color: var(--tig-primary);
                }
            }
            .active {
                background-color: var(--tig-item-active-bg);
                color: var(--tig-primary);
            }
        }
    }
}
@media only screen and (max-width: 767px) {
    .left-menu {
        width: 90px;
        .item {
            .children {
                .label {
                    width: 90%;
                }
            }
        }
    }
}
</style>
