<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="tit-row flex flex-align-center">
                <h2>核心数据汇总</h2>
                <!-- <el-tooltip placement="bottom-start" effect="light">
                    <template #content>
                        <div style="width: 450px;">
                            <p>今日新增分销员数：	今日新增的分销员，当天清退不会-1</p>
                            <p>今日分销员销售额：	今日新增的分销员订单的实际支付总金额（包含退款的金额）</p>
                            <p>今日成交客户数：	今日成交了分销员订单的客户数量</p>
                            <p>今日支出佣金：	今日已经结算的订单的佣金金额（佣金+邀请奖励）</p>
                            <p>累计分销员数：	总共的分销员数量</p>
                        </div>
                     </template>
                     <el-icon size="18" color="#969799"><QuestionFilled /></el-icon>
                </el-tooltip> -->
            </div>
            <div class="summary-row">
                <div class="summary-radio flex flex-align-center">
                    <el-radio-group v-model="filterParams.summaryType" size="default" @change="radioChange">
                        <el-radio-button label="今日" :value="0" />
                        <el-radio-button label="累计" :value="1" />
                    </el-radio-group>
                    <div class="time" v-if="filterParams.summaryType === 0">更新时间：{{ newTime }}</div>
                </div>
                <div class="summary-list" v-if="filterParams.summaryType === 0">
                    <div class="summary-item">
                        <div class="tit">今日新增分销员数</div>
                        <div class="num">{{ filterState.newSalesmanCount }}</div>
                    </div>
                    <div class="summary-item">
                        <div class="tit">今日分销员销售额（元）</div>
                        <div class="num">{{ filterState.salesmanAmount > 0 ? priceFormat(filterState.salesmanAmount) : "-" }}</div>
                    </div>
                    <div class="summary-item">
                        <div class="tit">今日成交客户数</div>
                        <div class="num">{{ filterState.customNum }}</div>
                    </div>
                    <div class="summary-item">
                        <div class="tit">今日支出佣金（元）</div>
                        <div class="num">{{ filterState.salesmanCommission > 0 ? priceFormat(filterState.salesmanCommission) : "-" }}</div>
                    </div>
                </div>
                <div class="summary-list" v-if="filterParams.summaryType === 1">
                    <div class="summary-item">
                        <div class="tit">分销员数</div>
                        <div class="num">{{ filterState.newSalesmanCount }}</div>
                    </div>
                    <div class="summary-item">
                        <div class="tit">分销员销售额（元）</div>
                        <div class="num">{{ filterState.salesmanAmount > 0 ? priceFormat(filterState.salesmanAmount) : "-" }}</div>
                    </div>
                    <div class="summary-item">
                        <div class="tit">成交客户数</div>
                        <div class="num">{{ filterState.customNum }}</div>
                    </div>
                    <div class="summary-item">
                        <div class="tit">支出佣金（元）</div>
                        <div class="num">{{ filterState.salesmanCommission > 0 ? priceFormat(filterState.salesmanCommission) : "-" }}</div>
                    </div>
                </div>
            </div>
            <div class="tit-row flex flex-align-center">
                <h2>核心指标趋势</h2>
                <!-- <el-tooltip placement="bottom-start" effect="light">
                    <template #content>
                        <div style="width: 450px;">
                            <p>分销员销售额：	统计时间内，店铺中所有分销员订单的实际支付总金额（包含退款的金额）</p>
                        </div>
                     </template>
                     <el-icon size="18" color="#969799"><QuestionFilled /></el-icon>
                </el-tooltip> -->
            </div>
            <TrendChart></TrendChart>
            <div class="tit-row flex flex-align-center">
                <h2>分销员排行</h2>
                <!-- <el-tooltip placement="bottom-start" effect="light">
                    <template #content>
                        <div style="width: 450px;">
                            <p>新增销售额：	所选时间内，分销员新增的推广和自购金额（分销员绑定客户主动下单也算）</p>
                            <p>新增客户数：	所选时间内，分销员所绑定成功的客户数</p>
                            <p>支付客户数：	所选时间内，分销员客户中有完成支付的客户数（已去重）</p>
                            <p>新增邀请数：	所选时间内，这个分销员所邀请的下级分销员</p>
                            <p>开单邀请数：	所选时间内，分销员邀请的分销员（下级）中，有业绩的分销员（已去重）</p>
                            <p>分享商品数：	所选时间内，分销员分享的商品数量总和</p>
                            <p>商品分享次数：	该商品在“赚”字分享弹窗中按钮的点击次数，按钮包含「微信好友」「小程序码」「保存图文」「保存海报」「二维码」「复制链接」「小程序链接」 能打开“赚”字分享弹层的页面有：商品详情页、推广详情页、分销员中心的推广商品列表、参与任务的商品列表页</p>
                            <p>商品分享引流：	所选时间内，分销员分享的商品链接的访问人数</p>
                            <p>商品分享浏览量：	所选时间内，这个分销员分享的商品链接的访问次数</p>
                        </div>
                     </template>
                     <el-icon size="18" color="#969799"><QuestionFilled /></el-icon>
                </el-tooltip> -->
            </div>
            <RankingTable class="padding-no"></RankingTable>
            <div class="tit-row flex flex-align-center">
                <h2>商品成交分析</h2>
                <!-- <el-tooltip placement="bottom-start" effect="light">
                    <template #content>
                        <div style="width: 450px;">
                            <p>分享人数：	该商品在“赚”字分享弹窗中按钮的点击人数（去重），按钮包含「微信好友」「小程序码」「保存图文」「保存海报」「二维码」「复制链接」「小程序链接」 能打开“赚”字分享弹层的页面有：商品详情页、推广详情页、分销员中心的推广商品列表、参与任务的商品列表页</p>
                            <p>分享次数：	该商品在“赚”字分享弹窗中按钮的点击次数，按钮包含「微信好友」「小程序码」「保存图文」「保存海报」「二维码」「复制链接」「小程序链接」 能打开“赚”字分享弹层的页面有：商品详情页、推广详情页、分销员中心的推广商品列表、参与任务的商品列表页</p>
                            <p>访问人数：	该商品被分销员分享的链接的访问人数</p>
                            <p>访问-支付转化率：	访问后24小时内购买的人数/当天访问该商品的人数</p>
                            <p>成交金额：	该商品通过分销员推广订单的实付金额之和（包含退款的金额）</p>
                            <p>支出佣金：	该商品被分销员卖出后已结算的佣金之和（佣金+邀请奖励）</p>
                        </div>
                     </template>
                     <el-icon size="18" color="#969799"><QuestionFilled /></el-icon>
                </el-tooltip> -->
            </div>
            <AnalysisTable class="padding-no"></AnalysisTable>
        </div>
    </div>
