<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-form-table">
                <el-tabs v-model="activeKey" class="lyecs-tabs" tab-position="top" @tab-change="onTabChange">
                    <el-tab-pane :key="1" label="基础信息" name="sm"></el-tab-pane>
                    <el-tab-pane v-if="formState.type==2" :key="2" :label="'企业信息'" name="company"></el-tab-pane>
                    <el-tab-pane :key="3" :label="formState.type==1?'个人信息':'法人代表信息'" name="base"></el-tab-pane>
                    <el-tab-pane :key="4" label="商户信息" name="merchant"></el-tab-pane>
                    <el-tab-pane :key="5" label="店铺信息" name="shop"></el-tab-pane>
                </el-tabs>
                <el-form v-if="!loading" ref="formRef" :model="formState" label-width="auto">
                    <template v-if="activeKey=='sm'">
                        <el-form-item label="预期店铺名称">
                            <div class="width100"> {{ formState.shopData.shopTitle }}</div>
                        </el-form-item>
                        <el-form-item label="入驻资质" prop="status">
                            <div class="width100"> {{ formState.type == 1 ? "个人入驻" : "企业入驻" }}</div>
                        </el-form-item>
                        <template v-if="formState.type==1"></template>
                        <template v-if="formState.type==2">
                            <el-form-item label="企业名称">
                                <div class="width100"> {{ formState.baseData.companyName }}</div>
                            </el-form-item>
                        </template>
                        <el-form-item label="联系人姓名">
                            <div class="width100"> {{ formState.merchantData.contactName }}</div>
                        </el-form-item>
                        <el-form-item label="联系人手机">
                            <div class="width100">
                                <MobileCard  :mobile="formState.merchantData.contactPhone"></MobileCard>
                            </div>
                        </el-form-item>
                        <el-form-item label="联系人邮箱">
                            <div class="width100"> {{ formState.merchantData.contactEmail }}</div>
                        </el-form-item>
                        <el-form-item label="审核结果">
                            <div class="width100">
                                <div>
                                    <template v-if="formState.status==1">
                                        <StatusDot :flicker="true"></StatusDot>
                                    </template>
                                    <template v-if="formState.status==10">
                                        <StatusDot color="#52c41a" :flicker="true"></StatusDot>
                                    </template>
                                    <template v-if="formState.status==20">
                                        <StatusDot color="#f5222d" :flicker="false"></StatusDot>
                                    </template>
                                    {{ formState.statusText }}
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="拒绝原因" v-if="formState.status==20">
                            <div class="width100"> {{ formState.auditRemark }}</div>
                        </el-form-item>
                    </template>
                    <template v-if="activeKey=='company'">
                        <el-form-item label="企业名称">
                            <div class="width100"> {{ formState.baseData.companyName }}</div>
                        </el-form-item>
                        <el-form-item label="注册地址">
                            <div class="width100"> {{ formState.baseData.licenseAddrProvinceName }} {{ formState.baseData.businessLicenseAddress }}</div>
                        </el-form-item>
                        <el-form-item label="经营范围">
                            <div class="width100"> {{ formState.baseData.businessScope }}</div>
                        </el-form-item>
                        <el-form-item label="统一社会信用代码">
                            <div class="width100"> {{ formState.baseData.businessLicenseId }}</div>
                        </el-form-item>
                        <el-form-item label="营业期限">
                            <div class="width100">
                                <template v-if="formState.baseData.operatingTermType==1">
                                    {{ formState.baseData.operatingTermTypeDate[0] + " ～  " + formState.baseData.operatingTermTypeDate[1] }}
                                </template>
                                <template v-else>
                                    {{ formState.baseData.operatingTermTypeEnd }} ～长期
                                </template>
                            </div>
                        </el-form-item>
                    </template>
                    <template v-if="activeKey=='base'">
                        <el-form-item :label="formState.type==1?'个人姓名':'法定代表人姓名'">
                            <div class="width100"> {{ formState.baseData.corporateName }}</div>
                        </el-form-item>
                        <el-form-item label="证件类型">
                            <div class="width100">
                                {{ documentTypeOptions.find(option => option.value === formState.baseData.documentType)?.label || "" }}
                            </div>
                        </el-form-item>
                        <el-form-item label="证件号码">
                            <div class="width100"> {{ formState.baseData.documentNumber }}</div>
                        </el-form-item>
                        <el-form-item  label="性别">
                            <div class="width100"> {{ formState.baseData.sex == 1 ? "男" : "女" }}</div>
                        </el-form-item>
                        <el-form-item  label="居住地址">
                            <div class="width100"> {{ formState.baseData.residentialAddress }}</div>
                        </el-form-item>
                        <el-form-item label="证件有效期">
                            <div class="width100">
                                <template v-if="formState.baseData.certificateValidityPeriod==1">
                                    {{ formState.baseData.certificateValidityPeriodDate[0] + " ～ " + formState.baseData.certificateValidityPeriodDate[1] }}
                                </template>
                                <template v-else>
                                    {{ formState.baseData.certificateValidityPeriodEnd }} ～ 长期
                                </template>
                            </div>
                        </el-form-item>
                        <el-form-item label="证件照正面">
                            <div class="width100">
                                <el-image :src="imageFormat(formState.baseData.frontOfPhoto[0].picUrl)" class="image-size" fit="cover" @click="showImage(imageFormat(formState.baseData.frontOfPhoto[0].picUrl))"></el-image>
                            </div>
                        </el-form-item>
                        <el-form-item label="证件照反面">
                            <div class="width100">
                                <el-image :src="imageFormat(formState.baseData.backOfPhoto[0].picUrl)" class="image-size" fit="cover" @click="showImage(imageFormat(formState.baseData.backOfPhoto[0].picUrl))"></el-image>
                            </div>
                        </el-form-item>
                        <el-form-item v-if="formState.baseData.supplementaryInformation.length>0" label="补充信息">
                            <div class="width100">
                                <template v-for="item in formState.baseData.supplementaryInformation">
                                    <el-image :src="imageFormat(item.picUrl)" class="image-size" fit="cover"
                                              @click="showImage(imageFormat(item.picUrl))"></el-image>
                                </template>
                            </div>
                        </el-form-item>
                    </template>
                    <template v-if="activeKey=='merchant'">
                        <el-form-item label="商户名称">
                            <div class="width100">{{ formState.merchantData.merchantName }}</div>
                        </el-form-item>
                        <template v-if="formState.type==1">
                            <el-form-item label="持卡人">
                                <div class="width100"> {{ formState.baseData.corporateName }}</div>
                            </el-form-item>
                            <el-form-item label="开户银行">
                                <div class="width100"> {{ formState.merchantData.bankDeposit }}</div>
                            </el-form-item>
                            <el-form-item label="开户支行">
                                <div class="width100"> {{ formState.merchantData.bankBranch }}</div>
                            </el-form-item>
                            <el-form-item label="银行卡号">
                                <div class="width100"> {{ formState.merchantData.bankCard }}</div>
                            </el-form-item>
                        </template>
                        <template v-if="formState.type==2">
                            <el-form-item label="对公账户">
                                <div class="width100"> {{ formState.baseData.companyName }}</div>
                            </el-form-item>
                            <el-form-item label="开户银行">
                                <div class="width100"> {{ formState.merchantData.bankDeposit }}</div>
                            </el-form-item>
                            <el-form-item label="开户支行">
                                <div class="width100"> {{ formState.merchantData.bankBranch }}</div>
                            </el-form-item>
                            <el-form-item label="对公银行账号">
                                <div class="width100"> {{ formState.merchantData.bankCard }}</div>
                            </el-form-item>
                            <el-form-item label="开户许可证">
                                <div class="width100">
                                    <template v-if="formState.merchantData.accountOpeningPermit?.length>0">
                                        <el-image :src="imageFormat(formState.merchantData.accountOpeningPermit[0].picUrl)" class="image-size" fit="cover"
                                                  @click="showImage(imageFormat(formState.merchantData.accountOpeningPermit[0].picUrl))"></el-image>
                                    </template>
                                </div>
                            </el-form-item>
                        </template>
                        <el-form-item label="经营地区">
                            <div class="width100">{{ formState.merchantData.businessAddressName }}{{ formState.merchantData.detailedAddress }}</div>
                        </el-form-item>
                        <el-form-item v-if="formState.type==2" label="营业执照">
                            <div class="width100">
                                <template v-if="formState.merchantData.businessLicenseImg?.length>0">
                                    <el-image :src="imageFormat(formState.merchantData.businessLicenseImg[0].picUrl)" class="image-size" fit="cover" @click="showImage(imageFormat(formState.merchantData.businessLicenseImg[0].picUrl))"></el-image>
                                </template>
                            </div>
                        </el-form-item>
                        <el-form-item label="客服电话">
                            <div class="width100">{{ formState.merchantData.customerServicePhone }}</div>
                        </el-form-item>
                    </template>
                    <template v-if="activeKey=='shop'">
                        <el-form-item label="店铺名称">
                            <div class="width100"> {{ formState.shopData.shopTitle }}</div>
                        </el-form-item>
                        <el-form-item label="联系电话">
                            <div class="width100">
                                <MobileCard  :mobile="formState.shopData.contactMobile"></MobileCard>
                            </div>
                        </el-form-item>
                        <el-form-item label="店铺logo">
                            <div class="width100">
                                <template v-if="formState.shopData.shopLogo?.length>0">
                                    <el-image :src="imageFormat(formState.shopData.shopLogo[0].picUrl)" class="image-size" fit="cover" @click="showImage(imageFormat(formState.shopData.shopLogo[0].picUrl))"></el-image>
                                </template>
                            </div>
                        </el-form-item>
                        <el-form-item v-if="formState.shopData.description" label="店铺简介">
                            <div class="width100"> {{ formState.shopData.description }}</div>
                        </el-form-item>
                    </template>
                    <template v-if="formState.status==1">
                        <el-form-item :wrapper-col="{ offset: 4, span: 16 }">
                            <el-button ref="submitBtn" class="form-submit-btn" type="primary" @click="onSubmit(10)">审核通过</el-button>
                            <el-button ref="submitBtn" class="form-submit-btn" @click="onSubmit(20)">审核不通过</el-button>
                        </el-form-item>
                        <TigInput classType="tig-from-input" :rows="4" v-model="formState.auditRemark" placeholder="请输入审核备注（审核不通过将必填）" type="textarea"></TigInput>
                    </template>
                </el-form>
                <a-spin :spinning="loading" style="width:100%;margin-top:100px" />
            </div>
        </div>
    </div>
    <el-dialog v-model="dialogVisible">
        <div class="image">
            <el-image :src="dialogImageUrl" alt="" fit="cover" />
        </div>
    </el-dialog>
