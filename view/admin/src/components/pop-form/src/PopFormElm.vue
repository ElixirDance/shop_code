<template>
    <div class="lyecs-popedit">
        <div v-if="isHover" class="flex flex-align-center pop-form-wrap">
            <slot></slot>
            <span class="lyecs-popedit-btn iconfont icon-bianji1" ref="buttonRef" @click="editBtn"></span>
        </div>
        <div v-else style="width: 100%" class="flex flex-align-center flex-justify-center pop-form-wrap">
            <slot></slot>
            <span class="lyecs-popedit-btn2 iconfont icon-bianji1" @click="editBtn"></span>
        </div>
        <!-- v-if="loaded" 用于优化表格中的加载性能 -->
        <div v-if="loaded" style="position: relative">
            <el-popover
                ref="popoverRef"
                trigger="click"
                placement="bottom-start"
                :hide-after="0"
                v-model:visible="visible"
                @confirm="onConfirm"
                @cancel="onCancel"
                :teleported="true"
                width="360px"
            >
                <template #reference>
                    <div style="position: absolute; left: -32px; width: 50px; height: 5px; visibility: hidden"></div>
                </template>
                <template #default>
                    <div class="popForm-con" style="width: 100%; padding: 8px 6px 5px; box-sizing: border-box">
                        <el-form
                            ref="formRef"
                            :model="formState"
                            layout="horizontal"
                            :rules="rules"
                            name="form_in_modal"
                            :wrapper-col="{ span: 38 }"
                            :label-wrap="false"
                        >
                            <el-form-item prop="paramValue" :label="label" :extra="extra" :max="max">
                                <TigInput width="100%" :type="type" v-model="formState.paramValue" />
                                <!-- <PriceInput v-else v-model:modelValue="formState.paramValue" :slot="false"></PriceInput> -->
                                <div class="extra" v-if="extra">{{ extra }}</div>
                            </el-form-item>
                        </el-form>
                        <div class="flex" style="justify-content: right">
                            <el-button size="small" @click="visible = false">取消</el-button>
                            <el-button v-if="!isDirect" size="small" type="primary" @click="onConfirm" :loading="loading">确认</el-button>
                            <el-button v-else size="small" type="primary" @click="directConfirm" :loading="loading">确认</el-button>
                        </div>
                    </div>
                </template>
            </el-popover>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, shallowRef } from "vue";
import request from "@/utils/request";
import { message } from "ant-design-vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import PriceInput from "@/views/product/product/src/PriceInput.vue";
const props = defineProps({
    orgValue: [String, Number], //父组件使用v-model双向绑定
    requestApi: { type: Function, default: request },
    label: { type: String, default: "编辑项" },
    extra: { tyoe: String, default: "" },
    max: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    maxNum: { type: Number, default: 0 },
    minNum: { type: Number, default: 0 },
    len: { type: Number, default: 0 },
    required: { type: Boolean, default: true },
    type: { type: String, default: "text" },
    params: {
        type: Object,
        default: { id: null, field: "" }
    },
    isDirect: { type: Boolean, default: false },
    isHover: { type: Boolean, default: true },
    isPrice: { type: Boolean, default: false }
});
const validateValue = (rule: any, value: any, callback: any) => {
    let paramValue = formState.paramValue;
    if (!paramValue) {
        callback(new Error("请输入" + props.label));
        return;
    }
    if (props.type === "textarea" || props.type === "input") {
        if (props.max > 0 && paramValue.length > props.max) {
            callback(new Error("请输入不超过" + props.max + "个字符的" + props.label));
            return;
        }
        if (props.len > 0 && paramValue.length > props.len) {
            callback(new Error("请输入不超过" + props.len + "个字符的" + props.label));
            return;
        }
    }
    if (props.type === "number" && isNaN(paramValue)) {
        callback(new Error("请输入数字"));
        return;
    }
    if (props.type === "number" && props.minNum > 0 && paramValue < props.minNum) {
        callback(new Error("请输入不少于" + props.minNum + "的数字"));
        return;
    }
    if (props.type === "number" && props.maxNum > 0 && paramValue > props.maxNum) {
        callback(new Error("请输入不大于" + props.maxNum + "的数字"));
        return;
    }
    callback();
};
interface RuleForm {
    paramValue: any;
}
const rules = reactive<FormRules<RuleForm>>({
    paramValue: [
        {
            required: true,
            validator: validateValue,
            trigger: "blur"
        }
    ]
});
const extra = ref(props.extra);
if (props.max > 0) {
    if (!extra.value) {
        extra.value = "请输入不超" + props.max + "个字符的" + props.label;
    }
}
if (props.min > 0) {
    if (!extra.value) {
        extra.value = "请输入不少于" + props.min + "个字符的" + props.label;
    }
}
if (props.len > 0) {
    if (!extra.value) {
        extra.value = "请输入" + props.len + "个字符的" + props.label;
    }
}
if (props.minNum > 0 && props.maxNum > 0) {
    if (!extra.value) {
        extra.value = "请输入" + props.minNum + "-" + props.maxNum + "之间的数字";
    }
}

const visible = ref<any>(false);
const loaded = ref<Boolean>(false);
const type = ref(props.type);
const formRef = shallowRef();
let formState = reactive<any>({
    //表单数据
    paramValue: props.orgValue
});
const emit = defineEmits(["update:orgValue", "callback"]);
const loading = ref<Boolean>(false);

const onConfirm = async () => {
    await formRef.value.validate();
    try {
        loading.value = true;
        const result = await props.requestApi({
            id: props.params.id,
            field: props.params.field,
            val: formState.paramValue
        });
        emit("update:orgValue", formState.paramValue);
        emit("callback");
        message.success("操作成功");
        visible.value = false;
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};

const directConfirm = async () => {
    await formRef.value.validate();
    try {
        // 直接更新 orgValue，不进行网络请求
        emit("update:orgValue", formState.paramValue);
        emit("callback");
        visible.value = false;
    } catch (error: any) {
        message.error(error.message);
    }
};
const editBtn = () => {
    loaded.value = true;
    visible.value = true;
    formState.paramValue = props.orgValue;
};

const show = (e: any) => {
    visible.value = true;
};
const onCancel = () => {
    // 还原表单的值
    formState.paramValue = props.orgValue;
    // 清除验证信息
    formRef.value.clearValidate();
};

defineExpose({
    show
    // close
});
</script>

<style lang="less" scoped>
.popForm-con {
    width: 370px;
    position: relative;
}

.lyecs-popedit {
    display: flex;
    position: relative;
    align-items: center;
}

.lyecs-popedit .lyecs-popedit-btn {
    cursor: pointer;
    color: #999;
    font-size: 16px;
    padding-left: 2px;
    line-height: 1;
}
.lyecs-popedit .lyecs-popedit-btn2 {
    cursor: pointer;
    color: #999;
    font-size: 16px;
    padding-left: 2px;
    line-height: 1;
}
</style>
