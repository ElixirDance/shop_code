<template>
    <link :href="icoDefinedCss" rel="stylesheet" />
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-table-list-warp">
                <div class="list-table-tool lyecs-search-warp">
                    <el-form :model="filterParams" name="form">
                        <div class="list-table-tool-row">
                            <div class="list-table-tool-col">
                                <el-space>
                                    <el-button v-if="filterParams.parentId > 0" @click="backToParentCat"
                                        ><i class="iconfont icon-fanhui" style="font-size: 14px; padding-right: 5px"></i>
                                        返回上一级
                                    </el-button>
                                    <DialogForm
                                        :params="{ act: 'add', parentId: filterParams.parentId }"
                                        isDrawer
                                        path="product/category/Info"
                                        title="添加分类"
                                        width="600px"
                                        @okCallback="loadFilter"
                                    >
                                        <el-button type="primary">添加分类</el-button>
                                    </DialogForm>
                                    <router-link
                                        v-if="isOverseas()"
                                        :to="{ path: '/setting/multilingual/translationContent/list', query: { type: 'category' } }"
                                    >
                                        <el-button>批量翻译分类名称</el-button>
                                    </router-link>
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
                    </el-form>
                </div>
                <div class="table-container">
                    <a-spin :spinning="loading">
                        <el-table
                            :data="filterState"
                            :expand-row-keys="expandIds"
                            :indent="30"
                            :load="loadData"
                            :total="total"
                            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                            lazy
                            row-key="categoryId"
                            @selection-change="onSelectChange"
                            @expand-change="handleExpandChange"
                            ref="tableRef"
                        >
                            <el-table-column type="selection" width="32" />
                            <el-table-column :width="200" label="分类名称">
                                <template #default="{ row }" row-key="categoryId">
                                    <el-space style="height: 30px">
                                        <div style="position: relative">
                                            <PopForm
                                                v-model:org-value="row.categoryName"
                                                :params="{ id: row.categoryId, field: 'categoryName' }"
                                                :requestApi="updateCategoryFiled"
                                                label="分类名称"
                                                type="textarea"
                                                @callback="changeCallback"
                                            >
                                                <a v-if="row.hasChildren" @click="childCat(row.categoryId)">{{ row.categoryName }}</a>
                                                <span v-else>{{ row.categoryName }}</span>
                                            </PopForm>
                                        </div>
                                    </el-space>
                                </template>
                            </el-table-column>
                            <el-table-column :width="120" label="分类图片">
                                <template #default="{ row }">
                                    <div v-if="row.categoryPic">
                                        <el-image :src="imageFormat(row.categoryPic)" fit="contain" style="height: 30px; width: 30px" />
                                    </div>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column :width="120" label="分类图标">
                                <template #default="{ row }">
                                    <i :class="'lyecs-defined-iconfont ' + row.categoryIco"></i>
                                </template>
                            </el-table-column> -->
                            <el-table-column label="单位">
                                <template #default="{ row }">
                                    <PopForm
                                        v-model:org-value="row.measureUnit"
                                        :params="{ id: row.categoryId, field: 'measureUnit' }"
                                        :requestApi="updateCategoryFiled"
                                        label="单位"
                                        type="input"
                                        @callback="changeCallback"
                                    >
                                        <div>{{ row.measureUnit || "-" }}</div>
                                    </PopForm>
                                </template>
                            </el-table-column>
                            <el-table-column label="是否热门">
                                <template #default="{ row }">
                                    <Switch v-model:checked="row.isHot" :params="{ id: row.categoryId, field: 'isHot' }" :requestApi="updateCategoryFiled" />
                                </template>
                            </el-table-column>
                            <el-table-column key="isShow" :sorter="true" label="是否显示">
                                <template #default="{ row }">
                                    <Switch
                                        v-model:checked="row.isShow"
                                        :params="{ id: row.categoryId, field: 'isShow' }"
                                        :requestApi="updateCategoryFiled"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column key="sortOrder" :sorter="true" label="排序">
                                <template #default="{ row }">
                                    <PopForm
                                        v-model:org-value="row.sortOrder"
                                        :params="{ id: row.categoryId, field: 'sortOrder' }"
                                        :requestApi="updateCategoryFiled"
                                        label="排序"
                                        type="integer"
                                        @callback="changeCallback"
                                    >
                                        <div>{{ row.sortOrder }}</div>
                                    </PopForm>
                                </template>
                            </el-table-column>
                            <el-table-column :width="240" fixed="right" label="操作">
                                <template #default="{ row }">
                                    <DialogForm
                                        :params="{ act: 'detail', id: row.categoryId }"
                                        :data="{ parentId: row.parentId }"
                                        isDrawer
                                        path="product/category/Info"
                                        title="编辑分类"
                                        width="600px"
                                        @okCallback="updateChildFilter"
                                    >
                                        <a class="btn-link">编辑</a>
                                    </DialogForm>
                                    <el-divider direction="vertical" />
                                    <DialogForm
                                        :params="{ act: 'add', parentId: row.categoryId }"
                                        :data="{ parentId: row.parentId || row.categoryId }"
                                        isDrawer
                                        path="product/category/Info"
                                        title="添加子分类"
                                        width="600px"
                                        @okCallback="updateChildFilter"
                                    >
                                        <a class="btn-link">添加子分类</a>
                                    </DialogForm>
                                    <el-divider direction="vertical" />
                                    <DialogForm
                                        :params="{ id: row.categoryId }"
                                        isDrawer
                                        path="product/category/Move"
                                        title="商品转移"
                                        width="600px"
                                        @okCallback="loadFilter"
                                    >
                                        <a class="btn-link">商品转移</a>
                                    </DialogForm>
                                    <el-divider direction="vertical" />
                                    <DeleteRecord
                                        v-if="row.parentId"
                                        :params="{ id: row.categoryId }"
                                        :requestApi="delCategory"
                                        @afterDelete="updateChildFilter({}, { parentId: row.parentId })"
                                        >删除
                                    </DeleteRecord>
                                    <DeleteRecord v-if="!row.parentId" :params="{ id: row.categoryId }" :requestApi="delCategory" @afterDelete="loadFilter"
                                        >删除</DeleteRecord
                                    >
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
import { DeleteRecord, Pagination, Switch } from "@/components/list";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import { PopForm } from "@/components/pop-form";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/store/app";
import { imageFormat } from "@/utils/format";
import { CategoryFilterParams, CategoryFilterState } from "@/types/product/category";
import { batchSubmit, delCategory, getCategoryList, updateCategoryFiled } from "@/api/product/category";
import { useCategoryStore } from "@/store/category";
import { isOverseas } from "@/utils/version";
const categoryStore = useCategoryStore();
//获取来自路由的参数
const { currentRoute } = useRouter();
const router = useRouter();
const appStore = useAppStore();
const config: any = useConfigStore();
const icoDefinedCss = ref(config.icoDefinedCss);

