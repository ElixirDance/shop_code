<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-table-list-warp">
                <div class="list-table-tool lyecs-search-warp">
                    <div class="list-table-tool-row">
                        <div class="list-table-tool-col">
                            <el-space>
                                <el-select placeholder="请选择状态" clearable v-model="filterParams.refundStatus" @change="onSearchSubmit">
                                    <el-option v-for="(item, index) in refundStatusList" :key="index" :value="index" :label="item" />
                                </el-select>
                                <TigInput
                                    v-model="filterParams.keyword"
                                    name="keyword"
                                    placeholder="输入售后单号"
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
                        <el-table :data="filterState" :loading="loading" :total="total" row-key="refundId" @sort-change="onSortChange">
                            <el-table-column label="退款类型" :width="120" prop="refundTypeName"></el-table-column>
                            <el-table-column label="退款信息">
                                <template #default="{ row }">
                                    <div style="display: flex; justify-content: space-between; align-items: center">
                                        <DialogForm
                                            :params="{ act: 'detail', id: row.aftersaleId, type: 2 }"
                                            isDrawer
                                            path="order/aftersales/Info"
                                            :title="'售后详情 ' + row.aftersales.aftersalesSn"
                                            width="800px"
                                            @okCallback="loadFilter"
                                            :showClose="false"
                                            :showOnOk="false"
                                        >
                                            售后编号：<a>{{ row.aftersales?.aftersalesSn }}</a>
                                        </DialogForm>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="退款状态" :width="120" prop="refundStatusName"></el-table-column>
                            <el-table-column label="申请时间" :width="160" prop="addTime"></el-table-column>
                            <el-table-column :width="120" fixed="right" label="操作">
                                <template #default="{ row }">
                                    <DialogForm
                                        :params="{ act: 'detail', id: row.refundId }"
                                        isDrawer
                                        title="编辑退款申请"
                                        width="800px"
                                        path="finance/refundApply/Info"
                                        @okCallback="loadFilter"
                                        :showClose="false"
                                        :showOnOk="false"
                                    >
                                        <a class="btn-link">{{ row.refundStatus == 0 || row.refundStatus == 1 ? "处理申请" : "查看详情" }}</a>
                                    </DialogForm>
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
import { DialogForm } from "@/components/dialog";
import { onMounted, reactive, ref } from "vue";
import { DeleteRecord, Pagination } from "@/components/list";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import { RefundApplyFilterParams, RefundApplyFilterState } from "@/types/finance/refundApply";
import { batchSubmit, getRefundApplyConfig, getRefundApplyList } from "@/api/finance/refundApply";

const config: any = useConfigStore();
// 基本参数定义
const filterState = ref(<RefundApplyFilterState[]>[]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const advancedSearch = ref<boolean>(false);
const filterParams = reactive<RefundApplyFilterParams>({
    //初使化用于查询的参数
    page: 1,
    size: config.get("pageSize"),
    sortField: "",
    sortOrder: "",
    keyword: ""
});
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getRefundApplyList({ ...filterParams });
        filterState.value = result.records;
        total.value = result.total;
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};
const refundStatusList = ref([]);
const fetchRefundApplyConfig = async () => {
    try {
        const result = await getRefundApplyConfig();
        refundStatusList.value = result;
    } catch (error: any) {
        message.error(error.message);
    }
};
const loadConfig = async () => {
    await fetchRefundApplyConfig();
    loadFilter();
};
onMounted(() => {
    loadConfig();
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

// 批量操作
const onBatchSubmit = async (action: string) => {
    try {
        const result = await batchSubmit(action, { ids: selectedIds.value });
        message.success("操作成功");
        loadFilter();
    } catch (error: any) {
        message.error(error.message);
    }
};
// 多选操作
const onSelectChange = (e: RefundApplyFilterState[]) => {
    selectedIds.value = e.map((item) => item.refundId);
};
</script>
