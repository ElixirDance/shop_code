<template>
    <a-spin :spinning="loading">
        <el-form ref="formRef" :model="formState" label-width="140px" style="margin-left: 22px">
            <div class="title" id="basicProductSettings">商品基础设置</div>
            <el-form-item label="商品货币符" prop="dollarSign">
                <TigInput width="100%" v-model="formState.dollarSign" />
                <div class="extra">货币符号 ，如：¥、€、$</div>
            </el-form-item>
            <el-form-item label="商品货币中文" prop="dollarSignCn">
                <TigInput width="100%" v-model="formState.dollarSignCn" />
                <div class="extra">货币符号中文，如：元、美元、欧元等</div>
            </el-form-item>
            <el-form-item label="商品货号前缀" prop="snPrefix">
                <TigInput width="100%" v-model="formState.snPrefix" />
            </el-form-item>

            <div class="title" id="showRelated">显示相关</div>
            <el-form-item label="显示销量" prop="showSelledCount">
                <el-radio-group v-model="formState.showSelledCount" class="itemWidth">
                    <el-radio :value="1">是</el-radio>
                    <el-radio :value="0">否</el-radio>
                </el-radio-group>
                <div class="extra">是否在商品详情页显示商品销量</div>
            </el-form-item>
            <el-form-item label="显示市场价" prop="showMarketprice">
                <el-radio-group v-model="formState.showMarketprice" class="itemWidth">
                    <el-radio :value="1">是</el-radio>
                    <el-radio :value="0">否</el-radio>
                </el-radio-group>
                <div class="extra">是否在商品详情页价格栏目中显示市场价</div>
            </el-form-item>
            <div class="title" id="otherSettings">其他设置</div>
            <el-form-item label="市场价换算" prop="marketPriceRate">
                <TigInput width="100%" TigInput type="decimal" :decimalPlaces="1" v-model="formState.marketPriceRate" />
                <div class="extra">输入商品价格时将自动根据该比例计算市场价格，推荐：1.2</div>
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
import { BaseProductConfig } from "@/types/setting/config";
import { getConfigProduct, saveConfigProduct } from "@/api/setting/config";
import { useConfigStore } from "@/store/config";
import { useScrollToElement, setupIntersectionObserver } from "@/utils/util";
import { useRoute } from "vue-router";
import {convertNullsToEmptyStrings} from "@/utils/format"
const route = useRoute();
// 监听路由变化
watch(
    () => route.query.point,
    () => {
        // 基本参数定义
        const { scrollToElement } = useScrollToElement((route.query.point as string) || "basicProductSettings", "scrollContainer", "basicProductSettings");
        scrollToElement();
    },
    { immediate: true }
);
const configStore = useConfigStore();
const formRef = shallowRef();
// 基本参数定义
const confirmLoading = ref<boolean>(false);
const formState = ref<BaseProductConfig>({
    dollarSign: "",
    dollarSignCn: "",
    snPrefix: "",
    showSelledCount: 0,
    showMarketprice: 0,
    marketPriceRate: 0
});
// 加载列表
onMounted(async () => {
    await loadFilter();
});
const loading = ref<boolean>(true);
const loadFilter = async () => {
    try {
        const result = await getConfigProduct();
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
        const result = await saveConfigProduct(formState.value);
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
