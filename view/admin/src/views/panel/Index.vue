<template>
    <div class="container">
        <div class="content_wrapper">
            <a-spin :spinning="loading">
                <div class="lyecs-table-list bar-top-item">
                    <el-row :gutter="15">
                        <el-col :xs="12" :sm="12" :md="6" :lg="6" class="itme-box" @click="toPage('/order/list', { status: 0 })">
                            <div class="bar_panel panel-bar-left"><i class="main_pel_m iconfont-admin icon-base-daifukuan"></i></div>
                            <div class="data_box">
                                <div class="title">待付款订单</div>
                                <div class="count">{{ filterState?.consoleData.awaitPay ?? 0 }}</div>
                            </div>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="6" :lg="6" class="itme-box" @click="toPage('/order/list', { status: 1 })">
                            <div class="bar_panel panel-bar-left"><em class="main_pel_m iconfont-admin icon-base-daifahuo"></em></div>
                            <div class="data_box">
                                <div class="title">待发货订单</div>
                                <div class="count">{{ filterState?.consoleData.awaitShip ?? 0 }}</div>
                            </div>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="6" :lg="6" class="itme-box" @click="toPage('/order/aftersales/list', { status: 1 })">
                            <div class="bar_panel panel-bar-left"><em class="main_pel_m iconfont-admin icon-base-tuihuanhuo"></em></div>
                            <div class="data_box">
                                <div class="title">待售后订单</div>
                                <div class="count">{{ filterState?.consoleData.awaitAfterSale ?? 0 }}</div>
                            </div>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="6" :lg="6" class="itme-box" @click="toPage('/user/feedback/list', { type: '5,6', status: 0 })">
                            <div class="bar_panel panel-bar-left"><em class="main_pel_m iconfont-admin icon-base-daipingjia"></em></div>
                            <div class="data_box">
                                <div class="title">待回复订单</div>
                                <div class="count">{{ filterState?.consoleData.awaitComment ?? 0 }}</div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="lyecs-table-list lyecs-table-list-admin">
                    <div class="store-data-con" style="">
                        <div class="header">
                            <div class="title">实时数据</div>
                        </div>
                        <div class="content">
                            <div class="index-cell index-cell-0">
                                <div class="live-wrapper">
                                    <i class="oui-icon iconfont-admin icon-base-basezhifujine"></i>
                                    <div class="index-detail">
                                        <div class="name sans-serif">支付金额</div>
                                        <div class="live-counter">
                                            <span class="oui-counter-digit">{{ filterState?.realTimeData.todayOrderAmount }}</span>
                                        </div>
                                        <div class="live-counter">
                                            <span class="oui-counter-digit f12"
                                                >日环比 <span>{{ filterState?.realTimeData.orderAmountGrowthRate ?? 0 }}%</span>
                                                <i
                                                    v-if="
                                                        filterState?.realTimeData.orderAmountGrowthRate.toString() !== '--' &&
                                                        Number(filterState?.realTimeData.orderAmountGrowthRate) > 0
                                                    "
                                                    class="admin-iconfont up red f12"
                                                    >&#xe61a;</i
                                                >
                                                <i v-else class="admin-iconfont green f12">&#xe61a;</i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="yesterday-data clearfix">
                                    <p class="name">昨日全天</p>
                                    <p class="yesterday-value num">{{ filterState?.realTimeData.yesterdayOrderAmount ?? "-" }}</p>
                                </div>
                            </div>
                            <div class="index-cell index-cell-1">
                                <div class="live-wrapper">
                                    <i class="oui-icon iconfont-admin icon-base-zuji"></i>
                                    <div class="index-detail">
                                        <div class="name sans-serif">访客数</div>
                                        <div class="live-counter">
                                            <span class="oui-counter-digit">{{ filterState?.realTimeData.todayVisitNum ?? "-" }}</span>
                                        </div>
                                        <div class="live-counter">
                                            <span class="oui-counter-digit f12"
                                                >日环比 <span>{{ filterState?.realTimeData.visitGrowthRate ?? 0 }}%</span>
                                                <i
                                                    v-if="
                                                        filterState?.realTimeData.visitGrowthRate.toString() !== '--' &&
                                                        Number(filterState?.realTimeData.visitGrowthRate) > 0
                                                    "
                                                    class="admin-iconfont up red f12"
                                                    >&#xe61a;</i
                                                >
                                                <i v-else class="admin-iconfont green f12">&#xe61a;</i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="yesterday-data clearfix">
                                    <p class="name">昨日全天</p>
                                    <p class="yesterday-value num">{{ filterState?.realTimeData.yesterdayVisitNum ?? "-" }}</p>
                                </div>
                            </div>
                            <div class="index-cell index-cell-2" style="border-left: 1px #f0f2f5 solid">
                                <div class="live-wrapper">
                                    <i class="oui-icon iconfont-admin icon-base-tuandui"></i>
                                    <div class="index-detail">
                                        <div class="name sans-serif">支付买家数</div>
                                        <div class="live-counter">
                                            <span class="oui-counter-digit">{{ filterState?.realTimeData.todayBuyerNum ?? "-" }}</span>
                                        </div>
                                        <div class="live-counter">
                                            <span class="oui-counter-digit f12"
                                                >日环比 <span>{{ filterState?.realTimeData.buyerGrowthRate ?? 0 }}%</span>
                                                <i
                                                    v-if="
                                                        filterState?.realTimeData.buyerGrowthRate.toString() !== '--' &&
                                                        Number(filterState?.realTimeData.buyerGrowthRate) > 0
                                                    "
                                                    class="admin-iconfont up red f12"
                                                    >&#xe61a;</i
                                                >
                                                <i v-else class="admin-iconfont green f12">&#xe61a;</i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="yesterday-data clearfix">
                                    <p class="name">昨日全天</p>
                                    <p class="yesterday-value num">{{ filterState?.realTimeData.yesterdayBuyerNum ?? "-" }}</p>
                                </div>
                            </div>
                            <div class="index-cell index-cell-3" style="border-left: 0">
                                <div class="live-wrapper">
                                    <i class="oui-icon iconfont-admin icon-base-liulan"></i>
                                    <div class="index-detail">
                                        <div class="name sans-serif">浏览量</div>
                                        <div class="live-counter">
                                            <span class="oui-counter-digit">{{ filterState?.realTimeData.todayViewNum ?? "-" }}</span>
                                        </div>
                                        <div class="live-counter">
                                            <span class="oui-counter-digit f12"
                                                >日环比 <span>{{ filterState?.realTimeData.viewGrowthRate ?? 0 }}%</span>
                                                <i
                                                    v-if="
                                                        filterState?.realTimeData.viewGrowthRate.toString() !== '--' &&
                                                        Number(filterState?.realTimeData.viewGrowthRate) > 0
                                                    "
                                                    class="admin-iconfont up red f12"
                                                    >&#xe61a;</i
                                                >
                                                <i v-else class="admin-iconfont green f12">&#xe61a;</i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="yesterday-data clearfix">
                                    <p class="name">昨日全天</p>
                                    <p class="yesterday-value num">{{ filterState?.realTimeData.yesterdayViewNum ?? "-" }}</p>
                                </div>
                            </div>
                            <div class="index-cell index-cell-4" style="border-left: 1px #f0f2f5 solid; border-bottom: 1px #f0f2f5 solid">
                                <div class="live-wrapper">
                                    <i class="oui-icon iconfont-admin icon-base-dingdan"></i>
                                    <div class="index-detail">
                                        <div class="name sans-serif">支付订单数</div>
                                        <div class="live-counter">
                                            <span class="oui-counter-digit">{{ filterState?.realTimeData.todayOrderNum }}</span>
                                        </div>
                                        <div class="live-counter">
                                            <span class="oui-counter-digit f12"
                                                >日环比 <span>{{ filterState?.realTimeData.orderGrowthRate ?? 0 }}%</span>
                                                <i
                                                    v-if="
                                                        filterState?.realTimeData.orderGrowthRate.toString() !== '--' &&
                                                        Number(filterState?.realTimeData.orderGrowthRate) > 0
                                                    "
                                                    class="admin-iconfont up red f12"
                                                    >&#xe61a;</i
                                                >
                                                <i v-else class="admin-iconfont green f12">&#xe61a;</i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="yesterday-data clearfix">
                                    <p class="name">昨日全天</p>
                                    <p class="yesterday-value num">{{ filterState?.realTimeData.yesterdayOrderNum ?? "-" }}</p>
                                </div>
                            </div>
                            <div class="index-cell index-cell-5" style="border-bottom: 1px #f0f2f5 solid">
                                <router-link :to="{ path: '/panel/statistics_order/list' }">
                                    <a class="check-more lyecs-openPage">查看更多销售统计</a>
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </a-spin>

            <div class="chart-menu">
                <div class="chart-menu-item" ref="accessStatisticsRef"></div>
                <div class="chart-menu-item" ref="ordersReceivedStatisticsRef"></div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick, onBeforeMount } from "vue";
