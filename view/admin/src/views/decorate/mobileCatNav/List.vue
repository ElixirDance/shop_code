<template>
    <div class="container">
        <div class="content_wrapper">
            <!-- <el-tabs v-model="activeKey" class="lyecs-tabs" tab-position="top" @tab-change="onTabChange">
                <el-tab-pane :name="1" label="主导航"></el-tab-pane>
                <el-tab-pane :name="2" label="顶部小导航"></el-tab-pane>
                <el-tab-pane :name="3" label="底部导航"></el-tab-pane>
                <el-tab-pane :name="4" label="侧边导航"></el-tab-pane>
            </el-tabs> -->
            <div class="container">
                <div class="lyecs-table-list-warp">
                    <div class="list-table-tool lyecs-search-warp">
                        <el-form :model="filterParams">
                            <div class="list-table-tool-row">
                                <div class="list-table-tool-col">
                                    <el-space>
                                        <DialogForm :params="{ act: 'add' }" title="添加首页分类栏" isDrawer path="decorate/mobileCatNav/Info" width="600px"
                                                    @okCallback="loadFilter">
                                            <el-button type="primary">添加首页分类栏</el-button>
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
                                <div class="list-table-tool-col"></div>
                            </div>
                        </el-form>
                    </div>
                    <div class="table-container">
                        <a-spin :spinning="loading">
                            <el-table :data="filterState" :loading="loading" :total="total" row-key="id" @selection-change="onSelectChange" @sort-change="onSortChange">
                                <el-table-column type="selection" width="32" />
                                <el-table-column :width="200" label="首页分类栏名称" prop="categoryName"></el-table-column>
                                <el-table-column :width="100" label="分类颜色" prop="categoryName" a>
                                    <template #default="{ row }">
                                        <div class="colorCard" :style="{backgroundColor: row.catColor}"></div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="是否显示" prop="isShow">
                                    <template #default="{ row }">
                                        <Switch v-model:checked="row.isShow" :params="{ id: row.mobileCatNavId, field: 'isShow' }" :requestApi="updateMobileCatNavFiled" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="排序" prop="sortOrder" sortable="custom">
                                    <template #default="{ row }">
                                        <PopForm v-model:org-value="row.sortOrder" :params="{ id: row.mobileCatNavId, field: 'sortOrder' }" :requestApi="updateMobileCatNavFiled"
                                            extra="默认值为50，数值越小，排序越靠前" label="排序" type="integer">
                                            <div>{{ row.sortOrder }}</div>
                                        </PopForm>
                                    </template>
                                </el-table-column>
                                <el-table-column :width="150" fixed="right" label="操作">
                                    <template #default="{ row }">
                                        <DialogForm :params="{ act: 'detail', id: row.mobileCatNavId }" :title="'编辑首页分类栏'" isDrawer path="decorate/mobileCatNav/Info" width="600px"
                                            @okCallback="loadFilter">
                                            <a class="btn-link">编辑</a>
                                        </DialogForm>
                                        <el-divider direction="vertical" />
                                        <DeleteRecord :params="{ id: row.mobileCatNavId }" :requestApi="delMobileCatNav" @afterDelete="loadFilter">删除
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
    </div>
</template>

<script lang="ts" setup>
import '@/style/css/list.less'
import { DialogForm } from '@/components/dialog'
import { PopForm } from '@/components/pop-form'
import { computed, onMounted, reactive, ref } from 'vue';
import { DeleteRecord, Pagination, Switch } from '@/components/list';
import { message } from 'ant-design-vue'
import { useConfigStore } from "@/store/config";
import { MobileCatNavFilterParams, MobileCatNavFilterState } from '@/types/decorate/mobileCatNav.d';
import { batchSubmit, delMobileCatNav, getMobileCatNavList, updateMobileCatNavFiled } from "@/api/decorate/mobileCatNav";

const config:any = useConfigStore();
// 基本参数定义
const filterState = ref(<MobileCatNavFilterState[]>[]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const filterParams = reactive<MobileCatNavFilterParams>({   //初使化用于查询的参数
    page: 1,
    size: config.get('pageSize'),
    sortField: '',
    sortOrder: ''
});
// const activeKey = ref<number>(1)
// const typeName = computed(() => {
//     return activeKey.value === 1 ? '主导航' : (activeKey.value === 2 ? '顶部小导航' : (activeKey.value === 3 ? '底部导航' : '侧边导航'))
// })
// const onTabChange = (val: number) => {
//     loadFilter()
// }

// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getMobileCatNavList({ ...filterParams });
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
const onSelectChange = (e: MobileCatNavFilterState[]) => {
    selectedIds.value = e.map((item) => item.mobileCatNavId);
};
</script>
<style scoped>
.color_card{
    width:20px;
    height:20px;
    border-radius: 3px;
}
</style>
