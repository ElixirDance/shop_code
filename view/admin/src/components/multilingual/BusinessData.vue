<template>
    <div style="width: 100%" v-if="type == 'input'">
        <TigInput classType="tig-form-input" v-model="modelValue" :disabled="disabled" :placeholder="placeholder" :maxlength="maxlength">
            <template #append v-if="isOverseas()">
                <DialogForm
                    isDrawer
                    @okCallback="_getCreateTranslation"
                    :title="'编辑'"
                    width="800px"
                    path="setting/multilingual/translationContent/BusinessDialog"
                    :params="{ act: isTranslation ? 'add' : 'detail', id: dataId, dataType: dataType, translationName: modelValue }"
                >
                    <el-button>
                        <SvgIcon v-if="!isTranslation" name="multilingual-multilingual" width="18" height="18" />
                        <SvgIcon v-else name="multilingual-multilingual-a" width="18" height="18" />
                    </el-button>
                </DialogForm>
            </template>
        </TigInput>
    </div>
    <div class="flex flex-align-center" style="width: 100%" v-if="type == 'select'">
        <el-select
            class="input-tag-warp"
            style="width: 310px !important;"
            :teleported="false"
            v-model="tagValue"
            multiple
            filterable
            allow-create
            default-first-option
            :reserve-keyword="false"
            placeholder=""
            popper-class="input-tag-popper-warp"
            @change="onChange"
            :filter-method="onfilter"
            @keyup.enter="onEnter"
        >
        </el-select>
        <DialogForm
            v-if="isOverseas()"
            isDrawer
            @okCallback="_getCreateTranslation"
            :title="'编辑'"
            width="800px"
            path="setting/multilingual/translationContent/BusinessDialog"
            :params="{ act: isTranslation ? 'add' : 'detail', id: dataId, dataType: dataType, translationName: modelValue }"
        >
            <el-button style="margin-left: 10px">
                <SvgIcon v-if="!isTranslation" name="multilingual-multilingual" width="18" height="18" />
                <SvgIcon v-else name="multilingual-multilingual-a" width="18" height="18" />
            </el-button>
        </DialogForm>
    </div>
</template>
<script lang="ts" setup>
import { DialogForm } from "@/components/dialog";
import { ref, defineModel, onMounted, watch } from "vue";
import { message } from "ant-design-vue";
import { getCreateTranslation, updateCreateTranslation } from "@/api/multilingual/currencyManagement";
import { tr } from "element-plus/es/locale";
import { isOverseas } from "@/utils/version";
const props = defineProps({
    disabled: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: ""
    },
    dataType: {
        type: Number,
        default: 2
    },
    dataId: {
        type: Number,
        default: 0
    },
    maxlength: {
        type: Number,
        default: 999999
    },
    type: {
        type: String,
        default: "input"
    },
    splitString: {
        type: String,
        value: ","
    }
});
const emit = defineEmits(["update:modelValue"]);
const modelValue = defineModel<string>("modelValue", { type: String, default: "" });
const translationName = ref<string>("");
const isTranslation = ref(false);
const _getCreateTranslation = async () => {
    try {
        const result = await getCreateTranslation({
            dataType: props.dataType,
            dataId: props.dataId
        });
        if (result.length <= 0) {
            isTranslation.value = true;
        } else {
            translationName.value = result.translationName;
            isTranslation.value = false;
        }
    } catch (error: any) {
        message.error(error.message);
    }
};
// 监听modelValue变化
watch(modelValue, (newVal: string) => {
    if (newVal != translationName.value) {
        isTranslation.value = true;
    } else {
        isTranslation.value = false;
    }
});
const tagValue = ref();
const splitString = ref();
splitString.value = props.splitString || ",";
if (props.type == "select") {
    console.log(modelValue.value);
    if (typeof modelValue.value === "string") {
        tagValue.value = modelValue.value ? modelValue.value.split(splitString.value) : [];
    } else {
        tagValue.value = modelValue.value;
    }
}
const onChange = (value: any) => {
    if (typeof modelValue.value === "string") {
        emit("update:modelValue", tagValue.value.join(splitString.value));
    } else {
        emit("update:modelValue", tagValue.value);
    }
};
const filterInput = ref();
const onfilter = (e: any) => {
    if (e) filterInput.value = e;
};
const onEnter = () => {
    if (tagValue.value.indexOf(filterInput.value) === -1) {
        if (filterInput.value) {
            tagValue.value.push(filterInput.value);
            filterInput.value = "";
        }
    }
};
onMounted(() => {
    if (props.dataId > 0) {
        _getCreateTranslation();
    }
});
</script>

<style lang="less" scoped>
:deep(.el-button) {
    padding: 3px 15px;
}
</style>
