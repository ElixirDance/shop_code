<template>
    <view></view>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";
import { commonLog } from "@/api/common";

const props = defineProps({
    productId: {
        type: [Number, String],
        default: ""
    },
    shopId: {
        type: [Number, String],
        default: ""
    },
    shopCategoryId: {
        type: [Number, String],
        default: ""
    },
    immediateLog: {
        type: Boolean,
        default: true
    }
});
interface IFilterParams {
    productId?: string | number;
    shopId?: string | number;
    shopCategoryId?: string | number;
    isNew?: number;
    click?: number;
}
const filterParams = reactive<IFilterParams>({});

const __commonLog = async () => {
    if (props.productId) {
        filterParams.productId = props.productId;
    }
    if (props.shopId) {
        filterParams.shopId = props.shopId;
    }
    if (props.shopCategoryId) {
        filterParams.shopCategoryId = props.shopCategoryId;
    }
    try {
        await commonLog(filterParams);
    } catch (error) {
        console.error(error);
    }
};

const currentDate = computed(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
});

const diffDate = (date1: string, date2: string): boolean => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diff = Math.abs(d1.getTime() - d2.getTime());
    const oneDay = 24 * 60 * 60 * 1000;
    return diff >= oneDay;
};
const updateVisitor = () => {
    const lastDate = uni.getStorageSync("lastDate");
    if (!lastDate || diffDate(currentDate.value, lastDate)) {
        filterParams.isNew = 1;
        // console.log("新访客");
    } else {
        filterParams.click = 1;
        // console.log("间隔不超过1天");
    }
    uni.setStorageSync("lastDate", currentDate.value);
};
updateVisitor();
onMounted(() => {
    if (props.immediateLog) {
        __commonLog();
    }
});

defineExpose({
    __commonLog
});
</script>

<style lang="scss" scoped></style>
