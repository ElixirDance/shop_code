<template>
    <div class="lyecs-popedit">
        <div class="table-product-box" v-if="skuList && skuList.length > 0">
            <el-table ref="tableRef" row-key="skuId" :class="isMultiple ? '' : 'hide-checkbox'" @select="selectRow" @select-all="handleSelectAll" :data="skuList" style="width: 100%" border>
                    <el-table-column type="selection" reserve-selection width="40" />
                    <el-table-column v-for="attr in skuTit" :label="attr.name">
                        <template #default="{ row }">
                            <ul>
                                <li v-for="(data, index) in row.skuData" :key="index">
                                    {{ attr.name == data.name ? data.value : ''}}
                                </li>
                            </ul>
                        </template>
                    </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
const props = defineProps({
    productInfo: {
        type: Object,
        default: {}
    },
    isMultiple: {
        type: Boolean,
        default: true
    },
})
const skuList = ref(props.productInfo.productSku || []);
const skuTit = ref(skuList.value[0]?.skuData)
const skuIds = ref<any[]>(JSON.parse(JSON.stringify(props.productInfo?.skuIds || [])));
const tableRef: any = ref();
const selectRow = (selection: any, val: any) => {
    if (!props.isMultiple) {
        // 单选
        tableRef.value.clearSelection();
        if (selection.length == 0) {
            skuIds.value = []; // 清空data中绑定的selectedRow
            return;
        }
        tableRef.value.toggleRowSelection(val, true);
        skuIds.value = [];
        skuIds.value.push(val.skuId)
    }else{
        // 多选
        if (skuIds.value.includes(val.skuId)) {
            skuIds.value.splice(skuIds.value.indexOf(val.skuId), 1)
        } else {
            skuIds.value.push(val.skuId)
        }
    }
};
const handleSelectAll = (selection:any) => {
    if (selection.length == 0) {
        skuIds.value = []; // 清空data中绑定的selectedRow
        return;
    }else{
        skuIds.value = [];
        selection.map((item:any) => {
            skuIds.value.push(item.skuId)
        })
    }
}
// const isSelectable = (row: any, index: number) => {
//     // 排除重复项
//     if(props.productInfo.skuIds && props.productInfo.skuIds.length > 0){
//         return !props.productInfo.skuIds.includes(row.skuId)
//     }else{
//         return true
//     }
// };
onMounted(() => {
    // 回显已选的 SKU
    skuIds.value.forEach(id => {
        const row = skuList.value.find((item:any) => item.skuId === id);
        if (row) {
            tableRef.value.toggleRowSelection(row, true);
        }
    });
});
defineExpose({
    skuIds
});
</script>

<style lang="less" scoped>
.lyecs-popedit-con{
    cursor: pointer;
    display: flex;
    align-items: center;
    .lyecs-popedit-btn {
        cursor: pointer;
        color: #999;
        font-size: 16px;
        padding-left: 2px;
        line-height: 1;
    }
}
.table-btn-box{
    text-align: end;
    padding-top: 10px;
    padding-right: 10px;
}
.table-product-box{
    padding-right: 10px;
    height: 300px;
    overflow-y: scroll;
    overflow-x: hidden;
    &&::-webkit-scrollbar {
        //修改滚动条宽度或高度
        width: 8px;
    }
    &&::-webkit-scrollbar-thumb {
        border-radius: 20px;
        background: #c2c2c2;
    }
    &&::-webkit-scrollbar-track {
        border-radius: 8px;
        background: #fff;
    }
    :deep(.el-form-item){
        margin-bottom: 0 !important;
        width: 70px !important;
    }
}
.table-product-inp{
    :deep(.el-form-item){
        margin-bottom: 0 !important;
        width: 120px !important;
    }
}
.lyecs-popedit{
    :deep(.hide-checkbox .el-table__header-wrapper .el-table__header .el-checkbox){
        display: none;
    }
}
</style>
