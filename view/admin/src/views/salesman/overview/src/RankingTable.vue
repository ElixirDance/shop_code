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
                    <el-table :data="filterState" :total="rankingTotal">
                        <el-table-column label="排名" :fixed="true" width="68">
                            <template #default="{ row, $index }">
                                <div style="position: relative">
                                    <div>{{ $index + 1 }}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="分销员昵称" prop="nickname" :fixed="true">
                            <template #default="{ row, $index }">
                                <div>
                                    <div>{{ row.nickname || row.username }}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="新增销售额(元)" prop="totalSaleAmount" sortable="custom">
                            <template #default="{ row, $index }">
                                <div>
                                    <div>{{ priceFormat(row.totalSaleAmount) }}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="新增客户数" prop="totalCustomers" sortable="custom">
                            <template #default="{ row, $index }">
                                <div>
                                    <div>{{ row.totalCustomers }}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="支付客户数" prop="totalPayCustomers" sortable="custom">
                            <template #default="{ row, $index }">
                                <div>
                                    <div>{{ row.totalPayCustomers }}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="开单邀请数" prop="orderNum" sortable="custom">
                            <template #default="{ row, $index }">
                                <div>
                                    <div>{{ row.orderNum || "--" }}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column label="操作" fixed="right">
                    <template #default="{ row }">
                        <div style="position: relative">
                            <div>{{ row.promotionName || "--" }}</div>
                        </div>
                    </template>
                </el-table-column> -->
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
import { ref, reactive, onMounted } from "vue";
import { useConfigStore } from "@/store/config";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import SelectTime from "./SelectTime.vue";
import { getDays } from "@/utils/util";
import { formattedDate } from "@/utils/time";
import { RankingFormState, RankingFilterParams } from "@/types/salesman/overview.d";
import { getSalesmanRanking } from "@/api/salesman/overview";
import { priceFormat } from "@/utils/format";
const router = useRouter();
const config: any = useConfigStore();

const rankingTotal = ref<number>(0);
const rankingloading = ref<boolean>(false);
const rankingFilterParams = reactive<RankingFilterParams>({
    page: 1,
    size: config.get("pageSize"),
    sortField: "",
    sortOrder: "",
    dateType: 3,
    startEndTime: formattedDate(getDays(1, "sub"), "YYYY-MM-DD")
});
const filterState = ref<RankingFormState[]>([]);
const getRankingData = async () => {
    rankingloading.value = true;
    try {
        const result = await getSalesmanRanking({ ...rankingFilterParams });
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
</style>
