<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-form-table">
                <el-form v-if="!loading" ref="formRef" :model="formState" label-width="auto">
                    <el-form-item :rules="[{ required: true, message: '模板名称不能为空!' }]" label="模板名称" prop="shippingTplName">
                        <TigInput width="100%" v-model="formState.shippingTplName" />
                    </el-form-item>
                    <el-form-item label="发货时间" prop="shippingTime">
                        <el-select v-model="formState.shippingTime" placeholder="请选择.." style="width: 100%">
                            <el-option label="4小时内" value="4小时内"></el-option>
                            <el-option label="8小时内" value="8小时内"></el-option>
                            <el-option label="12小时内" value="12小时内"></el-option>
                            <el-option label="16小时内" value="16小时内"></el-option>
                            <el-option label="20小时内" value="20小时内"></el-option>
                            <el-option label="1天内" value="1天内"></el-option>
                            <el-option label="2天内" value="2天内"></el-option>
                            <el-option label="3天内" value="3天内"></el-option>
                            <el-option label="4天内" value="4天内"></el-option>
                            <el-option label="5天内" value="5天内"></el-option>
                            <el-option label="7天内" value="7天内"></el-option>
                            <el-option label="8天内" value="8天内"></el-option>
                            <el-option label="10天内" value="10天内"></el-option>
                            <el-option label="12天内" value="12天内"></el-option>
                            <el-option label="15天内" value="15天内"></el-option>
                            <el-option label="17天内" value="17天内"></el-option>
                            <el-option label="20天内" value="20天内"></el-option>
                            <el-option label="25天内" value="25天内"></el-option>
                            <el-option label="30天内" value="30天内"></el-option>
                            <el-option label="45天内" value="45天内"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否默认" prop="isDefault">
                        <el-radio-group v-model="formState.isDefault" style="width: 100%">
                            <el-radio :value="1">是</el-radio>
                            <el-radio :value="0">否</el-radio>
                        </el-radio-group>
                        <div class="extra">只能设置一个默认模板</div>
                    </el-form-item>
                    <el-form-item label="是否包邮" prop="isFree">
                        <el-radio-group v-model="formState.isFree">
                            <el-radio :value="1">是</el-radio>
                            <el-radio :value="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="计价方式" prop="pricingType">
                        <el-radio-group v-model="formState.pricingType" @change="checkType">
                            <el-radio :value="1" :disabled="action != 'add'">按件数</el-radio>
                            <el-radio :value="2" :disabled="action != 'add'">按重量</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="运送方式" prop="shippingTplInfo" :rules="[{ required: true, message: '运送方式不能为空!' }]">
                        <div v-if="formState.shippingTplInfo.length == 0">
                            <DialogForm
                                :params="{ act: 'add' }"
                                isDrawer
                                path="setting/shippingType/Info"
                                title="添加配送类型"
                                width="600px"
                                @okCallback="fetchShippingTplConfig"
                            >
                                <el-button :icon="Plus" type="primary"> 添加配送类型</el-button>
                            </DialogForm>
                        </div>
                        <div v-for="(value, index) in formState.shippingTplInfo" class="shipping-method-style">
                            <div class="flex">
                                <Checkbox v-model="value.isChecked">
                                    <template #default> {{ value.shippingTypeName }}</template>
                                </Checkbox>
                            </div>
                            <div v-if="value.isChecked > 0" class="table-style">
                                <div class="title-style">
                                    <span class="title">默认运费</span>
                                    <el-form-item
                                        :prop="'shippingTplInfo[' + index + '].defaultTplInfo.startNumber'"
                                        :rules="[{ required: true, validator: validateNum }]"
                                        class="hn"
                                    >
                                        <TigInput type="integer" v-model="value.defaultTplInfo.startNumber" class="input-width"></TigInput>
                                    </el-form-item>
                                    &nbsp;{{ formState.pricingType == 1 ? "件" : "kg" }}内&nbsp;
                                    <el-form-item
                                        :prop="'shippingTplInfo[' + index + '].defaultTplInfo.startPrice'"
                                        :rules="[{ required: true, validator: validateNum }]"
                                        class="hn"
                                    >
                                        <TigInput type="decimal" v-model="value.defaultTplInfo.startPrice" class="input-width"></TigInput>
                                    </el-form-item>
                                    &nbsp;元，<span class="title">每增加</span>
                                    <el-form-item
                                        :prop="'shippingTplInfo[' + index + '].defaultTplInfo.addNumber'"
                                        :rules="[{ required: true, validator: validateNum }]"
                                        class="hn"
                                    >
                                        <TigInput type="integer" v-model="value.defaultTplInfo.addNumber" class="input-width"></TigInput>
                                    </el-form-item>
                                    &nbsp;{{ formState.pricingType == 1 ? "件" : "kg" }}，<span class="title">增加运费</span>
                                    <el-form-item
                                        :prop="'shippingTplInfo[' + index + '].defaultTplInfo.addPrice'"
                                        :rules="[{ required: true, validator: validateNum }]"
                                        class="hn"
                                    >
                                        <TigInput type="decimal" v-model="value.defaultTplInfo.addPrice" class="input-width"></TigInput>
                                    </el-form-item>
                                    &nbsp;元，<span class="title">满</span>
                                    <TigInput type="decimal" v-model="value.defaultTplInfo.freePrice" class="input-width"></TigInput>
                                    &nbsp;元，<span class="title">免运费</span>
                                </div>
                                <el-table v-if="value.areaTplInfo.length > 0" :data="value.areaTplInfo" style="width: 100%; margin-top: 8px">
                                    <el-table-column label="运送到" prop="regionData">
                                        <template #default="scope">
                                            <DialogForm
                                                :params="{
                                                    index: index,
                                                    itemIndex: scope.$index,
                                                    ids: scope.row.regionData.areaRegions,
                                                    other: value.areaTplInfo
                                                }"
                                                path="setting/shippingTpl/SelectRegion"
                                                title="编辑地区"
                                                width="900px"
                                                :style="{ width: '100%' }"
                                                @okCallback="changeRegion"
                                            >
                                                <div class="ysd">
                                                    <div style="flex: 1">
                                                        <el-form-item
                                                            :prop="'shippingTplInfo.' + index + '.areaTplInfo[' + scope.$index + '].regionData.areaRegionNames'"
                                                            :rules="[{ required: true, message: '未添加地区' }]"
                                                            class="hn"
                                                        >
                                                            <span
                                                                class="shipping-region-list"
                                                                :style="scope.row.regionData.areaRegionNames.length > 0 ? '' : 'color: red;'"
                                                            >
                                                                {{
                                                                    scope.row.regionData.areaRegionNames.length > 0
                                                                        ? scope.row.regionData.areaRegionNames.join("、")
                                                                        : "请添加地区"
                                                                }}
                                                            </span>
                                                        </el-form-item>
                                                    </div>
                                                    <div>
                                                        <a>编辑</a>
                                                    </div>
                                                </div>
                                            </DialogForm>
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="formState.pricingType == 1 ? '首件数(件)' : '首重量(kg)'" width="90">
                                        <template #default="scope">
                                            <el-form-item
                                                :prop="'shippingTplInfo.' + index + '.areaTplInfo[' + scope.$index + '].startNumber'"
                                                :rules="[{ required: true, validator: validateNum }]"
                                                class="hn"
                                            >
                                                <TigInput type="integer" v-model="scope.row.startNumber" class="input-width"></TigInput>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="首费(元)" width="80">
                                        <template #default="scope">
                                            <el-form-item
                                                :prop="'shippingTplInfo.' + index + '.areaTplInfo[' + scope.$index + '].startPrice'"
                                                :rules="[{ required: true, validator: validateNum }]"
                                                class="hn"
                                            >
                                                <TigInput type="decimal" v-model="scope.row.startPrice" class="input-width"></TigInput>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="formState.pricingType == 1 ? '续件数(件)' : '续重量(kg)'" width="90">
                                        <template #default="scope">
                                            <el-form-item
                                                :prop="'shippingTplInfo.' + index + '.areaTplInfo[' + scope.$index + '].addNumber'"
                                                :rules="[{ required: true, validator: validateNum }]"
                                                class="hn"
                                            >
                                                <TigInput type="integer" v-model="scope.row.addNumber" class="input-width"></TigInput>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="续费(元)" width="80">
                                        <template #default="scope">
                                            <el-form-item
                                                :prop="'shippingTplInfo.' + index + '.areaTplInfo[' + scope.$index + '].addPrice'"
                                                :rules="[{ required: true, validator: validateNum }]"
                                                class="hn"
                                            >
                                                <TigInput type="decimal" v-model="scope.row.addPrice" class="input-width"></TigInput>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="满免(元)" width="80">
                                        <template #default="scope">
                                            <el-form-item :prop="'shippingTplInfo.' + index + '.areaTplInfo[' + scope.$index + '].freePrice'" class="hn">
                                                <TigInput type="decimal" v-model="scope.row.freePrice" class="input-width"></TigInput>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="60">
                                        <template #default="scope">
                                            <el-button link type="primary" @click="deletingATemplate(index, scope.$index)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <el-button link type="primary" @click="addTemplate(value)">增加指定地区运费</el-button>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item v-show="!props.isDialog" :wrapper-col="{ offset: 4, span: 16 }">
                        <el-button ref="submitBtn" class="form-submit-btn" type="primary" @click="onSubmit">提交</el-button>
                    </el-form-item>
                </el-form>
                <a-spin :spinning="loading" style="width: 100%; margin-top: 100px" />
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, shallowRef } from "vue";
import { useRouter } from "vue-router";
import { message, Cascader } from "ant-design-vue";
import { ShippingTplFormState, ShippingTplInfoItem } from "@/types/setting/shippingTpl";
import { getShippingTpl, updateShippingTpl, getShippingTplConfig } from "@/api/setting/shippingTpl";
import { DialogForm } from "@/components/dialog";
import { Checkbox } from "@/components/radio";
import { useRegionStore } from "@/store/region";
import { Plus } from "@element-plus/icons-vue";
const region = useRegionStore();
const regionList = region.getRegionList();
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
const formState = ref<ShippingTplFormState>({
    shippingTplInfo: [],
    isDefault: 0,
    isFree: 0,
    pricingType: 1
});
const validateNum = (rule: any, value: any, callback: any) => {
    if (!value) {
        callback(new Error("请输入"));
    } else if (value.length > 0 && Number(value) <= 0) {
        callback(new Error("需大于0"));
    } else {
        callback();
    }
};
const fetchShippingTpl = async () => {
    try {
        const result = await getShippingTpl(action.value, { id: id.value });
        result.shippingTplInfo.map((row, index) => {
            row.isChecked = 1;
            if (row.defaultTplInfo == null) {
                row.defaultTplInfo = getDefaultRegion(row.shippingTypeId, row.shippingTypeName, 1);
                row.areaTplInfo = [];
                row.isChecked = 0;
            }
        });
        Object.assign(formState.value, result);
    } catch (error: any) {
        message.error(error.message);
        emit("close");
    } finally {
        loading.value = false;
    }
};

