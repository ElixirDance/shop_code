<template>
    <div class="countdown-box">
        <template v-if="countdownType === 'dailyCycle'">
            <template v-if="Array.isArray(props.dailyTime) && new Date().getTime() < Number(dailyTime[0])">
                <el-countdown :value-style="valueStyle" :format="format" :value="timeInfo.dailyStarTime" />
            </template>
            <template v-else>
                <el-countdown :value-style="valueStyle" :format="format" :value="timeInfo.dailyEndTime" />
            </template>
        </template>
        <template v-else>
            <el-countdown :value-style="valueStyle" :format="format" :value="Number(specifyTime)" />
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
const props = defineProps({
    countdownType: {
        type: String,
        default: "dailyCycle"
    },
    valueStyle: {
        type: Object,
        default: () => ({})
    },
    dailyTime: {
        type: [Array as any, Number],
        default: () => []
    },
    specifyTime: {
        type: Number,
        default: ""
    },
    format: {
        type: String,
        default: "HH:mm:ss"
    }
});

const timeInfo = computed(() => {
    let obj = {
        dailyStarTime: 0,
        dailyEndTime: 0
    };
    if (typeof props.dailyTime === "number") {
        let hour = new Date(props.dailyTime).getHours();
        obj.dailyEndTime = new Date(new Date().setHours(hour)).getTime();
    } else {
        let hour = new Date(props.dailyTime[0]).getHours();
        obj.dailyStarTime = new Date(new Date().setHours(hour)).getTime();
        hour = new Date(props.dailyTime[1]).getHours();
        obj.dailyEndTime = new Date(new Date().setHours(hour)).getTime();
    }

    return obj;
});
</script>

<style lang="less" scoped></style>
