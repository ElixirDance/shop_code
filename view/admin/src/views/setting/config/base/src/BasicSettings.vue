<template>
    <a-spin :spinning="loading">
        <el-form ref="formRef" :model="formState" label-width="150px" style="margin-left: 22px">
            <div class="title" id="storeInformation">店铺信息</div>
            <el-form-item label="商城简称" prop="shopName">
                <BusinessData v-model:modelValue="formState.shopName" :dataType="5" :dataId="1"></BusinessData>
                <div class="extra">该名称只需填写商城的名称即可，无需带其它关键词</div>
            </el-form-item>
            <el-form-item label="SEO标题后缀" prop="shopTitleSuffix">
                <BusinessData v-model:modelValue="formState.shopTitleSuffix" :dataType="5" :dataId="2"></BusinessData>
                <div class="extra">该后缀将显示在浏览器的标题栏，与SEO有关，建议长度不要超过20字符，效果如：“购物车 - Tig商城”</div>
            </el-form-item>
            <el-form-item label="首页SEO标题" prop="shopTitle">
                <BusinessData v-model:modelValue="formState.shopTitle" :dataType="5" :dataId="3"></BusinessData>
                <div class="extra">商城首页的完整标题（不带后缀）</div>
            </el-form-item>
            <el-form-item label="首页SEO关键词" prop="shopKeywords">
                <BusinessData type="select" v-if="!loading" v-model:modelValue="formState.shopKeywords" :dataType="5" :dataId="4"></BusinessData>
                <div class="extra">首页关键词，该设置与SEO有关，建议不要超过10个关键词（输入完请按回车键确认）</div>
            </el-form-item>
            <el-form-item label="首页SEO描述" prop="shopDesc">
                <BusinessData v-model:modelValue="formState.shopDesc" :dataType="5" :dataId="5"></BusinessData>
                <div class="extra">首页描述，该设置与SEO有关，建议长度不要超过50字符</div>
            </el-form-item>
            <el-form-item label="商城LOGO" prop="shopLogo">
                <FormAddGallery v-model:photo="formState.shopLogo" style="width: 100%" />
                <div class="extra">请根据页面设置对应大小的LOGO，高清需要上传双倍大小</div>
            </el-form-item>
            <el-form-item label="ico图标上传" prop="icoImg">
                <FormAddGallery v-model:photo="formState.icoImg" style="width: 100%" />
                <div class="extra">推荐使用高清128*128像素，格式为png或ico</div>
            </el-form-item>
            <el-form-item label="会员默认头像" prop="defaultAvatar">
                <FormAddGallery v-model:photo="formState.defaultAvatar" style="width: 100%" />
                <div class="extra">请上传1:1的200*200像素以内的图片</div>
            </el-form-item>
            <div class="title" id="globalSettings">全局设置</div>
            <el-form-item label="PC端域名" prop="pcDomain">
                <TigInput width="100%" v-model="formState.pcDomain" :maxlength="40" placeholder="" />
                <div class="extra">格式参考：https://www.tigshop.com（没有https则填http，后面不要带“/”），填写后查看商城或查看商品默认跳PC端</div>
            </el-form-item>
            <el-form-item label="H5端域名" prop="h5Domain">
                <TigInput width="100%" v-model="formState.h5Domain" :maxlength="40" placeholder="" />
                <div class="extra">格式参考：https://m.tigshop.com（没有https则填http，后面不要带“/”），PC端域名未填写时，会跳转H5端</div>
            </el-form-item>
            <el-form-item label="后台域名" prop="adminDomain">
                <TigInput width="100%" v-model="formState.adminDomain" :maxlength="40" placeholder="" />
                <div class="extra">格式参考：https://admin.tigshop.com（没有https则填http，后面不要带“/”）</div>
            </el-form-item>
            <el-form-item label="视频上传大小设置" prop="uploadMaxSize">
                <TigInput type="integer" width="100%" v-model="formState.uploadMaxSize" placeholder="" />
                <div class="extra">单位：MB，默认100MB，上传视频大小限制。</div>
            </el-form-item>
            <el-form-item label="关闭下单" prop="closeShop">
                <el-radio-group v-model="formState.closeOrder" class="itemWidth">
                    <el-radio :value="1">是</el-radio>
                    <el-radio :value="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="关闭注册" prop="shopRegClosed">
                <el-radio-group v-model="formState.shopRegClosed" class="itemWidth">
                    <el-radio :value="1">是</el-radio>
                    <el-radio :value="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="自动跳转" prop="autoRedirect">
                <el-radio-group v-model="formState.autoRedirect" class="itemWidth">
                    <el-radio :value="1">开启</el-radio>
                    <el-radio :value="0">关闭</el-radio>
                </el-radio-group>
                <div class="extra">如果开启，而且配置了H5端域名移动设备打开PC则会自动跳转到H5端</div>
            </el-form-item>

            <el-form-item label="是否开启手机区号选择" prop="isOpenMobileAreaCode" class="WidthMax">
                <el-radio-group v-model="formState.isOpenMobileAreaCode" class="itemWidth">
                    <el-radio :value="1">开启</el-radio>
                    <el-radio :value="0">关闭</el-radio>
                </el-radio-group>
                <div class="extra">如果开启则会将区号存入数据库，请谨慎选择（开启后不建议关闭）。</div>
            </el-form-item>

            <el-form-item label="自动注册用户名前缀" prop="usernamePrefix ">
                <TigInput width="100%" v-model="formState.usernamePrefix" placeholder="可不填" />
                <div class="extra">参考格式TigShop_</div>
            </el-form-item>
            <el-form-item label="发货后自动确认收货时间" prop="autoDeliveryDays">
                <div>
                    <div class="flex">
                        <p class="mr10">卖家发货后</p>
                        <TigInput type="integer" v-model="formState.autoDeliveryDays" width="110px"></TigInput>
                        <p class="ml10">天，自动确认收货</p>
                    </div>
                    <div class="extra">修改后将对新产生的订单立即生效，已产生的订单自动确认收货时间将以发货时的设置为准。</div>
                </div>
            </el-form-item>
            <el-form-item label="自动同意退货申请" prop="autoReturnGoods">
                <div>
                    <div>
                        <el-radio-group v-model="formState.autoReturnGoods" class="itemWidth">
                            <el-radio :value="1">开启</el-radio>
                            <el-radio :value="0">关闭</el-radio>
                        </el-radio-group>
                    </div>
                    <el-form-item
                        label=""
                        prop="autoReturnGoodsDays"
                        :rules="[{ required: formState.autoReturnGoods == 1, message: '请输入卖家自动同意售后天数' }]"
                    >
                        <div class="flex">
                            <p class="mr10">买家申请</p>
                            <TigInput type="integer" v-model="formState.autoReturnGoodsDays" width="110px" :disabled="formState.autoReturnGoods == 0"></TigInput>
                            <p class="ml10">天后，自动同意客户售后申请</p>
                        </div>
                    </el-form-item>
                </div>
            </el-form-item>
            <el-form-item label="买家申请售后限制" prop="afterSalesLimitDays">
                <div>
                    <div class="flex">
                        <p class="mr10">买家确认收货</p>
                        <TigInput type="integer" v-model="formState.afterSalesLimitDays" width="110px"></TigInput>
                        <p class="ml10">天后，不支持买家申请售后</p>
                    </div>
                    <div class="extra">注：不适用虚拟商品、卡密商品、付费内容等特殊类型订单。</div>
                </div>
            </el-form-item>

            <div class="title" id="filingInformation">备案信息</div>
            <el-form-item label="详细地址" prop="kefuAddress">
                <BusinessData v-model:modelValue="formState.kefuAddress" :dataType="5" :dataId="6"></BusinessData>
            </el-form-item>
            <el-form-item label="ICP备案号" prop="shopIcpNo">
                <BusinessData v-model:modelValue="formState.shopIcpNo" :dataType="5" :dataId="7"></BusinessData>
            </el-form-item>
            <el-form-item label="ICP备案链接" prop="shopIcpNoUrl">
                <TigInput width="100%" v-model="formState.shopIcpNoUrl" placeholder="不填则默认为：https://beian.miit.gov.cn" />
            </el-form-item>
            <el-form-item label="公安备案号" prop="shop110No">
                <TigInput width="100%" v-model="formState.shop110No" placeholder="不填则不显示" />
            </el-form-item>
            <el-form-item label="公安备案链接" prop="shop110Link">
                <TigInput width="100%" type="textarea" v-model="formState.shop110Link" placeholder="不填则默认为：https://beian.mps.gov.cn/#/query/webSearch" />
            </el-form-item>
            <div class="title" id="register">登录注册</div>
            <el-form-item label="开启公众号授权登录" prop="openWechatOauth" class="WidthMax">
                <el-radio-group v-model="formState.openWechatOauth" class="itemWidth" @change="changeopenWechatOauth">
                    <el-radio :value="1">是</el-radio>
                    <el-radio :value="0">否</el-radio>
                </el-radio-group>
                <div class="extra">此项设置控制是否开启微信注册及注册绑定手机，若为否将不支持开启微信注册及注册绑定手机</div>
            </el-form-item>
            <el-form-item label="是否开启微信注册" prop="openWechatRegister" class="WidthMax">
                <el-radio-group
                    v-model="formState.openWechatRegister"
                    class="itemWidth"
                    @change="changeWechatRegister"
                    :disabled="formState.openWechatOauth == 0"
                >
                    <el-radio :value="1">是</el-radio>
                    <el-radio :value="0">否</el-radio>
                </el-radio-group>
                <div class="extra">如果选是，PC端将显示微信扫码登录，小程序端将显示一键登录</div>
            </el-form-item>
            <el-form-item label="微信注册是否绑定手机" prop="wechatRegisterBindPhone" class="WidthMax">
                <el-radio-group
                    v-model="formState.wechatRegisterBindPhone"
                    class="itemWidth"
                    :disabled="formState.openWechatOauth == 0 || formState.openWechatRegister == 0"
                >
                    <el-radio :value="1">是</el-radio>
                    <el-radio :value="0">否</el-radio>
                </el-radio-group>
                <div class="extra">如果选是在微信登录时需绑定手机号方可注册，便于全站统一账号；若选择否，则不需要绑定手机，直接注册但不利于账号管理</div>
            </el-form-item>
            <!-- <el-form-item label="是否允许邮箱注册" prop="wechatRegisterBindPhone" class="WidthMax">
                <el-radio-group v-model="formState.wechatRegisterBindPhone" class="itemWidth" :disabled="formState.openWechatOauth==0">
                    <el-radio :value="1">是</el-radio>
                    <el-radio :value="0">否</el-radio>
                </el-radio-group>
                <div class="extra">如果选是，在使用邮箱接收验证码后，可完成注册。</div>
            </el-form-item> -->
            <el-form-item label="是否开启Facebook登录" prop="facebookLoginOn" class="WidthMax">
                <el-radio-group v-model="formState.facebookLoginOn" class="itemWidth">
                    <el-radio :value="1">是</el-radio>
                    <el-radio :value="0">否</el-radio>
                </el-radio-group>
                <div class="extra">如果选是，登录页面显示Facebook登录快捷入口，若客户未注册，将自动注册账号。</div>
            </el-form-item>
            <el-form-item label="应用APP ID" prop="facebookClientId">
                <div>
                    <TigInput width="100%" v-model="formState.facebookClientId" :disabled="formState.facebookLoginOn == 0" />
                    <div class="extra">需开通Facebook开发者平台，创建APP应用（未开通Tigshop APP商城可忽略）。</div>
                </div>
            </el-form-item>
            <el-form-item label="应用APP SECRET" prop="facebookClientSecret">
                <div>
                    <TigInput width="100%" type="textarea" v-model="formState.facebookClientSecret" :disabled="formState.facebookLoginOn == 0" />
                    <div class="extra">征得用户同意，让您的应用有券访问用户数据</div>
                </div>
            </el-form-item>
            <el-form-item label="是否开启Google登录" prop="googleLoginOn" class="WidthMax">
                <el-radio-group v-model="formState.googleLoginOn" class="itemWidth">
                    <el-radio :value="1">是</el-radio>
                    <el-radio :value="0">否</el-radio>
                </el-radio-group>
                <div class="extra">如果选是，登录页面将显示Google登录快捷入口。</div>
            </el-form-item>
            <el-form-item label="应用APP ID" prop="googleClientId">
                <div>
                    <TigInput width="100%" v-model="formState.googleClientId" :disabled="formState.googleLoginOn == 0" />
                    <div class="extra">需开通Google开发者平台，创建APP应用（未开通Tigshop APP商城可忽略）。</div>
                </div>
            </el-form-item>
            <el-form-item label="应用APP SECRET" prop="googleClientSecret">
                <div>
                    <TigInput width="100%" type="textarea" v-model="formState.googleClientSecret" :disabled="formState.googleLoginOn == 0" />
                    <div class="extra">征得用户同意，让您的应用有券访问用户数据</div>
                </div>
            </el-form-item>
        </el-form>
        <div style="height: 20px"></div>
        <div class="selected-action-warp">
            <div class="selected-action" style="padding-left: 80px">
                <el-button :loading="confirmLoading" class="form-submit-btn" size="large" type="primary" @click="onSubmit">提 交</el-button>
            </div>
        </div>
    </a-spin>
