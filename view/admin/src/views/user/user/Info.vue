<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-form-table">
                <el-form v-if="!loading" ref="formRef" :model="formState" label-width="auto">
                    <el-form-item v-if="operation==='create'" :rules="[{ required: true, message: '会员名称不能为空!' }]" label="会员名称" prop="username">
                        <TigInput classType="tig-form-input" v-model="formState.username"/>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="mobile">
                        <TigInput classType="tig-form-input" type="integer" v-model="formState.mobile"/>
                    </el-form-item>
                    <el-form-item label="邮箱地址" prop="email">
                        <TigInput classType="tig-form-input" v-model="formState.email"/>
                    </el-form-item>
                    <template v-if="operation==='create'">
                        <el-form-item :rules="[{ required: true, message: '新密码不能为空!' }]" label="新密码" prop="password">
                            <TigInput classType="tig-form-input" v-model="formState.password"/>
                        </el-form-item>
                        <el-form-item :rules="[{ required: true, message: '确认密码不能为空!' }]" label="确认密码" prop="pwdConfirm">
                            <TigInput classType="tig-form-input" v-model="formState.pwdConfirm"/>
                        </el-form-item>
                    </template>
                    <template v-else>
                        <el-form-item label="新密码" prop="password">
                            <TigInput classType="tig-form-input" v-model="formState.password"/>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="pwdConfirm">
                            <TigInput classType="tig-form-input" v-model="formState.pwdConfirm"/>
                        </el-form-item>
                    </template>
                    <el-form-item label="会员等级" prop="rankId">
                        <SelectRankList v-model="formState.rankId"></SelectRankList>
                        <!-- <el-select v-model="formState.rankId" style="width: 100%">
                            <el-option
                                v-for="item in options"
                                :key="item.rankId"
                                :label="item.rankName"
                                :value="item.rankId"
                            />
                        </el-select> -->
                    </el-form-item>
                    <el-form-item v-show="!props.isDialog" :wrapper-col="{ offset: 4, span: 16 }">
                        <el-button ref="submitBtn" class="form-submit-btn" type="primary" @click="onSubmit">提交</el-button>
                    </el-form-item>
                </el-form>
                <a-spin :spinning="loading" style="width:100%;margin-top:100px"/>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {nextTick, onMounted, ref, shallowRef} from "vue"
import {SelectRankList} from "@/components/select";
import {useRouter} from 'vue-router'
import {message} from "ant-design-vue";
import {UserFormState} from '@/types/user/user.d';
import {getUser, updateUser} from "@/api/user/user";
import {ElInput} from "element-plus";
// 父组件回调
const emit = defineEmits(["submitCallback", "update:confirmLoading", "close"]);

const props = defineProps({
    id: {
        type: Number,
        default: 0
    },
    act: {
        type: String,
        default: ''
    },
    isDialog: Boolean
});
const loading = ref<boolean>(true);
const query = useRouter().currentRoute.value.query;
const action = ref<string>(props.isDialog ? props.act : String(query.act));
const id = ref<number>(props.isDialog ? props.id : Number(query.id));
const operation = action.value === 'add' ? 'create' : 'update';
const formRef = shallowRef();
const formState = ref<UserFormState>({
    balance: 0,
    frozenBalance: 0,
    avatar: "",
    password: "",
    pwdConfirm: "",
});

const fetchUser = async () => {
    try {
        loading.value = true;
        const result = await getUser(action.value, {id: id.value});
        Object.assign(
            formState.value,
            result
        )
        formState.value.mobile =  formState.value.mobile?.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
    } catch (error: any) {
        message.error(error.message);
        emit('close');
    } finally {
        loading.value = false;
    }
};


onMounted(() => {
    if (action.value === "detail") {
        // 获取详情数据
        fetchUser();
    } else {
        loading.value = false;
    }
});

// 表单通过验证后提交
const onSubmit = async () => {
    await formRef.value.validate();
    try {
        emit('update:confirmLoading', true);
        const result = await updateUser(operation, {id: id.value, ...formState.value});
        emit('submitCallback', result);
        message.success("操作成功");
    } catch (error: any) {
        message.error(error.message);
    } finally {
        emit('update:confirmLoading', false);
    }
};
// 表单提交
const onFormSubmit = () => {
    onSubmit()
};

defineExpose({onFormSubmit});
</script>
<style lang="less" scoped>

</style>

