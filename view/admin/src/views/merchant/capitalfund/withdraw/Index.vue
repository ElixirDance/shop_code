<template>
    <div class="container">
        <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="提现" :name="1"></el-tab-pane>
            <el-tab-pane label="提现记录" :name="2"></el-tab-pane>
        </el-tabs>
        <WithdrawForm v-if="activeName == 1"></WithdrawForm>
        <WithdrawList v-if="activeName == 2"></WithdrawList>
    </div>
</template>

<script lang="ts" setup>
import '@/style/css/list.less'
import {ref} from 'vue';
import WithdrawForm from "./src/WithdrawForm.vue"
import WithdrawList from "./src/WithdrawList.vue"
import { useRouter, useRoute } from "vue-router";
const route = useRoute();
const query = useRouter().currentRoute.value.query;
const activeName = ref<number>(Number(query.type) || 1)

</script>
<style lang="less" scoped>
.container{
    background-color: #fff;
    padding: 20px;
    margin: 20px;
    min-height: 80vh;
}
</style>