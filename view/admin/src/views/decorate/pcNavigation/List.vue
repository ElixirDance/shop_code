<template>
    <div class="container">
        <div class="content_wrapper">
            <el-tabs v-model="activeKey" class="lyecs-tabs" tab-position="top" @tab-change="onTabChange">
                <el-tab-pane :name="1" label="主导航"></el-tab-pane>
                <el-tab-pane :name="2" label="顶部小导航"></el-tab-pane>
                <el-tab-pane :name="3" label="底部导航"></el-tab-pane>
                <el-tab-pane :name="4" label="侧边导航"></el-tab-pane>
            </el-tabs>
            <div v-if="activeKey != null && activeKey != 2" class="container">
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
                                                placeholder="输入导航栏名称"
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
                                                :params="{ act: 'add', type: activeKey, typeName }"
                                                :title="'添加' + typeName"
                                                isDrawer
                                                path="decorate/pcNavigation/Info"
                                                width="560px"
                                                @okCallback="loadFilter"
                                            >
                                                <el-button type="primary">{{ "添加" + typeName }}</el-button>
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
                                row-key="id"
                                @selection-change="onSelectChange"
                                @sort-change="onSortChange"
                            >
                                <el-table-column type="selection" width="32" />
                                <el-table-column :width="200" label="名称" prop="title"></el-table-column>
                                <el-table-column :width="100" label="位置" prop="typeName"></el-table-column>
                                <el-table-column label="是否显示" prop="isShow">
                                    <template #default="{ row }">
                                        <Switch v-model:checked="row.isShow" :params="{ id: row.id, field: 'isShow' }" :requestApi="updatePcNavigationField" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="是否新窗口">
                                    <template #default="{ row }">
                                        <Switch
                                            v-model:checked="row.isBlank"
                                            :params="{ id: row.id, field: 'isBlank' }"
                                            :requestApi="updatePcNavigationField"
                                        />
                                    </template>
                                </el-table-column>
                                <el-table-column label="排序" prop="sortOrder" sortable="custom">
                                    <template #default="{ row }">
                                        <PopForm
                                            v-model:org-value="row.sortOrder"
                                            :params="{ id: row.id, field: 'sortOrder' }"
                                            :requestApi="updatePcNavigationField"
                                            extra="默认值为50，数值越小，排序越靠前"
                                            label="排序"
                                            type="integer"
                                        >
                                            <div>{{ row.sortOrder }}</div>
                                        </PopForm>
                                    </template>
                                </el-table-column>
                                <el-table-column :width="150" fixed="right" label="操作">
                                    <template #default="{ row }">
                                        <DialogForm
                                            :params="{ act: 'detail', type: activeKey, id: row.id }"
                                            :title="'编辑商城' + typeName + '导航栏'"
                                            isDrawer
                                            path="decorate/pcNavigation/Info"
                                            width="560px"
                                            @okCallback="loadFilter"
                                        >
                                            <a class="btn-link">编辑</a>
                                        </DialogForm>
                                        <el-divider direction="vertical" />
                                        <DeleteRecord :params="{ id: row.id }" :requestApi="delPcNavigation" @afterDelete="loadFilter">删除 </DeleteRecord>
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
            <Tree v-else></Tree>
        </div>
    </div>
</template>

<script lang="ts" setup>
import "@/style/css/list.less";
import { DialogForm } from "@/components/dialog";
import { PopForm } from "@/components/pop-form";
import { computed, onMounted, reactive, ref } from "vue";
import { DeleteRecord, Pagination, Switch } from "@/components/list";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import { PcNavigationFilterParams, PcNavigationFilterState } from "@/types/decorate/pcNavigation.d";
import { batchSubmit, delPcNavigation, getPcNavigationList, updatePcNavigationField } from "@/api/decorate/pcNavigation";
import Tree from "./src/Tree.vue"

const config: any = useConfigStore();
// 基本参数定义
const filterState = ref(<PcNavigationFilterState[]>[]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const filterParams = reactive<PcNavigationFilterParams>({
    //初使化用于查询的参数
    page: 1,
    size: config.get("pageSize"),
    sortField: "",
    sortOrder: "",
    keyword: "",
    type: 1
});
const activeKey = ref<number>(1);
const typeName = computed(() => {
    return activeKey.value === 1 ? "主导航" : activeKey.value === 2 ? "顶部小导航" : activeKey.value === 3 ? "底部导航" : "侧边导航";
});
const onTabChange = (val: number) => {
    filterParams.type = val;
    if(val == 2){
        return;
    }
    loadFilter();
};

// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getPcNavigationList({ ...filterParams });
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
const onSelectChange = (e: PcNavigationFilterState[]) => {
    selectedIds.value = e.map((item) => item.id);
};
</script>
