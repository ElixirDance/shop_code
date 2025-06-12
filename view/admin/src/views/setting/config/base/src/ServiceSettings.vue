<template>
    <a-spin :spinning="loading">
        <el-form ref="formRef" :model="formState" label-width="140px" style="margin-left: 22px">
            <div class="title" id="customerServiceSettings">客服设置</div>
            <el-form-item label="客服选择" prop="kefuType">
                <el-radio-group v-model="formState.kefuType" class="itemWidth">
                    <el-radio-button :value="0">无客服</el-radio-button>
                    <el-radio-button :value="1">腾讯云客服</el-radio-button>
                    <el-radio-button :value="2">企业微信客服</el-radio-button>
                    <el-radio-button :value="3">自定义客服</el-radio-button>
                    <el-radio-button :value="4" v-if="isMerchant() || isPro()">TigChart客服</el-radio-button>
                </el-radio-group>
                <div v-if="formState.kefuType == 1">
                    <div class="extra">腾讯云设置地址：https://yzf.qq.com/xv/html/admin/chat/channel/web</div>
                    <div class="extra">设置流程：1、注册账号；2、会话->渠道设置->网站渠道，点击新增网站；3、在编辑里获取sign的值</div>
                </div>
                <div v-if="formState.kefuType == 2">
                    <div class="extra">提示：PC端打开企业微信客服会唤起PC端微信，如果未安装PC端微信也可查看二维码后扫码使用;</div>
                    <div class="extra">企业微信客服设置地址：https://work.weixin.qq.com/wework_admin/frame#/apps</div>
                    <div class="extra">设置流程：1、注册账号；2、应用管理->应用->微信客服->客服帐号->创建账号；3、客服账号获取帐号ID</div>
                </div>
                <div v-if="formState.kefuType == 3">
                    <div class="extra">提示：来回切换设置会丢失自定义客服的设置项，如需恢复请勿提交保存，刷新页面即可</div>
                </div>
            </el-form-item>

            <div v-if="formState.kefuType == 1">
                <el-form-item label="腾讯云客服打开方式" prop="kefuYzfType">
                    <el-radio-group v-model="formState.kefuYzfType">
                        <el-radio :value="0">打开链接地址</el-radio>
                        <el-radio :value="1">小弹窗打开</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="腾讯云客服sign" prop="kefuYzfSign">
                    <TigInput width="100%" v-model="formState.kefuYzfSign" />
                    <div class="extra">提示：sign为空时客服设置不生效！</div>
                </el-form-item>
            </div>

            <div v-if="formState.kefuType == 2">
                <el-form-item label="企业微信客服ID" prop="kefuWorkwxId">
                    <TigInput width="100%" v-model="formState.kefuWorkwxId" />
                    <div class="extra">提示：ID为空时客服设置不生效！</div>
                </el-form-item>
            </div>
            <div v-if="formState.kefuType == 2">
                <el-form-item label="企业微信企业ID" prop="corpId">
                    <TigInput width="100%" v-model="formState.corpId" />
                    <div class="extra">提示：小程序打开微信客服需要设置企业ID！</div>
                </el-form-item>
            </div>
            <div v-if="formState.kefuType == 3">
                <el-form-item label="客服链接" prop="kefuCode">
                    <TigInput width="100%" v-model="formState.kefuCode" />
                    <div class="extra">如果是脚本控制的链接，请在此处填入： 请填写http开头的客服链接;</div>
                </el-form-item>
                <el-form-item label="客服链接打开方式" prop="kefuCodeBlank">
                    <el-radio-group v-model="formState.kefuCodeBlank">
                        <el-radio :value="0">打开链接地址</el-radio>
                        <el-radio :value="1">小弹窗打开</el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>

            <div class="title" id="customerServiceInformation">客服信息</div>
            <el-form-item label="客服热线电话" prop="kefuPhone">
                <TigInput width="100%" v-model="formState.kefuPhone" />
                <div class="extra">不填则不显示</div>
            </el-form-item>
            <el-form-item label="服务时间" prop="kefuTime">
                <TigInput width="100%" v-model="formState.kefuTime" />
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
import { message } from "ant-design-vue";
import { BaseKefuConfig } from "@/types/setting/config";
import { getConfigKefu, saveConfigKefu } from "@/api/setting/config";
import { useConfigStore } from "@/store/config";
import { isMerchant, isPro } from "@/utils/version";
import { useScrollToElement, setupIntersectionObserver } from "@/utils/util";
import { convertNullsToEmptyStrings } from "@/utils/format"
import { useRoute } from "vue-router";
const route = useRoute();
// 监听路由变化
watch(
    () => route.query.point,
    () => {
        // 基本参数定义
        const { scrollToElement } = useScrollToElement(route.query.point as string || "customerServiceSettings", "scrollContainer", "customerServiceSettings");
        scrollToElement();
    },
    { immediate: true }
);
const configStore = useConfigStore();
const formRef = shallowRef();
// 基本参数定义
const confirmLoading = ref<boolean>(false);
const formState = ref<BaseKefuConfig>({
        kefuType: 0,
        kefuYzfType: 0,
        kefuYzfSign: "",
        kefuWorkwxId: "",
        kefuCode: "",
        kefuCodeBlank: 0,
        corpId: "",
        kefuPhone: "",
        kefuTime: ""
});
// 加载列表
onMounted(async () => {
    await loadFilter();
});
const loading = ref<boolean>(true);
const loadFilter = async () => {
    try {
        const result = await getConfigKefu();
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
        const result = await saveConfigKefu(formState.value);
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
