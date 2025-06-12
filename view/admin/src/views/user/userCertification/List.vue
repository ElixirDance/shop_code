<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-table-list-warp">
                <div class="list-table-tool lyecs-search-warp">
                    <el-form :model="filterParams" @submit.native.prevent="onSearchSubmit">
                        <div class="advanced-search-warp list-table-tool-row">
                            <div class="simple-form-warp">
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <div class="control-container">
                                            <TigInput
                                                v-model="filterParams.username"
                                                name="username"
                                                placeholder="输入会员名称"
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
                    </el-form>
                </div>
                <div class="table-container">
                    <a-spin :spinning="loading">
                        <el-table
                            :data="filterState"
                            :loading="loading"
                            :total="total"
                            row-key="id"
                            @sort-change="onSortChange"
                        >
                            <el-table-column :width="250" label="申请信息" prop="companyName">
                                <template #default="{ row }">
                                    <template v-if="row.type == 1">
                                        <Tag :transparent="true" text="个人"></Tag>
                                    </template>
                                    <template v-else>
                                        <Tag color="#409EFF" :transparent="false" text="企业"></Tag>
                                    </template>
                                    {{ row.type == 1 ? "" + row.companyData.corporateName : "" + row.companyData.companyName }}
                                </template>
                            </el-table-column>
                            <el-table-column :width="200" label="申请会员名称" prop="username">
                                <template #default="{ row }">
                                    <UserCard v-if="row.username" :user="row.username"></UserCard>
                                </template>
                            </el-table-column>
                            <el-table-column label="联系人姓名" prop="companyData.corporateName">
                                <template #default="{ row }">
                                    {{ row.companyData.corporateName }}
                                </template>
                            </el-table-column>
                            <el-table-column label="联系人电话" prop="companyData.contactPhone">
                                <template #default="{ row }">
                                    <MobileCard :mobile="row.companyData.contactPhone"></MobileCard>
                                </template>
                            </el-table-column>
                            <el-table-column label="申请状态" prop="statusText">
                                <template #default="{ row }">
                                    <template v-if="row.status == 1">
                                        <StatusDot :flicker="true"></StatusDot>
                                    </template>
                                    <template v-if="row.status == 2">
                                        <StatusDot color="#52c41a" :flicker="true"></StatusDot>
                                    </template>
                                    <template v-if="row.status == 3">
                                        <StatusDot color="#f5222d" :flicker="false"></StatusDot>
                                    </template>
                                    {{ row.statusText }}
                                </template>
                            </el-table-column>
                            <el-table-column label="申请日期" prop="addTime" sortable="custom"></el-table-column>
                            <el-table-column :width="110" fixed="right" label="操作">
                                <template #default="{ row }">
                                    <DialogForm
                                        :showClose="false"
                                        :showOnOk="false"
                                        :params="{ act: 'detail', id: row.id }"
                                        isDrawer
                                        path="user/userCertification/Info"
                                        title="申请详情"
                                        width="600px"
                                        @okCallback="loadFilter"
                                    >
                                        <a class="btn-link">详情</a>
                                    </DialogForm>
                                    <el-divider v-if="row.status == 3" direction="vertical" />
                                    <DeleteRecord v-if="row.status == 3" :params="{ id: row.id }" :requestApi="delUserCompany" @afterDelete="loadFilter"
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
                <div v-if="selectedIds.length > 0" class="selected-action-warp">
                    <div class="selected-action">
                        <el-space>
                            <span
                                >已选择：<b>{{ selectedIds.length }}</b> 项</span
                            >
                            <el-popconfirm title="您确认要批量删除所选数据吗？" @confirm="onBatchSubmit('del')">
                                <template #reference>
                                    <el-button>批量删除</el-button>
                                </template>
                            </el-popconfirm>
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
import { DeleteRecord, Pagination } from "@/components/list";
import { message } from "ant-design-vue";
import StatusDot from "@/components/form/src/StatusDot.vue";
import { useConfigStore } from "@/store/config";
import { UserCompanyFilterParams, UserCompanyFilterState } from "@/types/user/userCertification.d";
import { batchSubmit, delUserCompany, getUserCompanyList } from "@/api/user/userCertification";
import { imageFormat } from "@/utils/format";
import { Tag } from "@/components/form";
import MobileCard from "@/components/list/src/MobileCard.vue";
import UserCard from "@/components/list/src/UserCard.vue";
import SelectConfig from "./src/SelectConfig.vue";

const config: any = useConfigStore();
// 基本参数定义
const filterState = ref(<UserCompanyFilterState[]>[]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const filterParams = reactive<UserCompanyFilterParams>({
    //初使化用于查询的参数
    page: 1,
    size: config.get("pageSize"),
    sortField: "",
    sortOrder: "",
    status: 0,
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
        const result = await getUserCompanyList({ ...filterParams });
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
const onSelectChange = (e: UserCompanyFilterState[]) => {
    selectedIds.value = e.map((item) => item.userId);
};
</script>
<style lang="less" scoped>

</style>
