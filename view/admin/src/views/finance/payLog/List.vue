<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-table-list-warp">
                <div class="list-table-tool lyecs-search-warp">
                    <el-form :model="filterParams">
                        <div class="list-table-tool-row">
                            <div class="list-table-tool-col">
                                <el-space>
                                    <el-select v-model="filterParams.payStatus" clearable placeholder="请选择状态" @change="onSearchSubmit">
                                        <el-option :value="0" label="未支付" />
                                        <el-option :value="1" label="已支付" />
                                    </el-select>
                                    <TigInput
                                        v-model="filterParams.keyword"
                                        name="keyword"
                                        placeholder="输入订单号"
                                        @keyup.enter="onSearchSubmit"
                                        clearable
                                        @clear="onSearchSubmit"
                                    >
                                        <template #append>
                                            <el-button @click="onSearchSubmit"><span class="iconfont icon-chakan1"></span> </el-button>
                                        </template>
                                    </TigInput>
                                </el-space>
                            </div>
                        </div>
                    </el-form>
                </div>
                <div class="table-container">
                    <a-spin :spinning="loading">
                        <el-table :data="filterState" :loading="loading" :total="total" row-key="paylogId" @sort-change="onSortChange">
                            <el-table-column label="订单编号" prop="orderSn"></el-table-column>
                            <el-table-column label="订单收件人" prop="consignee">
                                <template #default="{ row }">
                                    {{ row.consignee || '--' }}
                                </template>
                            </el-table-column>
                            <el-table-column label="支付方式" prop="payName"></el-table-column>
                            <el-table-column label="支付金额" prop="payAmount"></el-table-column>
                            <el-table-column label="已退款金额" prop="refundAmount"></el-table-column>
                            <el-table-column :width="160" label="支付日期" prop="addTime" sortable="custom"></el-table-column>
                            <el-table-column label="支付状态" prop="payStatusName">
                                <template #default="{ row }">
                                    <span :style="{ color: row.payStatus === 1 ? 'green' : 'red' }">{{ row["payStatusName"] }}</span>
                                </template>
                            </el-table-column>
                            <template #empty>
                                <div class="empty-warp">
                                    <div v-if="!loading" class="empty-bg">暂无数据</div>
                                </div>
                            </template>
                        </el-table>
                    </a-spin>
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
import { PayLogFilterParams, PayLogFilterState } from "@/types/finance/payLog";
import { getPayLogList } from "@/api/finance/payLog";

const config: any = useConfigStore();
// 基本参数定义
const filterState = ref(<PayLogFilterState[]>[]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const filterParams = reactive<PayLogFilterParams>({
    //初使化用于查询的参数
    page: 1,
    size: config.get("pageSize"),
    sortField: "",
    sortOrder: "",
    keyword: "",
    payStatus: 1
});
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getPayLogList({ ...filterParams });
        filterState.value = result.records;
        total.value = result.total;
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};
onMounted(() => {
    loadFilter();
});

// 参数查询
const onSearchSubmit = () => {
    loadFilter();
};
// 修改排序
const onSortChange = ({ prop, order }: { prop: string; order?: string }) => {
    filterParams.sortField = prop;
    filterParams.sortOrder = order == "ascending" ? "asc" : order == "descending" ? "desc" : "";
    loadFilter();
};
</script>
