<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="row">
                <div class="col activity">
                    <div>
                        <div class="tip">仅统计优惠券、满减/送、限时折扣、秒杀、多人拼团、赠品 活动</div>
                        <div class="tabs flex">
                            <div
                                class="item"
                                v-for="item in promotionTypeList"
                                :class="{ active: item.value == filterParams.timeType }"
                                @click="changeTimeType(item.value)"
                            >
                                <div class="num">{{ item.num }}</div>
                                <div class="txt">{{ item.label }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div>
                        <h2>商家常用</h2>
                        <div class="app-wrapper cursor-pointer">
                            <div class="app-wrapper-item" @click="toPage(2)">
                                <div class="icon-col">
                                    <i class="iconfont-admin icon-youhuiquan"></i>
                                </div>
                                <div>
                                    <div class="name">优惠券</div>
                                    <div class="tip">向客户发放店铺优惠券</div>
                                </div>
                            </div>
                            <div class="app-wrapper-item" @click="toPage(6)">
                                <div class="icon-col">
                                    <i class="iconfont-admin icon-time-limit"></i>
                                </div>
                                <div>
                                    <div class="name">限时折扣</div>
                                    <div class="tip">设置商品限时打折促销</div>
                                </div>
                            </div>
                            <div class="app-wrapper-item" @click="toPage(3)">
                                <div class="icon-col">
                                    <p>减</p>
                                </div>
                                <div>
                                    <div class="name">满减</div>
                                    <div class="tip">购满一定金额或件数享受优惠</div>
                                </div>
                            </div>
                            <div class="app-wrapper-item" @click="toPage(5)">
                                <div class="icon-col">
                                    <p>送</p>
                                </div>
                                <div>
                                    <div class="name">满送</div>
                                    <div class="tip">购满一定金额或件数享受优惠</div>
                                </div>
                            </div>
                            <div class="app-wrapper-item" @click="toPage(9)">
                                <div class="icon-col">
                                    <i class="iconfont-admin icon-qiandao"></i>
                                </div>
                                <div>
                                    <div class="name">日历签到</div>
                                    <div class="tip">每日签到领取积分或奖励</div>
                                </div>
                            </div>
                            <div class="app-wrapper-item" @click="toPage(1)">
                                <div class="icon-col">
                                    <i class="iconfont-admin icon-miaosha"></i>
                                </div>
                                <div>
                                    <div class="name">秒杀</div>
                                    <div class="tip">快速抢购引导顾客更多消费</div>
                                </div>
                            </div>
                            <div class="app-wrapper-item" @click="toPage(10)">
                                <div class="icon-col">
                                    <p>赠</p>
                                </div>
                                <div>
                                    <div class="name">赠品</div>
                                    <div class="tip">设置赠品, 回馈客户</div>
                                </div>
                            </div>
                            <div class="app-wrapper-item" @click="toPage(7)">
                                <div class="icon-col">
                                    <p>充</p>
                                </div>
                                <div>
                                    <div class="name">余额充值</div>
                                    <div class="tip">充值店铺余额</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <!-- <div class="tit-box">
                        <div class="tit">
                            <span>活动记录</span>
                        </div>
                    </div> -->
                    <h2>活动记录</h2>
                    <el-tabs type="card" @tab-change="onTabChange">
                        <el-tab-pane v-for="item in promotionStatusList" :label="item.label" :value="item.value"></el-tab-pane>
                    </el-tabs>
                    <a-spin :spinning="loading">
                        <el-table :data="filterState" row-key="couponId" :total="total" :loading="loading">
                            <el-table-column label="活动名称" prop="promotionName" width="300">
                                <template #default="{ row }">
                                    <div style="position: relative">
                                        <div>{{ row.promotionName || "--" }}</div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="活动类型" prop="typeText" width="300"> </el-table-column>
                            <el-table-column label="活动时间" prop="timeText"> </el-table-column>
                            <el-table-column label="操作" width="110">
                                <template #default="{ row }">
                                    <a class="btn-link" @click="toPage(row.type)">查看</a>
                                    <el-divider direction="vertical" />
                                    <DialogForm
                                        v-if="row.type == 1"
                                        :params="{ act: 'detail', id: row.relationId }"
                                        isDrawer
                                        title="编辑限时秒杀"
                                        width="800px"
                                        path="promotion/seckill/Info"
                                        @okCallback="loadFilter"
                                    >
                                        <a class="btn-link">编辑</a>
                                    </DialogForm>
                                    <DialogForm
                                        v-if="row.type == 2"
                                        isDrawer
                                        @okCallback="loadFilter"
                                        title="编辑优惠券"
                                        width="800px"
                                        path="promotion/coupon/Info"
                                        :params="{ act: 'detail', id: row.relationId }"
                                    >
                                        <a class="btn-link">编辑</a>
                                    </DialogForm>
                                    <DialogForm
                                        v-if="row.type == 6"
                                        isDrawer
                                        @okCallback="loadFilter"
                                        title="编辑限时折扣"
                                        width="900px"
                                        path="promotion/productActivity/limitdiscount/Info"
                                        :params="{ act: 'detail', id: row.relationId }"
                                    >
                                        <a class="btn-link">编辑</a>
                                    </DialogForm>
                                    <DialogForm
                                        v-if="row.type == 3 || row.type == 5 || row.type == 4"
                                        isDrawer
                                        @okCallback="loadFilter"
                                        title="编辑优惠活动"
                                        width="800px"
                                        path="promotion/productActivity/Info"
                                        :params="{ act: 'detail', id: row.relationId, promotionType: row.type == 4 ? 2 : row.type == 3 ? 1 : 3 }"
                                    >
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
import "@/style/css/list.less";
import { DialogForm } from "@/components/dialog";
import { Pagination } from "@/components/list";
import { ref, reactive, onMounted } from "vue";
import { useConfigStore } from "@/store/config";
import type { PromotionFilterParams, PromotionFilterState } from "@/types/promotion/manage";
import { getPromotionList, getPromotionCount } from "@/api/promotion/manage";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
const router = useRouter();
const config: any = useConfigStore();
// 基本参数定义
const promotionTypeList = reactive([
    { value: 1, label: "进行中的活动", num: "-" },
    { value: 2, label: "7天内到期活动", num: "-" },
    { value: 3, label: "未开始活动", num: "-" }
]);
const promotionStatusList = reactive([
    { value: 0, label: "全部" },
    { value: 1, label: "秒杀" },
    { value: 2, label: "优惠券" },
    { value: 6, label: "限时折扣" },
    { value: 3, label: "满减" },
    { value: 5, label: "满赠" }
]);
const filterParams = reactive<PromotionFilterParams>({
    page: 1,
    size: config.get("pageSize"),
    sortField: "",
    sortOrder: "",
    timeType: 1,
    types: 0
});
const filterState = ref<PromotionFilterState[]>([]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    let type: any[] = [];
    if (filterParams.types === 0) {
        type = [];
    } else if (filterParams.types === 3) {
        type = [3, 4];
    } else {
        type = [filterParams.types];
    }
    try {
        const count = await getPromotionCount();
        (promotionTypeList[0].num as any) = count.timeType1Count;
        (promotionTypeList[1].num as any) = count.timeType2Count;
        (promotionTypeList[2].num as any) = count.timeType3Count;
        const result = await getPromotionList({ ...filterParams, type: type.join(",") });
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
const changeTimeType = (e: number) => {
    filterParams.timeType = e;
    loadFilter();
};
const onTabChange = (e: number) => {
    filterParams.types = promotionStatusList[e].value;
    loadFilter();
};
const toPage = (type: number) => {
    switch (type) {
        case 1:
            // 秒杀
            router.push({ path: "/promotion/seckill/list" });
            break;
        case 2:
            // 优惠券
            router.push({ path: "/promotion/coupon/list" });
            break;
        case 6:
            // 限时折扣
            router.push({ path: "/promotion/limitdiscount_gift/list" });
            break;
        case 3:
            // 满减
            router.push({ path: "/promotion/full_reduction/list" });
            break;
        case 5:
            // 满赠
            router.push({ path: "/promotion/reward_gift/list" });
            break;
        case 9:
            // 签到
            router.push({ path: "/promotion/sign_in_setting/list" });
            break;
        case 7:
            // 充值
            router.push({ path: "/promotion/recharge_setting/list" });
            break;
        case 10:
            // 赠品
            router.push({ path: "/promotion/product_gift/list" });
            break;
    }
};
</script>
<style lang="less" scoped>
.container {
    .content_wrapper {
        .row {
            .tit-box {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background-color: #f5f6fa;
                padding: 10px;
                margin-bottom: 20px;
                .tit {
                    border-left: 3px solid #155bd4;
                    padding-left: 10px;
                    font-size: 14px;
                }
            }
            .activity {
                h2 {
                    margin-bottom: 10px;
                }
                .tip {
                    font-size: 14px;
                    color: #999;
                }
                .tabs {
                    margin-top: 20px;
                    .item {
                        padding: 20px;
                        width: 240px;
                        background-color: #f7f7f7;
                        border-bottom: 3px solid #f7f7f7; /* 设置边框 */
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-end;
                        margin-right: 15px;
                        .num {
                            font-weight: 900;
                            font-size: 28px;
                            line-height: 28px;
                            font-family: Aviner;
                        }
                        .txt {
                            font-weight: 400;
                            font-size: 14px;
                            line-height: 20px;
                            margin-top: 10px;
                        }
                    }
                    .active {
                        background: var(--tig-item-active-bg);
                        border-bottom: 3px solid var(--tig-primary); /* 设置边框 */
                    }
                }
            }
            .col {
                h2 {
                    margin: 20px 0;
                }
            }
            .app-wrapper {
                display: flex;
                flex-wrap: wrap;
                margin-top: 20px;
                .app-wrapper-item {
                    display: flex;
                    align-items: center;
                    padding: 16px 20px;
                    margin-right: 15px;
                    margin-bottom: 15px;
                    background-color: #f7f8fa;
                    width: 290px;
                }
                .icon-col {
                    background-color: #df4544;
                    color: #fff;
                    width: 40px;
                    height: 40px;
                    border-radius: 5px;
                    text-align: center;
                    margin-right: 10px;
                    line-height: 40px;
                    .iconfont-admin {
                        font-size: 25px;
                    }
                    p {
                        font-size: 20px;
                    }
                }
                .name {
                    font-size: 14px;
                }
                .tip {
                    color: #999;
                    font-size: 12px;
                    line-height: 16px;
                    margin-top: 4px;
                }
            }
        }
    }
}
:deep(.el-tabs--card) {
    .el-tabs__header .el-tabs__item {
        background-color: #f5f6fa;
    }
    .el-tabs__header .el-tabs__item.is-active {
        background-color: #fff;
        color: #333;
    }
    .el-tabs__header .el-tabs__nav {
        overflow: hidden;
    }
}
</style>
