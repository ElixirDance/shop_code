<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-table-list-warp">
                <div class="list-table-tool lyecs-search-warp">
                    <el-form :model="filterParams" name="form">
                        <div class="advanced-search-warp list-table-tool-row">
                            <div class="simple-form-warp">
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>分销员：</span></label>
                                        <div class="control-container">
                                            <TigInput
                                                v-model="filterParams.mobile"
                                                name="mobile"
                                                placeholder="请输入手机号"
                                                @keyup.enter="onSearchSubmit"
                                                clearable
                                                @clear="onSearchSubmit"
                                            ></TigInput>
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>分组：</span></label>
                                        <div class="control-container">
                                            <SelectSalesmanGroup v-model:groupId="filterParams.groupId" @onChange="onSearchSubmit"></SelectSalesmanGroup>
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>等级：</span></label>
                                        <div class="control-container">
                                            <SelectPromoteMode v-model:level="filterParams.level" @onChange="onSearchSubmit"></SelectPromoteMode>
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <el-button type="primary" @click="onSearchSubmit">搜索</el-button>
                                </div>
                            </div>
                        </div>
                        <div class="advanced-search-warp list-table-tool-row">
                            <div class="simple-form-warp">
                                <div class="simple-form-field">
                                    <el-button type="primary" @click="handleExport" :loading="Exportloading">导出EXCEL</el-button>
                                </div>
                            </div>
                        </div>
                    </el-form>
                </div>
                <div class="table-container">
                    <a-spin :spinning="loading">
                        <el-table :data="filterState" :total="total" row-key="productId" @sort-change="onSortChange">
                            <el-table-column label="手机号" prop="productId" :width="130" fixed="left">
                                <template #default="{ row }">
                                    {{ row.baseUserInfo.mobile }}
                                </template>
                            </el-table-column>
                            <el-table-column label="昵称" prop="productId" :width="100">
                                <template #default="{ row }">
                                    {{ row.baseUserInfo.nickname || row.baseUserInfo.username }}
                                </template>
                            </el-table-column>
                            <el-table-column label="等级" prop="levelText" :width="100">
                                <template #default="{ row }">
                                    {{ row.levelText }}
                                </template>
                            </el-table-column>
                            <el-table-column label="分组" prop="groupInfo.groupName" :width="100">
                                <template #default="{ row }">
                                    {{ row.groupInfo.groupName }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="productId" align="left">
                                <template #header>
                                    <div class="flex flex-align-center">
                                        <p>累计销售金额({{ config.config.amountUnit }})</p>
                                        <el-tooltip placement="top" effect="light">
                                            <template #content> 累计业绩为实际有效业绩，剔除了退款金额。 </template>
                                            <el-icon size="16" color="#c8c9cc" style="margin-left: 5px"><QuestionFilled /></el-icon>
                                        </el-tooltip>
                                    </div>
                                </template>
                                <template #default="{ row }">
                                    {{ priceFormat(row.saleAmount) }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="productId" align="left">
                                <template #header>
                                    <div class="flex flex-align-center">
                                        <p>支付金额({{ config.config.amountUnit }})</p>
                                        <el-tooltip placement="top" effect="light">
                                            <template #content> 所选时间内，分销员客户的支付成功金额（含退款）。目前仅支持展示2023.11后的数据。 </template>
                                            <el-icon size="16" color="#c8c9cc" style="margin-left: 5px"><QuestionFilled /></el-icon>
                                        </el-tooltip>
                                    </div>
                                </template>
                                <template #default="{ row }">
                                    {{ priceFormat(row.payMoney) }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="refundAmount" align="left">
                                <template #header>
                                    <div class="flex flex-align-center">
                                        <p>退款金额({{ config.config.amountUnit }})</p>
                                        <el-tooltip placement="top" effect="light">
                                            <template #content>
                                                所选时间内，分销员客户的全额退款和部分退款的退款成功金额。目前仅支持展示2023.11后的数据。
                                            </template>
                                            <el-icon size="16" color="#c8c9cc" style="margin-left: 5px"><QuestionFilled /></el-icon>
                                        </el-tooltip>
                                    </div>
                                </template>
                                <template #default="{ row }">
                                    {{ priceFormat(row.refundAmount) }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="orderCount" :width="140" align="left">
                                <template #header>
                                    <div class="flex flex-align-center">
                                        <p>支付订单数</p>
                                        <el-tooltip placement="top" effect="light">
                                            <template #content> 所选时间内，分销员客户的所有已支付的订单。目前仅支持展示2023.11后的数据。 </template>
                                            <el-icon size="16" color="#c8c9cc" style="margin-left: 5px"><QuestionFilled /></el-icon>
                                        </el-tooltip>
                                    </div>
                                </template>
                                <template #default="{ row }">
                                    {{ row.orderCount }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="refundCount" :width="140" align="left">
                                <template #header>
                                    <div class="flex flex-align-center">
                                        <p>退款订单数</p>
                                        <el-tooltip placement="top" effect="light">
                                            <template #content>
                                                所选时间内，分销员客户的全额退款和部分退款的订单总数。目前仅支持展示2023.11后的数据。
                                            </template>
                                            <el-icon size="16" color="#c8c9cc" style="margin-left: 5px"><QuestionFilled /></el-icon>
                                        </el-tooltip>
                                    </div>
                                </template>
                                <template #default="{ row }">
                                    {{ row.refundCount }}
                                </template>
                            </el-table-column>
                            <el-table-column label="已结算收益" prop="totalCommission" :width="100">
                                <template #default="{ row }">
                                    {{ priceFormat(row.totalCommission) }}
                                </template>
                            </el-table-column>
                            <el-table-column label="累计收益" prop="totalAmountCommission" :width="100">
                                <template #default="{ row }">
                                    <DialogForm
                                        :params="{ act: 'detail', id: row.salesmanId }"
                                        :isDrawer="false"
                                        :showFooter="false"
                                        path="salesman/salesmanDetailed/src/cumulativeGain"
                                        title="佣金详情"
                                        width="600px"
                                        @okCallback="loadFilter"
                                    >
                                        <a class="btn-link">{{ priceFormat(row.totalAmountCommission) }}</a>
                                    </DialogForm>
                                </template>
                            </el-table-column>
                            <el-table-column label="累计客户数" prop="totalCustomer" :width="100">
                                <template #default="{ row }">
                                    {{ row.totalCustomer }}
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
                <div v-if="selectedIds.length > 0" class="selected-action-warp">
                    <div class="selected-action">
                        <el-space>
                            <span
                                >已选择：<b>{{ selectedIds.length }}</b> 项</span
                            >
                        </el-space>
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
import { promoterDetailsFilterState } from "@/types/salesman/promoter.d"

;
import { getsalesmanDetails, exportsalesmanDetails } from "@/api/salesman/promoter";
import { priceFormat } from "@/utils/format";
import { formattedDate } from "@/utils/time";
import { getDays } from "@/utils/util";
import { QuestionFilled } from "@element-plus/icons-vue";
import requestExport from "@/utils/export";
import { SelectSalesmanGroup, SelectPromoteMode } from "@/components/select";
const config: any = useConfigStore();
// 基本参数定义
const filterState = ref<promoterDetailsFilterState[]>([]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const waitingCheckedCount = ref<number>(0);
const selectedIds = ref<number[]>([]);
const filterParams = reactive<any>({
    page: 1,
    sortField: "",
    sortOrder: "",
    mobile: "",
    groupId: "",
    level: ""
    // startTime: "",
    // endTime: "",
    // timeType: 1
});
const dateType = ref(-1);
const changeDateType = (event: number) => {
    if (event === -1) {
        dateType.value = event;
        return;
    }
    filterParams.startTime = formattedDate(new Date(), "YYYY-MM-DD");
    if (event === 0) {
        //今天
        filterParams.endTime = formattedDate(new Date(), "YYYY-MM-DD");
    }
    if (event === 1) {
        //昨天
        filterParams.startTime = formattedDate(getDays(1, "sub"), "YYYY-MM-DD");
        filterParams.endTime = formattedDate(getDays(1, "sub"), "YYYY-MM-DD");
    }
    if (event === 2) {
        //近七天
        filterParams.endTime = formattedDate(getDays(7, "add"), "YYYY-MM-DD");
    }
    if (event === 3) {
        //近30天
        filterParams.endTime = formattedDate(getDays(30, "add"), "YYYY-MM-DD");
    }
    if (event === 4) {
        //近半年
        filterParams.endTime = formattedDate(getDays(180, "add"), "YYYY-MM-DD");
    }
};
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getsalesmanDetails({ ...filterParams, size: config.pageSize });
        filterState.value = result.records;
        total.value = result.total;
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};
const Exportloading = ref<boolean>(false);
const handleExport = async () => {
    Exportloading.value = true;
    try {
        const result = await exportsalesmanDetails({ ...filterParams, isExport: "1", size: -1 });
        Exportloading.value = false;
        requestExport(result, "分销员明细导出");
    } catch (error: any) {
        message.error(error.message);
    } finally {
        Exportloading.value = false;
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
