<template>
    <div class="container">
        <div class="content_wrapper">
            <div v-if="activeKey != null" class="container">
                <div class="lyecs-table-list-warp">
                    <div class="list-table-tool lyecs-search-warp">
                        <div class="advanced-search-warp list-table-tool-row">
                            <div class="simple-form-warp">
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <div class="control-container">
                                            <TigInput
                                                v-model="filterParams.keyword"
                                                name="keyword"
                                                placeholder="输入内容"
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
                                        <label class="control-label"><span>发票类型：</span></label>
                                        <div class="control-container">
                                            <el-select v-model="filterParams.invoiceType" clearable @change="onSearchSubmit">
                                                <el-option :value="1" label="普通发票" />
                                                <el-option :value="2" label="增值发票" />
                                            </el-select>
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <label class="control-label"><span>发票状态：</span></label>
                                        <div class="control-container">
                                            <el-select v-model="filterParams.status" clearable @change="onSearchSubmit">
                                                <el-option :value="0" label="待处理" />
                                                <el-option :value="1" label="已开" />
                                                <el-option :value="2" label="失败/作废" />
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
                        </div>
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
                                <el-table-column label="申请会员" prop="username" width="120"></el-table-column>
                                <el-table-column label="发票类型" width="110">
                                    <template #default="{ row }">
                                        <span :style="{ color: row.invoiceType === 2 ? 'red' : 'black' }">{{ row.invoiceType_name }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="公司名称/抬头" prop="companyName"></el-table-column>
                                <el-table-column label="金额(￥)" prop="amount" width="80"></el-table-column>
                                <el-table-column label="申请订单">
                                    <template #default="{ row }">
                                        <DialogForm
                                            :params="{ act: 'detail', id: row.orderId }"
                                            :showClose="false"
                                            :showOnOk="false"
                                            :title="'订单详情 ' + row.orderSn"
                                            isDrawer
                                            path="order/order/Info"
                                            width="880px"
                                            @callback="loadFilter"
                                        >
                                            <a class="btn-link"> {{ row.orderSn }}</a>
                                        </DialogForm>
                                    </template>
                                </el-table-column>
                                <el-table-column :width="160" label="申请日期" prop="addTime"></el-table-column>
                                <el-table-column label="申请状态">
                                    <template #default="{ row }">
                                        <span :style="{ color: row.status === 1 ? 'green' : row.status === 2 ? 'black' : 'red' }">{{ row.statusName }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column :width="150" fixed="right" label="操作">
                                    <template #default="{ row }">
                                        <DialogForm
                                            :params="{ act: 'detail', id: row.id }"
                                            isDrawer
                                            path="finance/orderInvoice/Info"
                                            title="编辑发票申请"
                                            width="700px"
                                            @okCallback="loadFilter"
                                        >
                                            <a class="btn-link">编辑</a>
                                        </DialogForm>
                                        <el-divider direction="vertical" />
                                        <DeleteRecord :params="{ id: row.id }" :requestApi="delOrderInvoice" @afterDelete="loadFilter">删除</DeleteRecord>
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
    </div>
</template>

<script lang="ts" setup>
import "@/style/css/list.less";
import { DialogForm } from "@/components/dialog";
import { onMounted, reactive, ref } from "vue";
import { DeleteRecord, Pagination } from "@/components/list";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import { OrderInvoiceFilterParams, OrderInvoiceFilterState } from "@/types/finance/orderInvoice.d";
import { batchSubmit, delOrderInvoice, getOrderInvoiceList } from "@/api/finance/orderInvoice";
import { SelectShop } from "@/components/select";

const config: any = useConfigStore();
// 基本参数定义
const filterState = ref<OrderInvoiceFilterState[]>();
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const advancedSearch = ref<boolean>(false);
const filterParams = reactive<OrderInvoiceFilterParams>({
    page: 1,
    size: config.get("pageSize"),
    sortField: "",
    sortOrder: "",
    keyword: "",
    shopType: 0,
});

const activeKey = ref<number>(0);
const onTabChange = (val: number) => {
    filterParams.shopType = val;
    loadFilter();
};

// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getOrderInvoiceList({ ...filterParams });
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
const onSelectChange = (e: OrderInvoiceFilterState[]) => {
    selectedIds.value = e.map((item) => item.id);
};
</script>
<style lang="less" scoped>
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

.display-col {
    display: flex;
    align-items: center; /* 垂直居中 */
    gap: 8px;

    .image {
        width: 30px;
        height: 30px;

        .image-style {
            width: 100%;
            height: 100%;
            object-fit: cover; /* 保持图片比例 */
        }
    }

    .image_comment {
        min-width: 50px;
        min-height: 50px;
        max-width: 50px;
        max-height: 50px;

        .image-style {
            width: 100%;
            height: 100%;
            object-fit: cover; /* 保持图片比例 */
        }
    }

    .text {
        flex-grow: 1; /* 占据剩余空间 */
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 隐藏超出部分 */
        text-overflow: ellipsis; /* 超出显示省略号 */
        margin-left: 8px; /* 与左侧图片的间距 */
    }

    .text_comment {
        flex-grow: 1; /* 占据剩余空间 */
    }
}

.multiline_hiding {
    height: 3.6em; /* 基于字体大小的高度, 3行文本高度 */
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* 限制在3行 */
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    line-height: 1.2em; /* 调整这个值以匹配你的字体大小 */
}
</style>
