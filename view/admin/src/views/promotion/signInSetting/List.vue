<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-table-list-warp">
                <div class="list-table-tool lyecs-search-warp">
                    <el-form :model="filterParams" @submit.native.prevent="onSearchSubmit">
                        <div class="list-table-tool-row">
                            <div class="list-table-tool-col">
                                <el-space>
                                    <TigInput name="keyword" v-model="filterParams.keyword" placeholder="输入关键词" clearable @clear="onSearchSubmit">
                                        <template #append>
                                            <el-button @click="onSearchSubmit"><span class="iconfont icon-chakan1"></span></el-button>
                                        </template>
                                    </TigInput>
                                </el-space>
                            </div>
                            <div class="list-table-tool-col">
                            </div>
                        </div>
                    </el-form>
                </div>
                <div class="table-container">
                    <a-spin :spinning="loading">
                        <el-table :data="filterState" row-key="id" :total="total" @sort-change="onSortChange" :loading="loading">
                            <el-table-column label="名称" prop="name" :width="200"> </el-table-column>
                            <el-table-column label="赠送积分" prop="points"> </el-table-column>
                            <el-table-column label="操作" fixed="right" :width="150">
                                <template #default="{ row }">
                                    <DialogForm isDrawer @okCallback="loadFilter" title="编辑示例模板" width="600px" path="promotion/signInSetting/Info"
                                        :params="{ act: 'detail', id: row.id }">
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
                        <Pagination v-model:page="filterParams.page" v-model:size="filterParams.size" :total="total" @callback="loadFilter" />
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
import { Pagination } from '@/components/list';
import { message } from 'ant-design-vue'
import { useConfigStore } from "@/store/config";
import { SignInSettingFilterState, SignInSettingFilterParams } from '@/types/promotion/signInSetting.d';
import { getSignInSettingList } from "@/api/promotion/signInSetting";
const config:any = useConfigStore();
// 基本参数定义
const filterState = ref<SignInSettingFilterState[]>();
const loading = ref<boolean>(true);
const total = ref<number>(0);
const filterParams = reactive<SignInSettingFilterParams>({
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
        const result = await getSignInSettingList({ ...filterParams });
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

</script>