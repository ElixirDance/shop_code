<template>
    <div class="container">
        <div class="content_wrapper">
            <el-tabs v-model="activeKey" class="lyecs-tabs" tab-position="top" @tab-change="onTabChange">
                <el-tab-pane :key="1" label="基础设置" name="base"></el-tab-pane>
                <el-tab-pane :key="2" label="微信支付" name="wechat"></el-tab-pane>
                <el-tab-pane :key="3" label="支付宝" name="alipay"></el-tab-pane>
                <el-tab-pane :key="4" label="YaBandPay" name="yabanpay"></el-tab-pane>
                <el-tab-pane :key="5" label="线下支付" name="offline"></el-tab-pane>
                <el-tab-pane :key="6" label="PayPal" name="PayPal"></el-tab-pane>
                <el-tab-pane :key="7" label="云支付" name="cloudPay"></el-tab-pane>
            </el-tabs>
            <a-spin :spinning="loading">
                <el-form ref="formRef" :model="formState" label-width="160px">
                    <div v-show="activeKey === 'base'" class="content">
                        <el-form-item label="余额支付" prop="basicPaySettings.useSurplus">
                            <el-radio-group v-model="formState.basicPaySettings.useSurplus" class="itemWidth">
                                <el-radio :value="1">支持</el-radio>
                                <el-radio :value="0">不支持</el-radio>
                            </el-radio-group>
                            <div class="extra">订单结算页面是否支持余额支付功能，不支持则不显示</div>
                        </el-form-item>
                        <el-form-item label="积分抵扣" prop="basicPaySettings.usePoints">
                            <el-radio-group v-model="formState.basicPaySettings.usePoints" class="itemWidth">
                                <el-radio :value="1">支持</el-radio>
                                <el-radio :value="0">不支持</el-radio>
                            </el-radio-group>
                            <div class="extra">订单结算页面是否支持积分抵扣功能，不支持则不显示</div>
                        </el-form-item>
                        <el-form-item label="优惠券" prop="basicPaySettings.useCoupon">
                            <el-radio-group v-model="formState.basicPaySettings.useCoupon" class="itemWidth">
                                <el-radio :value="1">支持</el-radio>
                                <el-radio :value="0">不支持</el-radio>
                            </el-radio-group>
                            <div class="extra">订单结算页面是否支持优惠券功能，不支持则不显示</div>
                        </el-form-item>
                    </div>
                    <div v-show="activeKey === 'wechat'" class="content">
                        <el-form-item label="是否开启" prop="wechatPaySettings.useWechat">
                            <el-radio-group v-model="formState.wechatPaySettings.useWechat" class="itemWidth">
                                <el-radio :value="1">开启</el-radio>
                                <el-radio :value="0">关闭</el-radio>
                            </el-radio-group>
                            <div class="extra">是否开启微信支付，如关闭则不显示微信支付选项</div>
                        </el-form-item>
                        <div v-show="formState.wechatPaySettings.useWechat === 1">
                            <el-form-item label="微信商户类型" prop="wechatPaySettings.wechatMchidType">
                                <el-radio-group v-model="formState.wechatPaySettings.wechatMchidType" class="itemWidth">
                                    <el-radio :value="1">普通商户模式</el-radio>
                                    <el-radio :value="2">服务商模式</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="微信商户号" prop="wechatPaySettings.wechatPayMchid">
                                <TigInput classType="tig-form-input" v-model="formState.wechatPaySettings.wechatPayMchid" />
                            </el-form-item>
                            <el-form-item
                                label="微信子商户号"
                                prop="wechatPaySettings.wechatPaySubMchid"
                                v-if="formState.wechatPaySettings.wechatMchidType === 2"
                            >
                                <div>
                                    <TigInput classType="tig-form-input" v-model="formState.wechatPaySettings.wechatPaySubMchid" />
                                    <div class="extra">请填写由服务商提供的子商户号</div>
                                </div>
                            </el-form-item>
                            <el-form-item label="商户API密钥" prop="wechatPaySettings.wechatPayKey">
                                <div>
                                    <TigInput classType="tig-form-input" v-model="formState.wechatPaySettings.wechatPayKey" />
                                    <div class="extra">请使用APIv3密钥</div>
                                </div>
                            </el-form-item>
                            <el-form-item
                                label="商户证书序列号"
                                prop="wechatPaySettings.wechatPaySerialNo"
                                v-if="formState.wechatPaySettings.wechatPayCheckType === 1"
                            >
                                <div>
                                    <TigInput classType="tig-form-input" v-model="formState.wechatPaySettings.wechatPaySerialNo" />
                                    <div class="extra">请使用API证书序列号</div>
                                </div>
                            </el-form-item>
                            <el-form-item label="商户API证书" prop="wechatPaySettings.wechatPayCertificate">
                                <div style="width: 100%">
                                    <Upload
                                        name="file"
                                        :action="requestUrl.prefix + '/setting/config/uploadFile?type=1'"
                                        :headers="requestUrl.headers as any"
                                        @change="handleChange"
                                        :showUploadList="false"
                                        :multiple="false"
                                    >
                                        <el-button>{{ formState.wechatPaySettings.wechatPayCertificate ? "重新上传" : "点击上传" }}</el-button>
                                        <span class="ml10">apiclient_cert.pem</span>
                                    </Upload>
                                </div>
                                <div class="extra">调用微信商户接口时需要用到的API证书，文件名称一般为apiclient_cert.pem，具体操作请参考教程</div>
                            </el-form-item>
                            <el-form-item label="商户API证书密钥" prop="wechatPayPrivateKey">
                                <div style="width: 100%">
                                    <Upload
                                        name="file"
                                        :action="requestUrl.prefix + '/setting/config/uploadFile?type=2'"
                                        :headers="requestUrl.headers as any"
                                        @change="handleChange"
                                        :showUploadList="false"
                                        :multiple="false"
                                    >
                                        <el-button>{{ formState.wechatPaySettings.wechatPayPrivateKey ? "重新上传" : "点击上传" }}</el-button>
                                        <span class="ml10">apiclient_key.pem</span>
                                    </Upload>
                                </div>
                                <div class="extra">调用微信商户接口时需要用到的API证书密钥，文件名称一般为apiclient_key.pem，具体操作请参考教程</div>
                            </el-form-item>
                            <el-form-item label="验证微信支付方式" prop="wechatPaySettings.wechatMchidType">
                                <el-radio-group v-model="formState.wechatPaySettings.wechatPayCheckType" class="itemWidth">
                                    <el-radio :value="1">平台证书</el-radio>
                                    <el-radio :value="2">微信支付公钥</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="平台证书" prop="" v-if="formState.wechatPaySettings.wechatPayCheckType === 1">
                                <div style="width: 100%">
                                    <el-button :loading="confirmLoading" class="form-submit-btn" type="success" @click="getPlatformCertificate">
                                        {{ formState.wechatPaySettings.wechatPayPlatformCertificate ? "更新证书" : "生成证书" }}
                                    </el-button>
                                </div>
                                <div class="extra">调用微信商户接口时需要用到的平台证书,上传API证书后需要更新平台证书，具体操作请参考教程</div>
                            </el-form-item>
                            <el-form-item label="微信支付公钥ID" prop="wechatPayPublicKeyId" v-if="formState.wechatPaySettings.wechatPayCheckType === 2">
                                <TigInput classType="tig-form-input" v-model="formState.wechatPaySettings.wechatPayPublicKeyId" />
                                <div class="extra">请使用微信支付公钥ID</div>
                            </el-form-item>
                            <el-form-item label="微信支付公钥文件" prop="wechatPayPublicKey" v-if="formState.wechatPaySettings.wechatPayCheckType === 2">
                                <div style="width: 100%">
                                    <Upload
                                        name="file"
                                        :action="requestUrl.prefix + '/setting/config/uploadFile?type=3'"
                                        :headers="requestUrl.headers as any"
                                        @change="handleChange"
                                        :showUploadList="false"
                                        :multiple="false"
                                    >
                                        <el-button>{{ formState.wechatPaySettings.wechatPayPublicKey ? "重新上传" : "点击上传" }}</el-button>
                                        <span class="ml10">微信支付公钥文件（如：pub_key.pem）</span>
                                    </Upload>
                                </div>
                                <div class="extra">调用微信商户接口时需要用到的公钥证书，文件名称一般为public.pem，具体操作请参考教程</div>
                            </el-form-item>
                        </div>
                    </div>
                    <div v-show="activeKey === 'alipay'" class="content">
                        <el-form-item label="是否开启" prop="aliPaySettings.useAlipay">
                            <el-radio-group v-model="formState.aliPaySettings.useAlipay" class="itemWidth">
                                <el-radio :value="1">开启</el-radio>
                                <el-radio :value="0">关闭</el-radio>
                            </el-radio-group>
                            <div class="extra">是否开启支付宝支付，如关闭则不显示支付宝支付选项</div>
                        </el-form-item>
                        <el-form-item label="支付宝APPID" prop="aliPaySettings.alipayAppid">
                            <TigInput classType="tig-form-input" v-model="formState.aliPaySettings.alipayAppid" />
                        </el-form-item>
                        <el-form-item label="应用私钥" prop="aliPaySettings.alipayRsaPrivateKey">
                            <TigInput classType="tig-form-input" type="textarea" v-model="formState.aliPaySettings.alipayRsaPrivateKey" :rows="10" />
                        </el-form-item>
                        <el-form-item label="支付宝公钥" prop="aliPaySettings.alipayRsaPublicKey">
                            <TigInput classType="tig-form-input" type="textarea" v-model="formState.aliPaySettings.alipayRsaPublicKey" :rows="5" />
                        </el-form-item>
                    </div>

                    <div v-show="activeKey === 'yabanpay'" class="content">
                        <el-form-item label="是否开启" prop="yaBandPaySettings.useYabanpay">
                            <el-radio-group v-model="formState.yaBandPaySettings.useYabanpay" class="itemWidth">
                                <el-radio :value="1">开启</el-radio>
                                <el-radio :value="0">关闭</el-radio>
                            </el-radio-group>
                            <div class="extra">是否开启YaBandPay支付，如关闭则不显示YaBandPay支付选项</div>
                        </el-form-item>
                        <el-form-item label="微信开启" prop="yaBandPaySettings.useYabanpayWechat">
                            <el-radio-group v-model="formState.yaBandPaySettings.useYabanpayWechat" class="itemWidth">
                                <el-radio :value="1">开启</el-radio>
                                <el-radio :value="0">关闭</el-radio>
                            </el-radio-group>
                            <div class="extra">是否开启YaBandPay微信支付，如关闭则不显示YaBandPay微信支付选项</div>
                        </el-form-item>
                        <el-form-item label="支付宝开启" prop="yaBandPaySettings.useYabanpayAlipay">
                            <el-radio-group v-model="formState.yaBandPaySettings.useYabanpayAlipay" class="itemWidth">
                                <el-radio :value="1">开启</el-radio>
                                <el-radio :value="0">关闭</el-radio>
                            </el-radio-group>
                            <div class="extra">是否开启YaBandPay支付宝支付，如关闭则不显示YaBandPay支付宝支付选项</div>
                        </el-form-item>
                        <el-form-item label="货币" prop="yaBandPaySettings.yabanpayCurrency">
                            <el-select v-model="formState.yaBandPaySettings.yabanpayCurrency" style="width: 450px;">
                                <el-option value="0" label="不选择" />
                                <el-option
                                    v-for="item in formState.yaBandPaySettings.yabanpayCurrencyList"
                                    :key="item.id"
                                    :value="item.value"
                                    :label="item.name"
                                />
                            </el-select>
                            <div class="extra">
                                如果选择了默认国家，则会员在选择地址时默认会显示该国家下的省份或地区，不再显示国家选择（修改设置对已经添加的会员地址不生效）
                            </div>
                        </el-form-item>
                        <el-form-item label="YaBandPay UID" prop="yaBandPaySettings.yabandpayUid">
                            <TigInput classType="tig-form-input" v-model="formState.yaBandPaySettings.yabandpayUid" />
                        </el-form-item>
                        <el-form-item label="YaBandPay Secret Key" prop="yaBandPaySettings.yabandpaySecretKey">
                            <TigInput classType="tig-form-input" v-model="formState.yaBandPaySettings.yabandpaySecretKey" />
                        </el-form-item>
                    </div>

                    <div v-show="activeKey === 'offline'" class="content">
                        <el-form-item label="是否开启" prop="offlinePaySettings.useOffline">
                            <el-radio-group v-model="formState.offlinePaySettings.useOffline" class="itemWidth">
                                <el-radio :value="1">开启</el-radio>
                                <el-radio :value="0">关闭</el-radio>
                            </el-radio-group>
                            <div class="extra">是否开启线下支付，如关闭则不显示线下支付选项</div>
                        </el-form-item>
                        <el-form-item label="汇款说明">
                            <el-tabs type="border-card" v-model="activeName" v-if="!loading">
                                <el-tab-pane label="银行汇款" :name="1">
                                    <Editor v-model:html="formState.offlinePaySettings.offlinePayBank" :border="false"></Editor>
                                </el-tab-pane>
                                <el-tab-pane label="企业汇款" :name="2">
                                    <Editor v-model:html="formState.offlinePaySettings.offlinePayCompany" :border="false"></Editor>
                                </el-tab-pane>
                            </el-tabs>
                        </el-form-item>
                    </div>

                    <div v-show="activeKey === 'PayPal'" class="content">
                        <el-form-item label="是否开启" prop="payPalSettings.usePaypal">
                            <el-radio-group v-model="formState.payPalSettings.usePaypal" class="itemWidth">
                                <el-radio :value="1">开启</el-radio>
                                <el-radio :value="0">关闭</el-radio>
                            </el-radio-group>
                            <div class="extra">是否开启PayPal支付，如关闭则不显示PayPal支付选项</div>
                        </el-form-item>
                        <el-form-item label="货币" prop="payPalSettings.paypalCurrency">
                            <el-select v-model="formState.payPalSettings.paypalCurrency" style="width: 450px;">
                                <el-option :value="0" label="不选择" />
                                <el-option v-for="item in formState.payPalSettings.paypalCurrencyList" :key="item.id" :value="item.value" :label="item.name" />
                            </el-select>
                            <div class="extra">
                                如果选择了默认国家，则会员在选择地址时默认会显示该国家下的省份或地区，不再显示国家选择（修改设置对已经添加的会员地址不生效）
                            </div>
                        </el-form-item>
                        <el-form-item label="Client ID" prop="payPalSettings.paypalClientId">
                            <TigInput classType="tig-form-input" v-model="formState.payPalSettings.paypalClientId" />
                        </el-form-item>
                        <el-form-item label="Secret" prop="payPalSettings.paypalSecret">
                            <TigInput classType="tig-form-input" v-model="formState.payPalSettings.paypalSecret" />
                        </el-form-item>
                    </div>

                    <div v-show="activeKey === 'cloudPay'" class="content">
                        <el-form-item label="是否开启" prop="yunPaySettings.useYunpay">
                            <el-radio-group v-model="formState.yunPaySettings.useYunpay" class="itemWidth">
                                <el-radio :value="1">开启</el-radio>
                                <el-radio :value="0">关闭</el-radio>
                            </el-radio-group>
                            <div class="extra">是否开启云支付，如关闭则不显示云支付选项</div>
                        </el-form-item>
                        <el-form-item label="商户号" prop="yunPaySettings.yunpayUid">
                            <TigInput classType="tig-form-input" v-model="formState.yunPaySettings.yunpayUid" />
                        </el-form-item>
                        <el-form-item label="商户秘钥" prop="yunPaySettings.yunpaySecretKey">
                            <TigInput classType="tig-form-input" v-model="formState.yunPaySettings.yunpaySecretKey" />
                        </el-form-item>
                    </div>
                </el-form>
                <div style="height: 20px"></div>
                <div class="selected-action-warp">
                    <div class="selected-action" style="padding-left: 80px">
                        <el-button :loading="confirmLoading" class="form-submit-btn" size="large" type="primary" @click="onSubmit">提 交</el-button>
                    </div>
                </div>
            </a-spin>
        </div>
    </div>
