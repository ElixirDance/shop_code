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
                                            <TigInput
                                                v-model="filterParams.keyword"
                                                name="keyword"
                                                placeholder="输入留言内容"
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
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>留言类型：</span></label>
                                        <div class="control-container">
                                            <el-select v-model="magType" multiple clearable placeholder="请选择" @clear="onSearchSubmit" @change="onSearchSubmit">
                                                <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.value" />
                                            </el-select>
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>回复状态：</span></label>
                                        <div class="control-container">
                                            <el-select
                                                v-model="filterParams.status"
                                                clearable
                                                placeholder="请选择"
                                                @clear="onSearchSubmit"
                                                @change="onSearchSubmit"
                                            >
                                                <el-option v-for="item in statusOptions" :label="item.label" :value="item.value" />
                                            </el-select>
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <div class="control-container">
                                            <el-popconfirm title="您确认要批量删除所选数据吗？" @confirm="onBatchSubmit('del')">
                                                <template #reference>
                                                    <el-button :disabled="selectedIds.length === 0">批量删除</el-button>
                                                </template>
                                            </el-popconfirm>
                                            <span v-if="selectedIds.length > 0">
                                                已选择：<b>{{ selectedIds.length }}</b> 项
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                            <el-table-column :width="120" label="会员名称" prop="username"></el-table-column>
                            <el-table-column label="类型" prop="typeName">
                                <template #default="{ row }">
                                    <p>{{ row.typeName }}</p>
                                    <div style="color: #999" v-if="row.orderSn">
                                        {{ row.orderSn }}
                                    </div>
                                    <div style="color: #999" v-if="row.shopId && row.store">
                                        {{ row.store.storeTitle }}
                                    </div>
                                    <div style="color: #999" v-if="row.productId > 0">
                                        {{ row.product?.productName || "--" }}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="留言内容" prop="content">
                                <template #default="{ row }">
                                    {{ row.content }}
                                </template>
                            </el-table-column>
                            <el-table-column :width="160" label="留言时间" prop="addTime"></el-table-column>
                            <!-- <el-table-column :width="100" label="状态" prop="statusName"></el-table-column> -->
                            <el-table-column :width="80" label="回复" prop="statusName"></el-table-column>
                            <el-table-column :width="150" fixed="right" label="操作">
                                <template #default="{ row }">
                                    <DialogForm
                                        :params="{ act: 'detail', id: row.id }"
                                        isDrawer
                                        path="user/feedback/Info"
                                        title="编辑会员留言"
                                        width="560px"
                                        @okCallback="loadFilter"
                                    >
                                        <a class="btn-link">查看</a>
                                    </DialogForm>
                                    <el-divider direction="vertical" />
                                    <DeleteRecord :params="{ id: row.id }" :requestApi="delFeedback" @afterDelete="loadFilter">删除 </DeleteRecord>
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
import { onMounted, reactive, ref } from "vue";
import { DeleteRecord, Pagination } from "@/components/list";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import { FeedbackFilterParams, FeedbackFilterState } from "@/types/user/feedback.d";
import { batchSubmit, delFeedback, getFeedbackList, updateFeedbackField } from "@/api/user/feedback";
import { useRoute, useRouter } from "vue-router";

const config: any = useConfigStore();
// 基本参数定义
const filterState = ref(<FeedbackFilterState[]>[]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const advancedSearch = ref<boolean>(false);
const query = useRouter().currentRoute.value.query;
const magType = ref<number[]>([]);
const filterParams = reactive<FeedbackFilterParams>({
    //初使化用于查询的参数
    page: 1,
    size: config.get("pageSize"),
    sortField: "",
    sortOrder: "",
    keyword: "",
    type: "",
    status: ""
});
const options = [
    {
        label: "建议",
        value: 0
    },
    {
        label: "投诉",
        value: 1
    },
    {
        label: "商品",
        value: 2
    },
    {
        label: "其他",
        value: 3
    },
    {
        label: "店铺投诉",
        value: 4
    },
    {
        label: "订单问题",
        value: 5
    },
    {
        label: "订单咨询",
        value: 6
    }
];
const statusOptions = [
    {
        label: "待回复",
        value: 0
    },
    {
        label: "已回复",
        value: 1
    },
    {
        label: "无效",
        value: 2
    }
];
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        if (magType.value.length > 0) {
            filterParams.type = magType.value.join(",");
        }
        const result = await getFeedbackList({ ...filterParams });
        filterState.value = result.records;
        total.value = result.total;
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};
onMounted(() => {
    if (query && query.type) {
        let typeArr: number[];
        if (typeof query.type === 'string') {
            typeArr = query.type.split(",").map(Number);
        } else if (Array.isArray(query.type)) {
            // 如果 query.type 是数组, 直接将它们转换为数字数组
            typeArr = query.type.map(Number);
        } else {
            // 处理 query.type 为其他类型的情况
            typeArr = [];
        }
        console.log(typeArr);
        magType.value = typeArr;
    }
    if (query && query.status) {
        filterParams.status = Number(query.status) as any;
    }
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
const onSelectChange = (e: FeedbackFilterState[]) => {
    selectedIds.value = e.map((item: any) => item.id);
};
</script>