const checkType = (e: any) => {
    for (let i = 0; i < formState.value.shippingTplInfo.length; i++) {
        // formState.value.shippingTplInfo[i].splice(1); // Removes all items starting from index 1 (the 2nd item)
    }
};

const deletingATemplate = (outerIndex: number, innerIndex: number) => {
    if (formState.value.shippingTplInfo && formState.value.shippingTplInfo[outerIndex].areaTplInfo) {
        formState.value.shippingTplInfo[outerIndex].areaTplInfo.splice(innerIndex, 1);
    }
};

const addTemplate = (value: any) => {
    value.areaTplInfo.push(getDefaultRegion(value.shippingTypeId, value.shippingTypeName, 0));
};

const changeRegion = (result: any) => {
    formState.value.shippingTplInfo[result.index].areaTplInfo[result.itemIndex].regionData.areaRegionNames = result.regionNames;
    formState.value.shippingTplInfo[result.index].areaTplInfo[result.itemIndex].regionData.areaRegions = result.regionIds;
};
const getDefaultRegion = (shippingTypeId: any, shippingTypeName: any, isDefault: any) => {
    return {
        shippingTplId: 0,
        shippingTypeId: shippingTypeId,
        isDefault: isDefault,
        startNumber: "",
        startPrice: "",
        addNumber: "",
        addPrice: "",
        freePrice: "",
        regionData: {
            areaRegions: [],
            areaRegionNames: []
        },
        shippingTypeName: shippingTypeName
    };
};

