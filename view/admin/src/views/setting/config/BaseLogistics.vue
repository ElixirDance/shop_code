<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-form-table">
                <a-spin :spinning="loading">
                    <el-form ref="formRef" :model="formState" label-width="auto">
                        <el-form-item label="接口对接" prop="logisticsType">
                            <el-radio-group v-model="formState.logisticsType" class="itemWidth">
                                <el-radio :value="'0'">无</el-radio>
                                <el-radio :value="'kdniao'">快递鸟</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="快递鸟API Key" prop="kdniaoApiKey" v-if="formState.logisticsType === 'kdniao'">
                            <TigInput classType="tig-form-input" v-model="formState.kdniaoApiKey" type="text"/>
                        </el-form-item>
                        <el-form-item label="快递鸟服务ID" prop="kdniaoBusinessId" v-if="formState.logisticsType === 'kdniao'">
                            <TigInput classType="tig-form-input" v-model="formState.kdniaoBusinessId" type="text"/>
                        </el-form-item>
                        <el-form-item label="发货人" prop="sender">
                            <TigInput classType="tig-form-input" v-model="formState.sender" type="text"/>
                        </el-form-item>
                        <el-form-item label="发货人联系方式" prop="mobile">
                            <TigInput classType="tig-form-input" v-model="formState.mobile" type="text"/>
                        </el-form-item>
                        <el-form-item label="发货地省份" prop="provinceName">
                            <TigInput classType="tig-form-input" v-model="formState.provinceName" type="text"/>
                        </el-form-item>
                        <el-form-item label="发货城市" prop="cityName">
                            <TigInput classType="tig-form-input" v-model="formState.cityName" type="text"/>
                        </el-form-item>
                        <el-form-item label="发货地区" prop="areaName">
                            <TigInput classType="tig-form-input" v-model="formState.areaName" type="text"/>
                        </el-form-item>
                        <el-form-item label="发货详细地址" prop="address">
                            <TigInput classType="tig-form-input" v-model="formState.address" type="text"/>
                        </el-form-item>
                    </el-form>
                    <div v-if="!loading" class="selected-action-warp">
                        <div class="selected-action" style="padding-left: 80px">
                            <el-button :loading="confirmLoading" class="form-submit-btn" size="large" type="primary" @click="onSubmit">提 交</el-button>
                        </div>
                    </div>
                </a-spin>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import "@/style/css/list.less";
import { onMounted, ref, shallowRef } from "vue";
import { message } from "ant-design-vue";
import type { BaseLogistics } from "@/types/setting/baseLogistics.d";
import { getShippingSettings, updateShippingSettings } from "@/api/setting/baseLogistics";
import { convertNullsToEmptyStrings } from "@/utils/format"
// 父组件回调
const emit = defineEmits(["submitCallback", "update:confirmLoading", "close"]);
const confirmLoading = ref(false);

const loading = ref<boolean>(true);
const formRef = shallowRef();
const formState = ref<BaseLogistics>({});
const loadFilter = async () => {
    try {
        const result = await getShippingSettings();
        formState.value = convertNullsToEmptyStrings(result);
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    // 获取详情数据
    loadFilter();
});

// 表单通过验证后提交
const onSubmit = async () => {
    try {
        emit("update:confirmLoading", true);
        const result = await updateShippingSettings(formState.value);
        emit("submitCallback", result);
        message.success("保存成功");
    } catch (error: any) {
        message.error(error.message);
    } finally {
        emit("update:confirmLoading", false);
    }
};
// 表单提交
const onFormSubmit = () => {
    onSubmit();
};

defineExpose({ onFormSubmit });
</script>
<style lang="less" scoped>
.notice-warp {
    background-color: #eef2ff;
    border-radius: 9px;
    padding: 15px;
    margin-bottom: 20px;
    line-height: 24px;
}
</style>
