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
                                            v-model="filterParams.keyword"
                                            name="keyword"
                                            placeholder="输入商户名称"
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
                                    <div class="control-container">
                                        <DialogForm
                                            :params="{ act: 'add' }"
                                            isDrawer
                                            path="adminMerchant/merchant/AddMerchant"
                                            title="添加商户"
                                            width="800px"
                                            @okCallback="loadFilter"
                                        >
                                            <el-button type="primary">添加商户</el-button>
                                        </DialogForm>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="table-container">
                    <a-spin :spinning="loading">
                        <el-table
                            :data="filterState"
                            :loading="loading"
                            :total="total"
                            row-key="merchantId"
                            @selection-change="onSelectChange"
                            @sort-change="onSortChange"
                        >
                            <el-table-column label="商户所属单位">
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
                            <el-table-column label="商户所属会员(ID)">
                                <template #default="{ row }">
                                    <div v-if="row.user">
                                        <UserCard :user="row.user?.username"></UserCard>{{ row.user?.userId ? "(" + row.user?.userId + ")" : "" }}
                                    </div>
                                    <div v-else>
                                        --
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="商户类型" prop="typeText"></el-table-column>
                            <el-table-column label="管理员">
                                <template #default="{ row }">
                                    <div v-if="row.admin">
                                        <UserCard :user="row.admin?.username"></UserCard>
                                    </div>
                                    <div v-else>
                                        --
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="已绑定店铺" prop="shopCount">
                                <template #default="{ row }">
                                    <el-button link @click="toPage(row)">{{ row.shopCount ? row.shopCount : "--" }}</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="认证状态" prop="statusText">
                                <template #default="{ row }">
                                    <template v-if="row.status == 1">
                                        <StatusDot color="#52c41a" :flicker="true"></StatusDot>
                                    </template>
                                    <template v-if="row.status == 2">
                                        <StatusDot color="#f5222d" :flicker="false"></StatusDot>
                                    </template>
                                    {{ row.statusText }}
                                </template>
                            </el-table-column>
                            <el-table-column label="认证日期" prop="addTime" sortable="custom"></el-table-column>
                            <el-table-column :width="80" fixed="right" label="操作">
                                <template #default="{ row }">
                                    <DialogForm
                                        :params="{ act: 'detail', id: row.merchantId }"
                                        isDrawer
                                        path="adminMerchant/merchant/Info"
                                        title="商户详情"
                                        width="600px"
                                        @okCallback="loadFilter"
                                        @callback="loadFilter"
                                        :showOnOk="false"
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
                <!--                <div v-if="selectedIds.length > 0" class="selected-action-warp">-->
                <!--                    <div class="selected-action">-->
                <!--                        <el-space>-->
                <!--                            <span-->
                <!--                            >已选择：<b>{{ selectedIds.length }}</b> 项</span-->
                <!--                            >-->
                <!--                            <el-popconfirm title="您确认要批量删除所选数据吗？" @confirm="onBatchSubmit('del')">-->
                <!--                                <template #reference>-->
                <!--                                    <el-button>批量删除</el-button>-->
                <!--                                </template>-->
                <!--                            </el-popconfirm>-->
                <!--                        </el-space>-->
                <!--                    </div>-->
                <!--                </div>-->
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import "@/style/css/list.less";
import { DialogForm } from "@/components/dialog";
import { onMounted, reactive, ref } from "vue";
import { DeleteRecord, Pagination, Switch } from "@/components/list";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import { MerchantFilterParams, MerchantFilterState } from "@/types/adminMerchant/merchant";
import { batchSubmit, getMerchantList, updateMerchantField } from "@/api/adminMerchant/merchant";
import { Tag } from "@/components/form";
import StatusDot from "@/components/form/src/StatusDot.vue";
import { updateArticleFiled } from "@/api/content/article";

const config: any = useConfigStore();
// 基本参数定义
const filterState = ref<MerchantFilterState[]>([]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const advancedSearch = ref<boolean>(false);
const filterParams = reactive<MerchantFilterParams>({
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
        const result = await getMerchantList({ ...filterParams });
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
import { useRouter } from "vue-router";
import UserCard from "@/components/list/src/UserCard.vue";

const router = useRouter();
const toPage = (val: any) => {
    console.log(val);
    router.push({ path: "/shop/list/", query: { id: val.merchantId, companyName: val.type == 2 ? val.companyName : val.corporateName } });
};

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
const onSelectChange = (e: MerchantFilterState[]) => {
    selectedIds.value = e.map((item) => item.merchantId);
};
</script>
<style lang="less" scoped>
.ssdw {
    display: flex;
    align-items: center;
    gap: 4px;
}
.font-color {
    color: var(--tig-primary);
    cursor: pointer;
}
</style>
