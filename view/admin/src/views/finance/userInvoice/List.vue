<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-table-list-warp">
                <div class="list-table-tool lyecs-search-warp">
                    <el-form :model="filterParams">
                        <div class="advanced-search-warp list-table-tool-row">
                            <div class="simple-form-warp">
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <div class="control-container">
                                            <TigInput v-model="filterParams.keyword" name="keyword" placeholder="输入申请会员/公司名称" @keyup.enter="onSearchSubmit" clearable @clear="onSearchSubmit">
                                                <template #append>
                                                    <el-button @click="onSearchSubmit"><span class="iconfont icon-chakan1"></span></el-button>
                                                </template>
                                            </TigInput>
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>申请状态：</span></label>
                                        <div class="control-container">
                                            <el-select clearable placeholder="请选择状态" v-model="filterParams.status" @change="onSearchSubmit">
                                                <el-option v-for="item in statusList" :label="item.label" :value="item.value"></el-option>
                                            </el-select>
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
                        <el-table :data="filterState" :loading="loading" :total="total" row-key="invoiceId"
                                  @selection-change="onSelectChange" @sort-change="onSortChange">
                            <el-table-column type="selection" width="32"/>
                            <el-table-column label="申请会员" prop="username">
                                <template #default="{ row }">
                                    {{ row.username || '--' }}
                                </template>
                            </el-table-column>
                            <el-table-column label="公司名称" prop="companyName"></el-table-column>
                            <el-table-column label="申请日期" prop="addTime"></el-table-column>
                            <el-table-column label="申请状态" prop="statusName">
                                <template #default="{ row }">
                                    <span :style="{color:row.status===1?'green':(row.status===2?'black':'red')}">{{row.statusName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :width="100" fixed="right" label="操作">
                                <template #default="{ row }">
                                    <DialogForm :params="{ act: 'detail', id: row.invoiceId }" isDrawer
                                                path="finance/userInvoice/Info"
                                                title="编辑增票资质申请" width="600px"
                                                @okCallback="loadFilter">
                                        <a class="btn-link">编辑</a>
                                    </DialogForm>
                                    <el-divider direction="vertical"/>
                                    <DeleteRecord :params="{ id: row.invoiceId }" :requestApi="delUserInvoice"
                                                  @afterDelete="loadFilter">删除
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
                        <Pagination v-model:page="filterParams.page" v-model:size="filterParams.size" :total="total"
                                    @callback="loadFilter"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import '@/style/css/list.less'
import {DialogForm} from '@/components/dialog'
import {onMounted, reactive, ref} from 'vue';
import {DeleteRecord, Pagination} from '@/components/list';
import {message} from 'ant-design-vue'
import {useConfigStore} from "@/store/config";
import {UserInvoiceFilterParams, UserInvoiceFilterState} from '@/types/finance/userInvoice';
import {batchSubmit, delUserInvoice, getUserInvoiceList} from "@/api/finance/userInvoice";

const config:any = useConfigStore();
// 基本参数定义
const filterState = ref(<UserInvoiceFilterState[]>[]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const advancedSearch = ref<boolean>(false);
const filterParams = reactive<UserInvoiceFilterParams>({   //初使化用于查询的参数
    page: 1,
    size: config.get('pageSize'),
    sortField: '',
    sortOrder: '',
    keyword: '',
});

const statusList = ref([
    {value: 1, label: '审核通过'},
    {value: 2, label: '待审核'},
    {value: 3, label: '审核未通过'},
])

// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getUserInvoiceList({...filterParams});
        filterState.value = result.records;
        total.value = result.total;
    } catch (error:any) {
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
const onSortChange = ({prop, order}: { prop: string; order?: string }) => {
    filterParams.sortField = prop;
    filterParams.sortOrder = order == 'ascending' ? 'asc' : order == 'descending' ? 'desc' : '';
    loadFilter();
};

// 批量操作
const onBatchSubmit = async (action: string) => {
    try {
        const result = await batchSubmit(action, {ids: selectedIds.value});
        message.success("操作成功");
        loadFilter();
    } catch (error:any) {
        message.error(error.message);
    }
};
// 多选操作
const onSelectChange = (e: UserInvoiceFilterState[]) => {
    selectedIds.value = e.map((item) => item.invoiceId);
};



</script>
