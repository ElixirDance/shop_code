<template>
    <div class="container">
        <div class="content_wrapper">
            <TigTabs v-model="activeKey" :tabs="productStatusList" @onTabChange="onTabChange" class="mb10"></TigTabs>
            <div class="lyecs-table-list-warp">
                <div class="list-table-tool lyecs-search-warp">
                    <el-form :model="filterParams" name="form">
                        <div class="advanced-search-warp list-table-tool-row">
                            <div class="simple-form-warp">
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <div class="control-container">
                                            <TigInput
                                                v-model="filterParams.keyword"
                                                name="keyword"
                                                placeholder="输入商品名称/货号"
                                                @keyup.enter="onSearchSubmit"
                                                clearable
                                                @clear="onSearchSubmit"
                                            >
                                                <template #append>
                                                    <el-button @click="onSearchSubmit"><span class="iconfont icon-chakan1"></span></el-button>
                                                </template>
                                            </TigInput>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="activeKey !== 2 && adminType != 'shop' && isMerchant()" class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>店铺：</span></label>
                                        <div class="control-container">
                                            <SelectShop v-model="filterParams.shopId" @onChange="SelectShopChange"></SelectShop>
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>分类：</span></label>
                                        <div class="control-container">
                                            <SelectCategory ref="selectCategoryRef" v-model:categoryId="filterParams.categoryId"></SelectCategory>
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>品牌：</span></label>
                                        <div class="control-container">
                                            <SelectBrand v-model:brandId="filterParams.brandId" @onChange="onSearchSubmit"></SelectBrand>
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>类型 ：</span></label>
                                        <div class="control-container">
                                            <el-select v-model="filterParams.introType" clearable @change="onSearchSubmit">
                                                <el-option label="精品" value="isBest" />
                                                <el-option label="热销" value="isHot" />
                                                <el-option label="新品" value="isNew" />
                                                <!-- <el-option label="秒杀" value="isPromote" /> -->
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
                                    <DialogForm
                                        :params="{ act: 'add' }"
                                        isDrawer
                                        path="product/product/Info"
                                        title="添加商品"
                                        width="950px"
                                        @okCallback="loadFilter"
                                    >
                                        <el-button type="primary">添加商品</el-button>
                                    </DialogForm>
                                    <router-link
                                        v-if="isOverseas() && adminType === 'admin'"
                                        :to="{ path: '/setting/multilingual/translationContent/list', query: { type: 'product' } }"
                                    >
                                        <el-button>批量翻译商品</el-button>
                                    </router-link>
                                    <router-link
                                        v-if="isOverseas() && adminType === 'shop'"
                                        :to="{ path: '/merchant_setting/shop_multilingual/shop_translationContent/list', query: { type: 'product' } }"
                                    >
                                        <el-button>批量翻译商品</el-button>
                                    </router-link>
                                    <el-popconfirm
                                        v-if="activeKey == 4 || activeKey == 1"
                                        title="您确认要批量移入回收站吗？"
                                        @confirm="onBatchSubmit('recycle')"
                                    >
                                        <template #reference>
                                            <el-button :disabled="selectedIds.length === 0">批量移入回收站</el-button>
                                        </template>
                                    </el-popconfirm>
                                    <el-popconfirm v-if="activeKey == 7" title="您确认要批量还原吗？" @confirm="onBatchSubmit('restore')">
                                        <template #reference>
                                            <el-button :disabled="selectedIds.length === 0">批量还原</el-button>
                                        </template>
                                    </el-popconfirm>
                                    <el-popconfirm v-if="activeKey == 4" title="您确认要批量上架吗？" @confirm="onBatchSubmit('up')">
                                        <template #reference>
                                            <el-button :disabled="selectedIds.length === 0">批量上架</el-button>
                                        </template>
                                    </el-popconfirm>

                                    <el-popconfirm v-if="activeKey == 1" title="您确认要批量下架吗？" @confirm="onBatchSubmit('down')">
                                        <template #reference>
                                            <el-button :disabled="selectedIds.length === 0">批量下架</el-button>
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
                        <el-table :data="filterState" :total="total" row-key="productId" @selection-change="onSelectChange" @sort-change="onSortChange">
                            <el-table-column type="selection" width="32" />
                            <el-table-column label="商品名称" prop="productId" sortable="custom" :min-width="320">
                                <template #default="{ row }">
                                    <div class="flex">
                                        <div v-if="row.picThumb" class="span-pic">
                                            <a :href="urlFormat({ path: 'product', sn: row.productSn })" target="_blank"
                                                ><img :src="imageFormat(row.picThumb)" height="40" width="40" alt=""
                                            /></a>
                                        </div>
                                        <div class="span-product-con">
                                            <div class="span-product-name" style="word-break: break-all">
                                                <PopForm
                                                    :max="100"
                                                    v-model:org-value="row.productName"
                                                    :params="{ id: row.productId, field: 'productName' }"
                                                    :requestApi="updateProductFiled"
                                                    label="商品名称"
                                                    type="textarea"
                                                >
                                                    <div>{{ row.productName }}</div>
                                                </PopForm>
                                            </div>
                                            <p v-if="row.brandName" class="span-product-brand">
                                                <span class="span-tit">商品：</span><span class="span-con">{{ row.brandName }}</span>
                                            </p>
                                            <p v-if="row.shopSimple" class="span-product-brand">
                                                <span class="span-tit">店铺：</span><span class="span-con green">{{ row.shopSimple.shopTitle }}</span>
                                            </p>
                                            <p v-if="row.shop" class="span-product-brand">
                                                <span class="span-tit">店铺：</span><span class="span-con green">{{ row.shop.shopTitle }}</span>
                                            </p>
                                            <p v-if="row.suppliersName" class="span-product-brand">
                                                <span class="span-tit">供应商：</span><span class="span-con green">{{ row.suppliersName }}</span>
                                            </p>
                                            <p v-if="row.type === 2"><span class="span-con green">【虚拟商品】</span></p>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column :width="200" label="商品信息">
                                <template #default="{ row }">
                                    <span class="span-tit">货号：</span>
                                    <div class="span-con">
                                        <PopForm
                                            v-model:org-value="row.productSn"
                                            :params="{ id: row.productId, field: 'productSn' }"
                                            :requestApi="updateProductFiled"
                                            label="货号"
                                            :max="20"
                                        >
                                            <div>{{ row.productSn || "--" }}</div>
                                        </PopForm>
                                    </div>
                                    <br />
                                    <span class="span-tit">售价：</span>
                                    <div class="span-con">
                                        <PopForm
                                            extra="请输入商品价格"
                                            isPrice
                                            v-model:org-value="row.productPrice"
                                            :params="{ id: row.productId, field: 'productPrice' }"
                                            :requestApi="updateProductFiled"
                                            label="售价"
                                            type="decimal"
                                        >
                                            <div>{{ row.productPrice || 0.0 }}</div>
                                        </PopForm>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="activeKey != 7 && activeKey != 5 && activeKey != 6" :width="100" label="是否上架">
                                <template #default="{ row }">
                                    <div class="status-switch">
                                        <div v-if="row.checkStatus == 1">
                                            <!-- <span class="span-tit">上架：</span> -->
                                            <Switch
                                                v-model:checked="row.productStatus"
                                                :params="{ id: row.productId, field: 'productStatus' }"
                                                :requestApi="updateProductFiled"
                                            />
                                        </div>
                                        <!-- <div>
                                            <span class="span-tit">精品：</span>
                                            <Switch
                                                v-model:checked="row.isBest"
                                                :params="{ id: row.productId, field: 'isBest' }"
                                                :requestApi="updateProductFiled" />
                                        </div>
                                        <div>
                                            <span class="span-tit">新品：</span>
                                            <Switch
                                                v-model:checked="row.isNew"
                                                :params="{ id: row.productId, field: 'isNew' }"
                                                :requestApi="updateProductFiled" />
                                        </div>
                                        <div>
                                            <span class="span-tit">热销：</span>
                                            <Switch
                                                v-model:checked="row.isHot"
                                                :params="{ id: row.productId, field: 'isHot' }"
                                                :requestApi="updateProductFiled" />
                                        </div> -->
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="activeKey === 5 || activeKey === 6" :width="100" label="审核状态">
                                <template #default="{ row }">
                                    <!-- <span v-if="row.checkStatus === 2" class="span-tit">审核状态：</span> -->
                                    <span v-if="row.checkStatus === 2" class="red tips-hover" :title="row.checkReason"
                                        >审核失败 <i class="ico-font">&#xe611;</i></span
                                    >
                                    <!-- <span v-if="row.checkStatus === 0" class="span-tit">审核状态：</span> -->
                                    <span v-if="row.checkStatus === 0" class="tips-hover gray" :title="row.checkReason">审核中</span><br />
                                </template>
                            </el-table-column>
                            <el-table-column v-if="activeKey === 6" :width="120" label="失败原因" show-overflow-tooltip>
                                <template #default="{ row }">
                                    {{ row.checkReason }}
                                </template>
                            </el-table-column>
                            <el-table-column v-if="activeKey != 7" :width="100" label="库存" prop="productStock" sortable="custom">
                                <template #default="{ row }">
                                    <a v-if="row.productExist">{{ row.productStock }}</a>
                                    <div v-else>
                                        <ProductStockPop
                                            v-if="!loading"
                                            :params="{ id: row.productId, productInfo: row }"
                                            :requestApi="updateProductFiled"
                                            @callback="loadFilter"
                                        >
                                            <div>{{ row.productStock }}</div>
                                        </ProductStockPop>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="activeKey != 7" :width="100" label="排序" prop="sortOrder" sortable="custom">
                                <template #default="{ row }">
                                    <PopForm
                                        v-model:org-value="row.sortOrder"
                                        :params="{ id: row.productId, field: 'sortOrder' }"
                                        :requestApi="updateProductFiled"
                                        label="排序"
                                        type="integer"
                                    >
                                        <div>{{ row.sortOrder }}</div>
                                    </PopForm>
                                </template>
                            </el-table-column>
                            <el-table-column :width="150" fixed="right" label="操作">
                                <template #default="{ row }">
                                    <el-space :size="0">
                                        <DialogForm
                                            :maskClose="false"
                                            v-if="activeKey == 5 && row.checkStatus === 0"
                                            :params="{ act: 'detail', id: row.productId, examine: 1 }"
                                            :showClose="false"
                                            :showOnOk="false"
                                            isDrawer
                                            path="product/product/Info"
                                            title="商品详情"
                                            width="900px"
                                            @okCallback="loadFilter"
                                        >
                                            <a class="btn-link">详情</a>
                                        </DialogForm>
                                        <el-divider v-if="activeKey == 5 && row.checkStatus === 0" direction="vertical" />
                                        <DialogForm
                                            :maskClose="false"
                                            v-if="activeKey == 6 && row.checkStatus === 2"
                                            :params="{ act: 'again', id: row.productId }"
                                            dialogClass="noPadding"
                                            isDrawer
                                            path="product/product/Info"
                                            title="修改商品（重新审核）"
                                            width="600px"
                                            @okCallback="loadFilter"
                                        >
                                            <a class="btn-link">重新审核</a>
                                        </DialogForm>
                                        <DialogForm
                                            :maskClose="false"
                                            v-if="activeKey == 5 && row.checkStatus === 0"
                                            :params="{ act: 'detail', id: row.productId }"
                                            dialogClass="noPadding"
                                            isDrawer
                                            path="product/product/Examine"
                                            title="商品审核"
                                            width="600px"
                                            @okCallback="loadFilter"
                                        >
                                            <a class="btn-link">去处理</a>
                                        </DialogForm>
                                        <DialogForm
                                            :maskClose="false"
                                            v-if="activeKey != 7 && activeKey != 5 && activeKey != 6"
                                            :params="{ act: 'detail', id: row.productId }"
                                            isDrawer
                                            path="product/product/Info"
                                            title="编辑商品"
                                            width="950px"
                                            @okCallback="loadFilter"
                                        >
                                            <a class="btn-link">编辑</a>
                                        </DialogForm>
                                        <el-divider v-if="activeKey != 7" direction="vertical" />
                                        <a
                                            v-if="activeKey != 7 && activeKey != 5 && activeKey != 6"
                                            class="btn-link"
                                            :href="urlFormat({ path: 'product', sn: row.productSn })"
                                            target="_blank"
                                            >查看</a
                                        >
                                        <el-divider v-if="activeKey != 7 && activeKey != 5 && activeKey != 6" direction="vertical" />
                                        <DeleteRecord
                                            v-if="activeKey === 7"
                                            :params="{ id: row.productId, field: 'isDelete', val: 0 }"
                                            :requestApi="updateProductFiled"
                                            title="确定还原该商品吗？"
                                            @afterDelete="loadFilter"
                                        >
                                            还原
                                        </DeleteRecord>
                                        <!-- <DeleteRecord
                                            v-if="activeKey === 7"
                                            :params="{ id: row.productId, isDelete: 0 }"
                                            :requestApi="delProduct"
                                            @afterDelete="loadFilter">
                                            删除
                                        </DeleteRecord>
                                        <el-divider v-if="activeKey === 7" direction="vertical" /> -->
                                        <el-dropdown trigger="hover" v-if="activeKey != 7" :hide-on-click="false">
                                            <span class="iconfont-admin icon-gengduo1 btn-link"></span>
                                            <template #dropdown>
                                                <el-dropdown-menu>
                                                    <el-dropdown-item>
                                                        <DeleteRecord
                                                            :params="{ id: row.productId, isDelete: 1 }"
                                                            :requestApi="recycleProduct"
                                                            title="确定把该商品移入回收站吗？"
                                                            @afterDelete="loadFilter"
                                                        >
                                                            移入回收站
                                                        </DeleteRecord>
                                                    </el-dropdown-item>
                                                    <el-dropdown-item>
                                                        <el-popconfirm title="确定复制?" @confirm="confirmEvent('copy', row.productId)">
                                                            <template #reference>
                                                                <el-button style="width: 100%" link type="primary">复制</el-button>
                                                            </template>
                                                        </el-popconfirm>
                                                    </el-dropdown-item>
                                                </el-dropdown-menu>
                                            </template>
                                        </el-dropdown>
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
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import "@/style/css/list.less";
import { DialogForm } from "@/components/dialog";
import { PopForm } from "@/components/pop-form";
import { onMounted, reactive, ref, computed } from "vue";
import { DeleteRecord, Pagination, Switch } from "@/components/list";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import { ProductFilterParams, ProductFilterState } from "@/types/product/product";
import { batchSubmit, recycleProduct, getProductList, updateProductFiled, updateProduct, getProductWaitingCheckedCount } from "@/api/product/product";
import { SelectBrand, SelectCategory, SelectShop } from "@/components/select";
import { imageFormat, urlFormat } from "@/utils/format";
import ProductStockPop from "./src/ProductStockPop.vue";
import { isMerchant, isOverseas } from "@/utils/version";
const config: any = useConfigStore();
// 基本参数定义
const filterState = ref<ProductFilterState[]>([]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const waitingCheckedCount = ref<number>(0);
const selectedIds = ref<number[]>([]);
const filterParams = reactive<ProductFilterParams>({
    page: 1,
    size: config.pageSize,
    sortField: "",
    sortOrder: "",
    keyword: "",
    introType: "",
    isDelete: 0,
    searchShop: 0
});
const adminType = ref(localStorage.getItem("adminType"));
const activeKey = ref<number>(1);
const onTabChange = (val: number) => {
    activeKey.value = val;
    filterParams.productStatus = val >= 1 && val <= 3 ? 1 : val >= 4 && val <= 6 ? 0 : undefined;
    filterParams.checkStatus = val >= 1 && val <= 4 ? 1 : val === 5 ? 0 : val === 6 ? 2 : undefined;
    filterParams.shopId = val === 2 ? 0 : val === 3 ? "" : "";
    filterParams.isDelete = val === 7 ? 1 : 0;
    filterParams.searchShop = val === 3 ? 1 : 0;
    Object.keys(filterParams).forEach((key) => {
        if ((filterParams as any)[key] === undefined) delete (filterParams as any)[key];
    });
    loadFilter();
};
const confirmEvent = async (act: string, id: string) => {
    try {
        const result = await updateProduct(act, { productId: id });
        message.success("操作成功");
        loadFilter();
    } catch (error: any) {
        message.error(error.message);
    }
};
const productStatusList = ref([
    {
        label: "出售中的商品",
        value: 1,
        isShow: true
    },
    {
        label: "自营商品",
        value: 2,
        isShow: adminType.value === "admin" && isMerchant()
    },
    {
        label: "店铺商品",
        value: 3,
        isShow: adminType.value === "admin" && isMerchant()
    },
    {
        label: "已下架商品",
        value: 4,
        isShow: true
    },
    {
        label: "商品回收站",
        value: 7,
        isShow: true
    },
    {
        label: "待审核商品",
        value: 5,
        count: waitingCheckedCount.value || 0,
        isShow: adminType.value === "admin" && isMerchant()
    },
    {
        label: "审核失败商品",
        value: 6,
        isShow: adminType.value === "shop"
    }
])
const selectCategoryRef = ref();
const SelectShopChange = (val: number) => {
    selectCategoryRef.value.SelectShopChange(val);
    onSearchSubmit();
};
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        if (activeKey.value === 1) {
            filterParams.productStatus = 1;
            filterParams.checkStatus = 1;
        }
        const result = await getProductList({ ...filterParams });
        const waitingCount = await getProductWaitingCheckedCount();
        filterState.value = result.records;
        total.value = result.total;
        waitingCheckedCount.value = waitingCount;
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
const onSelectChange = (e: any) => {
    selectedIds.value = e.map((item: any) => item.productId);
};
</script>
<style lang="less" scoped>
:deep(.el-popper) {
    z-index: 2000 !important;
}
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

</style>