import * as echarts from "echarts";
import { getPanelIndex } from "@/api/panel";
import { panelIndexFilterState } from "@/types/panel/index";
import { useRouter } from "vue-router";

const router = useRouter();

// 初始化导出模块

const loading = ref<boolean>(false);
// 获取详情数据
const filterState = ref<panelIndexFilterState>();
const accessStatisticsRef = ref<HTMLDivElement>();
const ordersReceivedStatisticsRef = ref<HTMLDivElement>();
let accessStatisticsChart: echarts.ECharts;
let ordersReceivedStatisticsChart: echarts.ECharts;
const accessStatisticsOptons = ref<any>({
    title: {
        text: "访问统计",
        left: "center"
    },
    grid: {
        // left: "5%"
        right: "2.5%"
    },
    tooltip: {
        trigger: "axis"
    },
    legend: {
        data: ["访问量"],
        left: "center", // 将图例居中显示（水平方向）
        bottom: "bottom" // 设置图例距离底部为容器高度的10%（垂直方向）
    },
    xAxis: {
        type: "category",
        data: [0]
    },
    yAxis: {
        type: "value"
    },
    series: [
        {
            name: "访问量",
            data: [0],
            type: "line",
            smooth: true,
            lineStyle: {
                color: "#1456f0"
            },
            areaStyle: {
                color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: "#ECF5FF"
                        },
                        {
                            offset: 1,
                            color: "#ffffff"
                        }
                    ],
                    global: !1
                }
            },
            color: "#1456f0",
            emphasis: {
                scale: !1
            }
        }
    ]
});
const ordersReceivedStatisticsOptons = ref<any>({
    title: {
        text: "订单统计",
        left: "center"
    },
    grid: {
        // left: "5%"
        right: "2.5%"
    },
    tooltip: {
        trigger: "axis"
    },
    legend: {
        data: ["订单金额", "订单数量"],
        left: "center", // 将图例居中显示（水平方向）
        bottom: "bottom" // 设置图例距离底部为容器高度的10%（垂直方向）
    },
    xAxis: {
        type: "category",
        data: []
    },
    yAxis: {
        type: "value"
    },
    series: [
        {
            name: "订单金额",
            data: [],
            type: "line",
            smooth: true,
            lineStyle: {
                color: "#fac858"
            },
            color: "#fac858",
            emphasis: {
                scale: !1
            }
        },
        {
            name: "订单数量",
            type: "bar",
            backgroundStyle: {
                color: "rgba(216, 229, 247, 0.55)",
                borderRadius: [8, 8, 0, 0]
            },
            itemStyle: {
                color: "#1456f0"
            },
            barWidth: "50%",
            data: []
        }
    ]
});
const getData = async () => {
    // loading.value = true;
    try {
        const result = await getPanelIndex();
        filterState.value = result;
        // return;
        accessStatisticsOptons.value.xAxis.data = result.panelStatisticalData.horizontalAxis;
        accessStatisticsOptons.value.series[0].data = result.panelStatisticalData.longitudinalAxisAccess;
        accessStatisticsChart && accessStatisticsChart.setOption(accessStatisticsOptons.value);
        const orderCountData = result.panelStatisticalData.longitudinalAxisOrderNum.map((item: number) => {
            return item === 0 ? null : item;
        });
        ordersReceivedStatisticsOptons.value.xAxis.data = result.panelStatisticalData.horizontalAxis;
        ordersReceivedStatisticsOptons.value.series[0].data = result.panelStatisticalData.longitudinalAxisOrderAmount;
        ordersReceivedStatisticsOptons.value.series[1].data = orderCountData;
        ordersReceivedStatisticsChart && ordersReceivedStatisticsChart.setOption(ordersReceivedStatisticsOptons.value);
    } catch (error) {
        console.error(error);
    }
    loading.value = false;
};

