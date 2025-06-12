<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-table-list-warp">
                <div class="list-table-tool lyecs-search-warp">
                    <el-form :model="filterParams">
                        <div class="list-table-tool-row">
                            <div class="list-table-tool-col">
                                <el-space>
                                    <el-button v-if="filterParams.parentId > 0" @click="backToParentCat"><i class="iconfont icon-fanhui"
                                                                                                             style="font-size:14px;padding-right: 5px;"></i> 返回上一级
                                    </el-button>
                                    <DialogForm :params="{ act: 'add', regionId: filterParams.parentId }" isDrawer path="setting/region/Info"
                                                title="添加地区" width="580px"
                                                @okCallback="loadFilter">
                                        <el-button type="primary">添加地区</el-button>
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
                        <el-table :data="filterState" :loading="loading" :total="total" row-key="regionId"
                                  @selection-change="onSelectChange" @sort-change="onSortChange">
                            <el-table-column type="selection" width="32"/>
                            <el-table-column :width="200" label="地区名称" prop="regionId" sortable="custom">
                                <template #default="{ row }">
                                    <div style="position: relative;">
                                        <PopForm v-model:org-value="row.regionName" :max="10" :params="{ id: row.regionId, field: 'regionName' }"
                                                 :requestApi="updateRegionField"
                                                 label="地区名称" type="textarea">
                                            <div>{{ row.regionName }}</div>
                                        </PopForm>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="首字母">
                                <template #default="{ row }">
                                    <PopForm v-model:org-value="row.firstWord" :len="1"
                                             :params="{ id: row.regionId, field: 'firstWord' }"
                                             :requestApi="updateRegionField"
                                             label="首字母" type="input">
                                        <div>{{ row.firstWord || '-' }}</div>
                                    </PopForm>
                                </template>
                            </el-table-column>
                            <el-table-column label="是否热门">
                                <template #default="{ row }">
                                    <Switch v-model:checked="row.isHot" :params="{ id: row.regionId, field: 'isHot' }" :requestApi="updateRegionField"/>
                                </template>
                            </el-table-column>
                            <el-table-column :width="200" fixed="right" label="操作">
                                <template #default="{ row }">
                                    <a class="btn-link" @click="onSearchSubmit(row.parentId,row.regionId,row.regionName)">子地区</a>
                                    <el-divider direction="vertical"/>
                                    <DialogForm :params="{ act: 'add', regionId: row.regionId }" isDrawer
                                                path="setting/region/Info"
                                                title="添加子地区" width="600"
                                                @okCallback="loadFilter">
                                        <a class="btn-link">添加子地区</a>
                                    </DialogForm>
                                    <el-divider direction="vertical"/>
                                    <DeleteRecord :params="{ id: row.regionId }" :requestApi="delRegion"
                                                  @afterDelete="loadFilter(row.parentId)">删除
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
                                    @callback="onChangePage"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import '@/style/css/list.less'
import {DialogForm} from '@/components/dialog'
import {PopForm} from '@/components/pop-form'
import {onMounted, reactive, ref} from 'vue';
import {DeleteRecord, Pagination, Switch} from '@/components/list';
import {message} from 'ant-design-vue'
import {useConfigStore} from "@/store/config";
import type {RegionFilterParams, RegionFilterState} from '@/types/setting/region';
import {batchSubmit, delRegion, getRegionList, updateRegionField} from "@/api/setting/region";
import {useAppStore} from "@/store/app";
const appStore = useAppStore();
const config:any = useConfigStore();
// 基本参数定义
const filterState = ref(<RegionFilterState[]>[]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const advancedSearch = ref<boolean>(false);
const filterParams = reactive<RegionFilterParams>({   //初使化用于查询的参数
    page: 1,
    size: config.get('pageSize'),
    sortField: '',
    sortOrder: '',
    keyword: '',
    parentId: 0,
});
const parentIds = ref<Array<number>>([])
const parentNames = ref<Array<string>>([])
const onChangePage = () => {
    loadFilter()
}
// 获取列表的查询结果
const loadFilter = async (parentId?:number|object) => {
    loading.value = true;
    try {
        if (parentId && typeof parentId === 'number'){
            filterParams.parentId = parentId
        }
        const result = await getRegionList({...filterParams});
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

const regionName = ref<string>('')
const onSearchSubmit = (pid:number, id:number, name:string) => {
    parentIds.value.push(pid)
    parentNames.value.push(name)
    filterParams.parentId = id;
    regionName.value = name
    // if (regionName.value) {
    //     appStore.setHeaderTitle('地区列表')
    // } else {
    //     appStore.setHeaderTitle('地区列表 - ' +regionName.value)
    // }
    loadFilter()
};

const backToParentCat = () => {
    filterParams.parentId = parentIds.value[parentIds.value.length - 1]
    regionName.value = parentNames.value[parentNames.value.length - 1]
    parentIds.value.pop();
    parentNames.value.pop();
    // if (regionName.value) {
    //     appStore.setHeaderTitle('地区列表')
    // } else {
    //     appStore.setHeaderTitle('地区列表 - ' +regionName.value)
    // }
    loadFilter()
}
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
const onSelectChange = (e: RegionFilterState[]) => {
    selectedIds.value = e.map((item) => item.regionId);
};

</script>
