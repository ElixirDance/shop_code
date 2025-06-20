<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="notice-warp">
                <p>
                    积分兑换列表前台地址为：{{ domain }}/exchange/list.html（支持手机版自动跳转）
                </p>
            </div>
            <div class="lyecs-table-list-warp">
                <div class="list-table-tool lyecs-search-warp">
                    <el-form :model="filterParams" @submit.native.prevent="onSearchSubmit">
                        <div class="advanced-search-warp list-table-tool-row">
                            <div class="simple-form-warp">
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <div class="control-container">
                                            <el-button type="primary" :icon="Refresh" @click="_getLiveRefresh">API更新直播间</el-button>
                                            <span>（一天上限三百次）</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <div class="control-container">
                                            <TigInput v-model="filterParams.wechatLiveTitle" name="wechatLiveTitle" placeholder="输入直播名称" clearable @clear="onSearchSubmit">
                                                <template #append>
                                                    <el-button @click="onSearchSubmit"><span class="iconfont icon-chakan1"></span></el-button>
                                                </template>
                                            </TigInput>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-form>
                </div>
                <div class="table-container">
                    <a-spin :spinning="loading">
                        <el-table :data="filterState" row-key="roomId" :total="total">
                            <el-table-column label="房间ID" prop="roomId" :width="80"></el-table-column>
                            <el-table-column label="直播名称" prop="wechatLiveTitle" :width="200"></el-table-column>
                            <el-table-column label="开始日期" prop="lastUpdateTime"></el-table-column>
                            <el-table-column label="结束日期" prop="endTime"></el-table-column>
                            <el-table-column label="当前状态" prop="liveStatusText"></el-table-column>
                            <el-table-column label="直播封面" prop="pointsDeductedAmount">
                                <template #default="{ row }">
                                    <Image :src="row.coverImg" fit="contain" style="height: 25px; width: 60px" />
                                </template>
                            </el-table-column>
                            <el-table-column label="商品显示范围" prop="actRangeText"></el-table-column>
                            <el-table-column label="操作" fixed="right" :width="150">
                                <template #default="{ row }">
                                    <DialogForm isDrawer @okCallback="loadFilter" title="编辑直播" width="750px"
                                        path="promotion/live/Info" :params="{ act: 'detail', id: row.roomId }">
                                        <a class="btn-link">编辑</a>
                                    </DialogForm>
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
import { Image } from "@/components/image";
import { Refresh } from "@element-plus/icons-vue";
import { DialogForm } from '@/components/dialog'
import { ref, reactive, onMounted } from 'vue';
import { Switch, Pagination } from '@/components/list';
import { message } from 'ant-design-vue'
import { LiveFilterState, LiveFilterParams } from '@/types/promotion/live.d';
import { getLiveList, getLiveRefresh } from "@/api/promotion/live";
import { useConfigStore } from "@/store/config"
const config:any = useConfigStore();
// 基本参数定义
const domain = ref(useConfigStore().domain)
const filterState = ref<LiveFilterState[]>();
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const advancedSearch = ref<boolean>(false);
const filterParams = reactive<LiveFilterParams>({
    page: 1,
    size: config.get('pageSize'),
    sortField: '',
    sortOrder: '',
    wechatLiveTitle: ''
});
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getLiveList({ ...filterParams });
        filterState.value = result.records;
        total.value = result.total;
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
}
const _getLiveRefresh = async () => {
    loading.value = true;
    try {
        await getLiveRefresh();
        loadFilter()
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
</script>
