<template>
    <div class="container">
        <el-row :gutter="15">
            <el-col :span="24">
                <div class="info-row">
                    <div class="title flex">
                        <div>店铺管理</div>
                        <div>
                            <DialogForm :params="{ act: 'detail'}" isDrawer path="merchant/setting/shopInfo/Info" title="编辑店铺信息" width="600px" @okCallback="loadFilter">
                                <div style="text-align: center;">
                                    <el-button type="primary" link>编辑</el-button>
                                </div>
                            </DialogForm>
                        </div>
                    </div>
                    <a-spin :spinning="loading">
                        <div class="info-content" v-if="shopInfo">
                            <div class="cell flex">
                                <div class="logo">
                                    <el-image style="width: 72px; height: 72px" v-if="shopInfo.shopLogo" :src="imageFormat(shopInfo.shopLogo)" fit="cover" />
                                    <el-image style="width: 72px; height: 72px" v-else src="/src/style/images/logo.png" fit="cover" />
                                </div>
                                <div class="txt-content">
                                    <div class="name">
                                        {{shopInfo.shopTitle}}
                                    </div>
                                    <el-row :gutter="10">
                                        <el-col :xs="24" :lg="12">
                                            <div class="form-data br1">
                                                <div class="label">
                                                    <div class="tit">
                                                        创建时间：
                                                    </div>
                                                    <div class="txt">
                                                        {{shopInfo.addTime}}
                                                    </div>
                                                </div>
                                                <div class="label">
                                                    <div class="tit">
                                                        店铺简介：
                                                    </div>
                                                    <div class="txt">
                                                        {{shopInfo.description || '--'}}
                                                    </div>
                                                </div>
                                                <div class="label">
                                                    <div class="tit">
                                                        联系电话：
                                                    </div>
                                                    <div class="txt">
                                                        <MobileCard v-if="shopInfo.contactMobile" :mobile="shopInfo.contactMobile"></MobileCard>
                                                        <span v-else>暂无联系电话</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </el-col>
                                        <el-col :xs="24" :lg="12" v-if="accountData.merchant">
                                            <div class="form-data">
                                                <div class="label">
                                                    <div class="tit">
                                                        主体信息：
                                                    </div>
                                                    <div class="txt">
                                                        {{ accountData.merchant?.merchantData?.merchantName }}
                                                    </div>
                                                </div>
                                                <div class="label">
                                                    <div class="tit">
                                                        负责人姓名：
                                                    </div>
                                                    <div class="txt">
                                                        {{ accountData.merchant?.merchantData?.contactName }}
                                                    </div>
                                                </div>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </div>
                    </a-spin>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="15">
            <el-col :span="24">
                <div class="info-row">
                    <div class="title flex">
                        <div>员工管理</div>
                    </div>
                    <a-spin :spinning="loading">
                        <div class="staff-info">
                            <div class="info-num-row">
                                <div class="item">
                                    <div class="tit">已有员工数</div>
                                    <div class="num">{{ staffData.usingUser || '-' }}</div>
                                    <div class="btn">
                                        <RouterLink to="/merchant_setting/employee/list">编辑</RouterLink>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="tit">剩余可用名额</div>
                                    <div class="num">{{ staffData.residue || '-' }}</div>
                                    <div class="btn">
                                        <RouterLink to="/merchant_setting/employee/list">获取更多</RouterLink>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="tit">停用员工数</div>
                                    <div class="num">{{ staffData.stopUsingUser || '0' }}</div>
                                    <div class="btn">
                                        <RouterLink to="/merchant_setting/employee/list">获取更多</RouterLink>
                                    </div>
                                </div>
                            </div>
                            <div class="log-row">
                                <div class="tit-row">
                                    <div class="tit">
                                        最近员工操作
                                    </div>
                                    <div class="more">
                                        <RouterLink to="/merchant_setting/employeeLog/list">获取更多</RouterLink>
                                    </div>
                                </div>
                                <div class="list-row">
                                    <div class="item" v-for="item in staffData.adminLog">
                                        <div class="staff">
                                            <div class="username">{{ item.username }}</div>
                                            <div class="tips">{{ item.logInfo }}</div>
                                        </div>
                                        <div class="time">
                                            {{ item.logTime }}
                                        </div>
                                    </div>
                                </div>
                                <div class="empty-warp" v-if="staffData.adminLog.length === 0">
                                    <div v-if="!loading" class="empty-bg">暂无数据</div>
                                </div>
                            </div>
                        </div>
                    </a-spin>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import "@/style/css/list.less";