const handleChartResize = () => {
    accessStatisticsChart?.resize();
    ordersReceivedStatisticsChart?.resize();
};

const initChart = () => {
    accessStatisticsChart = echarts.init(accessStatisticsRef.value);
    accessStatisticsChart.setOption(accessStatisticsOptons.value);

    ordersReceivedStatisticsChart = echarts.init(ordersReceivedStatisticsRef.value);
    ordersReceivedStatisticsChart.setOption(ordersReceivedStatisticsOptons.value);
    window.addEventListener("resize", handleChartResize);
};
const toPage = (path: string, query?: any) => {
    router.push({
        path,
        query
    });
};

onBeforeMount(() => {
    getData();
});
onMounted(() => {
    nextTick(() => {
        initChart();
    });
    window.onresize = () => {
        accessStatisticsChart?.resize();
    };
});
onUnmounted(() => {
    accessStatisticsChart?.dispose();
    ordersReceivedStatisticsChart?.dispose();
    window.removeEventListener("resize", handleChartResize);
});
</script>
<style lang="less" scoped>
/*面板页面*/
.page_index #content {
    background: #fff;
}

.bar-top-item {
    margin-bottom: 20px;
}

.bar-top-item .itme-box {
    height: 100%;
    box-sizing: border-box;
    border-radius: 4px;
    height: 80px;
    margin-bottom: 10px;
    display: inline-flex;
}

