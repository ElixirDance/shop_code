<template>
    <div class="container">
        <div class="content_wrapper">
            <activityTable ref="tableRef" :promotionType="1">
                <DialogForm isDrawer @okCallback="touchEvent" title="添加满减优惠活动" width="800px"
                    path="promotion/productActivity/Info" :params="{ act: 'add', promotionType: 1 }">
                    <el-button  type="primary">新增满减活动</el-button>
                </DialogForm>
            </activityTable>
        </div>
    </div>
</template>
<script setup lang="ts">
import '@/style/css/list.less'
import { DialogForm } from '@/components/dialog'
import { ref} from 'vue';
import { useConfigStore } from "@/store/config";
import activityTable from "../src/activityTable.vue"
const config:any = useConfigStore();
// 基本参数定义
const tableRef = ref<any>(null)
const touchEvent = () => {
    tableRef.value.loadFilter()
}
</script>
