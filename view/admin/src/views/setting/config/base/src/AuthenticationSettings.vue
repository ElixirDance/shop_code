<template>
    <a-spin :spinning="loading">
        <el-form ref="formRef" :model="formState" label-width="140px" style="margin-left: 22px">
            <div class="title" id="membershipAuthenticationSettings">会员认证设置</div>
            <el-form-item label="认证类型" prop="type">
                <el-radio-group v-model="formState.type" class="itemWidth">
                    <el-radio :value="1">企业认证</el-radio>
                    <el-radio :value="0">个人认证 + 企业认证</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否实名后才能查看价格" prop="isIdentity">
                <el-radio-group v-model="formState.isIdentity" class="itemWidth">
                    <el-radio :value="1">开启</el-radio>
                    <el-radio :value="0">关闭</el-radio>
                </el-radio-group>
                <div class="extra">开启后，前台商城的商品价格需要用户实名认证之后才能查看。</div>
            </el-form-item>
            <el-form-item label="是否开启询价功能" prop="isEnquiry">
                <el-radio-group v-model="formState.isEnquiry" class="itemWidth">
                    <el-radio :value="1">开启</el-radio>
                    <el-radio :value="0">关闭</el-radio>
                </el-radio-group>
                <div class="extra">开启后，前台商城的商品价格需要提交询价之后才能查看。</div>
            </el-form-item>
            <el-form-item label="是否短信通知" prop="smsNote">
                <el-radio-group v-model="formState.smsNote" class="itemWidth">
                    <el-radio :value="1">开启</el-radio>
                    <el-radio :value="0">关闭</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="审核周期" prop="tips">
                <TigInput width="100%" v-model="formState.tips"></TigInput>
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
import { BaseAuthenticationSettings, Regions } from "@/types/setting/config";
import { getConfigAuth, saveConfigAuth } from "@/api/setting/config";
import { useConfigStore } from "@/store/config";
import { useScrollToElement } from "@/utils/util";
import { useRoute } from "vue-router";
import {convertNullsToEmptyStrings} from "@/utils/format"
const route = useRoute();
// 监听路由变化
watch(
    () => route.query.point,
    () => {
        // 基本参数定义
        const { scrollToElement } = useScrollToElement((route.query.point as string) || "membershipAuthenticationSettings", "scrollContainer", "membershipAuthenticationSettings");
        scrollToElement();
    },
    { immediate: true }
);
const configStore = useConfigStore();
const formRef = shallowRef();
// 基本参数定义
const confirmLoading = ref<boolean>(false);
const formState = ref<BaseAuthenticationSettings>({
    type: 0,
    isIdentity: 0,
    isEnquiry: 0,
    smsNote: 0,
    tips: ""
});
// 加载列表
onMounted(async () => {
    await loadFilter();
});
const loading = ref<boolean>(true);
const loadFilter = async () => {
    try {
        const result = await getConfigAuth();
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
        const result = await saveConfigAuth(formState.value);
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
