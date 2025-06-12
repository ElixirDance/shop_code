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
                                        <label class="control-label"><span>状态：</span></label>
                                        <div class="control-container">
                                            <el-select v-model="filterParams.status" clearable @change="onSearchSubmit">
                                                <el-option :value="0" label="未回复" />
                                                <el-option :value="1" label="已回复" />
                                            </el-select>
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>商品ID：</span></label>
                                        <div class="control-container">
                                            <TigInput
                                                v-model="filterParams.productId"
                                                name="productId"
                                                placeholder="输入商品ID"
                                                @keyup.enter="onSearchSubmit"
                                                clearable
                                                @clear="onSearchSubmit"
                                            >
                                            </TigInput>
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>手机号：</span></label>
                                        <div class="control-container">
                                            <TigInput
                                                v-model="filterParams.mobile"
                                                name="mobile"
                                                placeholder="输入询价人手机号"
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
                            row-key="id"
                            @selection-change="onSelectChange"
                            @sort-change="onSortChange"
                        >
                            <el-table-column type="selection" width="32" />
                            <el-table-column label="商品名称" prop="productId" sortable="custom" :min-width="180">
                                <template #default="{ row }">
                                    <div class="flex">
                                        <div v-if="row.product.picThumb" class="span-pic">
                                            <a :href="urlFormat({ path: 'product', sn: row.product.productSn })" target="_blank"
                                                ><img :src="imageFormat(row.product.picThumb)" height="40" width="40" alt=""
                                            /></a>
                                        </div>
                                        <div class="span-product-con">
                                            <div class="span-product-name">
                                                <div>商品名称：{{ row.product.productName }}</div>
                                                <div>商品SN：{{ row.product.productSn }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="询价内容" prop="content"></el-table-column>
                            <el-table-column :width="100" label="状态">
                                <template #default="{ row }">
                                    <span v-if="row.status === 1" class="green">已回复</span>
                                    <span v-else class="gray">未回复</span>
                                </template>
                            </el-table-column>
                            <el-table-column :width="150" label="联系方式">
                                <template #default="{ row }">
                                    <MobileCard :mobile="row.mobile"></MobileCard>
                                </template>
                            </el-table-column>
                            <el-table-column :width="150" label="创建时间" prop="createTime"></el-table-column>
                            <el-table-column :width="150" fixed="right" label="操作">
                                <template #default="{ row }">
                                    <DialogForm
                                        :params="{ act: 'detail', id: row.id }"
                                        isDrawer
                                        :showOnOk="false"
                                        path="product/enquiry/Info"
                                        :title="row.status === 1 ? '查看' : '回复' + '询价'"
                                        width="600px"
                                        @okCallback="loadFilter"
                                    >
                                        <a class="btn-link">{{ row.status === 1 ? "详情" : "回复" }}</a>
                                    </DialogForm>
                                    <el-divider direction="vertical" />
                                    <DeleteRecord :params="{ id: row.id }" :requestApi="delPriceInquiry" @afterDelete="loadFilter">删除 </DeleteRecord>
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
import MobileCard from "@/components/list/src/MobileCard.vue";
import { PopForm } from "@/components/pop-form";
import { onMounted, reactive, ref } from "vue";
import { DeleteRecord, Pagination, Switch } from "@/components/list";
import { Image } from "@/components/image";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import { PriceInquiryFilterParams, PriceInquiryFilterState } from "@/types/product/enquiry";
import { batchSubmit, delPriceInquiry, getPriceInquiryList } from "@/api/product/enquiry";
import { isOverseas } from "@/utils/version";
import { imageFormat, urlFormat } from "@/utils/format";
const config: any = useConfigStore();
// 基本参数定义
const filterState = ref<PriceInquiryFilterState[]>([]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const advancedSearch = ref<boolean>(false);
const filterParams = reactive<PriceInquiryFilterParams>({
    //初使化用于查询的参数
    page: 1,
    size: config.get("pageSize"),
    sortField: "",
    sortOrder: "",
    mobile: "",
    productId: ""
});
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getPriceInquiryList({ ...filterParams });
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
const onSelectChange = (e: PriceInquiryFilterState[]) => {
    selectedIds.value = e.map((item) => item.id);
};
</script>
