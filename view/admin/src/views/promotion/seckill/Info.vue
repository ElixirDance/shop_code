<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-form-table">
                <el-form v-if="!loading" ref="formRef" :model="formState" :rules="rules" label-width="auto">
                    <el-form-item label="秒杀商品" prop="seckillItem" >
                        <div class="lyecs-product-select-group">
                            <el-space v-if="action == 'add'" style="margin-bottom: 15px">
                                <DialogForm
                                    :params="{ selectedIds: formState.seckillItem, isMultiple: false, isSelf: 1 }"
                                    isDrawer
                                    path="product/product/src/SelectProduct"
                                    title="选择商品"
                                    width="600px"
                                    @okCallback="onOk">
                                    <el-button :loading="loadingProduct" :disabled="formState.seckillItem?.length > 0" type="primary">选择商品</el-button>
                                </DialogForm>
                                <el-button v-if="formState.seckillItem?.length > 0" @click="clear">清空</el-button>
                            </el-space>
                            <div v-if="formState.seckillItem?.length > 0 && !loadingProduct" class="lyecs-product-selected-con">
                                <div class="product-selected-list">
                                    <div class="product-selected-list-tr product-selected-list-th" style="background-color: #f5f6fa">
                                        <div class="col col2">商品信息</div>
                                        <div class="col col1">秒杀价</div>
                                        <div class="col col1">秒杀库存</div>
                                        <div class="col col3" v-if="action == 'add' && formState.seckillItem?.length > 1">操作</div>
                                    </div>
                                    <template v-for="(item, key) in formState.seckillItem">
                                        <div class="product-selected-list-tr">
                                            <div class="col col2 product-info">
                                                <div style="display: flex">
                                                    <img :src="imageFormat(item.picThumb)" height="50" width="50" />
                                                    <span style="line-height: 2">{{ item.productName }}</span>
                                                </div>
                                                <ul>
                                                    <li v-for="it in item.skuData"><span class="title">{{ it.name }}：</span>{{ it.value }}</li>
                                                </ul>
                                            </div>
                                            <div class="col col1">
                                                <TigInput type="decimal" :disabled="action != 'add'" v-model="item.seckillPrice"></TigInput>
                                                <div class="extra">价格(元)：{{ item.skuPrice || item.productPrice}}</div>
                                            </div>
                                            <div class="col col1">
                                                <TigInput type="integer" :disabled="action != 'add'" v-model="item.seckillStock"></TigInput>
                                                <div class="extra">现有库存：{{ item.skuStock || item.productStock }}</div>
                                            </div>
                                            <div class="col col3" v-if="action == 'add' && formState.seckillItem?.length > 1">
                                                <el-button
                                                    v-if="item.secondsSeckill"
                                                    :type="item.tipValue == '取消参加' ? 'danger' : 'primary'"
                                                    link
                                                    @click="del(key)"
                                                    @mouseout="item.tipValue = '已参加'"
                                                    @mouseover="item.tipValue = '取消参加'"
                                                >{{ item.tipValue }}
                                                </el-button>
                                                <el-button v-else link type="primary" @click="del(key)">参加秒杀</el-button>
                                            </div>
                                            <div v-else>
                                                <!-- <span v-if="item.secondsSeckill" class="green">已参加</span> -->
                                            </div>
                                        </div>
                                    </template>
                                </div>
                                <div class="batch" v-if="action == 'add'">
                                    <span>批量设置：</span>
                                    <el-button link type="primary" v-if="inventory && price" @click="price = !price">秒杀价格</el-button>
                                    <div v-else-if="!price" class="setting">
                                        <TigInput type="decimal" v-model="_price" placeholder="请输入秒杀价格"></TigInput>
                                        <el-button link type="primary" @click="saveBatch(1)">保存</el-button>
                                        <el-button link type="primary" @click="price = !price">取消</el-button>
                                    </div>
                                    <el-button link type="primary" v-if="inventory && price" @click="inventory = !inventory">秒杀库存</el-button>
                                    <div v-else-if="!inventory" class="setting">
                                        <TigInput type="integer" v-model="_inventory" placeholder="请输入秒杀库存"></TigInput>
                                        <el-button link type="primary" @click="saveBatch(2)">保存</el-button>
                                        <el-button link type="primary" @click="inventory = !inventory">取消</el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="extra">只能添加一件商品参与秒杀活动（支持对不同规格进行单独设置）</div>
                    </el-form-item>
                    <el-form-item :rules="[{ required: true, message: '活动名称不能为空!' }]" label="活动名称" prop="seckillName">
                        <TigInput classType="tig-form-input" v-model="formState.seckillName" width="432px" />
                    </el-form-item>
                    <el-form-item label="活动日期" prop="seckillStartTime">
                        <SelectTimeInterval
                            v-model:end-date="formState.seckillEndTime"
                            v-model:start-date="formState.seckillStartTime"
                            clearable
                            type="datetime"
                            value-format="YYYY-MM-DD HH:mm:ss"></SelectTimeInterval>
                    </el-form-item>
                    <!--                    <el-form-item label="限购数量" prop="seckillLimitNum">-->
                    <!--                        <el-input v-model="formState.seckillLimitNum" />-->
                    <!--                    </el-form-item>-->
                    <el-form-item v-show="!props.isDialog" :wrapper-col="{ offset: 4, span: 16 }">
                        <el-button ref="submitBtn" class="form-submit-btn" type="primary" @click="onSubmit">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, shallowRef } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { SeckillFormState } from "@/types/promotion/seckill";
