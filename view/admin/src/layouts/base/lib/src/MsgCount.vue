<template>
    <div class="top-bar-item top-admin_msg" @click="markAsRead">
        <DialogForm v-bind:is-drawer="false" path="panel/adminMsg/AdminMsg" title="消息中心" :showFooter="false" width="1000px" :bodyStyle="{ padding: 0 }" @callback="fetchMessage">
            <a
                class="top-bar-btn lyecs-dialogPage"
                :style="{ color: themeInfo.layout !== 'default' && themeInfo.layout !== 'side' ? 'var(--tig-menu-text-color)' : '#788d9b' }"
                :class="themeInfo.layout"
            >
                <i class="admin-iconfont icon-tongzhi"></i>
                <span v-if="themeInfo.layout !== 'top'">消息</span>
                <span class="admin_msg-order_count" v-if="message?.orderCount > 0 && themeInfo.layout !== 'top'">新订单 {{ message.orderCount }}</span>
                <em class="admin_msg-count" v-if="useStore.messageCount > 0">{{ useStore.messageCount }}</em>
            </a>
        </DialogForm>
    </div>
    <div class="top-bar-item top-admin_msg" v-if="isMerchant() || isPro()">
        <router-link :to="{ path: '/im/index' }" target="_blank">
            <p
                class="top-bar-btn lyecs-dialogPage"
                :style="{ color: themeInfo.layout !== 'default' && themeInfo.layout !== 'side' ? 'var(--tig-menu-text-color)' : '#788d9b' }"
                :class="themeInfo.layout"
            >
                <i class="iconfont-admin icon-xiaoxi"></i><span v-if="themeInfo.layout !== 'top'">客服</span
                ><em class="admin_msg-count" v-if="message?.imMsgCount > 0">{{ message.imMsgCount }}</em>
            </p>
        </router-link>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { getAdminMsgCount } from "@/api/common/common";
import { DialogForm } from "@/components/dialog";
import { useConfigStore } from "@/store/config";
import { isMerchant, isPro } from "@/utils/version";
import { useThemeStore } from "@/store/theme";
import { useUserStore } from "@/store/user";
const { themeInfo } = useThemeStore();
const useStore = useUserStore();
import dayjs from "dayjs";
const config: any = useConfigStore();
const message = ref<any>(null);
let pollingInterval: any = null;
const fetchMessage = async () => {
    try {
        const response = await getAdminMsgCount({ startTime: localStorage.getItem("lastOpenTime") }); // 替换为你的API端点
        message.value = response;
        useStore.messageCount = response.unreadMsgCount;
    } catch (error) {
        console.error("请求消息失败:", error);
    }
};

const markAsRead = () => {
    message.value.orderCount = 0;
    localStorage.setItem("lastOpenTime", String(dayjs().unix()));
};
const startPolling = () => {
    pollingInterval = setInterval(fetchMessage, 30000); // 每15秒请求一次
};

const stopPolling = () => {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
};

onMounted(() => {
    fetchMessage(); // 组件挂载时立即请求一次
    startPolling(); // 开始轮询
});

onUnmounted(() => {
    stopPolling(); // 组件卸载时停止轮询
});
</script>

<style scoped lang="less">
/* 你的组件样式 */
.top-bar-item {
    position: relative;
    display: flex;
    align-items: center;
}

.top-bar-item .top-bar-btn {
    display: block;
    height: 40px;
    padding: 0 15px;
    font-size: 14px;
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
.default:hover {
    background: #f7f7f7 !important;
}
.top {
    padding: 0px 5px !important;
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
    left: 10px;
    top: 1px;
    font-size: 12px;
    color: #fff;
    background-color: #f33;
    line-height: 14px;
    padding: 0 5px;
    border-radius: 8px;
}
.admin_msg-order_count {
    font-size: 10px;
    color: #fff;
    background-color: #ffb53e;
    line-height: 14px;
    padding: 2px 8px;
    border-radius: 14px;
    margin-left: 5px;
}
@media only screen and (max-width: 767px) {
    .top-bar-item {
        span {
            display: none;
        }
    }
}
</style>
