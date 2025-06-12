<template>
    <div class="content_wrapper">
        <div class="container">
            <div class="lyecs-table-list-warp">
                <div class="list-table-tool lyecs-search-warp">
                    <el-form :model="filterParams">
                        <div class="advanced-search-warp list-table-tool-row">
                            <div class="simple-form-warp">
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>申请时间：</span></label>
                                        <div class="control-container">
                                            <SelectTimeInterval
                                                type="date"
                                                v-model:start-date="filterParams.addTimeStart"
                                                v-model:end-date="filterParams.addTimeEnd"
                                            ></SelectTimeInterval>
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>提现状态：</span></label>
                                        <div class="control-container">
                                            <el-select v-model="filterParams.status" clearable @change="onSearchSubmit">
                                                <el-option v-for="(item, index) in statusList" :value="index" :label="item" />
                                            </el-select>
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <el-button type="primary" @click="onSearchSubmit">搜索</el-button>
                                </div>
                            </div>
                        </div>
                    </el-form>
                </div>
                <div class="table-container">
                    <a-spin :spinning="loading">
                        <el-table :data="filterState" :loading="loading" :total="total" row-key="shopWithdrawLogId" @sort-change="onSortChange">
                            <el-table-column :width="150" label="申请时间" prop="addTime" sortable="custom"></el-table-column>
                            <el-table-column label="金额(元)" prop="amount"></el-table-column>
                            <el-table-column label="状态"  prop="status">
                                <template #default="{ row }">
                                    <template v-if="row.status == 0 || row.status == 4">
                                        <StatusDot color="blue" :flicker="true"></StatusDot>
                                    </template>
                                    <template v-if="row.status == 2">
                                        <StatusDot color="red" :flicker="true"></StatusDot>
                                    </template>
                                    <template v-if="row.status == 3">
                                        <StatusDot color="green" :flicker="true"></StatusDot>
                                    </template>
                                    <span>{{ row.statusText }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="收款人">
                                <template #default="{ row }">
                                    <span>{{ row.accountData?.accountName || "--" }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="收款账号">
                                <template #default="{ row }">
                                    <span>{{ row.accountData?.accountNo || "--" }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="到账方式" :width="200">
                                <template #default="{ row }">
                                    <span>
                                        {{ row.accountData?.accountTypeText || "--" }}
                                    </span>
                                    <span v-if="row.accountData?.bankBranch && row.accountData?.accountType == 1"> - {{ row.accountData?.bankBranch }}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="备注" prop="remark">
                                <template #default="{ row }">
                                    {{ row.remark || "--" }}
                                </template>
                            </el-table-column>
                            <el-table-column label="打款凭证" :width="160" align="center">
                                <template #default="{ row }">
                                    <Image
                                        :src="row.paymentVoucher"
                                        fit="contain"
                                        style="height: 25px; width: 80px"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column label="拒绝理由" prop="auditRemark">
                                <template #default="{ row }">
                                    {{ row.auditRemark || "--" }}
                                </template>
                            </el-table-column>
                            <el-table-column :width="100" fixed="right" label="操作">
                                <template #default="{ row }">
                                    <DialogForm
                                        v-if="row.status === 0"
                                        :params="{ act: 'detail', id: row.shopWithdrawLogId }"
                                        isDrawer
                                        path="shop/shopAccountRaply/Info"
                                        title="提现详情"
                                        width="500"
                                        @okCallback="loadFilter"
                                    >
                                        <a class="btn-link">审核</a>
                                    </DialogForm>
                                    <DialogForm
                                        v-if="row.status == 4"
                                        
                                        :params="{ act: 'detail', id: row.shopWithdrawLogId }"
                                        isDrawer
                                        path="shop/shopAccountRaply/Info"
                                        title="上传打款凭证"
                                        width="500"
                                        @okCallback="loadFilter"
                                    >
                                        <a class="btn-link">上传打款凭证</a>
                                    </DialogForm>
                                    <DialogForm
                                        v-if="row.status == 3 || row.status == 2"
                                        :showOnOk="row.status === 0 || row.status === 4"
                                        :params="{ act: 'detail', id: row.shopWithdrawLogId }"
                                        isDrawer
                                        path="shop/shopAccountRaply/Info"
                                        title="提现详情"
                                        width="500"
                                        @okCallback="loadFilter"
                                    >
                                        <a class="btn-link">详情</a>
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
import StatusDot from "@/components/form/src/StatusDot.vue";
import { Image } from "@/components/image";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import { WithdrawFilterParams, WithdrawFilterState } from "@/types/merchant/capitalfund/withdraw.d";
import { getWithdrawList, getWithdrawConfig } from "@/api/merchant/capitalfund/withdraw";
import { CustomSwitch } from "@/components/switch";
import { SelectTimeInterval } from "@/components/select";

const config: any = useConfigStore();
// 基本参数定义
const filterState = ref<WithdrawFilterState[]>([]);
const loading = ref<boolean>(false);
const total = ref<number>(0);
const filterParams = reactive<WithdrawFilterParams>({
    page: 1,
    size: config.get("pageSize"),
    sortField: "",
    sortOrder: "",
    status: "",
    addTimeStart: "",
    addTimeEnd: ""
});
const statusList = ref();
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getWithdrawList({ ...filterParams });
        filterState.value = result.records || [];
        console.log(result);
        console.log(filterState.value);
        total.value = result.total;
        const config = await getWithdrawConfig();
        statusList.value = config;
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
<style lang="less" scoped></style>