import { getSeckill, updateSeckill } from "@/api/promotion/seckill";
import { SelectTimeInterval } from "@/components/select";
import type { FormRules } from "element-plus";
import { imageFormat } from "@/utils/format";
import { DialogForm } from "@/components/dialog";
import { getProduct } from "@/api/product/product";
import { getDays } from "@/utils/util";
import { formattedDate } from "@/utils/time";
const emit = defineEmits(["submitCallback", "update:confirmLoading", "close"]);

const props = defineProps({
    id: {
        type: Number,
        default: 0,
    },
    act: {
        type: String,
        default: "",
    },
    isDialog: Boolean,
});
const loading = ref<boolean>(true);
const loadingProduct = ref<boolean>(true);
const query = useRouter().currentRoute.value.query;
const action = ref<string>(props.isDialog ? props.act : String(query.act));
const id = ref<number>(props.isDialog ? props.id : Number(query.id));
const operation = action.value === "add" ? "create" : "update";
const formRef = shallowRef();
const formState = ref<SeckillFormState>({
    seckillItem: []
});
const validateSeckillItem = (rule: any, value: any, callback: any) => {
    if (value.length == 0) {
        callback(new Error('活动商品不能为空!'))
        return;
    }
    value.forEach((item:any)=>{
        if(item.secondsSeckill) {
            if(!item.hasOwnProperty("seckillPrice")||item.seckillPrice==''){
                callback(new Error('请设置秒杀价格!'))
                return;
            }
            if(!item.hasOwnProperty("seckillStock")||item.seckillStock===''){
                callback(new Error('请设置秒杀库存!'))
                return;
            }
        }
    })
    const anySecondsSeckillTrue = value.some((product:any) => product.secondsSeckill);
    if (!anySecondsSeckillTrue) {
        callback(new Error('请至少设置一项参加秒杀的商品!'))
        return;
    }
    callback();
}
const validateTime = (rule: any, value: any, callback: any) => {
    if (value === "") {
        callback(new Error("活动时间不能为空"));
    } else {
        if (formState.value.seckillStartTime && formState.value.seckillEndTime) {
            callback();
        } else {
            callback(new Error("活动时间不能为空"));
        }
    }
};

const rules = reactive<FormRules<typeof formState>>({
    seckillStartTime: [{ required: true, validator: validateTime, trigger: "blur" }],
    seckillItem: [{ required: true, validator: validateSeckillItem, trigger: "blur" }],
});

onMounted(() => {
    if (action.value === "detail") {
        // 获取详情数据
        fetchSeckill();
    } else {
        loading.value = false;
        loadingProduct.value = false;
    }
});
const fetchSeckill = async () => {
    try {
        const result = await getSeckill(action.value, { id: id.value });
        Object.assign(formState.value, result);
        formState.value.seckillItem?.forEach((item: any) => {
            item.productName = formState.value.productName;
            item.picThumb = formState.value.picThumb;
            item.secondsSeckill = 1;
            item.tipValue = "已参加";
        });
        loadingProduct.value = false;
    } catch (error: any) {
        message.error(error.message);
        emit("close");
    } finally {
        loading.value = false;
        loadingProduct.value = false;
    }
};

