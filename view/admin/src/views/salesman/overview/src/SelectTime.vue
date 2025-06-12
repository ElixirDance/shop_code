<template>
    <el-form>
        <div class="filtrate-menu">
            <el-form-item class="mr-10" label="时间筛选：">
                <el-select v-model="dateType" placeholder="Select" style="width: 94.5px" @change="handleTimetype">
                    <el-option v-for="(item, index) in timeSorterList" :key="index" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item class="mr-10">
                <el-date-picker
                    v-if="dateType === 3"
                    style="width: 200px"
                    :shortcuts="dayShortcuts"
                    v-model="selectDate[3]"
                    value-format="YYYY-MM-DD"
                    :editable="false"
                    type="date"
                />
                <el-date-picker
                    v-if="dateType === 2"
                    style="width: 200px"
                    :shortcuts="monthShortcuts"
                    v-model="selectDate[2]"
                    value-format="YYYY-MM"
                    :editable="false"
                    type="month"
                />
                <SelectTimeInterval
                    v-if="dateType === 0"
                    type="date"
                    v-model:start-date="selectDate[0][0]"
                    v-model:end-date="selectDate[0][1]"
                ></SelectTimeInterval>
            </el-form-item>
            <el-form-item class="mr-10">
                <el-button plain @click="handleSearch">搜索</el-button>
            </el-form-item>
        </div>
    </el-form>
    <div class="chart" ref="chartRef"></div>
</template>
<script setup lang="ts">
import "@/style/css/list.less";
import { formatDate } from "@/utils/util";
import { reactive, onMounted } from "vue";
import { SelectTimeInterval } from "@/components/select";
const emit = defineEmits(["onOK"]);
const dateType = defineModel<Number>("dateType", { type: Number, default: 3 });
const dateValue = defineModel<String>("dateValue", { type: String || Array, default: null });
const selectDate = reactive<any>({
    "0": ["",""],
    "2": "",
    "3": ""
});
const timeSorterList = [
    {
        label: "自然日",
        value: 3
    },
    {
        label: "自然月",
        value: 2
    },
    {
        label: "自定义",
        value: 0
    }
];
const monthShortcuts = [
    {
        text: "本月",
        value: new Date()
    },
    {
        text: "上月",
        value: () => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
            return date;
        }
    },
    {
        text: "本年一月",
        value: () => {
            const date = new Date();
            const firstMonthOfYear = new Date(date.getFullYear(), 0, 1);
            return firstMonthOfYear;
        }
    }
];
const dayShortcuts = [
    {
        text: "今天",
        value: new Date()
    },
    {
        text: "昨天",
        value: () => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            return date;
        }
    },
    {
        text: "本月第一天",
        value: () => {
            const date = new Date();
            const years = date.getFullYear();
            const month = date.getMonth();
            return new Date(years, month, 1);
        }
    }
];
const handleSearch = () => {
    dateValue.value = selectDate[dateType.value as any];
    emit("onOK");
}
const handleTimetype = () => {
    // emit("onOK");
}
onMounted(() => {
    const nowDate = formatDate(new Date());
    if (nowDate) {
        const dates = nowDate.split("-");
        for (const key in selectDate) {
            if (key === "3") selectDate[key] = dateValue.value;
            if (key === "2") selectDate[key] = dates[0] + "-" + dates[1];
            if (key === "0") selectDate[key] =  [dateValue.value, dateValue.value];
        }
    }
});
</script>
<style lang="less" scoped>
.filtrate-menu {
    display: flex;
    .mr-10 {
        margin-right: 5px;
    }
}
</style>
