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
                                            placeholder="输入楼层名称"
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
                                            :params="{ act: 'add' }"
                                            isDrawer
                                            path="decorate/pcCatFloor/Info"
                                            title="添加抽屉楼层"
                                            width="800px"
                                            @okCallback="loadFilter"
                                        >
                                            <el-button type="primary">添加抽屉楼层</el-button>
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
                                        <!--                                    <el-button :loading="false"  @click="onClearCache">清除分类抽屉缓存 </el-button>-->
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
                            row-key="catFloorId"
                            @selection-change="onSelectChange"
                            @sort-change="onSortChange"
                        >
                            <el-table-column type="selection" width="32" />
                            <el-table-column :width="100" label="楼层图标">
                                <template #default="{ row }">
                                    <em :class="row.floorIcoFont" class="main_pel_m"></em>
                                </template>
                            </el-table-column>
                            <el-table-column label="楼层名称" prop="catFloorName">
                                <template #default="{ row }">
                                    <span>{{ row.catFloorName ? row.catFloorName : "--" }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :width="120" label="是否显示" sortable="custom">
                                <template #default="{ row }">
                                    <Switch
                                        v-model:checked="row.isShow"
                                        :params="{ id: row.catFloorId, field: 'isShow' }"
                                        :requestApi="updatePcCatFloorField"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column :width="120" label="排序" prop="sortOrder" sortable="custom">
                                <template #default="{ row }">
                                    <PopForm
                                        v-model:org-value="row.sortOrder"
                                        :params="{ id: row.catFloorId, field: 'sortOrder' }"
                                        :requestApi="updatePcCatFloorField"
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
                                        :params="{ act: 'detail', id: row.catFloorId }"
                                        isDrawer
                                        path="decorate/pcCatFloor/Info"
                                        title="编辑抽屉楼层"
                                        width="800px"
                                        @okCallback="loadFilter"
                                    >
                                        <a class="btn-link">编辑</a>
                                    </DialogForm>
                                    <el-divider direction="vertical" />
                                    <DeleteRecord :params="{ id: row.catFloorId }" :requestApi="delPcCatFloor" @afterDelete="loadFilter">删除 </DeleteRecord>
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
import { PopForm } from "@/components/pop-form";
import { onMounted, reactive, ref } from "vue";
import { DeleteRecord, Pagination, Switch } from "@/components/list";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import { PcCatFloorFilterParams, PcCatFloorFilterState } from "@/types/decorate/pcCatFloor.d";
import { batchSubmit, clearPcCatFloorCache, delPcCatFloor, getPcCatFloorList, updatePcCatFloorField } from "@/api/decorate/pcCatFloor";
import { Image } from "@/components/image";
import { updateFirstWorld } from "@/api/product/brand";
import { useLoadCss } from "@/utils/domUtils";
const configStore = useConfigStore();
if (configStore.config.icoDefinedCss) {
    useLoadCss(configStore.config.icoDefinedCss);
}

const config: any = useConfigStore();
// 基本参数定义
const filterState = ref(<PcCatFloorFilterState[]>[]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const filterParams = reactive<PcCatFloorFilterParams>({
    //初使化用于查询的参数
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
        const result = await getPcCatFloorList({ ...filterParams });
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
const onSelectChange = (e: PcCatFloorFilterState[]) => {
    selectedIds.value = e.map((item) => item.catFloorId);
};

const onClearCache = async () => {
    try {
        const result = await clearPcCatFloorCache();
        message.success("操作成功");
        await loadFilter();
    } catch (error: any) {
        message.error(error.message);
    }
};
</script>
