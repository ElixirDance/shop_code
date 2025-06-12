<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-table-list-warp">
                <div class="list-table-tool lyecs-search-warp">
                    <el-form :model="filterParams">
                        <div class="list-table-tool-row">
                            <div class="list-table-tool-col">
                                <el-space>
                                    <DialogForm isDrawer @okCallback="loadFilter" title="添加充值余额" width="600px" path="promotion/rechargeSetting/Info" :params="{ act: 'add' }">
                                        <el-button type="primary">添加充值余额</el-button>
                                    </DialogForm>
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
                        <el-table :data="filterState" row-key="rechargeId" @selection-change="onSelectChange" :total="total" @sort-change="onSortChange" :loading="loading">
                            <el-table-column type="selection" width="32" />
                            <el-table-column label="充值金额" prop="money">
                                <template #default="{ row }">
                                    <div style="position: relative;">
                                        <PopForm label="充值金额" type="decimal" :requestApi="updateRechargeSettingFiled" v-model:org-value="row.money"
                                            :params="{ id: row.rechargeId, field: 'money' }" :max="50">
                                            <div>{{ row.money }}</div>
                                        </PopForm>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="赠送金额" prop="discountMoney">
                                <template #default="{ row }">
                                    <div style="position: relative;">
                                        <PopForm label="赠送金额" type="decimal" :requestApi="updateRechargeSettingFiled" v-model:org-value="row.discountMoney"
                                            :params="{ id: row.rechargeId, field: 'discountMoney' }" :max="50">
                                            <div>{{ row.discountMoney }}</div>
                                        </PopForm>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="是否显示" prop="isShow" sortable="custom">
                                <template #default="{ row }">
                                    <Switch v-model:checked="row.isShow" :requestApi="updateRechargeSettingFiled" :params="{ id: row.rechargeId, field: 'isShow' }" />
                                </template>
                            </el-table-column>
                            <el-table-column label="排序" prop="sortOrder" sortable="custom">
                                <template #default="{ row }">
                                    <PopForm label="排序" type="integer" :requestApi="updateRechargeSettingFiled" v-model:org-value="row.sortOrder"
                                        :params="{ id: row.rechargeId, field: 'sortOrder' }" extra="默认值为50，数值越小，排序越靠前">
                                        <div>{{ row.sortOrder }}</div>
                                    </PopForm>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" fixed="right" :width="150">
                                <template #default="{ row }">
                                    <DialogForm isDrawer @okCallback="loadFilter" title="编辑示例模板" width="600px" path="promotion/rechargeSetting/Info"
                                        :params="{ act: 'detail', id: row.rechargeId }">
                                        <a class="btn-link">编辑</a>
                                    </DialogForm>
                                    <el-divider direction="vertical" />
                                    <DeleteRecord @afterDelete="loadFilter" :requestApi="delRechargeSetting" :params="{ id: row.rechargeId }">删除</DeleteRecord>
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
                        <Pagination v-model:page="filterParams.page" v-model:size="filterParams.size" :total="total" @callback="loadFilter" />
                    </div>
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
import { RechargeSettingFilterState, RechargeSettingFilterParams } from '@/types/promotion/rechargeSetting.d';
import { getRechargeSettingList, batchSubmit, updateRechargeSettingFiled, delRechargeSetting } from "@/api/promotion/rechargeSetting";
const config:any = useConfigStore();
// 基本参数定义
const filterState = ref<RechargeSettingFilterState[]>();
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const filterParams = reactive<RechargeSettingFilterParams>({
    page: 1,
    size: config.get('pageSize'),
    sortField: '',
    sortOrder: '',
});
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getRechargeSettingList({ ...filterParams });
        filterState.value = result.records;
        total.value = result.total;
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
const onSelectChange = (e: RechargeSettingFilterState[]) => {
    selectedIds.value = e.map((item) => item.rechargeId);
};
</script>
