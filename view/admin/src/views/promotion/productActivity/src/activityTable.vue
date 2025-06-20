<template>
    <div class="container">
        <div class="lyecs-table-list-warp">
            <div class="list-table-tool lyecs-search-warp">
                <el-form :model="filterParams">
                    <div class="advanced-search-warp list-table-tool-row">
                        <div class="simple-form-warp">
                            <div class="simple-form-field">
                                <div class="form-group">
                                    <div class="control-container">
                                        <TigInput v-model="filterParams.keyword" name="keyword" placeholder="输入活动名称" @keyup.enter="onSearchSubmit" clearable @clear="onSearchSubmit">
                                            <template #append>
                                                <el-button @click="onSearchSubmit"><span class="iconfont icon-chakan1"></span></el-button>
                                            </template>
                                        </TigInput>
                                    </div>
                                </div>
                            </div>
                            <div class="simple-form-field">
                                <div class="form-group">
                                    <label class="control-label"><span>活动状态：</span></label>
                                    <div class="control-container">
                                        <el-select v-model="filterParams.isGoing" clearable @clear="onSearchSubmit" @change="onSearchSubmit">
                                            <el-option v-for="(item, key) in promotionStatus" :value="key" :label="item" />
                                        </el-select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="list-table-tool-row">
                        <div class="list-table-tool-col">
                            <el-space>
                                <slot></slot>
                                <el-popconfirm title="您确认要批量删除所选数据吗？" @confirm="onBatchSubmit('del')">
                                    <template #reference>
                                        <el-button :disabled="selectedIds.length === 0">批量删除</el-button>
                                    </template>
                                </el-popconfirm>
                                <span v-if="selectedIds.length > 0">
                                        已选择：<b>{{ selectedIds.length }}</b> 项
                                    </span>

                            </el-space>
                        </div>
                    </div>
                </el-form>
            </div>
            <div class="table-container">
                <a-spin :spinning="loading">
                    <el-table :data="filterState" row-key="promotionId" @selection-change="onSelectChange" :total="total"
                        @sort-change="onSortChange" :loading="loading">
                        <el-table-column type="selection" width="32" />
                        <el-table-column label="活动名称" prop="promotionName" :width="150">
                            <template #default="{ row }">
                                <div style="position: relative;">
                                    <div>{{ row.promotionName || '--' }}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="活动类型" prop="promotionTypeName" width="100">
                        </el-table-column>
                        <el-table-column label="起始日期" prop="startTime" width="150" sortable="custom">
                        </el-table-column>
                        <el-table-column label="截止日期" prop="endTime" width="150" sortable="custom">
                        </el-table-column>
                        <el-table-column label="排序" prop="sortOrder" sortable="custom">
                            <template #default="{ row }">
                                <PopForm label="排序" type="integer" :requestApi="updateProductActivityFiled" v-model:org-value="row.sortOrder"
                                    :params="{ id: row.promotionId, field: 'sortOrder' }" extra="默认值为50，数值越小，排序越靠前">
                                    <div>{{ row.sortOrder }}</div>
                                </PopForm>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" prop="productStatus"></el-table-column>
                        <el-table-column label="是否启用" prop="isAvailable" sortable="custom">
                                <template #default="{ row }">
                                    <Switch v-model:checked="row.isAvailable" :requestApi="updateProductActivityFiled"
                                        :params="{ id: row.promotionId, field: 'isAvailable' }" />
                                </template>
                            </el-table-column>
                        <el-table-column label="操作" fixed="right">
                            <template #default="{ row }">
                                <DialogForm isDrawer @okCallback="loadFilter" title="编辑优惠活动" width="800px"
                                    path="promotion/productActivity/Info" :params="{ act: 'detail', id: row.promotionId, promotionType: row.promotionType }">
                                    <a class="btn-link">编辑</a>
                                </DialogForm>
                                <el-divider direction="vertical" />
                                <DeleteRecord @afterDelete="loadFilter" :requestApi="delProductActivity"
                                    :params="{ id: row.promotionId }">删除</DeleteRecord>
                            </template>
                        </el-table-column>
                        <template #empty>
                            <div class="empty-warp">
                                <div v-if="!loading" class="empty-bg">暂无数据</div>
                            </div>
                        </template>
                    </el-table>
                </a-spin>
                <div class="pagination-con" v-if="total > 0">
                    <Pagination v-model:page="filterParams.page" v-model:size="filterParams.size" :total="total"
                        @callback="loadFilter" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import '@/style/css/list.less'
import { DialogForm } from '@/components/dialog'
import { PopForm } from '@/components/pop-form'
import { ref, reactive, onMounted } from 'vue';
import { DeleteRecord, Switch, Pagination } from '@/components/list';
import { message } from 'ant-design-vue'
import { useConfigStore } from "@/store/config";
import { ProductActivityFilterState, ProductActivityFilterParams } from '@/types/promotion/productActivity.d';
import { getProductActivityList, batchSubmit, updateProductActivityFiled, delProductActivity, getProductActivityConfig } from "@/api/promotion/productActivity";
const config:any = useConfigStore();
const props = defineProps({
    promotionType: {
        type: Number,
        default: 1,
    }
});
// 基本参数定义
const filterState = ref<ProductActivityFilterState[]>();
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const filterParams = reactive<ProductActivityFilterParams>({
    page: 1,
    size: config.get('pageSize'),
    sortField: '',
    sortOrder: '',
    keyword: '',
    promotionType: props.promotionType == 3 ? "3" : "1,2",
});
const promotionStatus = ref<string[]>([])
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getProductActivityList({ ...filterParams });
        filterState.value = result.records;
        total.value = result.total;
        const config = await getProductActivityConfig()
        promotionStatus.value = config.promotionStatus
        console.log(promotionStatus.value)
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
}
onMounted(() => {
    loadFilter();
});

// 参数查询
const onSearchSubmit = () => {
    loadFilter()
};
// 修改排序
const onSortChange = ({ prop, order }: { prop: string; order?: string }) => {
    filterParams.sortField = prop;
    filterParams.sortOrder = order == 'ascending' ? 'asc' : order == 'descending' ? 'desc' : '';
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
const onSelectChange = (e: ProductActivityFilterState[]) => {
    selectedIds.value = e.map((item:any) => item.promotionId);
};
defineExpose({
	loadFilter
})
</script>
<style>
</style>
