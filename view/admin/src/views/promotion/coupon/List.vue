<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="bonus-wrap">
                <p class="subtitle">按使用场景快速创建</p>
                <div class="card-wrap">
                    <div class="card-wrap__container">
                        <div class="item-bg coupon-cards-item">
                            <div>
                                <div class="title">满减券</div>
                                <div class="desc">
                                    <p>例：满100元减20元<br />便于合理控制活动成本</p>
                                </div>
                            </div>
                            <DialogForm
                                isDrawer
                                @okCallback="loadFilter"
                                title="添加满减券"
                                width="800px"
                                path="promotion/coupon/Info"
                                :params="{ act: 'add', couponType: 1 }"
                            >
                                <el-button type="primary">立即新建</el-button>
                            </DialogForm>
                        </div>
                        <div class="item-bg coupon-cards-item">
                            <div>
                                <div class="title">折扣券</div>
                                <div class="desc">
                                    <p>例：满100元打9折<br />提高店铺销量和客单价</p>
                                </div>
                            </div>
                            <DialogForm
                                isDrawer
                                @okCallback="loadFilter"
                                title="添加折扣券"
                                width="800px"
                                path="promotion/coupon/Info"
                                :params="{ act: 'add', couponType: 2 }"
                            >
                                <el-button type="primary">立即新建</el-button>
                            </DialogForm>
                        </div>
                        <div class="item-bg coupon-cards-item item-bg2">
                            <div>
                                <div class="title">新人专享券</div>
                                <div class="desc">
                                    <p>仅店铺新客可领，提高新客<br />首单转化</p>
                                </div>
                            </div>
                            <DialogForm
                                isDrawer
                                @okCallback="loadFilter"
                                title="添加新人专享券"
                                width="800px"
                                path="promotion/coupon/Info"
                                :params="{ act: 'add', isNewUser: 1 }"
                            >
                                <el-button type="primary">立即新建</el-button>
                            </DialogForm>
                        </div>
                        <div class="item-bg coupon-cards-item item-bg2">
                            <div>
                                <div class="title">会员专享券</div>
                                <div class="desc">
                                    <p>限会员可领的优惠券，丰富会<br />员权益，凸显会员身份价值</p>
                                </div>
                            </div>
                            <DialogForm
                                isDrawer
                                @okCallback="loadFilter"
                                title="添加会员专享券"
                                width="850px"
                                path="promotion/coupon/Info"
                                :params="{ act: 'add', isNewUser: 2 }"
                            >
                                <el-button type="primary">立即新建</el-button>
                            </DialogForm>
                        </div>
                    </div>
                </div>
            </div>
            <div class="lyecs-table-list-warp">
                <div class="list-table-tool lyecs-search-warp">
                    <!-- <div class="lyecs-nav-scroll">
                        <el-tabs v-model:modelValue="filterParams.shopId" tab-position="top" @tab-change="tabChange">
                            <el-tab-pane label="自营" :name="0"></el-tab-pane>
                            <el-tab-pane label="店铺" :name="-1"></el-tab-pane>
                        </el-tabs>
                    </div> -->
                    <el-form :model="filterParams" @submit.native.prevent="onSearchSubmit">

                        <div class="advanced-search-warp list-table-tool-row">
                            <div class="simple-form-warp">
                                <div v-if="filterParams.shopId == -1" class="simple-form-field">
                                    <div class="form-group">
                                        <div class="control-container">
                                            <SelectShop v-model:shopId="filterParams.shopId"></SelectShop>
                                        </div>
                                    </div>
                                </div>
                                <div class="simple-form-field">
                                    <div class="form-group">
                                        <div class="control-container">
                                            <TigInput v-model="filterParams.keyword" name="keyword" placeholder="输入优惠券名称" clearable @clear="onSearchSubmit">
                                                <template #append>
                                                    <el-button @click="onSearchSubmit"><span class="iconfont icon-chakan1"></span></el-button>
                                                </template>
                                            </TigInput>
                                        </div>
                                    </div>
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

                    </el-form>
                </div>
                <div class="table-container">
                    <a-spin :spinning="loading">
                        <el-table
                            :data="filterState"
                            row-key="couponId"
                            @selection-change="onSelectChange"
                            :total="total"
                            @sort-change="onSortChange"
                            :loading="loading"
                        >
                            <el-table-column type="selection" width="32" />
                            <el-table-column label="优惠券名称" prop="couponId" :width="200">
                                <template #default="{ row }">
                                    <div style="position: relative">
                                        <PopForm
                                            label="优惠券名称"
                                            type="textarea"
                                            :requestApi="updateCouponFiled"
                                            v-model:org-value="row.couponName"
                                            :params="{ id: row.couponId, field: 'couponName' }"
                                        >
                                            <div>{{ row.couponName }}</div>
                                        </PopForm>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="发放类型">
                                <template #default="{ row }">
                                    {{ row.couponType == 1 ? "满减券" : "折扣券" }}
                                    <span v-if="row.isNewUser == 1" class="green">(新人专享)</span>
                                    <span v-if="row.limitUserRank.length" class="green">(会员专享)</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="优惠券金额(折扣)" prop="couponMoney" sortable="custom">
                                <template #default="{ row }">
                                    <PopForm
                                        v-if="row.couponType == 1"
                                        label="优惠券金额"
                                        type="decimal"
                                        :requestApi="updateCouponFiled"
                                        v-model:org-value="row.couponMoney"
                                        :params="{ id: row.couponId, field: 'couponMoney' }"
                                    >
                                        <div>{{ row.couponMoney || "0" }}</div>
                                    </PopForm>
                                    <PopForm
                                        v-if="row.couponType == 2"
                                        label="优惠券折扣"
                                        type="decimal"
                                        :requestApi="updateCouponFiled"
                                        v-model:org-value="row.couponDiscount"
                                        :params="{ id: row.couponId, field: 'couponDiscount' }"
                                    >
                                        <div>{{ row.couponDiscount || "0" }}折</div>
                                    </PopForm>
                                </template>
                            </el-table-column>
                            <el-table-column label="优惠门槛" prop="minOrderAmount" sortable="custom">
                                <template #default="{ row }">
                                    <PopForm
                                        v-if="row.reduceType == 1"
                                        label="优惠门槛"
                                        :type="row.couponUnit == 1 ? 'decimal' : 'integer'"
                                        :requestApi="updateCouponFiled"
                                        v-model:org-value="row.minOrderAmount"
                                        :params="{ id: row.couponId, field: 'minOrderAmount' }"
                                    >
                                        <div>{{ row.minOrderAmount || "0" }}{{ row.couponUnit == 1 ? "元" : "件" }}</div>
                                    </PopForm>
                                    <div v-else>无门槛券</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="是否展示" prop="isShow" sortable="custom">
                                <template #default="{ row }">
                                    <Switch v-model:checked="row.isShow" :requestApi="updateCouponFiled" :params="{ id: row.couponId, field: 'isShow' }" />
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" fixed="right">
                                <template #default="{ row }">
                                    <DialogForm
                                        isDrawer
                                        @okCallback="loadFilter"
                                        title="编辑优惠券"
                                        width="800px"
                                        path="promotion/coupon/Info"
                                        :params="{ act: 'detail', id: row.couponId }"
                                    >
                                        <a class="btn-link">编辑</a>
                                    </DialogForm>
                                    <el-divider direction="vertical" />
                                    <DeleteRecord @afterDelete="loadFilter" :requestApi="delCoupon" :params="{ id: row.couponId }">删除</DeleteRecord>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column label="操作" fixed="right" :width="150">
                                <template #default="{ row }">
                                    <DialogForm isDrawer @okCallback="loadFilter" title="编辑示例模板" width="800px" path="product/example/Info"
                                        :params="{ act: 'edit', id: row.exampleId }">
                                        <a class="btn-link">编辑</a>
                                    </DialogForm>
                                    <el-divider direction="vertical" />
                                    <DeleteRecord @afterDelete="loadFilter" :requestApi="delCoupon" :params="{ id: row.exampleId }">删除</DeleteRecord>
                                </template>
                            </el-table-column> -->
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
import "@/style/css/list.less";
import { DialogForm } from "@/components/dialog";
import { PopForm } from "@/components/pop-form";
import { ref, reactive, onMounted } from "vue";
import { DeleteRecord, Switch, Pagination } from "@/components/list";
import { Image } from "@/components/image";
import { message } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import { CouponFilterState, CouponFilterParams } from "@/types/promotion/coupon.d";
import { getCouponList, batchSubmit, updateCouponFiled, delCoupon } from "@/api/promotion/coupon";
import { SelectShop } from "@/components/select";
const config: any = useConfigStore();
// 基本参数定义
const filterState = ref<CouponFilterState[]>();
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const filterParams = reactive<CouponFilterParams>({
    page: 1,
    size: config.get("pageSize"),
    sortField: "",
    sortOrder: "",
    keyword: "",
    isShow: -1,
    shopId: 0
});
//切换自营和店铺
// const tabChange = (tab) => {
//     loadFilter()
// }
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getCouponList({ ...filterParams });
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
const onSelectChange = (e: any) => {
    selectedIds.value = e.map((item: any) => item.couponId);
};
</script>
<style>
/*优惠券列表类型选择*/
.bonus-wrap .card-wrap {
    display: -ms-flexbox;
    display: flex;
    margin-bottom: 24px;
    -ms-flex-pack: start;
    justify-content: flex-start;
    overflow: hidden;
    z-index: -1;
}

