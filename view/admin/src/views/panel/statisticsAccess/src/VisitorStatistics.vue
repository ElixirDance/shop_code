<template>
    <div class="visitor-statistics" ref="visitorStatisticsRef"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick, watchEffect, inject } from "vue";
import * as echarts from "echarts";
const filterState = inject<any>("filterState");

const visitorStatisticsRef = ref<HTMLDivElement>();
let myChart: echarts.ECharts;
const myChartOptions = ref<any>({
    title: {
        text: "访客数统计",
        left: "center"
    },
    grid: {
        left: "4%"
    },
    tooltip: {
        trigger: "axis"
    },
    legend: {
        data: ["访问数"],
        left: "center", // 将图例居中显示（水平方向）
        bottom: "bottom" // 设置图例距离底部为容器高度的10%（垂直方向）
    },
    xAxis: {
        type: "category",
        data: ["一月", "二月", "三月", "四月", "五月", "六月", "七月"]
    },
    yAxis: {
        type: "value",
        name: "(人次)",
        axisLabel: {
            formatter: "{value}"
        }
    },
    series: [
        {
            name: "访问数",
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "line",
            smooth: true,
            lineStyle: {
                color: "rgba(58,77,233,0.8)"
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
                            color: "rgba(58,77,233,0.8)"
                        },
                        {
                            offset: 1,
                            color: "#ffffff"
                        }
                    ],
                    global: !1
                }
            },
            color: "rgba(58,77,233,0.8)",
            emphasis: {
                scale: !1
            },
            tooltip: {
                valueFormatter: function (value: string) {
                    return value + "人";
                }
            }
        }
    ]
});
const handleChartResize = () => {
    myChart?.resize();
};
const initChart = () => {
    myChart = echarts.init(visitorStatisticsRef.value);
    myChart?.setOption(myChartOptions.value);
    window.addEventListener("resize", handleChartResize);
};

watchEffect(() => {
    if (filterState && filterState.value?.hasOwnProperty("horizontalAxis")) {
        nextTick(() => {
            myChartOptions.value.xAxis.data = filterState.value.horizontalAxis;
            myChartOptions.value.series[0].data = filterState.value.longitudinalAxis;
            myChart?.setOption(myChartOptions.value);
        });
    }
});

onMounted(() => {
    nextTick(() => {
        initChart();
    });
    window.onresize = () => {
        myChart?.resize();
    };
});
onUnmounted(() => {
    myChart?.dispose();
    window.removeEventListener("resize", handleChartResize);
});
</script>

<style lang="less" scoped>
.visitor-statistics {
    width: 100%;
    height: 100%;
}
</style>
