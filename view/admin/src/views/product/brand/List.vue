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
                                            <TigInput
                                                v-model="filterParams.keyword"
                                                name="keyword"
                                                placeholder="输入品牌名称"
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
                                        <label class="control-label"><span>是否显示：</span></label>
                                        <div class="control-container">
                                            <el-select v-model="filterParams.isShow" clearable @change="onSearchSubmit">
                                                <!-- <el-option :value="-1" label="请选择..."/> -->
                                                <el-option :value="0" label="不显示" />
                                                <el-option :value="1" label="显示" />
                                            </el-select>
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>是否热门：</span></label>
                                        <div class="control-container">
                                            <el-select v-model="filterParams.brandIsHot" clearable @change="onSearchSubmit">
                                                <!-- <el-option :value="-1" label="请选择..."/> -->
                                                <el-option :value="0" label="否" />
                                                <el-option :value="1" label="是" />
                                            </el-select>
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>首字母：</span></label>
                                        <div class="control-container">
                                            <TigInput v-model="filterParams.firstWord" @keyup.enter="onSearchSubmit" clearable @clear="onSearchSubmit" />
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
                                    <DialogForm
                                        :params="{ act: 'add' }"
                                        isDrawer
                                        path="product/brand/Info"
                                        title="添加品牌"
                                        width="600px"
                                        @okCallback="loadFilter"
                                    >
                                        <el-button type="primary">添加品牌</el-button>
                                    </DialogForm>
                                    <router-link v-if="isOverseas()" :to="{ path: '/setting/multilingual/translationContent/list', query: { type: 'brand' } }">
                                        <el-button>批量翻译品牌名称</el-button>
                                    </router-link>
                                    <el-popconfirm title="您确认要批量删除所选数据吗？" @confirm="onBatchSubmit('del')">
                                        <template #reference>
                                            <el-button :disabled="selectedIds.length === 0">批量删除</el-button>
                                        </template>
                                    </el-popconfirm>
                                    <el-button :loading="false" :disabled="selectedIds.length === 0" @click="onUpdateFirstWorld">批量更新品牌首字母 </el-button>
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
                        <el-table
                            :data="filterState"
                            :loading="loading"
                            :total="total"
                            row-key="brandId"
                            show-overflow-tooltip
                            @selection-change="onSelectChange"
                            @sort-change="onSortChange"
                        >
                            <el-table-column type="selection" width="32" />
                            <el-table-column :width="200" label="品牌名称" prop="brandId" sortable="custom">
                                <template #default="{ row }">
                                    <PopForm
                                        v-model:org-value="row.brandName"
                                        :max="30"
                                        :params="{ id: row.brandId, field: 'brandName' }"
                                        :requestApi="updateBrandField"
                                        label="品牌名称"
                                        type="textarea"
                                    >
                                        {{ row.brandName }}
                                    </PopForm>
                                </template>
                            </el-table-column>
                            <el-table-column label="品牌缩略图">
                                <template #default="{ row }">
                                    <!-- <Image :src="row.brandLogo" fit="contain" style="height: 25px; width: 60px" /> -->
                                </template>
                            </el-table-column>
                            <el-table-column label="首字母">
                                <template #default="{ row }">
                                    <PopForm
                                        v-model:org-value="row.firstWord"
                                        :len="1"
                                        :params="{ id: row.brandId, field: 'firstWord' }"
                                        :requestApi="updateBrandField"
                                        label="首字母"
                                        type="input"
                                    >
                                        <div>{{ row.firstWord || "-" }}</div>
                                    </PopForm>
                                </template>
                            </el-table-column>
                            <el-table-column label="是否热销">
                                <template #default="{ row }">
                                    <Switch
                                        v-model:checked="row.brandIsHot"
                                        :params="{ id: row.brandId, field: 'brandIsHot' }"
                                        :requestApi="updateBrandField"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column label="是否显示" prop="isShow" sortable="custom">
                                <template #default="{ row }">
                                    <Switch v-model:checked="row.isShow" :params="{ id: row.brandId, field: 'isShow' }" :requestApi="updateBrandField" />
                                </template>
                            </el-table-column>
                            <el-table-column label="排序" prop="sortOrder" sortable="custom">
                                <template #default="{ row }">
                                    <PopForm
                                        v-model:org-value="row.sortOrder"
                                        :params="{ id: row.brandId, field: 'sortOrder' }"
                                        :requestApi="updateBrandField"
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
                                        :params="{ act: 'detail', id: row.brandId }"
                                        isDrawer
                                        path="product/brand/Info"
                                        title="编辑品牌"
                                        width="600px"
                                        @okCallback="loadFilter"
                                    >
                                        <a class="btn-link">编辑</a>
                                    </DialogForm>
                                    <el-divider direction="vertical" />
                                    <DeleteRecord :params="{ id: row.brandId }" :requestApi="delBrand" @afterDelete="loadFilter">删除 </DeleteRecord>
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
import { Image } from "@/components/image";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import { BrandFilterParams, BrandFilterState } from "@/types/product/brand";
import { batchSubmit, delBrand, getBrandList, updateBrandField, updateFirstWorld } from "@/api/product/brand";
import { isOverseas } from "@/utils/version";
const config: any = useConfigStore();
// 基本参数定义
const filterState = ref<BrandFilterState[]>([]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const advancedSearch = ref<boolean>(false);
const filterParams = reactive<BrandFilterParams>({
    //初使化用于查询的参数
    page: 1,
    size: config.get("pageSize"),
    sortField: "",
    sortOrder: "",
    keyword: "",
    firstWord: ""
});
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getBrandList({ ...filterParams });
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
const onSelectChange = (e: BrandFilterState[]) => {
    selectedIds.value = e.map((item) => item.brandId);
};

// 更新首字母
const onUpdateFirstWorld = async () => {
    try {
        const result = await updateFirstWorld();
        message.success("操作成功");
        loadFilter();
    } catch (error: any) {
        message.error(error.message);
    }
};
</script>
