<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="tit-box">
                <div class="tit">
                    <span>所有店铺总余额: 截止时间: [{{ dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss") }}]</span>
                </div>
            </div>
            <div class="balance-box flex-wrap">
                <div class="label">
                    <div class="title">
                        余额总结余(元)
                        <el-tooltip placement="bottom" effect="light">
                            <template #content>
                                <div class="tooltip-width">可用店铺余额=店铺余额-不可用店铺余额</div>
                            </template>
                            <el-icon><QuestionFilled /></el-icon>
                        </el-tooltip>
                        <router-link :to="{ path: '/shop/shopAccountRaply/list' }">
                            <el-button type="primary" link>提现申请</el-button>
                        </router-link>
                    </div>
                    <div class="num">
                        {{ priceFormat(accountData.shopMoney) || 0.0 }}
                    </div>
                </div>
                <div class="label">
                    <div class="title">
                        待结算总额(元)
                        <el-tooltip placement="bottom" effect="light">
                            <template #content>
                                <div class="tooltip-width">交易未完成的订单总额，消费者确认收货后将自动转入店铺余额</div>
                            </template>
                            <el-icon><QuestionFilled /></el-icon>
                        </el-tooltip>
                    </div>
                    <div class="num">
                        {{ priceFormat(accountData.unSettlementMoney) || 0.0 }}
                    </div>
                </div>
                <div class="label">
                    <div class="title">
                        不可用余额(元)
                        <el-tooltip placement="bottom" effect="light">
                            <template #content>
                                <div class="tooltip-width">提现中或者退款中的冻结店铺余额</div>
                            </template>
                            <el-icon><QuestionFilled /></el-icon>
                        </el-tooltip>
                    </div>
                    <div class="num">
                        {{ priceFormat(accountData.frozenMoney) || 0.0 }}
                    </div>
                </div>
            </div>
            <div class="tit-box">
                <div class="tit">
                    <span>店铺余额排行</span>
                </div>
            </div>
            <div class="lyecs-table-list-warp">
                <div class="table-container">
                    <el-table :data="shopList" :loading="shopLoading" :total="shopTotal" row-key="logId" v-loading="shopLoading">
                        <el-table-column label="店铺名称">
                            <template #default="{ row }">
                                {{ row.shopTitle || "--" }}
                            </template>
                        </el-table-column>
                        <el-table-column label="店铺LOGO">
                            <template #default="{ row }">
                                <Image :src="row.shopLogo" fit="contain" style="height: 25px; width: 60px" />
                            </template>
                        </el-table-column>
                        <el-table-column label="商户名称" :width="200">
                            <template #default="{ row }">
                                <div v-if="row.merchant">
                                    <span>{{ row.merchant.corporateName || "--" }}</span>
                                    <DialogForm
                                        :params="{ act: 'detail', id: row.merchant.merchantId }"
                                        isDrawer
                                        path="adminMerchant/merchant/Info"
                                        title="商户详情"
                                        width="600px"
                                        :showClose="false"
                                        :showOnOk="false"
                                        @okCallback="loadFilter"
                                    >
                                        <a class="btn-link green" v-if="row.merchant.status == 1">(已认证)</a>
                                        <a class="btn-link grey" v-else>(未认证)</a>
                                    </DialogForm>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="店铺余额(元)">
                            <template #default="{ row }">
                                {{ priceFormat(row.shopMoney) || 0.0 }}
                            </template>
                        </el-table-column>
                        <el-table-column label="店铺状态" sortable="custom">
                            <template #default="{ row }">
                                <template v-if="row.status == 10">
                                    <StatusDot color="red" :flicker="true"></StatusDot>
                                </template>
                                <template v-if="row.status == 1">
                                    <StatusDot color="green" :flicker="true"></StatusDot>
                                </template>
                                <span v-if="row.status === 10" style="color: red">{{ row.statusText }}</span>
                                <span v-else-if="row.status === 1" style="color: green">{{ row.statusText }}</span>
                            </template>
                        </el-table-column>
                        <template #empty>
                            <div class="empty-warp">
                                <div v-if="!loading" class="empty-bg">暂无数据</div>
                            </div>
                        </template>
                    </el-table>
                    <div v-if="total > 0" class="pagination-con">
                        <Pagination v-model:page="shopFilterParams.page" v-model:size="shopFilterParams.size" :total="shopTotal" @callback="_getShopList" />
                    </div>
                </div>
            </div>
            <div class="tit-box">
                <div class="tit">
                    <span>最近交易记录</span>
                </div>
            </div>
            <div class="lyecs-table-list-warp">
                <el-tabs type="card" @tab-change="onTabChange">
                    <el-tab-pane v-for="item in orderStatusList" :label="item.label"></el-tab-pane>
                </el-tabs>
                <div class="table-container">
                    <el-table :data="filterState" :loading="loading" :total="total" row-key="logId" v-loading="tableLoading">
                        <el-table-column label="时间" prop="addTime" width="160"></el-table-column>
                        <el-table-column label="购买用户" width="160">
                            <template #default="{ row }">
                                <span>{{ row.user.username }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="订单编号" prop="orderSn" width="160"></el-table-column>

                        <el-table-column label="金额(元)|明细">
                            <template #default="{ row }">
                                <span>总金额: {{ priceFormat(row.totalAmount) || 0.0 }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" prop="orderStatusName" width="120"></el-table-column>
                        <el-table-column label="操作" width="80">
                            <template #default="{ row }">
                                <DialogForm
                                    :params="{ act: 'detail', id: row.orderId }"
                                    :showClose="false"
                                    :showOnOk="false"
                                    :title="'订单详情 ' + row.orderSn"
                                    isDrawer
                                    path="order/order/Info"
                                    width="880px"
                                    @callback="loadFilter"
                                >
                                    <el-button size="small" link type="primary"> 查看详情 </el-button>
                                </DialogForm>
                            </template>
                        </el-table-column>
                        <template #empty>
                            <div class="empty-warp">
                                <div v-if="!loading" class="empty-bg">暂无数据</div>
                            </div>
                        </template>
                    </el-table>
                    <div v-if="total > 0" class="pagination-con">
                        <Pagination v-model:page="filterParams.page" v-model:size="filterParams.size" :total="total" @callback="loadFilter" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import "@/style/css/list.less";
import { onMounted, reactive, ref } from "vue";
import { Pagination } from "@/components/list";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import { Image } from "@/components/image";
import { UserBalanceLogFilterState } from "@/types/finance/userBalanceLog";
import { DialogForm } from "@/components/dialog";
import { QuestionFilled } from "@element-plus/icons-vue";
import { getShopAccount } from "@/api/merchant/capitalfund/dashboard";
import { AccountFormState } from "@/types/merchant/capitalfund/dashboard.d";
import { priceFormat } from "@/utils/format";
import { getOrderList } from "@/api/order/order";
import { OrderFilterParams } from "@/types/order/order.d";
import { getShopList } from "@/api/shop/shop";
import dayjs from "dayjs";

// 基本参数定义
const orderStatusList = reactive([
    { value: -1, label: "全部" },
    { value: 0, label: "待支付" },
    { value: 1, label: "待发货" },
    { value: 2, label: "已发货" },
    { value: 3, label: "已取消" },
    { value: 4, label: "无效" },
    { value: 5, label: "已完成" },
    { value: -2, label: "已删除" },
    { value: 99, label: "待结算" }
]);
const config: any = useConfigStore();
// 基本参数定义
const filterState = ref(<UserBalanceLogFilterState[]>[]);
const loading = ref<boolean>(true);
const shopLoading = ref<boolean>(true);
const tableLoading = ref<boolean>(true);
const total = ref<number>(0);
const displayAmount = ref<boolean>(true);
const filterParams = reactive<OrderFilterParams>({
    //初使化用于查询的参数
    page: 1,
    size: config.get("pageSize"),
    sortField: "",
    sortOrder: "",
    orderStatus: -1,
    isSettlement: 0
});
const accountData = ref<AccountFormState>({
    shopMoney: 0
});
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getShopAccount();
        accountData.value = result;
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};
const shopFilterParams = reactive<OrderFilterParams>({
    //初使化用于查询的参数
    page: 1,
    size: 10,
    sortField: "shopMoney",
    sortOrder: "desc"
});
const shopList = ref<any[]>([]);
const shopTotal = ref<number>(0);
const _getShopList = async () => {
    shopLoading.value = true;
    try {
        const result = await getShopList({ ...shopFilterParams });
        shopList.value = result.records;
        shopTotal.value = result.total;
    } catch (error: any) {
        message.error(error.message);
    } finally {
        shopLoading.value = false;
    }
};
const fetchOrderList = async () => {
    tableLoading.value = true;
    try {
        const result = await getOrderList({ ...filterParams });
        filterState.value = result.records;
        total.value = result.total;
    } catch (error: any) {
        message.error(error.message);
    } finally {
        tableLoading.value = false;
    }
};
onMounted(() => {
    loadFilter();
    fetchOrderList();
    _getShopList();
});
const onTabChange = (e: number) => {
    if (orderStatusList[e].value != 99) {
        filterParams.orderStatus = orderStatusList[e].value;
    } else {
        filterParams.orderStatus = -1;
        filterParams.isSettlement = 0;
    }
    fetchOrderList();
};
</script>
<style lang="less" scoped>
.content_wrapper {
    background-color: #fff;
    padding: 20px;
    .tit-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;
        margin-bottom: 20px;
        .tit {
            border-left: 3px solid #155bd4;
            padding-left: 10px;
            font-size: 14px;
        }
    }
    .balance-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #f5f6fa;
        padding: 10px;
        margin-bottom: 20px;
        font-size: 14px;
        .label {
            padding: 28px;
            .title {
                margin-bottom: 26px;
                display: flex;
                align-items: center;
                :deep(.el-icon) {
                    margin-left: 5px;
                    color: #333;
                }
            }
            .num {
                font-size: 24px;
                font-weight: 500;
            }
        }
    }
    :deep(.el-tabs--card) {
        .el-tabs__header .el-tabs__item {
            background-color: #f5f6fa;
        }
        .el-tabs__header .el-tabs__item.is-active {
            background-color: #fff;
            color: #333;
        }
        .el-tabs__header .el-tabs__nav {
            overflow: hidden;
        }
    }
}
</style>