// 基本参数定义
const filterState = ref<CategoryFilterState[]>([]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const expandIds = ref([]);
const filterParams = reactive<CategoryFilterParams>({
    page: 1,
    size: config.get("pageSize"),
    sortField: "",
    sortOrder: "",
    keyword: "",
    isShow: -1,
    parentId: 0
});
const parentId = ref<Array<number>>([0]);
const parentName = ref<string>();
const route = useRoute();
// const currentParentId = ref(null)
const tableTreeRefreshTool = reactive<any>({});
onMounted(() => {
    const query = <any>currentRoute.value.query;
    if (query.id > 0) {
        filterParams.parentId = query.id;
    }
    route.meta.title = "";
    loadFilter();
});

// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getCategoryList({ ...filterParams });
        filterState.value = result.records;
        total.value = result.total;
        // parentName.value = result.parentName;
        // if (!result.parentName) {
        //     appStore.setHeaderTitle("类目管理");
        // } else {
        //     appStore.setHeaderTitle("类目管理 - " + result.parentName);
        // }
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};

const loadData = async (tree: any, treeNode: any, resolve: any) => {
    // 保存父级id，在你需要刷新子级数据的地方可以用到
    // currentParentId.value = tree.categoryId
    // 在之前声明的全局变量中，增加一个key为 本条数据的id，id可替换为你数据中的任意唯一值
    tableTreeRefreshTool[tree.categoryId] = {};
    // 重要！保存resolve方法，以便后续使用
    tableTreeRefreshTool[tree.categoryId].resolve = resolve;
    // 记录展开次数，具体作用后续介绍
    tableTreeRefreshTool[tree.categoryId].expandCount = 0;
    // 请求api接口获取数据
    const result = await getCategoryList({
        page: 1,
        parentId: tree.categoryId,
        size: 1000
    });
    // 调用resolve方法，渲染子级数据
    resolve(result.records);
};
const handleExpandChange = async (row: any, expanded: any) => {
    // 获取到之前保存的全局变量
    const curr = tableTreeRefreshTool[row.categoryId];
    // 展开次数 +1
    curr.expandCount++;
    // 如果是展开状态，且展开次数大于1，且上一次的状态为折叠，则请求api数据，更新子菜单
    if (expanded && curr.expandCount > 1 && !curr.prevStatus) {
        // api请求
        const result = await getCategoryList({
            page: 1,
            parentId: row.categoryId,
            size: 1000
        });
        // 调用resolve方法，渲染子级数据
        curr.resolve(result.records);
    }
    // 保存本次的展开或折叠状态，用于下次判断
    curr.prevStatus = expanded;
};
const tableRef = ref(); // 用于引用表格组件
// 更新当前层级的所有子级
const updateChildFilter = async (res: any, data: any) => {
    const curr = tableTreeRefreshTool[data.parentId];
    // console.log(curr)
    // console.log(tableRef.value)
    if (curr) {
        const result = await getCategoryList({
            page: 1,
            parentId: data.parentId,
            size: 1000
        });
        //通过ref获取table的子节点数
        if (tableRef.value.store.states.lazyTreeNodeMap.value[data.parentId].length > 1) {
            //说明该节点下有多个子节点
            tableRef.value.store.states.lazyTreeNodeMap[data.parentId] = [];
        } else {
            //说明该节点只有一个节点
            tableRef.value.store.states.lazyTreeNodeMap.value[data.parentId] = [];
        }
        curr.resolve(result.records);
    } else {
        loadFilter();
    }
};
const changeCallback = () => {
    categoryStore.clearCategory();
};