import { ref, onMounted, computed } from "vue";
import {DialogForm} from "@/components/dialog";
import { QuestionFilled } from "@element-plus/icons-vue";
import { useUserStore } from "@/store/user";
import { imageFormat } from "@/utils/format";
import {message} from 'ant-design-vue'
import {getShopAccount, getStaffShow} from "@/api/merchant/capitalfund/dashboard";
import {getShopInfo} from "@/api/authority/accountEditing";
import {AccountFormState, StaffFrom} from "@/types/merchant/capitalfund/dashboard.d";
import {getUsercount} from "@/api/merchant/setting/team";
import MobileCard from "@/components/list/src/MobileCard.vue";
const shopInfo = computed(() => useUserStore().shopInfo);
const accountData = ref<AccountFormState>({
    shopMoney: 0
})
const staffData = ref<StaffFrom>({
    adminLog:[]
})
const loading = ref<boolean>(true);
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getShopInfo();
        accountData.value = result;
        // 更新后台设置项
        const userStore = useUserStore() as any;
        userStore.updateUserInfo();
        //员工数量 只有1个值 不知道怎么放 先不显示
        // console.log(getUsercount())
        const resultStaff = await getStaffShow();
        staffData.value = resultStaff;
    } catch (error:any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
}
onMounted(() => {
    loadFilter();
});
</script>
<style lang="less" scoped>
.container{
    .info-row{
        background-color: #fff;
        margin-bottom: 15px;
        .title{
            font-size: 18px;
            font-weight: 700;
            padding: 20px;
            justify-content: space-between;
        }
        .info-content{
            .cell{
                padding: 0 20px 20px 20px;
                .logo{
                    width: 72px;
                    height: 72px;
                    background-color: #eee;
                    border-radius: 100px;
                    margin-right: 20px;
                    overflow: hidden;
                }
                .txt-content{
                    width: 90%;
                    .name{
                        margin-bottom: 20px;
                        font-size: 16px;
                        margin-left: 26px;
                        font-weight: 700;
                        color: #323233;
                    }
                    .form-data{
                        width: 100%;
                        .label{
                            font-size: 14px;
                            display: flex;
                            align-items: center;
                            margin-bottom: 12px;
                            .tit{
                                text-align: right;
                                white-space: nowrap;
                                min-width: 100px;
                                line-height: 20px;
                                color: #646566;
                            }
                            .txt{
                                display: flex;
                                align-items: center;
                                line-height: 20px;
                                color: #37373f;
                                :deep(.el-icon){
                                    color: #c8c9cc;
                                }
                                :deep(.el-button.is-link){
                                    margin-top: 2px;
                                    margin-left: 5px;
                                }
                            }
                        }
                    }
                    .br1{
                        border-right: 1px solid #ededee;
                    }
                }
            }
        }
        .staff-info{
            .info-num-row{
                display: flex;
                margin:0 20px;
                border-bottom: 1px solid #ededee;
                padding-bottom: 20px;
                .item{
                    width: 33.33%;
                    text-align: center;
                    .tit{
                         font-size: 13px;
                         color: #999;
                         margin-bottom: 10px;
                     }
                    .num{
                         font-size: 24px;
                         font-weight: 700;
                         color: #323233;
                     }
                    .btn{
                         margin-top: 10px;
                     }
                }
            }
            .log-row{
                padding: 20px;
                .tit-row{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .tit{
                         font-size: 16px;
                         font-weight: 700;
                    }
                }
                .list-row{
                    .item{
                        margin-top: 20px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .staff{
                            display: flex;
                            align-items: center;
                            .username{
                                font-size: 14px;
                            }
                            .tips{
                                font-size: 14px;
                                color: #999;
                                margin-left: 10px;
                            }
                        }
                        .time{
                            color: #999;
                        }
                    }
                }
            }
        }
    }
}
</style>
