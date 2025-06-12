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
                                        <div class="control-container">
                                            <TigInput v-model="filterParams.keyword" name="keyword" placeholder="输入账户变动原因" @keyup.enter="onSearchSubmit" clearable @clear="onSearchSubmit">
                                                <template #append>
                                                    <el-button @click="onSearchSubmit"><span class="iconfont icon-chakan1"></span> </el-button>
                                                </template>
                                            </TigInput>
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>会员用户名：</span></label>
                                        <div class="control-container">
                                            <TigInput v-model="filterParams.username" @keyup.enter="onSearchSubmit" clearable @clear="onSearchSubmit" />
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <el-button type="primary" @click="onSearchSubmit">搜索</el-button>
                                </div>
                            </div>
                        </div>
                    </el-form>
                </div>
                <div class="table-container">
                    <a-spin :spinning="loading">
                        <el-table :data="filterState" :loading="loading" :total="total" row-key="logId">
                            <el-table-column label="账户变动时间" prop="changeTime" width="160"></el-table-column>
                            <el-table-column label="会员用户名" prop="username" width="120">
                                <template #default="{ row }">
                                    <DialogForm v-if="row.username" :params="{ act: 'edit', id: row.userId }" isDrawer
                                                path="user/user/AccountLog"
                                                :title="'会员'+row.username+'的账目明细'" width="800px"
                                                @okCallback="loadFilter">
                                        <a class="btn-link">{{ row.username }}</a>
                                    </DialogForm>
                                    <div v-else>--</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="账户变动原因" prop="changeDesc"></el-table-column>
                            <el-table-column label="变动资金账户" width="250">
                                <template #default="{ row }">
                                    <span v-if="row.changeType===1" style="color:#0000FF">+{{ row.balance }}</span>
                                    <span v-else-if="row.changeType===2" style="color:#FF0000">-{{ row.balance }}</span>
                                    <span v-else>{{ row.balance }}</span>
                                    <span v-if="row.afterBalance" style="color:#999;font-size:12px">（变更后金额:{{ row.afterBalance}}）</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="冻结资金账户" width="250">
                                <template #default="{ row }">
                                    <span v-if="row.changeType===1" style="color:#0000FF">+{{ row.frozenBalance }}</span>
                                    <span v-else-if="row.changeType===2" style="color:#FF0000">-{{ row.frozenBalance }}</span>
                                    <span v-else>{{ row.frozenBalance }}</span>
                                    <span v-if="row.after_frozenBalance" style="color:#999;font-size:12px">（变更后金额:{{ row.after_frozenBalance}}）</span>
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
                        <Pagination v-model:page="filterParams.page" v-model:size="filterParams.size" :total="total"
                                    @callback="loadFilter"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import '@/style/css/list.less'
import {onMounted, reactive, ref} from 'vue';
import {Pagination} from '@/components/list';
import {message} from 'ant-design-vue'
import {useConfigStore} from "@/store/config";
import {UserBalanceLogFilterParams, UserBalanceLogFilterState} from '@/types/finance/userBalanceLog';
import {getUserBalanceLogList} from "@/api/finance/userBalanceLog";
import {DialogForm} from "@/components/dialog";

const config:any = useConfigStore();
// 基本参数定义
const filterState = ref(<UserBalanceLogFilterState[]>[]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const advancedSearch = ref<boolean>(false);
const filterParams = reactive<UserBalanceLogFilterParams>({   //初使化用于查询的参数
    page: 1,
    size: config.get('pageSize'),
    sortField: '',
    sortOrder: '',
    keyword: '',
});
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getUserBalanceLogList({...filterParams});
        filterState.value = result.records;
        total.value = result.total;
    } catch (error:any) {
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
