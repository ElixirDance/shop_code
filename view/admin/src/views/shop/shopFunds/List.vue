<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="container">
                <div class="lyecs-table-list-warp">
                    <div class="list-table-tool lyecs-search-warp">
                        <div class="advanced-search-warp list-table-tool-row">
                            <div class="simple-form-warp">
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <div class="control-container">
                                            <TigInput
                                                v-model="filterParams.keyword"
                                                name="username"
                                                placeholder="输入店铺名称"
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
                                        <TigTabs v-model="filterParams.status" :tabs="shopStatus" @onTabChange="onChange"></TigTabs>
                                    </div>
                                </div>
                                <div v-if="advancedSearch">
                                    <div class="simple-form-field">
                                        <div class="form-group">
                                            <label class="control-label"><span>店铺状态：</span></label>
                                            <div class="control-container">
                                                <el-select v-model="filterParams.status" clearable>
                                                    <el-option :value="0" label="全部" />
                                                    <el-option :value="1" label="运营中" />
                                                    <el-option :value="10" label="关闭" />
                                                </el-select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="simple-form-field">
                                        <el-button type="primary" @click="onSearchSubmit">搜索</el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="table-container">
                        <a-spin :spinning="loading">
                            <el-table
                                :data="filterState"
                                :loading="loading"
                                :total="total"
                                row-key="shopId"
                                @selection-change="onSelectChange"
                                @sort-change="onSortChange"
                            >
                                <el-table-column label="店铺名称">
                                    <template #default="{ row }">
                                        {{ row.shopTitle || "--" }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="店铺LOGO">
                                    <template #default="{ row }">
                                        <Image :src="row.shopLogo" fit="contain" style="height: 25px; width: 60px" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="店铺状态">
                                    <template #default="{ row }">
                                        <template v-if="row.status == 10">
                                            <StatusDot color="red" :flicker="true"></StatusDot>
                                        </template>
                                        <template v-if="row.status == 1">
                                            <StatusDot color="green" :flicker="true"></StatusDot>
                                        </template>
                                        <span v-if="row.status === 10" style="color: red">{{ row.statusText }}</span>
                                        <span v-else-if="row.status === 1" style="color: green">{{ row.statusText }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="店铺资金" sortable="custom">
                                    <template #default="{ row }">
                                        {{ priceFormat(row.shopMoney) || 0.0 }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="待结算金额" sortable="custom">
                                    <template #default="{ row }">
                                        {{ priceFormat(row.unSettlementOrder) || 0.0 }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="不可用资金" sortable="custom">
                                    <template #default="{ row }">
                                        {{ priceFormat(row.frozenMoney) || 0.0 }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="开店时间">
                                    <template #default="{ row }">
                                        {{ row.addTime }}
                                    </template>
                                </el-table-column>
                                <el-table-column :width="120" fixed="right" label="操作">
                                    <template #default="{ row }">
                                        <DialogForm
                                            :params="{ shopId: row.shopId }"
                                            :showClose="false"
                                            :showOnOk="false"
                                            isDrawer
                                            path="shop/financialLog/List"
                                            title="资金日志"
                                            width="800px"
                                        >
                                            <a class="btn-link">查看资金日志</a>
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
                        <div v-if="total > 0" class="pagination-con">
                            <Pagination v-model:page="filterParams.page" v-model:size="filterParams.size" :total="total" @callback="loadFilter" />
                        </div>
                    </div>
                    <div v-if="selectedIds.length > 0" class="selected-action-warp">
                        <div class="selected-action">
                            <el-space>
                                <span
                                    >已选择：<b>{{ selectedIds.length }}</b> 项</span
                                >
                                <el-popconfirm title="您确认要批量删除所选数据吗？" @confirm="onBatchSubmit('del')">
                                    <template #reference>
                                        <el-button>批量删除</el-button>
                                    </template>
                                </el-popconfirm>
                            </el-space>
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
import { Image } from "@/components/image";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import { ShopFilterParams, ShopFilterState } from "@/types/shop/shop.d";
import { batchSubmit, getShopAccountList, updateShopFiled } from "@/api/shop/shop";
import { CustomSwitch } from "@/components/switch";
import { ElMessageBox } from "element-plus";
import { getShopLink } from "@/utils/util";
import { useRouter } from "vue-router";
import { priceFormat } from "@/utils/format";
import StatusDot from "@/components/form/src/StatusDot.vue";
const query = useRouter().currentRoute.value.query;
const shopStatus = ref<any[]>([
    {
        label: "全部",
        value: 0,
        isShow: true
    },
    {
        label: "开业",
        value: 1,
        isShow: true
    },
    {
        label: "关店",
        value: 10,
        isShow: true
    },
]);
const config: any = useConfigStore();
// 基本参数定义
const filterState = ref<ShopFilterState[]>([]);
const loading = ref<boolean>(false);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const advancedSearch = ref<boolean>(false);
const filterParams = reactive<ShopFilterParams>({ page: 1, size: config.get("pageSize"), sortField: "", sortOrder: "", keyword: "", status: 0 });
const handleSwitchChange = (params: any) => {
    const { data, row } = params;
    ElMessageBox.confirm("确认修改当前店铺的开业状态吗?", "提示", { confirmButtonText: "确认", cancelButtonText: "取消", type: "warning" })
        .then(() => {
            row.status = row.status == 1 ? 10 : 1;
            const result = updateShopFiled({ ...data, id: row.shopId, val: row.status });
            message.success("修改成功");
        })
        .catch(() => {});
};
const onChange = (status: number) => {
    filterParams.status = status;
    loadFilter();
};
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getShopAccountList({ ...filterParams });
        filterState.value = result.records;
        total.value = result.total;
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};
const okCallback = () => {
    clearUrlParams();
    loadFilter();
};
const clearUrlParams = () => {
    // 获取当前页面的完整URL
    let currentUrl = window.location.href;
    // 使用URL对象解析当前URL
    let urlObj = new URL(currentUrl);
    // 清除查询字符串
    urlObj.search = "";
    // 将修改后的URL设置为当前页面的URL
    window.history.replaceState({}, document.title, urlObj.toString());
};
const dialogForm = ref<any>();
const merchantId = ref<number>(0);
onMounted(() => {
    loadFilter();
    console.log(query);
    if (query.id) {
        ElMessageBox.confirm(`为[${query.companyName || "--"}]立即创建店铺?`, "提示", {
            closeOnClickModal: false,
            showClose: false,
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
        })
            .then(() => {
                merchantId.value = Number(query.id);
                dialogForm.value.show();
            })
            .catch(() => {
                merchantId.value = 0;
                clearUrlParams();
            });
    }
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
const onSelectChange = (e: ShopFilterState[]) => {
    selectedIds.value = e.map((item) => item.shopId);
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

.green {
    margin-left: 8px;
    color: green !important;
}
.grey {
    margin-left: 8px;
    color: #999 !important;
}
</style>
