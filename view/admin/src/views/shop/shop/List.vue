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
                                                name="keyword"
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
                                                    <el-option :value="4" label="暂停运营" />
                                                    <el-option :value="10" label="打烊" />
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
                        <div class="list-table-tool-row">
                            <div class="list-table-tool-col">
                                <el-space>
                                    <DialogForm
                                        ref="dialogForm"
                                        :params="{ act: 'add', id: merchantId }"
                                        isDrawer
                                        path="shop/shop/Add"
                                        title="新增店铺"
                                        width="800px"
                                        @closeCallback="closeCallback"
                                        @okCallback="okCallback"
                                    >
                                        <el-button type="primary">新增店铺</el-button>
                                    </DialogForm>
                                    <!-- <el-popconfirm title="您确认要批量删除所选数据吗？" @confirm="onBatchSubmit('del')">
                                            <template #reference>
                                                <el-button :disabled="selectedIds.length === 0">批量删除</el-button>
                                            </template>
                                        </el-popconfirm>
                                        <span v-if="selectedIds.length > 0">
                                            已选择：<b>{{ selectedIds.length }}</b> 项
                                        </span> -->
                                </el-space>
                            </div>
                            <div class="list-table-tool-col"></div>
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
                                <!-- <el-table-column type="selection" width="32" /> -->
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
                                <el-table-column label="商户名称" :width="200">
                                    <template #default="{ row }">
                                        <div v-if="row.merchant">
                                            <span v-if="row.merchant.type == 2">{{ row.merchant.merchantData?.merchantName || "--" }}</span>
                                            <span v-if="row.merchant.type == 1">{{ row.merchant.corporateName || "--" }}</span>
                                            <DialogForm
                                                :params="{ act: 'detail', id: row.merchant.merchantId }"
                                                isDrawer
                                                path="adminMerchant/merchant/Info"
                                                title="商户详情"
                                                width="600px"
                                                :showClose="false"
                                                :showOnOk="false"
                                                @okCallback="loadFilter"
                                            >
                                                <a class="btn-link green" v-if="row.merchant.status == 1">(已认证)</a>
                                                <a class="btn-link grey" v-else>(未认证)</a>
                                            </DialogForm>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="店铺状态" sortable="custom">
                                    <template #default="{ row }">
                                        <template v-if="row.status == 10">
                                            <StatusDot color="red" :flicker="true"></StatusDot>
                                        </template>
                                        <template v-if="row.status == 4">
                                            <StatusDot color="red" :flicker="true"></StatusDot>
                                        </template>
                                        <template v-if="row.status == 1">
                                            <StatusDot color="green" :flicker="true"></StatusDot>
                                        </template>
                                        <span v-if="row.status === 10 || row.status === 4" style="color: red">{{ row.statusText }}</span>
                                        <span v-else-if="row.status === 1" style="color: green">{{ row.statusText }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="店铺管理员" align="center">
                                    <template #default="{ row }">
                                        <div v-if="row.merchant && row.merchant.admin">
                                            <p>{{ row.merchant.admin.username || "--" }}</p>
                                        </div>
                                        <div v-else>--</div>
                                    </template>
                                </el-table-column>
                                <!-- <el-table-column label="是否开业" align="center">
                                    <template #default="{ row }">
                                        <CustomSwitch v-model="row.status" :params="{ row: row, field: 'status' }" :active-value=1 :inactive-value=10 size="small" @switch-click="handleSwitchChange"></CustomSwitch>
                                    </template>
                                </el-table-column> -->
                                <el-table-column :width="200" fixed="right" label="操作">
                                    <template #default="{ row }">
                                        <DialogForm
                                            :params="{ act: 'detail', id: row.shopId }"
                                            isDrawer
                                            path="shop/shop/Info"
                                            title="编辑店铺"
                                            width="700px"
                                            @okCallback="loadFilter"
                                        >
                                            <a class="btn-link">编辑</a>
                                        </DialogForm>
                                        <el-divider direction="vertical" />
                                        <DialogForm
                                            :params="{ id: row.shopId }"
                                            isDrawer
                                            path="shop/shop/Set"
                                            title="店铺结算设置"
                                            width="500px"
                                            @okCallback="loadFilter"
                                        >
                                            <a class="btn-link">结算设置</a>
                                        </DialogForm>
                                        <el-divider direction="vertical" />
                                        <a :href="getShopLink('shop', row.shopId)" target="_blank" class="btn-link">查看店铺</a>
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
import { Image } from "@/components/image";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import { ShopFilterParams, ShopFilterState } from "@/types/shop/shop.d";
import { batchSubmit, getShopList, updateShopFiled } from "@/api/shop/shop";
import { CustomSwitch } from "@/components/switch";
import { ElMessageBox } from "element-plus";
import { getShopLink } from "@/utils/util";
import { useRouter } from "vue-router";
import StatusDot from "@/components/form/src/StatusDot.vue";
import SelectConfig from "@/views/adminMerchant/apply/src/SelectConfig.vue";
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
        label: "暂停运营",
        value: 4,
        isShow: true
    },
    {
        label: "打烊",
        value: 10,
        isShow: true
    },
]);
const query = useRouter().currentRoute.value.query;

const config: any = useConfigStore();
// 基本参数定义
const filterState = ref<ShopFilterState[]>([]);
const loading = ref<boolean>(false);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const advancedSearch = ref<boolean>(false);
const filterParams = reactive<ShopFilterParams>({ page: 1, size: config.get("pageSize"), sortField: "", sortOrder: "", keyword: "", status: 0 });
const onChange = (status: number) => {
    filterParams.status = status;
    loadFilter();
};
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
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getShopList({ ...filterParams });
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
const closeCallback = () => {
    merchantId.value = 0;
    clearUrlParams();
};

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

.tabs {
    flex-wrap: wrap;
    gap: 10px !important;
    margin-left: 10px;

    .item {
        padding: 0px 10px;
        text-align: center;
        height: 25px;
        line-height: 25px;
        color: #333;
        margin-right: 5px;
        font-size: 14px;
        border-radius: 2px;
        border: 1px solid #fff;
        cursor: pointer;

        &:hover {
            color: var(--tig-primary);
        }
    }

    .active {
        color: var(--tig-primary);
        background: var(--tig-item-active-bg);
        border: 1px solid var(--tig-primary);
    }
}
</style>
