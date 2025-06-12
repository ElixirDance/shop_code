<template>
    <a-spin :spinning="loading">
        <el-form ref="formRef" :model="formState" label-width="140px" style="margin-left: 22px">
            <div class="title" id="SMSSettings">短信设置</div>
            <el-form-item label="短信帐户用户名" prop="smsKeyId">
                <TigInput width="100%" v-model="formState.smsKeyId" />
                <div class="extra">您所申请的短信服务用户名，不填则表示不开通</div>
            </el-form-item>
            <el-form-item label="短信帐户密码" prop="smsKeySecret">
                <TigInput width="100%" v-model="formState.smsKeySecret" />
                <div class="extra">您所申请的短信服务密码</div>
            </el-form-item>
            <el-form-item label="短信签名" prop="smsSignName">
                <TigInput width="100%" v-model="formState.smsSignName" />
                <div class="extra">阿里短信这里填短信签名，其它的根据具体短信接口填写</div>
            </el-form-item>
            <el-form-item label="商家短信号码" prop="smsShopMobile">
                <TigInput width="100%" type="integer" v-model="formState.smsShopMobile" />
                <div class="extra">用于接收会员订单等信息</div>
            </el-form-item>
            <div class="title" id="emailNotification">邮箱通知</div>
            <el-form-item label="客服收件地址" prop="serviceEmail">
                <TigInput width="100%" v-model="formState.serviceEmail" />
                <div class="extra">该客服邮件地址可用于接收下面所设置的通知</div>
            </el-form-item>
            <el-form-item label="提交订单发送邮件" prop="sendConfirmEmail">
                <el-radio-group v-model="formState.sendConfirmEmail" class="itemWidth">
                    <el-radio :value="1">是</el-radio>
                    <el-radio :value="0">否</el-radio>
                </el-radio-group>
                <div class="extra">订单提交后发送（未支付），建议选“否”</div>
            </el-form-item>
            <el-form-item label="订单支付发送邮件" prop="orderPayEmail">
                <el-radio-group v-model="formState.orderPayEmail" class="itemWidth">
                    <el-radio :value="1">是</el-radio>
                    <el-radio :value="0">否</el-radio>
                </el-radio-group>
                <div class="extra">会员支付订单成功时，是否给会员发送邮件</div>
            </el-form-item>
            <el-form-item label="下单给客服发邮件" prop="sendServiceEmail">
                <el-radio-group v-model="formState.sendServiceEmail" class="itemWidth">
                    <el-radio :value="1">是</el-radio>
                    <el-radio :value="0">否</el-radio>
                </el-radio-group>
                <div class="extra">提示：此处为发送给客服，商城信息中的客服邮件地址不为空时，该选项有效</div>
            </el-form-item>
            <el-form-item label="发货时发送邮件" prop="sendShipEmail">
                <el-radio-group v-model="formState.sendShipEmail" class="itemWidth">
                    <el-radio :value="1">是</el-radio>
                    <el-radio :value="0">否</el-radio>
                </el-radio-group>
                <div class="extra">提示：该邮件是发给客户</div>
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
import { onMounted, ref, shallowRef, nextTick, watch } from "vue";
import { message } from "ant-design-vue";
import { BaseNotice } from "@/types/setting/config";
import { getConfigNotify, saveConfigNotify } from "@/api/setting/config";
import { useScrollToElement, setupIntersectionObserver } from "@/utils/util";
import { useRoute } from "vue-router";
import {convertNullsToEmptyStrings} from "@/utils/format"
const route = useRoute();
// 监听路由变化
watch(
    () => route.query.point,
    () => {
        // 基本参数定义
        const { scrollToElement } = useScrollToElement((route.query.point as string) || "SMSSettings", "scrollContainer", "SMSSettings");
        scrollToElement();
    },
    { immediate: true }
);
const formRef = shallowRef();
// 基本参数定义
const confirmLoading = ref<boolean>(false);
const formState = ref<BaseNotice>({
    smsKeyId: "",
    smsKeySecret: "",
    smsSignName: "",
    smsShopMobile: "",
    serviceEmail: "",
    sendConfirmEmail: 0,
    orderPayEmail: 0,
    sendServiceEmail: 0,
    sendShipEmail: 0
});

// 加载列表
onMounted(async () => {
    await loadFilter();
});
const loading = ref<boolean>(true);
const loadFilter = async () => {
    try {
        const result = await getConfigNotify();
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
        const result = await saveConfigNotify(formState.value);
        message.success("修改成功");
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
