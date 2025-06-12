<template>
    <a-spin :spinning="loading">
        <el-form ref="formRef" :model="formState" label-width="145px" style="margin-left: 22px">
            <div class="title" id="weChatofficialaccount">微信公众号</div>
            <!-- <el-form-item label="开启公众号授权登录" prop="wechatOauth">
                <el-radio-group v-model="formState.wechatOauth" class="itemWidth">
                    <el-radio :value="1">开启</el-radio>
                    <el-radio :value="0">关闭</el-radio>
                </el-radio-group>
            </el-form-item> -->
            <el-form-item label="微信APPID" prop="wechatAppId">
                <TigInput width="100%" v-model="formState.wechatAppId" />
                <div class="extra">请从微信公众号后台获取，链接：https://mp.weixin.qq.com</div>
            </el-form-item>
            <el-form-item label="微信AppSecret" prop="wechatAppSecret">
                <TigInput width="100%" v-model="formState.wechatAppSecret" />
                <div class="extra">请从微信公众号后台获取</div>
            </el-form-item>
            <el-form-item label="微信服务器接口地址" prop="wechatServerUrl">
                <TigInput width="100%" v-model="formState.wechatServerUrl" readonly />
                <div class="extra">系统默认项目，配置公众号服务器地址时请带项目访问域名</div>
            </el-form-item>
            <el-form-item label="微信服务器Token" prop="wechatServerToken">
                <TigInput width="100%" v-model="formState.wechatServerToken" />
                <div class="extra">请从微信公众号后台获取</div>
            </el-form-item>
            <el-form-item label="微信服务器消息加密密钥" prop="wechatServerSecret">
                <TigInput width="100%" v-model="formState.wechatServerSecret" />
                <div class="extra">请从微信公众号后台获取</div>
            </el-form-item>
            <div class="title" id="weChatMiniProgram">微信小程序</div>
            <el-form-item label="微信小程序AppID" prop="wechatMiniProgramAppId">
                <TigInput width="100%" v-model="formState.wechatMiniProgramAppId" />
                <div class="extra">微信小程序公众平台->设置->开发设置中获取，开通小程序必填</div>
            </el-form-item>
            <el-form-item label="微信小程序AppSecret" prop="wechatMiniProgramSecret">
                <TigInput width="100%" v-model="formState.wechatMiniProgramSecret" />
                <div class="extra">微信小程序公众平台->设置->开发设置中获取，开通小程序必填</div>
            </el-form-item>
            <div class="title" id="weChatAppPayment">微信APP支付</div>
            <el-form-item label="应用APP ID" prop="wechatPayAppId">
                <TigInput width="100%" v-model="formState.wechatPayAppId" />
                <div class="extra">需开通微信开发者平台，创建APP应用（未开通Tigshop APP商城可忽略）</div>
            </el-form-item>
            <el-form-item label="应用APP SECRET" prop="wechatPayAppSecret">
                <TigInput width="100%" v-model="formState.wechatPayAppSecret" />
                <div class="extra">需通微信开发者平台获取（未开通Tigshop APP商城可忽略）</div>
            </el-form-item>
            <div class="title" id="ICOicon">ICO图标</div>
            <el-form-item label="官方图标库地址" prop="icoTigCss" v-if="false">
                <TigInput width="100%" v-model="formState.icoTigCss" />
                <div>
                    <div class="extra">官方图标库不建议修改，自定义图标库功能可以满足自定义需求</div>
                </div>
            </el-form-item>
            <el-form-item label="自定义ico图标库" prop="icoDefinedCss">
                <TigInput width="100%" v-model="formState.icoDefinedCss" />
                <div>
                    <div class="extra">
                        自定义ico图标库，前往http://iconfont.cn添加，按Tigshop教程操作，这里只需填写如：<br />https//at.alicdn.com/t/font_400590_y7t88bzlwhskbj4i.css
                    </div>
                    <div class="extra">您也可以下载至本地服务器，只需填写能访问到iconfont的完整域名和存放路径</div>
                </div>
            </el-form-item>
            <div class="title" id="storageSettings">存储设置</div>
            <el-form-item label="存储类型" prop="storageType">
                <el-radio-group v-model="formState.storageType" class="itemWidth">
                    <el-radio :value="0">本地存储</el-radio>
                    <el-radio :value="1">阿里云OSS存储</el-radio>
                    <el-radio :value="2">腾讯云COS存储</el-radio>
                </el-radio-group>
                <div class="extra">开启云存储后，图片会直接通过接口上传至指定云存储，不会再保存在本地。</div>
            </el-form-item>
            <el-form-item label="图片是否保存全路径" prop="storageSaveFullPath" v-if="formState.storageType > 0">
                <el-radio-group v-model="formState.storageSaveFullPath" class="itemWidth">
                    <el-radio :value="1">是</el-radio>
                    <el-radio :value="0">否</el-radio>
                </el-radio-group>
                <div class="extra">选择是后上传文件会保存全路径进数据库内。(如https://www.****.com/upload/2022/01/01/1.jpg)</div>
            </el-form-item>
            <el-form-item label="图片访问域名" prop="storageLocalUrl" v-if="formState.storageType == 0">
                <TigInput width="100%" v-model="formState.storageLocalUrl" @blur="validateUrl(formState.storageLocalUrl)" />
                <div>
                    <div class="error" v-if="isErrorText">图片访问域名结尾必须带斜杠 /</div>
                    <div class="extra">参考格式： https://oss.tigshop.com/</div>
                </div>
            </el-form-item>
            <el-form-item label="图片访问域名" prop="storageOssUrl" v-if="formState.storageType == 1">
                <TigInput width="100%" v-model="formState.storageOssUrl" @blur="validateUrl(formState.storageOssUrl)" />
                <div>
                    <div class="error" v-if="isErrorText">图片访问域名结尾必须带斜杠 /</div>
                    <div class="extra">参考格式： https://oss.tigshop.com/</div>
                </div>
            </el-form-item>
            <el-form-item label="图片访问域名" prop="storageCosUrl" v-if="formState.storageType == 2">
                <TigInput width="100%" v-model="formState.storageCosUrl" @blur="validateUrl(formState.storageCosUrl)" />
                <div>
                    <div class="error" v-if="isErrorText">图片访问域名结尾必须带斜杠 /</div>
                    <div class="extra">参考格式： https://oss.tigshop.com/</div>
                </div>
            </el-form-item>
            <template v-if="formState.storageType != 0">
                <el-form-item label="AccessKeyId" prop="storageOssAccessKeyId" v-if="formState.storageType == 1">
                    <TigInput width="100%" v-model="formState.storageOssAccessKeyId" />
                </el-form-item>
                <el-form-item label="SecretId" prop="storageCosSecretId" v-if="formState.storageType == 2">
                    <TigInput width="100%" v-model="formState.storageCosSecretId" />
                </el-form-item>
                <el-form-item label="AccessKeySecret" prop="storageOssAccessKeySecret" v-if="formState.storageType == 1">
                    <TigInput width="100%" type="textarea" v-model="formState.storageOssAccessKeySecret" />
                </el-form-item>
                <el-form-item label="KeySecret" prop="storageCosSecretKey" v-if="formState.storageType == 2">
                    <TigInput width="100%" type="textarea" v-model="formState.storageCosSecretKey" />
                </el-form-item>
                <el-form-item label="空间名称" prop="storageOssBucket" v-if="formState.storageType == 1">
                    <TigInput width="100%" v-model="formState.storageOssBucket" />
                </el-form-item>
                <el-form-item label="空间名称" prop="storageCosBucket" v-if="formState.storageType == 2">
                    <TigInput width="100%" v-model="formState.storageCosBucket" />
                </el-form-item>
                <el-form-item label="空间地域节点" prop="storageOssRegion" v-if="formState.storageType == 1">
                    <TigInput width="100%" v-model="formState.storageOssRegion" />
                    <div class="extra"></div>
                </el-form-item>
                <el-form-item label="空间地域节点" prop="storageCosRegion" v-if="formState.storageType == 2">
                    <TigInput width="100%" v-model="formState.storageCosRegion" />
                    <div class="extra"></div>
                </el-form-item>
            </template>
            <template v-if="isOverseas()">
                <div class="title" id="multilingualSettings">多语言设置</div>
                <el-form-item label="是否开启多语言" prop="langOn">
                    <el-radio-group v-model="formState.langOn" class="itemWidth">
                        <el-radio :value="1">是</el-radio>
                        <el-radio :value="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="接口翻译" prop="langType">
                    <el-radio-group v-model="formState.langType" class="itemWidth">
                        <el-radio :value="1">火山翻译</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="火山翻译AssessKey" prop="langVolcengineAccessKey">
                    <TigInput width="100%" type="textarea" v-model="formState.langVolcengineAccessKey" />
                </el-form-item>
                <el-form-item label="火山翻译SecretKey" prop="langVolcengineSecret">
                    <TigInput width="100%" type="textarea" v-model="formState.langVolcengineSecret" />
                </el-form-item>
            </template>
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
import { onMounted, ref, shallowRef, nextTick, watch } from "vue";
import { message } from "ant-design-vue";
import { BaseInterfactSettings, Regions } from "@/types/setting/config";
import { getConfigApi, saveConfigApi } from "@/api/setting/config";
import { useConfigStore } from "@/store/config";
import { useLicensedStore } from "@/store/licensed";
import { isOverseas } from "@/utils/version";
import { useScrollToElement, setupIntersectionObserver } from "@/utils/util";
import { convertNullsToEmptyStrings } from "@/utils/format"
import { useRoute } from "vue-router";
const route = useRoute();
// 监听路由变化
watch(
    () => route.query.point,
    () => {
        // 基本参数定义
        const { scrollToElement } = useScrollToElement((route.query.point as string) || "weChatofficialaccount", "scrollContainer", "weChatofficialaccount");
        scrollToElement();
    },
    { immediate: true }
);
const configStore = useConfigStore();
const formRef = shallowRef();
const confirmLoading = ref<boolean>(false);
const formState = ref<BaseInterfactSettings>({
    wechatOauth: 0,
    wechatAppId: "",
    wechatAppSecret: "",
    wechatServerUrl: "",
    wechatServerToken: "",
    wechatServerSecret: "",
    wechatMiniProgramAppId: "",
    wechatMiniProgramSecret: "",
    wechatPayAppId: "",
    wechatPayAppSecret: "",
    icoTigCss: "",
    icoDefinedCss: "",
    storageType: 0,
    storageSaveFullPath: 0,
    storageLocalUrl: "",
    storageOssUrl: "",
    storageOssAccessKeyId: "",
    storageOssAccessKeySecret: "",
    storageOssBucket: "",
    storageOssRegion: "",
    storageCosUrl: "",
    storageCosSecretId: "",
    storageCosSecretKey: "",
    storageCosBucket: "",
    storageCosRegion: "",
    langOn: 0,
    langType: 0,
    langVolcengineAccessKey: "",
    langVolcengineSecret: ""
});

// 加载列表
onMounted(async () => {
    await loadFilter();
});
const loading = ref<boolean>(true);
const loadFilter = async () => {
    try {
        const result = await getConfigApi();
        formState.value = convertNullsToEmptyStrings(result);
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};
const isErrorText = ref<boolean>(false);
const validateUrl = (url: string) => {
    if (url.endsWith("/") || url.endsWith("\\")) {
        isErrorText.value = false;
        return;
    }
    isErrorText.value = true;
};
// 表单通过验证后提交
const onSubmit = async () => {
    let url = formState.value.storageType == 0 ? formState.value.storageLocalUrl : (formState.value.storageType == 1 ? formState.value.storageOssUrl : formState.value.storageCosUrl);
    await validateUrl(url)
    if (isErrorText.value) {
        message.error("图片访问域名结尾必须带斜杠 /");
        nextTick(() => {
            const { scrollToElement } = useScrollToElement("storageSettings", "scrollContainer");
            scrollToElement();
        });
        return;
    }
    confirmLoading.value = true;
    try {
        const result = await saveConfigApi(formState.value);
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
