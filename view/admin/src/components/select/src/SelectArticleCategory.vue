<template>
    <el-cascader
        v-model="ids"
        :options="options"
        :props="cascaderProps"
        :disabled="disabled"
        clearable
        placeholder="请选择分类"
        placement="right"
        style="width: 100%"
        @change="onChange"
        @clear="onClear"
    />
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getArticleCategoryTree } from "@/api/content/articleCategory";
import { ArticleCategoryFilterState } from "@/types/content/articleCategory";
import { message } from "ant-design-vue";
// import 'element-plus/es/components/cascader/style/css'
// 传值
const props = defineProps({
    modelValue: { type: [Number, Array, String], default: 0 },
    checkStrictly: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false }
});
let id = 0;
const cascaderProps = {
    checkStrictly: props.checkStrictly,
    label: "articleCategoryName",
    value: "articleCategoryId",
    children: "children"
};
//选项卡
const options = ref<ArticleCategoryFilterState[]>([]);
const loaded = ref(false);
// 当前值
const ids = ref(props.modelValue);
// 给父组件传值
const emit = defineEmits(["update:modelValue"]);
// 加载分类
onMounted(() => {
    if (props.modelValue != null) {
        loadRegion();
    }
});
const loadRegion = async () => {
    if (loaded.value) {
        return;
    }
    let id = 0;
    ids.value = props.modelValue || [];

    loaded.value = true;
    try {
        const result = await getArticleCategoryTree();
        options.value = result;
        ids.value = props.modelValue;
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loaded.value = false;
    }
};
const onChange = (ids: any) => {
    emit("update:modelValue", ids);
};
const onClear = () => {
    ids.value = [];
};
</script>
<style lang="less" scoped>
.cascader {
    width: 100%;
}
</style>
