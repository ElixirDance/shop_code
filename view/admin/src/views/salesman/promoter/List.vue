<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-table-list-warp">
                <div class="list-table-tool lyecs-search-warp">
                    <el-form :model="filterParams" name="form">
                        <div class="advanced-search-warp list-table-tool-row">
                            <div class="simple-form-warp">
                                <div class="simple-form-field" style="margin-right: 10px">
                                    <div class="form-group">
                                        <TigInput
                                            v-model="filterParams.mobile"
                                            name="mobile"
                                            placeholder="输入分销员手机号或昵称"
                                            @keyup.enter="onSearchSubmit"
                                            clearable
                                            @clear="onSearchSubmit"
                                        >
                                            <template #append>
                                                <el-button @click="onSearchSubmit"><span class="iconfont icon-chakan1"></span></el-button>
                                            </template>
                                        </TigInput>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>加入时间：</span></label>
                                        <div class="control-container flex flex-align-center">
                                            <SelectTimeInterval
                                                type="date"
                                                v-model:start-date="filterParams.addTimeStart"
                                                v-model:end-date="filterParams.addTimeEnd"
                                                @callback="changeDateType(-1)"
                                            ></SelectTimeInterval>
                                            <div style="margin-left: 10px">
                                                <el-radio-group class="itemWidth" v-model="dateType" @change="changeDateType">
                                                    <el-radio-button :value="0">今天</el-radio-button>
                                                    <el-radio-button :value="1">昨天</el-radio-button>
                                                    <el-radio-button :value="2">近7天</el-radio-button>
                                                    <el-radio-button :value="3">近30天</el-radio-button>
                                                    <el-radio-button :value="4">近半年</el-radio-button>
                                                </el-radio-group>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>邀请方：</span></label>
                                        <div class="control-container">
                                            <TigInput
                                                v-model="filterParams.pidMobile"
                                                name="pidMobile"
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
                                    <DialogForm
                                        :params="{ act: 'add' }"
                                        isDrawer
                                        path="salesman/promoter/Info"
                                        title="添加分销员"
                                        width="550px"
                                        @okCallback="loadFilter"
                                    >
                                        <el-button type="primary">添加分销员</el-button>
                                    </DialogForm>
                                </div>
                            </div>
                        </div>
                    </el-form>
                </div>
                <div class="table-container">
                    <a-spin :spinning="loading">
                        <el-table :data="filterState" :total="total" row-key="salesmanId" @selection-change="onSelectChange" @sort-change="onSortChange">
                            <!-- <el-table-column type="selection" width="32" fixed="left"/> -->
                            <el-table-column label="昵称" prop="salesmanId" :width="140" fixed="left">
                                <template #default="{ row }">
                                    {{ row.baseUserInfo?.nickname || row.baseUserInfo?.username }}
                                </template>
                            </el-table-column>
                            <el-table-column label="手机号" :width="140" fixed="left">
                                <template #default="{ row }">
                                    {{ row.baseUserInfo?.mobile || "--" }}
                                </template>
                            </el-table-column>
                            <el-table-column label="等级">
                                <template #default="{ row }">
                                    {{ row.levelText || "--" }}
                                </template>
                            </el-table-column>
                            <el-table-column label="分组">
                                <template #default="{ row }">
                                    {{ row.groupInfo?.groupName || "--" }}
                                </template>
                            </el-table-column>
                            <el-table-column label="邀请方">
                                <template #default="{ row }">
                                    {{ row.pidMobile || "--" }}
                                </template>
                            </el-table-column>
                            <el-table-column label="累计销售额(元)" sortable="custom" :width="160">
                                <template #default="{ row }">
                                    {{ priceFormat(row.saleAmount) }}
                                </template>
                            </el-table-column>
                            <!-- <el-table-column label="累计佣金(元)" sortable="custom" :width="140">
                                <template #default="{ row }">
                                    11
                                </template>
                            </el-table-column>
                            <el-table-column label="累计客户数" sortable="custom">
                                <template #default="{ row }">
                                    11
                                </template>
                            </el-table-column>
                            <el-table-column label="累计邀请数" sortable="custom">
                                <template #default="{ row }">
                                    11
                                </template>
                            </el-table-column> -->
                            <el-table-column label="加入时间" sortable="custom">
                                <template #default="{ row }">
                                    {{ row.addTime }}
                                </template>
                            </el-table-column>
                            <el-table-column :width="120" fixed="right" label="操作">
                                <template #default="{ row }">
                                    <el-space :size="0">
                                        <DialogForm
                                            :maskClose="false"
                                            :showClose="false"
                                            :showOnOk="false"
                                            :params="{ act: 'detail', id: row.salesmanId }"
                                            dialogClass="noPadding"
                                            isDrawer
                                            path="salesman/promoter/Detail"
                                            title="分销员详情"
                                            width="900px"
                                            @okCallback="loadFilter"
                                        >
                                            <a class="btn-link">详情</a>
                                        </DialogForm>
                                        <el-divider direction="vertical" />
                                        <DialogForm
                                            :maskClose="false"
                                            :params="{ act: 'detail', id: row.salesmanId }"
                                            isDrawer
                                            path="salesman/promoter/Info"
                                            title="编辑分销员"
                                            width="550px"
                                            @okCallback="loadFilter"
                                        >
                                            <a class="btn-link">编辑</a>
                                        </DialogForm>
                                        <!-- <el-divider direction="vertical" />
                                        <DialogForm
                                            :maskClose="false"
                                            :params="{ act: 'detail', id: row.salesmanId }"
                                            dialogClass="noPadding"
                                            :isDrawer="false"
                                            path="salesman/promoter/Clearance"
                                            title="清退分销员"
                                            width="600px"
                                            @okCallback="loadFilter">
                                            <a class="btn-link">清退</a>
                                        </DialogForm> -->
                                    </el-space>
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
                            <el-button>设置等级</el-button>
                            <el-button>分组</el-button>
                            <el-button>清退</el-button>
                        </el-space>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import "@/style/css/list.less";
