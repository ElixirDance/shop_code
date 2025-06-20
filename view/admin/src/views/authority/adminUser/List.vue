<template>
    <div class="container">
        <div class="content_wrapper">
            <el-tabs v-if="isMerchant()" v-model="activeKey" class="lyecs-tabs" tab-position="top" @tab-change="onTabChange">
                <el-tab-pane label="管理员列表" name="admin"></el-tab-pane>
                <el-tab-pane label="店铺管理员列表" name="shop"></el-tab-pane>
            </el-tabs>
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
                                            :placeholder="activeKey == 'shop' ? '输入员工名称' : '输入管理员名称'"
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
                            <div class="simple-form-field" v-if="activeKey !== 'shop'">
                                <div class="form-group">
                                    <div class="control-container">
                                        <DialogForm
                                            :params="{ act: 'add', type: action ? action : '', suppliersId: id ? id : 0, adminType: activeKey }"
                                            isDrawer
                                            path="authority/adminUser/Info"
                                            :title="'添加管理员'"
                                            width="800px"
                                            @okCallback="loadFilter"
                                        >
                                            <el-button type="primary">添加管理员</el-button>
                                        </DialogForm>
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
                </div>
                <div class="table-container">
                    <a-spin :spinning="loading">
                        <el-table
                            :data="filterState"
                            :loading="loading"
                            :total="total"
                            row-key="adminId"
                            @selection-change="onSelectChange"
                            @sort-change="onSortChange"
                        >
                            <el-table-column type="selection" width="32" />
                            <el-table-column width="200" :label="activeKey == 'shop' ? '员工名称' : '管理员名称'" prop="username">
                                <template #default="{ row }">
                                    <div class="avatar-username">
                                        <template v-if="extractContent(String(row.avatar)) == 'one'">
                                            <el-avatar :size="30" :src="imageFormat(row.avatar)" />
                                        </template>
                                        <template v-else-if="extractContent(String(row.avatar)) == 'def'">
                                            <el-avatar :size="30" :src="returnAvatar(row.avatar)" />
                                        </template>
                                        <template v-else>
                                            <el-avatar :size="30" src="" />
                                        </template>
                                        <div>
                                            <div>{{ row.username }}</div>
                                            <div v-if="activeKey == 'shop' && row.isAdmin == 1">
                                                <Tag :transparent="true" text="店铺管理员"></Tag>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="权限组" prop="roleName" v-if="activeKey != 'shop'">
                                <template #default="{ row }">
                                    <span :class="row.roleName ? 'green' : 'gray'">{{ row.roleName || "-" }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="邮箱" prop="email">
                                <template #default="{ row }">
                                    <span>{{ row.email || "-" }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="电话" prop="mobile">
                                <template #default="{ row }">
                                    <span v-if="row.mobile">
                                        <MobileCard :mobile="row.mobile"></MobileCard>
                                    </span>
                                    <span v-else>--</span>
                                </template>
                            </el-table-column>
                            <el-table-column :width="150" fixed="right" label="操作">
                                <template #default="{ row }">
                                    <DialogForm
                                        :params="{ act: 'detail', id: row.adminId, adminType: activeKey }"
                                        isDrawer
                                        path="authority/adminUser/Info"
                                        :title="activeKey == 'shop' ? '编辑员工' : '编辑管理员'"
                                        width="800px"
                                        @okCallback="loadFilter"
                                    >
                                        <a class="btn-link">编辑</a>
                                    </DialogForm>
                                    <template>
                                        <el-divider direction="vertical" />
                                        <a v-if="activeKey != 'shop'" class="btn-link" @click="toPage(row.adminId)">日志</a>
                                    </template>
                                    <el-divider direction="vertical" v-if="row.adminId != 1" />
                                    <DeleteRecord v-if="row.adminId != 1" :params="{ id: row.adminId }" :requestApi="delAdminUser" @afterDelete="loadFilter"
                                        >删除
                                    </DeleteRecord>
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
import { Image } from "@/components/image";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import type { AdminUserFilterParams, AdminUserFilterState } from "@/types/authority/adminUser";
import { batchSubmit, delAdminUser, getAdminUserList } from "@/api/authority/adminUser";
import { useRouter } from "vue-router";
import { extractContent } from "@/utils/util";
import { imageFormat } from "@/utils/format";
import { returnAvatar } from "@/utils/avatar";
import MobileCard from "@/components/list/src/MobileCard.vue";
import { Tag } from "@/components/form";
import { isMerchant } from "@/utils/version";

const router = useRouter();
const config: any = useConfigStore();
// 基本参数定义
const filterState = ref(<AdminUserFilterState[]>[]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const filterParams = reactive<AdminUserFilterParams>({
    //初使化用于查询的参数
    page: 1,
    size: config.get("pageSize"),
    sortField: "",
    sortOrder: "",
    keyword: "",
    adminUserType: "admin"
});
const activeKey = ref<string>("admin");
const onTabChange = (val: string) => {
    activeKey.value = val;
    filterParams.adminUserType = val;
    loadFilter();
};
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getAdminUserList({ ...filterParams });
        filterState.value = result.records;
        total.value = result.total;
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};
const toPage = (id: string | number) => {
    router.push("/authority/admin_log/list?userId=" + id);
};
const props = defineProps({
    id: {
        type: Number,
        default: 0
    },
    act: {
        type: String,
        default: ""
    },
    isDialog: Boolean
});
const query = useRouter().currentRoute.value.query;
const action = ref<string>(props.isDialog ? props.act : String(query.act));
const id = ref<number | string>(props.isDialog ? props.id : Number(query.id) || "");
onMounted(() => {
    if (action.value) {
        filterParams.suppliersId = id.value;
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
        loadFilter();
    } catch (error: any) {
        message.error(error.message);
    }
};
// 多选操作
const onSelectChange = (e: AdminUserFilterState[]) => {
    selectedIds.value = e.map((item) => item.adminId);
};
</script>
<style lang="less" scoped>
.avatar-username {
    display: flex;
    align-items: center;
    gap: 8px;
}
</style>