.bar-top-item .itme-box .bar_panel {
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    padding: 15px;
    height: 100%;
    width: 40%;
    align-items: center;
    justify-content: center;
    display: flex;
    box-sizing: border-box;
}

.bar-top-item .itme-box:nth-child(1) .bar_panel {
    background: var(--tig-primary);
}

.bar-top-item .itme-box:nth-child(2) .bar_panel {
    background: #ffb53e;
}

.bar-top-item .itme-box:nth-child(3) .bar_panel {
    background: #1ebfae;
}

.bar-top-item .itme-box:nth-child(4) .bar_panel {
    background: #ff445b;
}

.bar-top-item .itme-box:nth-child(5) .bar_panel {
    background: #24c7f9;
}

.bar-top-item .itme-box .bar_panel .main_pel_m {
    font-size: 30px;
    color: #fff;
    line-height: 46px;
}

.bar-top-item .itme-box .data_box {
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
    background: #f7f8fa;
    color: #666;
    line-height: 1.8em;
    font-weight: normal;
    margin: 0;
    padding: 15px 0 15px 20px;
    text-align: left;
    height: 100%;
    width: 60%;
    box-sizing: border-box;
}

.bar-top-item .itme-box .data_box .title {
    font-size: 14px;
}

.bar-top-item .itme-box .data_box .count {
    color: #666 !important;
    font-size: 22px;
    font-weight: bold;
    padding-top: 5px;
}

.bar-top-item .itme-box .data_box .count:hover {
    color: #333 !important;
}

.tabe-data-con {
    width: 49%;
    min-height: 100px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    margin-bottom: 20px;
    overflow: hidden;
    background: #fff;
}

.tabe-data-con .con {
    margin: 0;
}

.tabe-data-con table {
    border: 0;
}

.tabe-data-con table a {
    color: #db0b0b;
}

.tabe-data-con table tr:hover td {
    background-color: #fff;
}

.tabe-data-con .header {
    padding: 0 14px;
    height: 46px;
    line-height: 45px;
    background: rgba(61, 127, 255, 0.06);
}

.tabe-data-con .header .title {
    float: left;
    font:
        14px/45px tahoma,
        arial,
        "Hiragino Sans GB",
        "Microsoft Yahei",
        \5b8b\4f53,
        sans-serif;
    color: #000;
}

.tabe-data-con .last td {
    border-bottom: 0;
}

.store-data-con {
    width: 100%;
    min-height: 300px;
    border-radius: 4px;
    margin-bottom: 30px;
    overflow: hidden;
    background: #fff;
}

.store-data-con .header {
    padding: 0;
    height: 46px;
    line-height: 45px;
    border-bottom: 1px solid #f0f2f5;
}

.store-data-con .header .title {
    font:
        14px/45px tahoma,
        arial,
        "Hiragino Sans GB",
        "Microsoft Yahei",
        \5b8b\4f53,
        sans-serif;
    color: #000;
    font-weight: bold;
}

.store-data-con .index-cell {
    width: 50%;
    height: 160px;
    padding: 20px 14px 0;
    text-align: center;
    box-sizing: border-box;
}

.lyecs-table-list-admin .store-data-con .index-cell {
    width: 33%;
}

.store-data-con .index-cell .live-wrapper {
    position: relative;
    padding-left: 60px;
    height: 70px;
    overflow: hidden;
}

