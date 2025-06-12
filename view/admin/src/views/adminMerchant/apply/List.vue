<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-table-list-warp">
                <div class="list-table-tool lyecs-search-warp">
                    <div class="advanced-search-warp list-table-tool-row">
                        <div class="simple-form-warp">
                            <div class="simple-form-field">
                                <div class="form-group">
                                    <div class="control-container">
                                        <TigInput
                                            v-model="filterParams.username"
                                            name="username"
                                            placeholder="输入会员名称"
                                            @keyup.enter="onSearchSubmit"
                                            clearable
                                            @clear="onSearchSubmit"
                                        >
                                            <template #append>
                                                <el-button @click="onSearchSubmit"><span class="iconfont icon-chakan1"></span> </el-button>
                                            </template>
                                        </TigInput>
                                    </div>
                                </div>
                            </div>
                            <div class="simple-form-field">
                                <div class="form-group">
                                    <SelectConfig @callback="onChangeFilter"></SelectConfig>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="filterParams.status == 20" class="list-table-tool-row">
                        <div class="list-table-tool-col">
                            <el-space>
                                <el-popconfirm title="您确认要批量删除所选数据吗？" @confirm="onBatchSubmit('del')">
                                    <template #reference>
                                        <el-button :disabled="selectedIds.length === 0 || filterParams.status != 20">批量删除</el-button>
                                    </template>
                                </el-popconfirm>
                                <span v-if="selectedIds.length > 0">
                                    已选择：<b>{{ selectedIds.length }}</b> 项
                                </span>
                            </el-space>
                        </div>
                        <div class="list-table-tool-col"></div>
                    </div>
                </div>
                <div class="table-container">
                    <a-spin :spinning="loading">
                        <el-table
                            :data="filterState"
                            :loading="loading"
                            :total="total"
                            row-key="merchantApplyId"
                            @selection-change="onSelectChange"
                            @sort-change="onSortChange"
                        >
                            <el-table-column v-if="filterParams.status == 20" type="selection" width="32" />
                            <el-table-column label="申请信息">
                                <template #default="{ row }">
                                    <div class="ssdw">
                                        <template v-if="row.type == 1">
                                            <Tag :transparent="true" text="个人"></Tag>
                                        </template>
                                        <template v-else>
                                            <Tag color="#409EFF" :transparent="false" text="企业"></Tag>
                                        </template>
                                        {{ row.type == 1 ? "" + row.corporateName : "" + row.companyName }}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="申请会员名称(ID)">
                                <template #default="{ row }">
                                    <div v-if="row.user">{{ row.user.username || "" }}({{ row.user.userId || "" }})</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="联系人姓名" prop="userName">
                                <template #default="{ row }">
                                    {{ row.merchantData.contactName }}
                                </template>
                            </el-table-column>
                            <el-table-column label="联系人电话" prop="contactMobile">
                                <template #default="{ row }">
                                    <MobileCard :mobile="row.merchantData.contactPhone"></MobileCard>
                                </template>
                            </el-table-column>
                            <el-table-column label="申请状态" prop="statusText">
                                <template #default="{ row }">
                                    <template v-if="row.status == 1">
                                        <StatusDot :flicker="true"></StatusDot>
                                    </template>
                                    <template v-if="row.status == 10">
                                        <StatusDot color="#52c41a" :flicker="true"></StatusDot>
                                    </template>
                                    <template v-if="row.status == 20">
                                        <StatusDot color="#f5222d" :flicker="false"></StatusDot>
                                    </template>
                                    {{ row.statusText }}
                                </template>
                            </el-table-column>
                            <el-table-column :width="160" label="申请日期" prop="addTime" sortable="custom"></el-table-column>
                            <el-table-column :width="150" fixed="right" label="操作">
                                <template #default="{ row }">
                                    <DialogForm
                                        :showClose="false"
                                        :showOnOk="false"
                                        :params="{ act: 'detail', id: row.merchantApplyId }"
                                        isDrawer
                                        path="adminMerchant/apply/Info"
                                        title="申请详情"
                                        width="600px"
                                        @okCallback="loadFilter"
                                    >
                                        <a class="btn-link">详情</a>
                                    </DialogForm>
                                    <el-divider v-if="row.status == 20" direction="vertical" />
                                    <DeleteRecord
                                        v-if="row.status == 20"
                                        :params="{ id: row.merchantApplyId }"
                                        :requestApi="delApply"
                                        @afterDelete="loadFilter"
                                        >删除</DeleteRecord
                                    >
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
import { ApplyFilterParams, ApplyFilterState } from "@/types/adminMerchant/apply";
import { batchSubmit, delApply, getApplyList } from "@/api/adminMerchant/apply";
import SelectConfig from "@/views/adminMerchant/apply/src/SelectConfig.vue";
import { Tag } from "@/components/form";
import StatusDot from "@/components/form/src/StatusDot.vue";
import MobileCard from "@/components/list/src/MobileCard.vue";

const config: any = useConfigStore();
// 基本参数定义
const filterState = ref<ApplyFilterState[]>([]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const advancedSearch = ref<boolean>(false);
const filterParams = reactive<ApplyFilterParams>({
    //初使化用于查询的参数
    page: 1,
    size: config.get("pageSize"),
    sortField: "",
    sortOrder: "",
    username: ""
});
const onChangeFilter = (value: any) => {
    filterParams.status = value;
    loadFilter();
};
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getApplyList({ ...filterParams });
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
        await loadFilter();
    } catch (error: any) {
        message.error(error.message);
    }
};
// 多选操作
const onSelectChange = (e: ApplyFilterState[]) => {
    selectedIds.value = e.map((item) => item.merchantApplyId);
};
</script>
<style lang="less" scoped>
.ssdw {
    display: flex;
    align-items: center;
    gap: 4px;
}
</style>