</template>

<script lang="ts" setup>
import "@/style/css/list.less";
import { onMounted, ref, shallowRef, watch } from "vue";
import { FormAddGallery } from "@/components/gallery";
import { message } from "ant-design-vue";
import { BaseConfig } from "@/types/setting/config";
import { getConfigBasic, saveConfigBasic } from "@/api/setting/config";
import { useConfigStore } from "@/store/config";
import BusinessData from "@/components/multilingual/BusinessData.vue";
import { useScrollToElement } from "@/utils/util";
import { convertNullsToEmptyStrings } from "@/utils/format";
import { useRoute } from "vue-router";
const route = useRoute();
// 监听路由变化
watch(
    () => route.query.point,
    () => {
        // 基本参数定义
        const { scrollToElement } = useScrollToElement((route.query.point as string) || "storeInformation", "scrollContainer", "storeInformation");
        scrollToElement();
    },
    { immediate: true }
);
const configStore = useConfigStore();
const formRef = shallowRef();
const confirmLoading = ref<boolean>(false);
const formState = ref<BaseConfig>({
    shopName: "",
    kefuAddress: "",
    pcDomain: "",
    h5Domain: "",
    adminDomain: "",
    uploadMaxSize: 100,
    autoRedirect: 0,
    isOpenMobileAreaCode: 0,
    shopTitle: "",
    shopTitleSuffix: "",
    shopKeywords: "",
    shopDesc: "",
    shopLogo: "",
    defaultAvatar: "",
    icoImg: "",
    usernamePrefix: "",
    shopIcpNo: "",
    shopIcpNoUrl: "",
    shop110No: "",
    shop110Link: "",
    shopRegClosed: 0,
    closeOrder: 0,
    openWechatRegister: 1,
    wechatRegisterBindPhone: 1,
    openWechatOauth: 1,
    autoDeliveryDays: 7,
    autoReturnGoods: 0,
    autoReturnGoodsDays: 7,
    afterSalesLimitDays: 15,
    googleLoginOn: 0,
    googleClientId: "",
    googleClientSecret: "",
    facebookLoginOn: 0,
    facebookClientId: "",
    facebookClientSecret: ""
});
// 加载列表
onMounted(async () => {
    await loadFilter();
});
const changeopenWechatOauth = (e: number) => {
    formState.value.openWechatRegister = e;
    formState.value.wechatRegisterBindPhone = e;
};
const changeWechatRegister = (e: number) => {
    formState.value.wechatRegisterBindPhone = e;
};
const loading = ref<boolean>(true);
const loadFilter = async () => {
    try {
        const result = await getConfigBasic();
        formState.value = convertNullsToEmptyStrings(result);
        if(!result.uploadMaxSize){
            formState.value.uploadMaxSize = 100;
        }
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};
// 表单通过验证后提交
const onSubmit = async () => {
    await formRef.value.validate();
    confirmLoading.value = true;
    try {
        const result = await saveConfigBasic(formState.value);
        message.success("修改成功");
        configStore.updateConfig();
    } catch (error: any) {
        message.error(error.message);
    } finally {
        confirmLoading.value = false;
    }
};
</script>
<style lang="less" scoped>
.title {
    font-weight: bold;
    padding-top: 20px;
    padding-bottom: 30px;
    font-size: 14px;
}

.subtitle {
    color: #999;
    font-weight: normal;
    font-size: 12px;
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

.itemWidth {
    width: 100%;
}
.error {
    color: red;
}
</style>