.bonus-wrap .card-wrap__container {
    transition: transform 0.6s ease-in-out;
    display: -ms-flexbox;
    display: flex;
}

.bonus-wrap .item-bg {
    position: relative;
    white-space: nowrap;
    padding: 20px 27px 17px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    background: rgba(51, 136, 255, 0.07);
    margin-right: 15px;
    text-align: center;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: justify;
    justify-content: space-between;
}

.bonus-wrap .coupon-cards-item {
    min-width: 166px;
    width: 170px;
}

.bonus-wrap .coupon-cards-item .title {
    font-size: 16px;
    color: #333;
}

.bonus-wrap .coupon-cards-item .desc {
    padding-top: 10px;
    line-height: 18px;
    font-size: 12px;
    color: #666;
}

.bonus-wrap .coupon-cards-item button {
    margin-top: 15px;
    padding: 0 16px;
}

.bonus-wrap .subtitle {
    font-weight: 500;
    font-size: 14px;
    color: #323233;
    line-height: 20px;
    margin-bottom: 16px;
}

.bonus-wrap .item-bg2 {
    background: #fff;
    border: 1px solid #ebedf0;
    box-sizing: border-box;
    width: 223px !important;
}

@media only screen and (max-width: 767px) {
    .bonus-wrap .card-wrap__container {
        flex-wrap: wrap;
    }
    .bonus-wrap .item-bg {
        width: 47% !important;
        box-sizing: border-box;
        margin: 0;
        margin-top: 10px;
    }
    .bonus-wrap .item-bg:nth-child(2n) {
        margin-left: 3%;
    }
}
</style>