onMounted(async () => {
    await fetchShippingTplConfig();
    if (action.value === "detail") {
        // 获取详情数据
        await fetchShippingTpl();
    } else {
        loading.value = false;
    }
});
const fetchShippingTplConfig = async () => {
    try {
        const result = await getShippingTplConfig();
        result.forEach((row: any) => {
            row.isChecked = 1;
            if (row.defaultTplInfo == null) {
                row.defaultTplInfo = getDefaultRegion(row.shippingTypeId, row.shippingTypeName, 1);
                row.areaTplInfo = [];
                row.isChecked = 0;
            }
        });
        formState.value.shippingTplInfo = result;
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};
// 表单通过验证后提交
const onSubmit = async () => {
    await formRef.value.validate();
    try {
        emit("update:confirmLoading", true);
        const result = await updateShippingTpl(operation, { id: id.value, ...formState.value });
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
<style lang="less" scoped>
.shipping-method-style {
    display: flex;
    width: 100%;
    margin-bottom: 8px;
    flex-direction: column;

    .table-style {
        border: 1px solid #ddd;
        padding: 5px;

        .title-style {
            background-color: #e8f2ff;
            padding: 6px 12px;
            color: #999;
            display: flex;
            align-items: center;

            .title {
                color: #000000d9;
                margin-right: 4px;
            }

            .input-width {
                width: 60px;
            }
        }
    }
}

.shipping-region-list {
    line-height: 24px;
}

.ysd {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
}
</style>
