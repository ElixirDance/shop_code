<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="notice-warp">提示：查询的时间间隔上限默认为一月，如果数据量过大导至查询时间过久或者超时报错，请尝试缩小查询的时间间隔！</div>
            <el-form :model="filterParams">
                <div class="filtrate-menu">
                    <el-form-item class="mr-10">
                        <SelectTimeInterval
                            type="date"
                            v-model:start-date="filterParams.startTime"
                            v-model:end-date="filterParams.endTime"
                        ></SelectTimeInterval>
                    </el-form-item>
                    <el-form-item class="mr-10">
                        <TigInput v-model="filterParams.keyword" placeholder="输入商品名称或者商品编号" @keyup.enter="handleSearch" clearable @clear="handleSearch"> </TigInput>
                    </el-form-item>
                    <el-form-item class="mr-10">
                        <el-button plain @click="handleSearch">搜索</el-button>
                    </el-form-item>
                    <el-form-item class="mr-10">
                        <el-button plain @click="handleExport" :loading="Exportloading">导出EXCEL</el-button>
                    </el-form-item>
                </div>
            </el-form>

            <div class="table-container">
                <a-spin :spinning="loading">
                    <el-table :data="filterState" :total="total" row-key="productId" @sort-change="onSortChange">
                        <el-table-column label="商品名称" prop="productName">
                            <template #default="{ row }">
                                <div class="flex">
                                    <div v-if="row.picThumb" class="span-pic">
                                        <a :href="urlFormat({ path: 'product', id: row.productId })" target="_blank"
                                            ><img :src="imageFormat(row.picThumb)" height="50" width="50"
                                        /></a>
                                    </div>
                                    <div class="span-product-con">
                                        <div class="span-product-name">{{ row.productName }}</div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品编号" prop="productSn"> </el-table-column>
                        <el-table-column label="总销量" prop="totalSalesNum" sortable="custom"> </el-table-column>
                        <el-table-column label="总销售额" prop="totalSalesAmount" sortable="custom">
                            <template #default="{ row }">
                                {{ priceFormat(row.totalSalesAmount) }}
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
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { useConfigStore } from "@/store/config";
import { SelectTimeInterval } from "@/components/select";
import { Pagination } from "@/components/list";
import { getDays } from "@/utils/util";
import { formattedDate } from "@/utils/time";
import { getGoodsTopSales, exportGoodsTopSales } from "@/api/panel/statisticsGoods";
import type { statisticsGoodsFilterParams, FilterResult } from "@/types/panel/statisticsGoods.d.ts";
import { imageFormat, urlFormat, priceFormat } from "@/utils/format";
import { message } from "ant-design-vue";
import requestExport from "@/utils/export";
const config = useConfigStore();

const loading = ref<boolean>(false);
const filterState = ref<FilterResult[]>();
const total = ref<number>(0);
const filterParams = reactive<statisticsGoodsFilterParams>({
    page: 1,
    size: config.pageSize,
    keyword: "",
    startTime: formattedDate(getDays(30, "sub"), "YYYY-MM-DD"),
    endTime: formattedDate(new Date(), "YYYY-MM-DD")
});

const getData = async () => {
    loading.value = true;
    try {
        const result = await getGoodsTopSales(filterParams);
            filterState.value = result.records;
            total.value = result.total;
    } catch (error: any) {
        message.error(error.message);
        console.error(error);
    }
    loading.value = false;
};

const handleSearch = () => {
    getData();
};


const Exportloading = ref<boolean>(false)
const handleExport = async () => {
  Exportloading.value = true;
  try {
    const result = await exportGoodsTopSales({ ...filterParams, isExport: "1" });
    Exportloading.value = false;
    requestExport(result,'销售排行导出')
  } catch (error:any) {
    message.error(error.message)
  } finally {
    Exportloading.value = false;
  }
};


// 修改排序
const onSortChange = ({ prop, order }: { prop: string; order?: string }) => {
    console.log(prop, order);
    filterParams.sortField = prop;
    filterParams.sortOrder = order == "ascending" ? "asc" : order == "descending" ? "desc" : "";
    getData();
};

const loadFilter = () => {
    getData();
};

onMounted(() => {
    getData();
});
</script>

<style lang="less" scoped>
.filtrate-menu {
    display: flex;
    // margin-bottom: 20px;

    .mr-10 {
        margin-right: 5px;
    }
}

.span-product-name {
    margin-left: 5px;
}
</style>
