<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-table-list-warp">
                <div class="list-table-tool lyecs-search-warp">
                    <el-form :model="filterParams" @submit.native.prevent="onSearchSubmit">
                        <div class="list-table-tool-row">
                            <div class="list-table-tool-col">
                                <el-space>
                                    <TigInput v-model="filterParams.keyword" name="keyword" placeholder="输入会员名称/手机号/邮箱" clearable @clear="onSearchSubmit">
                                        <template #append>
                                            <el-button @click="onSearchSubmit"><span class="iconfont icon-chakan1"></span> </el-button>
                                        </template>
                                    </TigInput>
                                </el-space>
                            </div>
                        </div>
                    </el-form>
                </div>
                <div class="table-container">
                    <a-spin :spinning="loading">
                        <el-table :data="filterState" :loading="loading" :total="total" row-key="id">
                            <el-table-column label="操作发生时间" prop="changeTime"></el-table-column>
                            <el-table-column label="会员名称" prop="id">
                                <template #default="{ row }">
                                    <div style="position: relative">
                                        <div>{{ row.username }}</div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column :width="200" label="操作备注" prop="changeDesc"></el-table-column>
                            <el-table-column label="积分">
                                <template #default="{ row }"> 
                                      <p v-if="row.changeType == 1" style="color: rgb(0, 0, 255)">＋{{ row.points }}</p>
                                      <p v-else style="color: rgb(255, 0, 0);">－{{ row.points }}</p>
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
import { onMounted, reactive, ref } from "vue";
import { Pagination } from "@/components/list";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import { IntegralLogFilterParams, IntegralLogFilterState } from "@/types/user/integralLog";
import { getIntegralLogList } from "@/api/user/integralLog";

const config:any = useConfigStore();
// 基本参数定义
const filterState = ref(<IntegralLogFilterState[]>[]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const filterParams = reactive<IntegralLogFilterParams>({
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
        const result = await getIntegralLogList({ ...filterParams });
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
</script>
