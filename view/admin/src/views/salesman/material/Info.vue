<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-form-table">
                <div class="lyecs-form-table">
                    <el-form v-if="!loading" ref="formRef" :model="formState" label-width="auto">
                        <el-form-item label="素材图片" prop="pics" :rules="[{ required: true, message: '素材图片不能为空!' }]">
                            <FormAddGallery v-model:photos="formState.pics" isMultiple></FormAddGallery>
                        </el-form-item>
                        <el-form-item label="素材分类" prop="categoryId" :rules="[{ required: true, message: '请选择素材分类!' }]">
                            <selectCategory v-model:categoryId="formState.categoryId"></selectCategory>
                        </el-form-item>
                        <el-form-item :rules="[{ required: true, message: '素材内容不能为空!' }]" label="素材内容" prop="content">
                            <TigInput classType="tig-form-input" v-model="formState.content" :rows="5" type="textarea" />
                        </el-form-item>
                        <el-form-item label="选择商品" prop="productId" :rules="[{ required: true, message: '请选择商品!' }]">
                            <SelectProduct :isMultiple="false" v-model:ids="productIds"></SelectProduct>
                        </el-form-item>
                        <el-form-item label="是否置顶" prop="isTop">
                            <el-radio-group v-model="formState.isTop">
                                <el-radio :value="1">置顶</el-radio>
                                <el-radio :value="0">不置顶</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-show="!props.isDialog" :wrapper-col="{ offset: 4, span: 16 }">
                            <el-button ref="submitBtn" class="form-submit-btn" type="primary" @click="onSubmit">提交</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <a-spin :spinning="loading" style="width: 100%; margin-top: 100px" />
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, shallowRef, watch } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { FormAddGallery } from "@/components/gallery";
import type { materialFormState } from "@/types/salesman/material.d";
import { getmaterial, updatematerial } from "@/api/salesman/material";
import selectCategory from "./src/selectCategory.vue";
import { SelectProduct } from "@/components/select";
// 父组件回调
const emit = defineEmits(["submitCallback", "update:confirmLoading", "close"]);

const props = defineProps({
    id: {
        type: Number,
        default: 0
    },
    act: {
        type: String,
        default: ""
    },
    isDialog: Boolean
});
const loading = ref<boolean>(true);
const query = useRouter().currentRoute.value.query;
const action = ref<string>(props.isDialog ? props.act : String(query.act));
const id = ref<number>(props.isDialog ? props.id : Number(query.id));
const operation = action.value === "add" ? "create" : "update";
const formRef = shallowRef();
const productIds = ref<number[]>([]);
watch(productIds.value, (val) => {
    console.log(val);
    formState.value.productId = val[0];
},{deep: true});
const formState = ref<materialFormState>({
    isTop: 0,
    content: ""
});
const fetchBrand = async () => {
    try {
        const result = await getmaterial(action.value, { id: id.value });
        if(result.productId && result.productId !== 'null'){
            productIds.value = [Number(result.productId)];
        }
        formState.value = result;
    } catch (error: any) {
        message.error(error.message);
        emit("close");
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    if (action.value === "detail") {
        // 获取详情数据
        fetchBrand();
    } else {
        loading.value = false;
    }
});

// 表单通过验证后提交
const onSubmit = async () => {
    await formRef.value.validate();
    if (formState.value.productId) {
        message.error("请选择商品!");
        return;
    }
    try {
        emit("update:confirmLoading", true);
        const result = await updatematerial(operation, { id: id.value, ...formState.value });
        emit("submitCallback", result);
        message.success("操作成功");
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
