<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-table-list-warp">
                <div class="list-table-tool lyecs-search-warp">
                    <div class="advanced-search-warp list-table-tool-row">
                        <div class="simple-form-warp">
                            <div class="simple-form-field">
                                <div class="form-group">
                                    <label class="control-label"><span>商品名称：</span></label>
                                    <div class="control-container">
                                        <TigInput
                                            v-model="filterParams.productName"
                                            name="productName"
                                            placeholder="输入商品名称/货号"
                                            @keyup.enter="onSearchSubmit"
                                            clearable
                                            @clear="onSearchSubmit"
                                        ></TigInput>
                                    </div>
                                </div>
                            </div>
                            <div class="simple-form-field">
                                <div class="form-group">
                                    <label class="control-label"><span>商品状态：</span></label>
                                    <div class="control-container">
                                        <el-select v-model="filterParams.status" clearable @change="onSearchSubmit">
                                            <el-option label="上架" :value="1" />
                                            <el-option label="下架" :value="0" />
                                        </el-select>
                                    </div>
                                </div>
                            </div>
                            <div class="simple-form-field">
                                <div class="form-group">
                                    <label class="control-label"><span>推广类型：</span></label>
                                    <div class="control-container">
                                        <el-select v-model="filterParams.salesmanProductType" clearable @change="onSearchSubmit">
                                            <el-option v-for="(item, index) in salesmanProductTypeList" :label="item" :value="index" />
                                        </el-select>
                                    </div>
                                </div>
                            </div>
                            <div class="simple-form-field">
                                <el-button type="primary" @click="onSearchSubmit">搜索</el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="table-container">
                    <a-spin :spinning="loading">
                        <el-table :data="filterState" :total="total" row-key="productId" @selection-change="onSelectChange" @sort-change="onSortChange">
                            <el-table-column type="selection" width="32" />
                            <el-table-column label="商品" prop="productId" :min-width="150">
                                <template #default="{ row }">
                                    <div class="flex">
                                        <div v-if="row.picThumb" class="span-pic">
                                            <a :href="urlFormat({ path: 'product', sn: row.productSn })" target="_blank"
                                                ><img :src="imageFormat(row.picThumb)" height="50" width="50"
                                            /></a>
                                        </div>
                                        <div class="span-product-con">
                                            <div class="span-product-name">
                                                <!-- <PopForm
                                                    :max="100"
                                                    v-model:org-value="row.productName"
                                                    :params="{ id: row.productId, field: 'productName' }"
                                                    :requestApi="updateSalesmanProductFiled"
                                                    label="商品名称"
                                                    type="textarea"> -->
                                                <div>{{ row.productName }}</div>
                                                <!-- </PopForm> -->
                                            </div>
                                            <p v-if="row.brandName" class="span-product-brand">
                                                <span class="span-tit">商品：</span><span class="span-con">{{ row.brandName }}</span>
                                            </p>
                                            <p v-if="row.storeTitle" class="span-product-brand">
                                                <span class="span-tit">店铺：</span><span class="span-con green">{{ row.storeTitle }}</span>
                                            </p>
                                            <p v-if="row.suppliersName" class="span-product-brand">
                                                <span class="span-tit">供应商：</span><span class="span-con green">{{ row.suppliersName }}</span>
                                            </p>
                                            <p v-if="row.type === 2"><span class="span-con green">【虚拟商品】</span></p>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="金额(元)">
                                <template #default="{ row }">
                                    {{ priceFormat(row.productPrice) }}
                                </template>
                            </el-table-column>
                            <el-table-column label="库存">
                                <template #default="{ row }">
                                    {{ row.productStock }}
                                </template>
                            </el-table-column>
                            <el-table-column label="是否参与推广">
                                <template #default="{ row }">
                                    {{ row.salesmanProduct && row.salesmanProduct.isJoin == 1 ? "参与" : "不参与" }}
                                </template>
                            </el-table-column>
                            <el-table-column label="佣金">
                                <template #default="{ row }"> 默认比例 </template>
                            </el-table-column>
                            <el-table-column label="商品佣金">
                                <template #default="{ row }">
                                    {{ row.salesmanProduct?.productCommission.productCommission || "--" }}
                                </template>
                            </el-table-column>
                            <el-table-column label="下级分销员卖货提成">
                                <template #default="{ row }">
                                    {{ row.salesmanProduct?.productCommission.subCommission || "--" }}
                                </template>
                            </el-table-column>
                            <el-table-column label="商品状态">
                                <template #default="{ row }">
                                    {{ row.productStatus === 1 ? "上架" : "下架" }}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作时间">
                                <template #default="{ row }">
                                    {{ row.salesmanProduct?.updateTime }}
                                </template>
                            </el-table-column>
                            <el-table-column :width="120" fixed="right" label="操作">
                                <template #default="{ row }">
                                    <el-space :size="0">
                                        <DialogForm
                                            :maskClose="false"
                                            :params="{
                                                act: row.salesmanProduct?.salesmanProductId ? 'detail' : 'add',
                                                id: row.productId,
                                                salesmanProduct: row.salesmanProduct
                                            }"
                                            isDrawer
                                            path="salesman/product/Info"
                                            title="设置商品佣金"
                                            width="800px"
                                            @okCallback="loadFilter"
                                        >
                                            <a class="btn-link">设置佣金</a>
                                        </DialogForm>
                                    </el-space>
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
                                <template #reference> </template>
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
import { productFilterParams, productFilterState } from "@/types/salesman/product";
import { batchSubmit, getSalesmanProductList, updateSalesmanProductFiled, getSalesmanProductnConfig } from "@/api/salesman/product";
import { SelectBrand, SelectCategory, SelectShop } from "@/components/select";
import { imageFormat, urlFormat, priceFormat } from "@/utils/format";
import { formattedDate } from "@/utils/time";

const config: any = useConfigStore();
// 基本参数定义
const filterState = ref<productFilterState[]>([]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const waitingCheckedCount = ref<number>(0);
const selectedIds = ref<number[]>([]);
const filterParams = reactive<productFilterParams>({
    page: 1,
    size: config.pageSize,
    sortField: "",
    sortOrder: "",
    productName: "",
    status: "",
});
const adminType = ref(localStorage.getItem("adminType"));
const onTabChange = (val: number) => {
    loadFilter();
};

// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getSalesmanProductList({ ...filterParams });
        filterState.value = result.records;
        total.value = result.total;
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};
const salesmanProductTypeList = ref();
const _getSalesmanProductnConfig = async () => {
    try {
        const result = await getSalesmanProductnConfig();
        salesmanProductTypeList.value = result;
    } catch (error: any) {
        message.error(error.message);
    }
};
onMounted(() => {
    loadFilter();
    _getSalesmanProductnConfig();
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
const onSelectChange = (e: any) => {
    selectedIds.value = e.map((item: any) => item.productId);
};
</script>
<style lang="less" scoped>
.status-switch {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 150px;
}

.status-switch > div {
    word-break: keep-all;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
}
.list-table-tool {
    margin-bottom: 0;
}
</style>
