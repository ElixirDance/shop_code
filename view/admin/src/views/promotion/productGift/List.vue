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
                                            <TigInput v-model="filterParams.keyword" name="keyword" placeholder="输入赠品名称" clearable @clear="onSearchSubmit">
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
                                            <DialogForm isDrawer @okCallback="loadFilter" title="添加赠品" width="900px"
                                                        path="promotion/productGift/Info" :params="{ act: 'add' }">
                                                <el-button type="primary">添加赠品</el-button>
                                            </DialogForm>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="list-table-tool-row">
                            <div class="list-table-tool-col">
                                <el-space>
                                    <DialogForm isDrawer @okCallback="loadFilter" title="添加赠品" width="900px"
                                                path="promotion/productGift/Info" :params="{ act: 'add' }">
                                        <el-button type="primary">添加赠品</el-button>
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
                        </div> -->
                    </el-form>
                </div>
                <div class="table-container">
                    <a-spin :spinning="loading">
                        <el-table :data="filterState" row-key="id" @selection-change="onSelectChange" :total="total"
                            @sort-change="onSortChange" :loading="loading">
<!--                             <el-table-column type="selection" width="32" />-->
                            <el-table-column label="赠品名称" prop="giftName" width="120"></el-table-column>
                            <el-table-column label="商品信息" prop="productName">
                                <template #default="{ row }">
                                    <div class="product-info">
                                        <img :src="imageFormat(row.productInfo.picThumb)" height="50" width="50" />
                                        <p>{{ row.productInfo.productName }}</p>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="赠品库存" prop="giftStock" sortable="custom"></el-table-column>
                            <el-table-column label="操作" fixed="right" :width="150">
                                <template #default="{ row }">
                                    <DialogForm isDrawer @okCallback="loadFilter" title="编辑赠品" width="900px"
                                        path="promotion/productGift/Info" :params="{ act: 'detail', id: row.giftId }">
                                        <a class="btn-link">编辑</a>
                                    </DialogForm>
                                    <el-divider direction="vertical" />
                                    <DeleteRecord @afterDelete="loadFilter" :requestApi="delProductGift"
                                        :params="{ id: row.giftId }">删除</DeleteRecord>
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
    </div>
</template>

<script setup lang="ts">
import '@/style/css/list.less'
import { DialogForm } from '@/components/dialog'
import { ref, reactive, onMounted } from 'vue';
import { DeleteRecord, Pagination } from '@/components/list';
import { message } from 'ant-design-vue'
import { ProductGiftFilterState, ProductGiftFilterParams } from '@/types/promotion/productGift.d';
import { getProductGiftList, delProductGift, batchSubmit } from "@/api/promotion/productGift";
import { useConfigStore } from "@/store/config"
import { imageFormat } from "@/utils/format";
const config:any = useConfigStore();
// 基本参数定义
const domain = ref(useConfigStore().domain)
const filterState = ref<ProductGiftFilterState[]>();
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const filterParams = reactive<ProductGiftFilterParams>({
    page: 1,
    size: config.get('pageSize'),
    sortField: '',
    sortOrder: '',
    keyword: ''
});
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getProductGiftList({ ...filterParams });
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
const onSelectChange = (e: ProductGiftFilterState[]) => {
    selectedIds.value = e.map((item) => item.giftId);
};
</script>
<style lang="less" scoped>
.product-info{
    display: flex;
    align-items: center;
    img{
        margin-right: 10px;
    }
}
</style>
