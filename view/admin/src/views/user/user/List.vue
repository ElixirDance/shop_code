<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-table-list-warp">
                <div class="list-table-tool lyecs-search-warp">
                    <el-form :model="filterParams" @keyup.enter="onSearchSubmit">
                        <div class="advanced-search-warp list-table-tool-row">
                            <div class="simple-form-warp">
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <div class="control-container">
                                            <TigInput
                                                v-model="filterParams.keyword"
                                                name="keyword"
                                                placeholder="输入会员名称/手机号/邮箱"
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
                                        <label class="control-label"><span>用户筛选：</span></label>
                                        <div class="control-container">
                                            <el-select v-model="filterParams.fromTag" clearable @change="onSearchSubmit">
                                                <el-option :value="1" label="微信公众号" />
                                                <el-option :value="2" label="微信小程序" />
                                                <el-option :value="3" label="H5" />
                                                <el-option :value="4" label="PC" />
                                                <el-option :value="5" label="APP" />
                                            </el-select>
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>可用余额大于：</span></label>
                                        <div class="control-container">
                                            <TigInput type="decimal" v-model="filterParams.balance" clearable @clear="onSearchSubmit" />
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>积分大于：</span></label>
                                        <div class="control-container">
                                            <TigInput type="integer" v-model="filterParams.pointsGt" clearable @clear="onSearchSubmit" />
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>积分小于：</span></label>
                                        <div class="control-container">
                                            <TigInput type="integer" v-model="filterParams.pointsLt" clearable @clear="onSearchSubmit" />
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <el-button type="primary" @click="onSearchSubmit">搜索</el-button>
                                </div>
                            </div>
                        </div>
                        <div class="list-table-tool-row">
                            <div class="list-table-tool-col">
                                <el-space>
                                    <DialogForm :params="{ act: 'add' }" isDrawer path="user/user/Info" title="添加会员" width="560px" @okCallback="loadFilter">
                                        <el-button type="primary">添加会员</el-button>
                                    </DialogForm>
                                    <el-popconfirm title="您确认要批量删除所选数据吗？" @confirm="onBatchSubmit('del')">
                                        <template #reference>
                                            <el-button :disabled="selectedIds.length === 0">批量删除</el-button>
                                        </template>
                                    </el-popconfirm>
                                    <DialogForm
                                        :params="{ act: 'setRank', ids: selectedIds }"
                                        isDrawer
                                        path="user/user/BatchRank"
                                        title="批量修改会员等级"
                                        width="600px"
                                        @okCallback="loadFilter"
                                    >
                                        <el-button :disabled="selectedIds.length === 0">批量修改会员等级</el-button>
                                    </DialogForm>
                                    <span v-if="selectedIds.length > 0">
                                        已选择：<b>{{ selectedIds.length }}</b> 项
                                    </span>
                                </el-space>
                            </div>
                            <div class="list-table-tool-col"></div>
                        </div>
                    </el-form>
                </div>
                <div class="table-container">
                    <a-spin :spinning="loading">
                        <el-table
                            :data="filterState"
                            :loading="loading"
                            :total="total"
                            row-key="userId"
                            @selection-change="onSelectChange"
                            @sort-change="onSortChange"
                        >
                            <el-table-column type="selection" width="32" />
                            <el-table-column :width="200" label="会员名称" prop="username" sortable="custom">
                                <template #default="{ row }">
                                    <div class="avatar-info">
                                        <el-avatar :size="30" :src="imageFormat(row.avatar)" />
                                        <div class="info">
                                            <UserCard v-if="row.username != row.mobile" :user="row.username" :isCompanyAuth="row.isCompanyAuth"></UserCard>
                                            <MobileCard :mobile="row.mobile"></MobileCard>
                                            <div v-if="row.fromTagName">
                                                <Tag
                                                    :color="row.fromTag === 2 || row.fromTag === 5 ? '#31c19e' : '#1890FF'"
                                                    :text="row.fromTagName"
                                                    :transparent="false"
                                                    style="margin-left: 0"
                                                ></Tag>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column :width="140" label="会员等级" prop="rankName">
                                <template #default="{ row }">
                                    <div class="rank-container">
                                        <el-image v-if="row.rankLogo" :src="imageFormat(row.rankLogo)" class="image" fit="contain" />
                                        <div class="text">{{ row.rankName }}</div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column :width="140" label="是否认证" prop="isCompanyAuth">
                                <template #default="{ row }">
                                    <div>
                                        <div v-if="row.isCompanyAuth" style="color: #67c23a">已认证</div>
                                        <div v-else style="color: #f50">未认证</div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="余额" prop="balance" sortable="custom">
                                <template #default="{ row }">
                                    <ul>
                                        <li>{{ row.balance }}</li>
                                        <li v-if="row.frozenBalance > 0" style="color: #999999">(冻结：{{ row.frozenBalance }})</li>
                                    </ul>
                                </template>
                            </el-table-column>
                            <el-table-column :width="100" label="消费积分" prop="points" sortable="custom"></el-table-column>
                            <el-table-column label="累计消费次数" prop="orderCount" sortable="custom"></el-table-column>
                            <el-table-column label="累计消费金额" prop="orderAmount" sortable="custom"></el-table-column>
                            <el-table-column :width="160" label="注册日期" prop="regTime" sortable="custom"></el-table-column>
                            <el-table-column :width="250" fixed="right" label="操作">
                                <template #default="{ row }">
                                    <DialogForm
                                        :params="{ act: 'detail', id: row.userId }"
                                        isDrawer
                                        path="user/user/Detail"
                                        title="会员管理"
                                        width="800px"
                                        @okCallback="loadFilter"
                                        @callback="loadFilter"
                                        :showClose="false"
                                        :showOnOk="false"
                                    >
                                        <a class="btn-link">查看</a>
                                    </DialogForm>
                                    <el-divider direction="vertical" />
                                    <DialogForm
                                        :params="{ act: 'user', id: row.userId }"
                                        :showOnOk="false"
                                        isDrawer
                                        path="order/order/List"
                                        :title="row.username + ' - 查看订单'"
                                        width="1200px"
                                    >
                                        <a class="btn-link">查看订单</a>
                                    </DialogForm>
                                    <el-divider direction="vertical" />
                                    <DialogForm
                                        :params="{ id: row.userId }"
                                        isDrawer
                                        path="user/user/AccountLog"
                                        :title="'会员' + row.username + '的账目明细'"
                                        width="800px"
                                        @okCallback="loadFilter"
                                    >
                                        <a class="btn-link">账目明细</a>
                                    </DialogForm>
                                    <el-divider direction="vertical" />
                                    <DeleteRecord :params="{ id: row.userId }" :requestApi="delUser" @afterDelete="loadFilter">删除 </DeleteRecord>
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
import { useConfigStore } from "@/store/config";
import { UserFilterParams, UserFilterState } from "@/types/user/user.d";
import { batchSubmit, delUser, getUserList } from "@/api/user/user";
import { SelectRankList } from "@/components/select";
import { imageFormat } from "@/utils/format";
import { Tag } from "@/components/form";
import MobileCard from "@/components/list/src/MobileCard.vue";
import UserCard from "@/components/list/src/UserCard.vue";

const config: any = useConfigStore();
// 基本参数定义
const filterState = ref(<UserFilterState[]>[]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const filterParams = reactive<UserFilterParams>({
    //初使化用于查询的参数
    page: 1,
    size: config.get("pageSize"),
    sortField: "",
    sortOrder: "",
    keyword: "",
    rankId: 0
});
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getUserList({ ...filterParams });
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
const onSelectChange = (e: UserFilterState[]) => {
    selectedIds.value = e.map((item) => item.userId);
};
</script>
<style lang="less" scoped>
.avatar-info {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 0 8px;
    align-items: center;
    gap: 14px;

    .info {
        display: flex;
        flex-direction: column;
    }
}

.rank-container {
    display: flex;
    align-items: center; /* 垂直居中 */

    .image {
        width: 18px;
        height: 18px;
    }

    .text {
        margin-left: 3px;
    }
}
</style>
