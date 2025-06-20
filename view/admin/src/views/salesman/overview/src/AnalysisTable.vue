<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="table-container">
                <SelectTime
                    v-model:dateType="rankingFilterParams.dateType"
                    v-model:dateValue="rankingFilterParams.startEndTime"
                    @onOK="getRankingData"
                ></SelectTime>
                <a-spin :spinning="rankingloading">
                    <el-table :data="filterState" row-key="productId" :total="rankingTotal">
                        <el-table-column label="排名" :fixed="true" width="68">
                            <template #default="{ row, $index }">
                                <div>
                                    <div>{{ $index + 1 }}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品" prop="productName" :fixed="true" min-width="200">
                            <template #default="{ row }">
                                <div class="flex flex-align-center">
                                    <div>
                                        <Image :src="row.picThumb" fit="contain" style="height: 50px; width: 50px;margin-right: 10px;" />
                                    </div>
                                    <div>
                                        <div>{{ row.productName || "--" }}</div>
                                        <div class="sn">货号：{{ row.productSn || "--" }}</div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="成交金额" prop="totalProductMoney" sortable="custom" width="200">
                            <template #default="{ row }">
                                <div>
                                    <div>{{ priceFormat(row.totalProductMoney) || "--" }}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="支出佣金" prop="commissionExpenses" width="200">
                            <template #default="{ row }">
                                <div>
                                    <div>{{ priceFormat(row.commissionExpenses) || "--" }}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <template #empty>
                            <div class="empty-warp">
                                <div v-if="!rankingloading" class="empty-bg">暂无数据</div>
                            </div>
                        </template>
                    </el-table>
                </a-spin>
                <div class="pagination-con" v-if="rankingTotal > 0">
                    <Pagination
                        v-model:page="rankingFilterParams.page"
                        v-model:size="rankingFilterParams.size"
                        :total="rankingTotal"
                        @callback="getRankingData"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import "@/style/css/list.less";
import { Pagination } from "@/components/list";
import { formatDate } from "@/utils/util";
import { ref, reactive, onMounted } from "vue";
import { useConfigStore } from "@/store/config";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { SelectTimeInterval } from "@/components/select";
import SelectTime from "./SelectTime.vue";
import { getDays } from "@/utils/util";
import { formattedDate } from "@/utils/time";
import { AnalysisFilterParams, AnalysisFormState } from "@/types/salesman/overview.d";
import { getProductAnalysis } from "@/api/salesman/overview";
import { priceFormat, imageFormat } from "@/utils/format";
import { Image } from "@/components/image";
const router = useRouter();
const config: any = useConfigStore();

const rankingTotal = ref<number>(0);
const rankingloading = ref<boolean>(false);
const rankingFilterParams = reactive<AnalysisFilterParams>({
    page: 1,
    size: config.get("pageSize"),
    sortField: "",
    sortOrder: "",
    dateType: 3,
    startEndTime: formattedDate(getDays(1, "sub"), "YYYY-MM-DD")
});
const filterState = ref<AnalysisFormState[]>([]);
const getRankingData = async () => {
    rankingloading.value = true;
    try {
        const result = await getProductAnalysis({ ...rankingFilterParams });
        filterState.value = result.records;
        rankingTotal.value = result.total;
    } catch (error: any) {
        message.error(error.message);
    } finally {
        rankingloading.value = false;
    }
};
onMounted(() => {
    getRankingData();
});
</script>
<style lang="less" scoped>
.table-container {
    margin-bottom: 20px;
}
.filtrate-menu {
    display: flex;

    .mr-10 {
        margin-right: 5px;
    }
}
.sn{
    font-size: 12px;
    color: #999;
}
</style>