// const loadChildren = async (row, treeNode, resolve) => {
//     // 保存resolve操作，用于以后的更新
//     const item = findItemById(filterState.value, row.categoryId);
//     item.resolve = resolve
//     try {
//         const result = await getCategoryList({
//             page: 1,
//             parentId: row.categoryId,
//             size: 1000,
//         });
//         row.children = result.records
//         resolve(result.records);
//     } catch (error) {
//         message.error(error.message);
//     }

// }
// // 更新当前层级的所有子级
// const updateChildFilter = async (parentId = 0) => {
//     const row = findItemById(filterState.value, parentId);
//     try {
//         const result = await getCategoryList({
//             page: 1,
//             parentId: parentId,
//             size: 1000,
//         });
//         row.resolve(result.records);
//     } catch (error) {
//         message.error(error.message);
//     }
// }
// // 获取分类数组对应ID的元素
// const findItemById = (items: any[], id: number): any => {
//     for (const item of items) {
//         if (item.categoryId === id) {
//             return item;
//         } else if (item.children) {
//             const found = findItemById(item.children, id);
//             if (found) {
//                 return found;
//             }
//         }
//     }
//     return null;
// };

const childCat = (id: number) => {
    parentId.value.push(id);
    filterParams.parentId = id;
    loadFilter();
};
const backToParentCat = () => {
    parentId.value.pop();
    filterParams.parentId = parentId.value[parentId.value.length - 1];
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

const onSelectChange = (e: any) => {
    selectedIds.value = e.map((item: any) => item.categoryId);
};
</script>

<style lang="less">
.el-table__expand-icon {
    top: 2px;
    margin-right: 18px !important;
}

// :deep(.table-container) .el-table__expand-icon {
//     display: none;
// }
.el-table__expand-icon--expanded {
    transform: none;
}

.el-table__expand-icon svg {
    display: none;
}

.el-table__expand-icon .el-icon {
    color: inherit;
    text-decoration: none;
    outline: none;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    float: left;
    box-sizing: border-box;
    width: 17px;
    height: 17px;
    padding: 0;
    line-height: 17px;
    background: #ffffff;
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    transform: scale(0.9411764705882353);
    user-select: none;
}

.el-table__expand-icon .el-icon.is-loading {
    animation: none;
}

.el-table__expand-icon .el-icon::before,
.el-table__expand-icon .el-icon::after {
    position: absolute;
    background: currentcolor;
    transition: transform 0.3s ease-out;
    content: "";
}

.el-table__expand-icon .el-icon::before {
    top: 7px;
    inset-inline-end: 3px;
    inset-inline-start: 3px;
    height: 1px;
}

.el-table__expand-icon .el-icon::after {
    top: 3px;
    bottom: 3px;
    inset-inline-start: 7px;
    width: 1px;
    transform: rotate(90deg);
}

.el-table__expand-icon .el-icon::after {
    position: absolute;
    background: currentcolor;
    transition: transform 0.3s ease-out;
    content: "";
}

.el-table__expand-icon .el-icon::before {
    transform: rotate(-180deg);
}

.el-table__expand-icon .el-icon::after {
    transform: rotate(0deg);
}

.el-table__expand-icon--expanded .el-icon::before {
    transform: rotate(0);
}

.el-table__expand-icon--expanded .el-icon::after {
    transform: rotate(90deg);
}
</style>