</template>
<script setup lang="ts">
import "@/style/css/list.less";
import dayjs from "dayjs";
import { ref, reactive, onMounted, onUnmounted, nextTick } from "vue";
import { useConfigStore } from "@/store/config";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { QuestionFilled } from "@element-plus/icons-vue";
import RankingTable from "./src/RankingTable.vue";
import AnalysisTable from "./src/AnalysisTable.vue";
import TrendChart from "./src/TrendChart.vue";
import { priceFormat } from "@/utils/format";
import { CoreSummaryFilterParams, CoreSummaryFormState } from "@/types/salesman/overview.d";
import { getOverviewCoreSummary } from "@/api/salesman/overview";

const filterParams = reactive<CoreSummaryFilterParams>({
    summaryType: 0
});
const filterState = ref<CoreSummaryFormState>({
    newSalesmanCount: 0,
    salesmanAmount: 0,
    customNum: 0,
    salesmanCommission: 0
});
const loading = ref<boolean>(true);
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getOverviewCoreSummary({ ...filterParams });
        filterState.value = result;
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};
const newTime = ref<string>(dayjs().format("YYYY-MM-DD HH:mm:ss"));
const radioChange = (value: number) => {
    filterParams.summaryType = value;
    if (value === 0) {
        newTime.value = dayjs().format("YYYY-MM-DD HH:mm:ss");
    }
    loadFilter();
};
onMounted(() => {
    loadFilter();
});
</script>
<style lang="less" scoped>
.container {
    .content_wrapper {
        .tit-row {
            margin-bottom: 20px;
            h2 {
                margin-right: 10px;
            }
        }
        .summary-row {
            .summary-radio {
                margin-bottom: 20px;
                :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
                    color: var(--tig-primary) !important;
                    background-color: var(--tig-item-active-bg) !important;
                }
                :deep(.el-radio-button__inner) {
                    width: 80px;
                }
                .time {
                    color: #969799;
                    margin-left: 10px;
                }
            }
            .summary-list {
                margin-top: 16px;
                display: grid;
                grid-template-columns: 24% 24% 24% 24%;
                grid-template-rows: 1fr;
                margin-bottom: 20px;
                .summary-item {
                    margin-bottom: 32px;
                    .tit {
                        color: #646566;
                        font-size: 14px;
                        margin-bottom: 12px;
                    }
                    .num {
                        font-size: 24px;
                        color: #323233;
                        font-weight: 700;
                    }
                }
            }
        }
    }
}
.padding-no {
    :deep(.content_wrapper) {
        padding: 0 !important;
    }
}
@media only screen and (max-width: 767px) {
    .summary-item {
        .tit {
            line-height: 20px;
            height: 35px;
        }
    }
}
</style>