// 表单通过验证后提交
const onSubmit = async () => {
    await formRef.value.validate();
    try {
        emit("update:confirmLoading", true);
        const result = await updateSeckill(operation, { id: id.value, ...formState.value });
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

const price = ref(true);
const inventory = ref(true);

const _price = ref<string>("");
const _inventory = ref<number>();
const saveBatch = (type: number) => {
    if (type === 1) {
        formState.value.seckillItem.forEach((item: any) => {
            if (item.secondsSeckill) {
                item.seckillPrice = _price.value;
            }
        });
        _price.value = "";
        price.value = !price.value;
    } else {
        formState.value.seckillItem.forEach((item: any) => {
            if (item.secondsSeckill) {
                item.seckillStock = _inventory.value;
            }
        });
        _inventory.value = undefined;
        inventory.value = !inventory.value;
    }
    formRef.value.validate();
};
const onOk = (e: number[]) => {
    formState.value.productId = e[0];
    loadList(e[0]);
};
const loadList = async (id: number) => {
    loadingProduct.value = true;
    if (id) {
        try {
            const result = await getProduct("detail", { id: id });
            if (result.productList?.length === 0) {
                let temp: any = {};
                temp.secondsSeckill = 1;
                temp.tipValue = "已参加";
                temp.seckillPrice = '';
                temp.seckillStock = '';
                temp.picThumb = result.picThumb;
                temp.productName = result.productName;
                temp.skuPrice = result.productPrice;
                temp.skuStock = result.productStock;
                formState.value.seckillItem =[];
                formState.value.seckillItem.push(temp);
            } else {
                formState.value.seckillItem =[];
                result.productList?.forEach((item: any) => {
                    let temp: any = {};
                    temp.secondsSeckill = 1;
                    temp.tipValue = "已参加";
                    temp.seckillPrice = '';
                    temp.seckillStock = '';
                    temp.picThumb = result.picThumb;
                    temp.productName = result.productName;
                    temp.skuPrice = item.skuPrice;
                    temp.skuStock = item.skuStock;
                    temp.skuId = item.skuId;
                    temp.skuData = item.skuData;
                    formState.value.seckillItem.push(temp);
                });
            }
        } catch (error: any) {
            message.error(error.message);
        } finally {
            loadingProduct.value = false;
        }
    }
};
const clear = () => {
    formState.value.seckillItem = [];
};
// 删除
const del = (key: number) => {
    formState.value.seckillItem[key].secondsSeckill = formState.value.seckillItem[key].secondsSeckill ? 0 : 1;
};

defineExpose({ onFormSubmit });
</script>

<style lang="less" scoped>
.all_brand {
    padding: 8px;
}

.all_brand ul {
    display: flex;
    flex-wrap: wrap;
    width: 290px;
}

.all_brand li a {
    padding: 2px 7px;
    display: inline-block;
    border-radius: 3px;
    line-height: 20px;
}

.all_brand li a:hover {
    background: #f4f4f4;
}

/*商品选择器*/
.lyecs-product-select-group {
    margin-bottom: 0;
    width: 100%;

    .lyecs-product-selected-con {
        max-width: 710px;
        position: relative;
        padding-top: 50px;
    }

    .clear-btn {
        margin-left: 20px;
    }

    .desc {
        margin-left: 20px;
        color: #999;
    }

    .product-selected-list {
        margin-bottom: 20px;
        max-height: 550px;
        overflow-y: auto;
        min-width: 400px;

        .product-selected-list-tr {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            border-bottom: 1px solid #f0f0f0;

            .col {
                padding: 10px;
            }

            .col1 {
                width: 100px;
            }

            .col2 {
                flex: 1;
            }

            .col3 {
                width: 80px;
            }

            .product-info {
                display: flex;
                flex-wrap: nowrap;
                flex-direction: column;

                gap: 8px;


                & > ul {
                    width: 100%;
                    line-height: 1.5;
                    .title{
                        font-weight: bold;
                    }
                }
            }

            .product-info img {
                margin-right: 10px;
            }
        }

        .product-selected-list-th {
            color: #333;
            font-weight: bold;
            position: absolute;
            top: 0;
            width: 100%;
            background: #fff;
            height: 50px;
        }


    }
    .batch {
        display: flex;

        margin-top: 20px;

        & > div {
            color: #155bd4;
            cursor: pointer;
        }

        .setting {
            display: flex;
            gap: 8px;
        }
    }
}
.extra{
    white-space: nowrap;
}
</style>
