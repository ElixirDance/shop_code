<template>
    <div class="tabs flex">
        <div
            class="item"
            :class="value == -1 ? 'active' : ''"
            @click="onChange(-1)"
        >
            全部
        </div>
        <div
            class="item"
            v-for="item in options"
            :class="value == item.status ? 'active' : ''"
            @click="onChange(item.status)"
        >
            {{ item.statusText }}
        </div>
    </div>
</template>
<script setup lang="ts">
// 父组件回调
import {onMounted, ref} from "vue";
import {getApplyConfig, getApplyList} from "@/api/adminMerchant/apply";
import {message} from "ant-design-vue";
const emit = defineEmits([
    "callback",
])
onMounted(() => {
    loadFilter();
})
const value = ref(-1)
const onChange = (status: number)=>{
    value.value = status;
    emit('callback', value)
}
const options:any = ref([])
const loadFilter = async () => {
    try {
        const result = await getApplyConfig();
        options.value = result.statusList;
    } catch (error: any) {
        message.error(error.message);
    } finally {
    }
};
</script>
<style scoped lang="less">
.tabs {
    flex-wrap: wrap;
    gap: 10px !important;
    //margin-left: 10px;
    .item {
        padding: 0px 10px;
        text-align: center;
        height: 25px;
        line-height: 25px;
        color: #333;
        margin-right: 5px;
        font-size: 14px;
        border-radius: 2px;
        border: 1px solid #fff;
        cursor: pointer;
        &:hover {
            color: var(--tig-primary);
        }
    }
    .active {
        color: var(--tig-primary);
        background: var(--tig-item-active-bg);
        border: 1px solid var(--tig-primary);
    }
}
</style>
