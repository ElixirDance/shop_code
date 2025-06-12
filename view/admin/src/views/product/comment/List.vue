<template>
    <div class="container">
        <div class="content_wrapper">
            <el-tabs v-model="activeKey" class="lyecs-tabs" tab-position="top" @tab-change="onTabChange">
                <el-tab-pane :name="-1" label="全部评价"></el-tab-pane>
                <el-tab-pane :name="1" label="有晒单"></el-tab-pane>
            </el-tabs>
            <div v-if="activeKey != null" class="container">
                <div class="lyecs-table-list-warp">
                    <div class="list-table-tool lyecs-search-warp">
                        <el-form :model="filterParams"  @submit.native.prevent="onSearchSubmit">
                            <div class="advanced-search-warp list-table-tool-row">
                                <div class="simple-form-warp">
                                    <div class="simple-form-field">
                                        <div class="form-group">
                                            <div class="control-container">
                                                <TigInput
                                                    v-model="filterParams.keyword"
                                                    name="keyword"
                                                    placeholder="请输入评价内容"
                                                    clearable @clear="onSearchSubmit"
                                                >
                                                    <template #append>
                                                        <el-button @click="onSearchSubmit"><span class="iconfont icon-chakan1"></span> </el-button>
                                                    </template>
                                                </TigInput>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="simple-form-field">
                                        <div class="form-group">
                                            <div class="control-container">
                                                <DialogForm
                                                    :params="{ act: 'add' }"
                                                    isDrawer
                                                    path="product/comment/Info"
                                                    title="添加用户评论"
                                                    width="600px"
                                                    @okCallback="loadFilter"
                                                >
                                                    <el-button type="primary">添加用户评论</el-button>
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
                        </el-form>
                    </div>
                    <div class="table-container">
                        <a-spin :spinning="loading">
                            <el-table
                                :data="filterState"
                                :loading="loading"
                                :total="total"
                                row-key="commentId"
                                @selection-change="onSelectChange"
                                @sort-change="onSortChange"
                            >
                                <el-table-column type="selection" width="32" />
                                <el-table-column :width="150" label="用户名称" prop="username" sortable="custom">
                                    <template #default="{ row }">
                                        <div class="display-col">
                                            <div v-if="row.avatar" class="image avatar flex">
                                                <Image :src="imageFormat(row.avatar)" class="image-style" fit="cover" />
                                            </div>
                                            <el-tooltip class="box-item" effect="light" :content="row.username" placement="bottom">
                                                <div class="text">
                                                    {{ row.username }}
                                                </div>
                                                <!-- <el-button>bottom</el-button> -->
                                            </el-tooltip>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column :width="260" label="评论对象">
                                    <template #default="{ row }">
                                        <div class="display-col">
                                            <div class="image_comment">
                                                <Image :src="imageFormat(row.picThumb)" class="image-style shopPics" fit="contain" />
                                            </div>
                                            <div class="text_comment multiline_hiding">
                                                <a :href="urlFormat({ path: 'product', id: row.productId })" target="_blank"> {{ row.productName }} </a>
                                            </div>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column :width="260" label="评价内容" prop="content">
                                    <template #default="{ row }">
                                        <div class="text_comment">
                                            {{ row.content }}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column :width="250" label="晒单" prop="showPics">
                                    <template #default="{ row }">
                                        <div v-if="row.showPics" class="image">
                                            <template v-if="row.showPics.length > 1" v-for="(item, index) in row.showPics">
                                                <Image class="shopPics" v-if="index < 4" :src="imageFormat(item.picThumb)" width="50" style="" fit="contain" />
                                            </template>
                                        </div>
                                        <div v-else>--</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="评论等级" prop="commentRank" sortable="custom" width="100">
                                    <template #default="{ row }">
                                        <PopForm
                                            v-model:org-value="row.commentRank"
                                            :params="{ id: row.commentId, field: 'commentRank' }"
                                            type="integer"
                                            :minNum="1"
                                            :maxNum="5"
                                            :requestApi="updateCommentFiled"
                                            label="评论等级"
                                        >
                                            <div>{{ row.commentRank }}星</div>
                                        </PopForm>
                                    </template>
                                </el-table-column>
                                <el-table-column label="评论日期" prop="addTime" sortable="custom" width="160"></el-table-column>
                                <el-table-column label="是否置顶" prop="isTop" sortable="custom" width="100">
                                    <template #default="{ row }">
                                        <Switch
                                            v-model:checked="row.isTop"
                                            :params="{ id: row.commentId, field: 'isTop' }"
                                            :requestApi="updateCommentFiled"
                                        />
                                    </template>
                                </el-table-column>
                                <el-table-column label="是否推荐" prop="isRecommend" sortable="custom" width="100">
                                    <template #default="{ row }">
                                        <Switch
                                            v-model:checked="row.isRecommend"
                                            :params="{ id: row.commentId, field: 'isRecommend' }"
                                            :requestApi="updateCommentFiled"
                                        />
                                    </template>
                                </el-table-column>
                                <el-table-column label="排序" prop="sortOrder" sortable="custom">
                                    <template #default="{ row }">
                                        <PopForm
                                            v-model:org-value="row.sortOrder"
                                            :params="{ id: row.commentId, field: 'sortOrder' }"
                                            :requestApi="updateCommentFiled"
                                            type="integer"
                                            label="排序"
                                        >
                                            <div>{{ row.sortOrder }}</div>
                                        </PopForm>
                                    </template>
                                </el-table-column>
                                <el-table-column width="100" fixed="right" label="操作">
                                    <template #default="{ row }">
                                        <DialogForm
                                            :params="{ act: 'detail', id: row.commentId }"
                                            isDrawer
                                            path="product/comment/Info"
                                            title="编辑用户评论"
                                            width="700px"
                                            @okCallback="loadFilter"
                                        >
                                            <a class="btn-link">编辑</a>
                                        </DialogForm>
                                        <el-divider direction="vertical" />
                                        <DeleteRecord :params="{ id: row.commentId }" :requestApi="delComment" @afterDelete="loadFilter">删除</DeleteRecord>
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
import { PopForm } from "@/components/pop-form";
import { onMounted, reactive, ref } from "vue";
import { DeleteRecord, Pagination, Switch } from "@/components/list";
import { Image } from "@/components/image";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import { CommentFilterParams, CommentFilterState } from "@/types/product/comment";
import { batchSubmit, delComment, getCommentList, updateCommentFiled } from "@/api/product/comment";
import { imageFormat, urlFormat } from "@/utils/format";

const config: any = useConfigStore();
// 基本参数定义
const filterState = ref<CommentFilterState[]>();
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const advancedSearch = ref<boolean>(false);
const filterParams = reactive<CommentFilterParams>({
    page: 1,
    size: config.get("pageSize"),
    sortField: "",
    sortOrder: "",
    keyword: "",
    isShowed: -1
});

const activeKey = ref<number>(-1);
const onTabChange = (val: number) => {
    filterParams.isShowed = val;
    loadFilter();
};

// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getCommentList({ ...filterParams });
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
const onSelectChange = (e: Object[]) => {
    selectedIds.value = e.map((item: any) => item.commentId);
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
            border-radius: 100%;
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
    }
}
.text_comment {
    /*最多两行*/
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.shopPics {
    margin-right: 5px;
    margin-top: 5px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 3px;
}
.multiline_hiding {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* 限制在3行 */
    -webkit-box-orient: vertical;
    a {
        color: #343434;
    }
}
</style>
