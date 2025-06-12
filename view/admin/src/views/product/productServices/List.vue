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
                                            <TigInput v-model="filterParams.keyword" name="keyword" placeholder="输入服务名称" clearable @clear="onSearchSubmit">
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
                                                path="product/productServices/Info"
                                                title="添加商品服务"
                                                width="600px"
                                                @okCallback="loadFilter"
                                            >
                                                <el-button type="primary">添加商品服务</el-button>
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
                    </el-form>
                </div>
                <div class="table-container">
                    <a-spin :spinning="loading">
                        <el-table
                            :data="filterState"
                            :loading="loading"
                            :total="total"
                            row-key="productServiceId"
                            @selection-change="onSelectChange"
                            @sort-change="onSortChange"
                        >
                            <el-table-column type="selection" width="32" />
                            <el-table-column :width="300" label="服务名称" prop="productServiceId" sortable="custom">
                                <template #default="{ row }">
                                    <div style="position: relative">
                                        <PopForm
                                            label="服务名称"
                                            type="textarea"
                                            :requestApi="updateProductServicesFiled"
                                            v-model:org-value="row.productServiceName"
                                            :params="{ id: row.productServiceId, field: 'productServiceName' }"
                                            :max="100"
                                        >
                                            <div>{{ row.productServiceName }}</div>
                                        </PopForm>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="图标">
                                <template #default="{ row }">
                                    <Image :src="row.icoImg" fit="contain" style="height: 25px" />
                                </template>
                            </el-table-column>
                            <el-table-column label="简介" prop="productServiceDesc">
                                <template #default="{ row }">
                                    <PopForm
                                        :max="100"
                                        label="简介"
                                        type="input"
                                        :requestApi="updateProductServicesFiled"
                                        v-model:org-value="row.productServiceDesc"
                                        :params="{ id: row.productServiceId, field: 'productServiceDesc' }"
                                    >
                                        <div>{{ row.productServiceDesc }}</div>
                                    </PopForm>
                                </template>
                            </el-table-column>
                            <el-table-column label="默认显示" prop="defaultOn" sortable="custom">
                                <template #default="{ row }">
                                    <Switch
                                        v-model:checked="row.defaultOn"
                                        :requestApi="updateProductServicesFiled"
                                        :params="{ id: row.productServiceId, field: 'defaultOn' }"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column label="排序" prop="sortOrder" sortable="custom">
                                <template #default="{ row }">
                                    <PopForm
                                        label="排序"
                                        type="integer"
                                        :requestApi="updateProductServicesFiled"
                                        v-model:org-value="row.sortOrder"
                                        :params="{ id: row.productServiceId, field: 'sortOrder' }"
                                        extra="默认值为50，数值越小，排序越靠前"
                                    >
                                        <div>{{ row.sortOrder }}</div>
                                    </PopForm>
                                </template>
                            </el-table-column>
                            <el-table-column :width="150" fixed="right" label="操作">
                                <template #default="{ row }">
                                    <DialogForm
                                        :params="{ act: 'detail', id: row.productServiceId }"
                                        isDrawer
                                        path="product/productServices/Info"
                                        title="编辑商品服务"
                                        width="600px"
                                        @okCallback="loadFilter"
                                    >
                                        <a class="btn-link">编辑</a>
                                    </DialogForm>
                                    <el-divider direction="vertical" />
                                    <DeleteRecord :params="{ id: row.productServiceId }" :requestApi="delProductServices" @afterDelete="loadFilter"
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
import { DeleteRecord, Switch, Pagination } from "@/components/list";
import { Image } from "@/components/image";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import { ProductServicesFilterParams, ProductServicesFilterState } from "@/types/product/productServices";
import { batchSubmit, delProductServices, getProductServicesList, updateProductServicesFiled } from "@/api/product/productServices";

const config: any = useConfigStore();
// 基本参数定义
const filterState = ref<ProductServicesFilterState[]>();
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);

const filterParams = reactive<ProductServicesFilterParams>({
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
        const result = await getProductServicesList({ ...filterParams });
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
const onSelectChange = (e: Object[]) => {
    selectedIds.value = e.map((item: any) => item.productServiceId);
};
</script>
