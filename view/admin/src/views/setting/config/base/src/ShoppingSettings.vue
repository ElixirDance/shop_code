<template>
    <a-spin :spinning="loading">
        <el-form ref="formRef" :model="formState" label-width="145px" style="margin-left: 22px">
            <div class="title" id="globalShoppingSettings">购物全局设置</div>
            <el-form-item label="运费模板地区设置机制" prop="childAreaNeedRegion">
                <el-radio-group v-model="formState.childAreaNeedRegion" class="itemWidth">
                    <el-radio :value="1">仅设置的地区可配送</el-radio>
                    <el-radio :value="0">未设置的地区皆可配送（使用默认运费设置）</el-radio>
                </el-radio-group>
                <div>
                    <div class="extra">
                        运费模板一旦增加指定地区运费，如果该设置为“仅设置的地区可配送”，将不再默认全国都可配送，而是只能配送到增加的地区（如果收货地址不在设置范围，该配送类型不可用）；
                    </div>
                    <div class="extra">
                        如果设置为“未设置的地区使用默认运费设置”，收货地址如果是设置的地区范围内，则按该地区的运费计费，如果不在这范围内，则按默认计费（相当于不会存在不能配送的区域）；
                    </div>
                    <div class="extra">
                        如何选择？如果所有商品可全国配送，就选“未设置的地区使用默认运费设置”，如果有的商品只配送给部分区域，则选前者，该设置会对全站商品生效，慎重设置！
                    </div>
                </div>
            </el-form-item>
            <div class="title" id="orderSettings">订单设置</div>
            <el-form-item label="未付款订单" prop="autoCancelOrderMinute">
                <div class="itemWidth flex">
                    <span class="mr8">订单超</span>
                    <TigInput type="integer" v-model="formState.autoCancelOrderMinute" width="60px" />
                    <span class="ml8">分钟未支付自动取消</span>
                </div>
                <div class="extra">未支付的订单会自动取消，请填写分钟，比如10则代表10分钟未付款则取消订单，为0或空则不限制</div>
            </el-form-item>
            <div class="title" id="pointsSetting">积分设置</div>
            <el-form-item label="积分名称" prop="integralName">
                <TigInput width="100%" v-model="formState.integralName" />
                <div class="extra">您可以将积分重新命名。例如：金豆、金币</div>
            </el-form-item>
            <el-form-item label="积分换算比例" prop="integralScale">
                <TigInput width="100%" TigInput type="decimal" :decimalPlaces="1" v-model="formState.integralScale" />
                <div class="extra">每100积分可抵多少元现金</div>
            </el-form-item>
            <el-form-item label="下单送积分" prop="orderSendPoint">
                <TigInput width="100%" TigInput type="integer" v-model="formState.orderSendPoint" />
                <div class="extra">每消费一元送的积分数量</div>
            </el-form-item>
            <el-form-item label="积分支付比例" prop="integralPercent">
                <TigInput width="100%" TigInput type="decimal" :decimalPlaces="1" v-model="formState.integralPercent" />
                <div class="extra">每100元商品最多可以使用多少元积分</div>
            </el-form-item>
            <el-form-item label="评论商品送积分" prop="commentSendPoint">
                <TigInput width="100%" TigInput type="integer" v-model="formState.commentSendPoint" />
                <div class="extra">每次有效评论赠送积分数</div>
            </el-form-item>
            <el-form-item label="晒单商品送积分" prop="showSendPoint">
                <TigInput width="100%" TigInput type="integer" v-model="formState.showSendPoint" />
                <div class="extra">每次有效晒单赠送积分数</div>
            </el-form-item>
            <el-form-item label="签到赠送积分" prop="useQiandaoPoint">
                <el-radio-group v-model="formState.useQiandaoPoint" class="itemWidth">
                    <el-radio :value="1">是</el-radio>
                    <el-radio :value="0">否</el-radio>
                </el-radio-group>
                <div class="extra">是否开启每日签到赠送积分</div>
            </el-form-item>

            <div class="title" id="invoiceSettings">发票设置</div>
            <el-form-item label="是否能开发票" prop="canInvoice">
                <el-radio-group v-model="formState.canInvoice" class="itemWidth">
                    <el-radio :value="1">是</el-radio>
                    <el-radio :value="0">否</el-radio>
                </el-radio-group>
                <div class="extra">如果为否，订单结算时将不显示发票</div>
            </el-form-item>
            <el-form-item label="是否支持增值税专用发票" prop="invoiceAdded">
                <el-radio-group v-model="formState.invoiceAdded" class="itemWidth">
                    <el-radio :value="1">是</el-radio>
                    <el-radio :value="0">否</el-radio>
                </el-radio-group>
                <div class="extra">开启增值税专用发票会同步开启发票资质提交和审核，关闭则只显示“普通发票”</div>
            </el-form-item>
            <div class="title" id="returnAndExchangeSettings">退换货设置</div>
            <el-form-item label="回寄联系人设置" prop="returnConsignee">
                <TigInput width="100%" v-model="formState.returnConsignee" />
            </el-form-item>
            <el-form-item label="回寄电话设置" prop="returnMobile">
                <TigInput width="100%" v-model="formState.returnMobile" />
            </el-form-item>
            <el-form-item label="回寄地址设置" prop="returnAddress">
                <TigInput width="100%" v-model="formState.returnAddress" />
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
import { BaseShoppingConfig, Regions } from "@/types/setting/config";
import { getConfigShopping, saveConfigShopping } from "@/api/setting/config";
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
        const { scrollToElement } = useScrollToElement((route.query.point as string) || "globalShoppingSettings", "scrollContainer", "globalShoppingSettings");
        scrollToElement();
    },
    { immediate: true }
);
const configStore = useConfigStore();
const formRef = shallowRef();
// 基本参数定义
const confirmLoading = ref<boolean>(false);
const formState = ref<BaseShoppingConfig>({
    childAreaNeedRegion: 0,
    autoCancelOrderMinute: 0,
    integralName: "",
    integralScale: "",
    orderSendPoint: "",
    integralPercent: "",
    commentSendPoint: "",
    showSendPoint: "",
    useQiandaoPoint: 0,
    canInvoice: 0,
    invoiceAdded: 0,
    returnConsignee: "",
    returnMobile: "",
    returnAddress: ""
});
// 加载列表
onMounted(async () => {
    await loadFilter();
});
const loading = ref<boolean>(true);
const loadFilter = async () => {
    try {
        const result = await getConfigShopping();
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
        const result = await saveConfigShopping(formState.value);
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
