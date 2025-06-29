<template>
    <div class="tig-input-wrapper" :class="classType" :style="{ width }">
        <el-input
            ref="inputRef"
            :type="type == 'password' || type == 'textarea' ? type : 'text'"
            :name="name"
            :rows="rows"
            v-model="modelValue"
            :disabled="disabled"
            :placeholder="placeholder"
            :clearable="clearable"
            :maxlength="maxlength"
            :min="min"
            :max="max"
            :size="size"
            :prefix-icon="prefixIcon"
            :suffix-icon="suffixIcon"
            @blur="onBlur"
            @input="onInput"
            @clear="onClear"
            @keyup.enter="keyupEnter"
            style="width: 100%"
        >
            <template #append v-if="$slots.append"> <slot name="append"></slot> </template>
            <template #prepend v-if="$slots.prepend"> <slot name="prepend"></slot> </template>
            <template #suffix v-if="$slots.suffix"> <slot name="suffix"></slot> </template>
        </el-input>
    </div>
</template>
<script lang="ts" setup>
//**
//  TigInput
//  TigInput classType="tig-form-input"
//  TigInput classType="tig-form-input" type="integer"
//  TigInput classType="tig-form-input" type="decimal"
//  TigInput type="decimal"
//  TigInput type="integer"
//  */

import { ref, defineProps, defineEmits, defineModel, PropType, VNode, watch } from "vue";
import { useConfigStore } from "@/store/config";
const config = useConfigStore().config;
const inputRef = ref();
// 定义props
const props = defineProps({
    classType: {
        // 自定义class tig-form-input 用于表单输入框 tig-input 用于普通输入框(列表筛选项)
        type: String as () => "tig-input" | "tig-form-input",
        default: ""
    },
    type: {
        // 输入框类型 integer 整数 decimal 小数
        type: String as () => "text" | "password" | "decimal" | "integer" | "textarea",
        default: "text"
    },
    decimalPlaces: {
        // 小数位数
        type: Number,
        default: 2
    },
    allowNegative: {
        // 是否允许负数 type为decimal | integer时有效
        type: Boolean,
        default: false
    },
    prefixIcon: {
        type: [String, Function, null] as PropType<string | (() => VNode) | null>,
        default: null
    },
    suffixIcon: {
        type: [String, Function, null] as PropType<string | (() => VNode) | null>,
        default: null
    },
    min: {
        // 最小值
        type: [Number, null] as PropType<(() => VNode) | null>,
        default: null
    },
    max: {
        // 最大值
        type: [Number, null] as PropType<(() => VNode) | null>,
        default: null
    },
    maxlength: {
        type: Number,
        default: 999999
    },
    width: {
        // 自定义宽度
        type: String,
        default: ""
    },
    disabled: {
        type: Boolean,
        default: false
    },
    clearable: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        default: ""
    },
    rows: {
        type: Number,
        default: 3
    },
    size: {
        type: String,
        default: "default"
    }
});
const emit = defineEmits(["update:modelValue", "clear", "keyupEnter", "blur", "input"]);
const modelValue = defineModel<any>("modelValue", { default: "" });
const onBlur = () => {
    try {
        let value = modelValue.value;
        // 统一转为字符串处理（如果输入的是数字）
        if (typeof value !== "string") {
            value = value.toString();
        }
        if (props.type === "integer") {
            // 正整数处理
            value = value.replace(/[^\d-]/g, ""); // 移除非数字和负号
            let numValue = value ? parseInt(value) : 0;
            // 根据allowNegative决定是否允许负数
            if (!props.allowNegative) {
                numValue = Math.max(0, numValue); // 确保不小于0
            }
            value = String(numValue); // 最终转为字符串
        }
        if (props.type === "decimal") {
            // 小数处理
            value = value.replace(/[^\d.-]/g, ""); // 只保留数字和点、负号
            // 处理多个小数点的情况
            const parts = value.split(".");
            if (parts.length > 1) {
                value = `${parts[0]}.${parts[1].slice(0, props.decimalPlaces)}`;
            }
            let numValue = parseFloat(value);
            // 根据allowNegative决定是否允许负数
            if (!props.allowNegative && numValue < 0) {
                numValue = Math.max(0, numValue); // 确保不小于0
            }
            value = numValue.toFixed(props.decimalPlaces);
        }
        // 判断如果type等于 integer 或者 decimal 时，最后得到的值内包含了中文英文特殊字符，则直接返回0
        if (props.type === "integer" || props.type === "decimal") {
            if (/[\u4e00-\u9fa5]/.test(value) || /[^\d.-]/.test(value) || !value) {
                value = "0";
            }
        }
        emit("update:modelValue", value);
        emit("blur");
    } catch (err: any) {
        // inputRef.value?.focus(); // 验证失败时重新聚焦
    }
};
const keyupEnter = () => {
    emit("keyupEnter");
};
const onClear = () => {
    emit("clear");
};
const onInput = () => {
    emit("input");
};
</script>
<style scoped lang="less">
.tig-input {
    width: 215px;
}
.tig-form-input {
    width: 450px;
}
@media (max-width: 768px) {
    .tig-input,
    .tig-form-input {
        width: 100%;
    }
    .tig-input-wrapper {
        width: 100% !important;
    }
}
</style>
