<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-table-list-warp">
                <div class="list-table-tool lyecs-search-warp">
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
                </div>
                <div class="table-container">
                    <a-spin :spinning="loading">
                        <el-table :data="filterState" :loading="loading" :total="total" row-key="paylogId" @sort-change="onSortChange">
                            <el-table-column label="退款信息" prop="aftersalesSn">
                                <template #default="{ row }">
                                    <div style="display: flex; justify-content: space-between; align-items: center">
                                        <DialogForm
                                            :params="{ act: 'detail', id: row.refund?.aftersaleId, type: 2 }"
                                            isDrawer
                                            path="order/aftersales/Info"
                                            :title="'售后详情 ' + row.refund?.aftersales.aftersalesSn"
                                            width="800px"
                                            @okCallback="loadFilter"
                                            :showClose="false"
                                            :showOnOk="false"
                                        >
                                            售后编号：<a>{{ row.refund?.aftersales.aftersalesSn }}</a>
                                        </DialogForm>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="退款方式" prop="refundTypeText"></el-table-column>
                            <el-table-column label="退款金额" prop="refundAmount"></el-table-column>
                            <el-table-column :width="160" label="退款时间" prop="addTime" sortable="custom"></el-table-column>
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
import { DialogForm } from "@/components/dialog";
import { onMounted, reactive, ref } from "vue";
import { Pagination } from "@/components/list";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import { RedundLogFilterParams, RedundLogFilterState } from "@/types/finance/refundLog";
import { getRedundLogList } from "@/api/finance/refundLog";

const config: any = useConfigStore();
// 基本参数定义
const filterState = ref(<RedundLogFilterState[]>[]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const filterParams = reactive<RedundLogFilterParams>({
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
        const result = await getRedundLogList({ ...filterParams });
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