import { SelectTimeInterval } from "@/components/select";
import { DialogForm } from "@/components/dialog";
import { onMounted, reactive, ref } from "vue";
import { Pagination } from "@/components/list";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import { promoterFilterParams, promoterFilterState } from "@/types/salesman/promoter.d";
import { batchSubmit, getsalesmanList } from "@/api/salesman/promoter";
import { SelectSalesmanGroup, SelectPromoteMode } from "@/components/select";
import { priceFormat } from "@/utils/format";
import { formattedDate } from "@/utils/time";
import { getDays } from "@/utils/util";

const config: any = useConfigStore();
// 基本参数定义
const filterState = ref<promoterFilterState[]>([]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const waitingCheckedCount = ref<number>(0);
const selectedIds = ref<number[]>([]);
const filterParams = reactive<promoterFilterParams>({
    page: 1,
    size: config.pageSize,
    sortField: "",
    sortOrder: "",
    mobile: "",
    pidMobile: "",
    level: "",
    groupId: "",
    addTimeStart: "",
    addTimeEnd: ""
});
const dateType = ref(-1);
const changeDateType = (event: number) => {
    if (event === -1) {
        dateType.value = event;
        return;
    }
    filterParams.addTimeStart = formattedDate(new Date(), "YYYY-MM-DD");
    if (event === 0) {
        //今天
        filterParams.addTimeEnd = formattedDate(new Date(), "YYYY-MM-DD");
    }
    if (event === 1) {
        //昨天
        filterParams.addTimeStart = formattedDate(getDays(1, "sub"), "YYYY-MM-DD");
        filterParams.addTimeEnd = formattedDate(getDays(1, "sub"), "YYYY-MM-DD");
    }
    if (event === 2) {
        //近七天
        filterParams.addTimeEnd = formattedDate(getDays(7, "add"), "YYYY-MM-DD");
    }
    if (event === 3) {
        //近30天
        filterParams.addTimeEnd = formattedDate(getDays(30, "add"), "YYYY-MM-DD");
    }
    if (event === 4) {
        //近半年
        filterParams.addTimeEnd = formattedDate(getDays(180, "add"), "YYYY-MM-DD");
    }
    loadFilter();
};
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getsalesmanList({ ...filterParams });
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
const onSelectChange = (e: any) => {
    selectedIds.value = e.map((item: any) => item.salesmanId);
};
</script>
<style lang="less" scoped>
.list-table-tool {
    margin-bottom: 0;
}
</style>