</template>
<script lang="ts" setup>
import { onMounted, ref, shallowRef } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { ElMessageBox } from 'element-plus'
import { ApplyFormState } from "@/types/adminMerchant/apply";
import { auditApply, getApply } from "@/api/adminMerchant/apply";
import { imageFormat } from "@/utils/format";
import StatusDot from "@/components/form/src/StatusDot.vue";
import MobileCard from "@/components/list/src/MobileCard.vue";
// 父组件回调
const emit = defineEmits(["submitCallback", "update:confirmLoading", "close"]);
const activeKey = ref<string>("sm");
const onTabChange = (val: string) => {
    activeKey.value = val;
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
const loading = ref<boolean>(true);
const router = useRouter()
const query = useRouter().currentRoute.value.query;
const action = ref<string>(props.isDialog ? props.act : String(query.act));
const id = ref<number>(props.isDialog ? props.id : Number(query.id));
const operation = action.value === "add" ? "create" : "update";
const formRef = shallowRef();
const formState = ref<ApplyFormState>({} as ApplyFormState);
const fetchApply = async () => {
    try {
        const result = await getApply(action.value, { id: id.value });
        Object.assign(
            formState.value,
            result
        );
    } catch (error: any) {
        message.error(error.message);
        emit("close");
    } finally {
        loading.value = false;
    }
};

const documentTypeOptions = ref([
    {
        value: 1,
        label: "大陆身份证"
    }, {
        value: 2,
        label: "护照（限境外人士）"
    }, {
        value: 3,
        label: "来往内地通行证（中国香港居民）"
    }, {
        value: 4,
        label: "来往内地通行证（中国澳门居民）"
    }, {
        value: 5,
        label: "来往大陆通行证（中国台湾居民）"
    }
]);
onMounted(() => {
    if (action.value === "detail") {
        // 获取详情数据
        fetchApply();
    } else {
        loading.value = false;
    }
});

// 表单通过验证后提交
const onSubmit = async (type: number) => {
    await formRef.value.validate();
    try {
        if (type == 20 && !formState.value.auditRemark) {
            message.error("请输入审核备注");
            return;
        }
        emit("update:confirmLoading", true);
        const result = await auditApply({ merchantApplyId: id.value, status: type, auditRemark: formState.value.auditRemark });
        if (type == 10) {
            open(result)
            return;
        }
        emit("submitCallback", result);
        message.success("提交成功");
    } catch (error: any) {
        message.error(error.message);
    } finally {
        emit("update:confirmLoading", false);
    }
};
const open = (result:any) => {
  ElMessageBox.confirm(
    '入驻申请已通过，系统已为用户自动创建商户',
    '提示',
    {
      confirmButtonText: '前往商户列表',
      cancelButtonText: '取消',
      type: 'success',
    }
  )
    .then(() => {
        router.push({ path: '/adminMerchant/list' });
        emit("submitCallback", result);
    })
    .catch(() => {
        emit("submitCallback", result);
    })
}
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const showImage = (url: string) => {
    dialogImageUrl.value = url;
    dialogVisible.value = true;
};
</script>
<style lang="less" scoped>
.width100 {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    word-break: break-word
}

:deep(.el-tabs__content) {
    display: none;
}

.image-size {
    width: 80px;
    height: 80px;
    border: 1px solid #e0e0e0;
    cursor: pointer;
}

.image {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