</template>

<script lang="ts" setup>
import "@/style/css/list.less";
import { onMounted, ref, shallowRef } from "vue";
import { Editor } from "@/components/editor/index";
import { message, Upload } from "ant-design-vue";
import type { Regions } from "@/types/setting/config";
import type { PaymentFormState } from "@/types/setting/payment";
import request, { requestUrl } from "@/utils/request";
import { getPaymentSettings, updatePaymentSettings, createPlatformCertificate } from "@/api/setting/payment";
import { convertNullsToEmptyStrings } from "@/utils/format";
const formRef = shallowRef();
// 基本参数定义
const activeKey = ref<string>("base");
const activeName = ref<number>(1);
const confirmLoading = ref<boolean>(false);
const formState = ref<PaymentFormState>({
    basicPaySettings: {
        useSurplus: 0,
        usePoints: 0,
        useCoupon: 0
    },
    wechatPaySettings: {
        useWechat: 0,
        wechatMchidType: 0,
        wechatPayMchid: "wechatPayMchid_46f1aec6bf75",
        wechatPaySubMchid: 0,
        wechatPayKey: "wechatPayKey_de5a4632fe4a",
        wechatPaySerialNo: "wechatPaySerialNo_4a29ab342bc1",
        wechatPayCertificate: 0,
        wechatPayPrivateKey: 0,
        wechatPayCheckType: 0,
        wechatPayPlatformCertificate: 0,
        wechatPayPublicKeyId: 0,
        wechatPayPublicKey: 0
    },
    aliPaySettings: {
        useAlipay: 0,
        alipayAppid: "alipayAppid_3491ebfd7013",
        alipayRsaPrivateKey: "alipayRsaPrivateKey_ed5c993f7075",
        alipayRsaPublicKey: "alipayRsaPublicKey_893f003f55d1"
    },
    yaBandPaySettings: {
        useYabanpay: 0,
        useYabanpayWechat: 0,
        useYabanpayAlipay: 0,
        yabanpayCurrency: "yabanpayCurrency_957f5c4b40ce",
        yabandpayUid: "yabandpayUid_59277ac5d616",
        yabandpaySecretKey: "yabandpaySecretKey_2f8cef5492f1"
    },
    offlinePaySettings: {
        useOffline: 0,
        offlinePayBank: "offlinePayBank_72fb45670fda",
        offlinePayCompany: "offlinePayCompany_0f283b8c7a4b"
    },
    payPalSettings: {
        usePaypal: 0,
        paypalCurrency: "paypalCurrency_86d4b0562507",
        paypalClientId: "paypalClientId_ade0fded0622",
        paypalSecret: "paypalSecret_e23291d5b03b"
    },
    yunPaySettings: {
        useYunpay: 0,
        yunpayUid: "yunpayUid_b254bd1793f9",
        yunpaySecretKey: "yunpaySecretKey_e5ab30a9934a"
    }
});

