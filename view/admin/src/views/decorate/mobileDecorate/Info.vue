<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-form-table">
                <el-form ref="formRef" :model="formState" label-width="auto">
                    <el-form-item prop="decorateTitle" label="首页装修模板名称" :rules="[{ required: true, message: '首页装修模板名称不能为空!' }]">
                        <TigInput classType="tig-form-input" v-model="formState.decorateTitle" />
                    </el-form-item>
                    <el-form-item prop="sortOrder" label="排序">
                        <TigInput type="integer" classType="tig-form-input" v-model="formState.sortOrder" />
                    </el-form-item>
                    <el-form-item v-show="!props.isDialog" :wrapper-col="{ offset: 4, span: 16 }">
                        <el-button ref="submitBtn" class="form-submit-btn" type="primary" @click="onSubmit">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, shallowRef, onMounted } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { FormState } from "@/types/decorate/mobileDecorate.d";
import { updateDecorate } from "@/api/decorate/mobileDecorate";

const emit = defineEmits(["submitCallback", "update:confirmLoading", "close"]);

const props = defineProps({
    id: {
        type: Number,
        default: 0,
    },
    decorateType: {
        type: Number,
        default: 1,
    },
    act: {
        type: String,
        default: "",
    },
    isDialog: Boolean,
});
const query = useRouter().currentRoute.value.query;
const action = ref<string>(props.isDialog ? props.act : String(query.act));
const id = ref<number>(props.isDialog ? props.id : Number(query.id));
const operation = action.value === "add" ? "create" : "update";
const formRef = shallowRef();
const formState = ref<FormState>({});

// 表单通过验证后提交
const onSubmit = async () => {
    await formRef.value.validate();
    try {
        emit("update:confirmLoading", true);
        const result = await updateDecorate(operation, { id: id.value, decorateType: props.decorateType, ...formState.value });
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