.store-data-con .index-cell .live-wrapper .oui-icon {
    position: absolute;
    top: 0;
    left: 1px;
    margin-top: 0;
    font-size: 28px;
    margin-right: 16px;
    width: 42px;
    height: 42px;
    line-height: 42px;
    text-align: center;
    color: #fff;
    background-color: #f7f8fa;
    border-radius: 100%;
}

.store-data-con .index-cell.index-cell-0 .live-wrapper .oui-icon {
    color: #278bf5;
}

.store-data-con .index-cell.index-cell-1 .live-wrapper .oui-icon {
    color: #00c59f;
}

.store-data-con .index-cell.index-cell-2 .live-wrapper .oui-icon {
    color: #ffbc00;
}

.store-data-con .index-cell.index-cell-3 .live-wrapper .oui-icon {
    color: #ff8436;
}

.store-data-con .index-cell.index-cell-4 .live-wrapper .oui-icon {
    color: #ff638f;
}

.store-data-con .index-cell .live-wrapper .index-detail {
    width: 100%;
    text-align: left;
}

.store-data-con .index-cell .live-wrapper .index-detail .name {
    color: #333;
}

.store-data-con .index-cell .live-wrapper .index-detail .live-counter {
    margin-top: 2px;
    font: 18px/1.4 Arial;
    height: 28px;
    line-height: 28px;
    color: #333;
}

.store-data-con .index-cell .live-wrapper .index-detail .live-counter .oui-counter-digit span {
    margin-left: 5px;
}

.store-data-con .index-cell .live-wrapper .index-detail .live-counter .admin-iconfont.up {
    display: inline-block;
    transform: rotate(180deg);
}

.store-data-con .index-cell .yesterday-data {
    margin-top: 34px;
    color: #999;
}

.store-data-con .index-cell .yesterday-data .name {
    float: left;
}

.store-data-con .index-cell .yesterday-data .yesterday-value {
    float: right;
}

.store-data-con .index-cell.index-cell-0,
.store-data-con .index-cell.index-cell-1,
.store-data-con .index-cell.index-cell-2,
.store-data-con .index-cell.index-cell-3 {
    border-bottom: 1px #f0f2f5 solid;
}

.store-data-con .index-cell.index-cell-1,
.store-data-con .index-cell.index-cell-3,
.store-data-con .index-cell.index-cell-5 {
    border-left: 1px #f0f2f5 solid;
}

.store-data-con .index-cell .check-more {
    text-align: center;
    display: block;
    width: 100%;
    line-height: 40px;
    color: #333;
    margin-top: 20px;
}

.store-articel-tab {
    border-bottom: solid 1px #dcdee3;
    height: 37px;
}

.store-articel-tab a {
    display: inline-block;
    padding: 0 12px;
    height: 36px;
    line-height: 36px;
}

.store-articel-tab a.current {
    border-bottom: 2px solid #008ae5;
}

.store-data-con .content {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
}

.store-articel-con li {
    margin-top: 6px;
    line-height: 30px;
}

.store-articel-con li span {
    padding-right: 12px;
}

.store-articel-con li span.top {
    color: #ff5000;
}

.chart-data-con {
    flex: 1;
}
.chart-data-con:first-child {
    margin-right: 20px;
}
.chart-data-con .header {
    border-bottom: 1px #f0f2f5 solid;
    margin-bottom: 20px;
}
.chart-data-con .header .title {
    font:
        14px/45px tahoma,
        arial,
        "Hiragino Sans GB",
        "Microsoft Yahei",
        \5b8b\4f53,
        sans-serif;
    color: #000;
    font-weight: bold;
}

.chart-menu {
    display: flex;
    justify-content: space-between;
    height: 400px;
    .chart-menu-item {
        width: 48%;
        height: 100%;
    }
}
@media only screen and (max-width: 767px) {
    .lyecs-table-list-admin .store-data-con .index-cell {
        width: 50% !important;
        border-left: 1px #fff solid !important;
        border-right: 1px #fff solid !important;
        height: 138px;
        padding: 18px 14px 0;
    }
    .index-cell:nth-child(2n -1) {
        border-right: 1px solid rgb(240, 242, 245) !important;
    }
    .chart-menu {
        flex-wrap: wrap;
    }
    .chart-menu-item {
        width: 100% !important;
    }
    .bar-top-item .itme-box .data_box {
        padding: 15px 0 15px 12px;
    }
    .store-data-con .index-cell .yesterday-data {
        margin-top: 20px;
    }
}
</style>
