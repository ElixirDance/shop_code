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
                                            placeholder="输入权限组名称"
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
                            </div>
                            <div class="simple-form-field">
                                <div class="form-group">
                                    <div class="control-container">
                                        <DialogForm
                                            :params="{ act: 'add' }"
                                            isDrawer
                                            path="authority/adminRole/Info"
                                            title="添加管理员权限组"
                                            width="800px"
                                            @okCallback="loadFilter"
                                        >
                                            <el-button type="primary">添加管理员权限组</el-button>
                                        </DialogForm>
                                    </div>
                                </div>
                            </div>
                            <div class="simple-form-field">
                                <div class="form-group">
                                    <div class="control-container">
                                        <el-popconfirm title="您确认要批量删除所选数据吗？" @confirm="onBatchSubmit('del')">
                                            <template #reference>
                                                <el-button :disabled="selectedIds.length === 0">批量删除</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <span v-if="selectedIds.length > 0">
                                            已选择：<b>{{ selectedIds.length }}</b> 项
                                        </span>
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
                            row-key="roleId"
                            @selection-change="onSelectChange"
                            @sort-change="onSortChange"
                        >
                            <el-table-column type="selection" width="32" />
                            <el-table-column label="权限组名称" width="200">
                                <template #default="{ row }">
                                    <PopForm
                                        v-model:org-value="row.roleName"
                                        :max="10"
                                        :params="{ id: row.roleId, field: 'roleName' }"
                                        :requestApi="updateAdminRoleField"
                                        label="权限组名称"
                                        type="input"
                                    >
                                        <div>{{ row.roleName }}</div>
                                    </PopForm>
                                </template>
                            </el-table-column>
                            <el-table-column label="描述" prop="roleDesc"></el-table-column>
                            <el-table-column :width="120" fixed="right" label="操作">
                                <template #default="{ row }">
                                    <DialogForm
                                        v-if="row.roleId > 1"
                                        :params="{ act: 'detail', id: row.roleId }"
                                        isDrawer
                                        path="authority/adminRole/Info"
                                        title="编辑管理员权限组"
                                        width="800px"
                                        @okCallback="loadFilter"
                                    >
                                        <a class="btn-link">编辑</a>
                                    </DialogForm>
                                    <el-divider v-if="row.roleId > 2" direction="vertical" />
                                    <DeleteRecord v-if="row.roleId > 2" :params="{ id: row.roleId }" :requestApi="delAdminRole" @afterDelete="loadFilter"
                                        >删除
                                    </DeleteRecord>
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
import { PopForm } from "@/components/pop-form";
import { onMounted, reactive, ref } from "vue";
import { DeleteRecord, Pagination, Switch } from "@/components/list";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import type { AdminRoleFilterParams, AdminRoleFilterState } from "@/types/authority/adminRole";
import { batchSubmit, delAdminRole, getAdminRoleList, updateAdminRoleField } from "@/api/authority/adminRole";

const config: any = useConfigStore();
// 基本参数定义
const filterState = ref(<AdminRoleFilterState[]>[]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const filterParams = reactive<AdminRoleFilterParams>({
    //初始化用于查询的参数
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
        const result = await getAdminRoleList({ ...filterParams });
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
const onSelectChange = (e: AdminRoleFilterState[]) => {
    selectedIds.value = e.map((item) => item.roleId);
};
</script>
