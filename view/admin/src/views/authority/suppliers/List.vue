<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-table-list-warp">
                <div class="list-table-tool lyecs-search-warp">
                    <div class="notice-warp">
                        <p>- 添加供应商后，您可以在商品编辑中，设置商品所属供应商</p>
                        <p>- 供应商可通过其管理员账号，登录管理员后台，权限默认为处理订单和退货</p>
                        <p>- 供应商只能看到有自己所属商品的订单，且只能对其所属商品进行发货操作</p>
                    </div>
                    <div class="advanced-search-warp list-table-tool-row">
                        <div class="simple-form-warp">
                            <div class="simple-form-field">
                                <div class="form-group">
                                    <div class="control-container">
                                        <TigInput
                                            v-model="filterParams.keyword"
                                            name="keyword"
                                            placeholder="输入关键词"
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
                                            path="authority/suppliers/Info"
                                            title="添加供应商"
                                            width="580px"
                                            @okCallback="loadFilter"
                                        >
                                            <el-button type="primary">添加供应商</el-button>
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
                            row-key="suppliersId"
                            @selection-change="onSelectChange"
                            @sort-change="onSortChange"
                        >
                            <el-table-column type="selection" width="32" />
                            <el-table-column label="供应商名称" width="200">
                                <template #default="{ row }">
                                    <PopForm
                                        v-model:org-value="row.suppliersName"
                                        :max="10"
                                        :params="{ id: row.suppliersId, field: 'suppliersName' }"
                                        :requestApi="updateSuppliersField"
                                        label="权限组名称"
                                        type="input"
                                    >
                                        <div>{{ row.suppliersName }}</div>
                                    </PopForm>
                                </template>
                            </el-table-column>
                            <el-table-column label="负责人姓名" prop="contactName"></el-table-column>
                            <el-table-column label="负责人联系方式" prop="contactPhone"></el-table-column>
                            <el-table-column label="供应商状态">
                                <template #default="{ row }">
                                    <Switch
                                        v-model:checked="row.isCheck"
                                        :params="{ id: row.suppliersId, field: 'isCheck' }"
                                        :requestApi="updateSuppliersField"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column :width="180" fixed="right" label="操作">
                                <template #default="{ row }">
                                    <DialogForm
                                        :params="{ act: 'detail', id: row.suppliersId }"
                                        isDrawer
                                        path="authority/suppliers/Info"
                                        title="编辑供应商"
                                        width="580px"
                                        @okCallback="loadFilter"
                                    >
                                        <a class="btn-link">编辑</a>
                                    </DialogForm>
                                    <el-divider direction="vertical" />
                                    <DialogForm
                                        :params="{ act: 'suppliers', id: row.suppliersId }"
                                        :showOnOk="false"
                                        isDrawer
                                        path="authority/adminUser/List"
                                        :title="row.suppliersName + ' - 账号管理'"
                                        width="1000px"
                                    >
                                        <a class="btn-link">账号管理</a>
                                    </DialogForm>
                                    <el-divider direction="vertical" />
                                    <DeleteRecord :params="{ id: row.suppliersId }" :requestApi="delSuppliers" @afterDelete="loadFilter">删除 </DeleteRecord>
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
import type { SuppliersFilterParams, SuppliersFilterState } from "@/types/authority/suppliers";
import { batchSubmit, delSuppliers, getSuppliersList, updateSuppliersField } from "@/api/authority/suppliers";

const config: any = useConfigStore();
// 基本参数定义
const filterState = ref(<SuppliersFilterState[]>[]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const filterParams = reactive<SuppliersFilterParams>({
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
        const result = await getSuppliersList({ ...filterParams });
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
const onSelectChange = (e: SuppliersFilterState[]) => {
    selectedIds.value = e.map((item) => item.suppliersId);
};
</script>