const onTabChange = (val: string) => {
    activeKey.value = val;
};
// 加载列表
onMounted(async () => {
    loadFilter();
});
const loading = ref<boolean>(true);
const getPlatformCertificate = async () => {
    try {
        const result = await createPlatformCertificate();
        message.success("操作成功");
        loadFilter();
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};
const loadFilter = async () => {
    try {
        const result = await getPaymentSettings();
        formState.value = convertNullsToEmptyStrings(result);
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};
// 表单通过验证后提交
const onSubmit = async () => {
    confirmLoading.value = true;
    try {
        const result = await updatePaymentSettings({
            ...formState.value
        });
        message.success("修改成功");
    } catch (error: any) {
        message.error(error.message);
    } finally {
        confirmLoading.value = false;
    }
};
const handleChange = (info: any) => {
    if (info.file.status == "uploading") {
    }
    if (info.file.status !== "uploading") {
    }
    if (info.file.status === "done") {
        // 上传完成
        if (info.file.response.code !== 0) {
            info.file.status = "error";
            message.error(info.file.response.data.message);
        } else {
            for (let index in info.fileList) {
                if (info.file.uid == info.fileList[index].uid) {
                    info.fileList[index] = Object.assign(info.fileList[index], info.fileList[index].response.data);
                }
            }
            message.success("文件上传成功！");
            loadFilter();
        }
    } else if (info.file.status === "error") {
        message.error(`${info.file.name} 文件上传失败！`);
    }
};
</script>
<style lang="less" scoped>
.content {
    padding: 10px;

    .title {
        font-weight: bold;
        padding-top: 20px;
        padding-bottom: 20px;
        font-size: 14px;
    }

    .subtitle {
        color: #999;
        font-weight: normal;
        font-size: 12px;
    }
    :deep(.el-tabs--border-card > .el-tabs__content) {
        padding: 0;
    }
}

.mr8 {
    margin-right: 8px;
}

.width60 {
    width: 60px;
}

.ml8 {
    margin-left: 8px;
}
</style>
<style>
.itemWidth {
    width: 100%;
}
</style>
