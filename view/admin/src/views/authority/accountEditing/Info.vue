<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-form-table">
                <el-form ref="formRef" :model="formState" label-width="auto">
                    <el-form-item label="手机号：">
                        {{ formState.mobile }}
                    </el-form-item>
                    <!-- <el-form-item :rules="[{ required: true, message: '验证码不能为空!' }]" label="获取验证码：" prop="mobileCode">
                        <MobileCode
                            v-model:mobile="formState.mobile"
                            v-model:mobileCode="formState.code"
                            :requestApi="setAdminCode"
                            :showMessage="true"
                            class="mobile-code-text"
                            @mobileErrorCallback="mobileErrorCallback"
                        ></MobileCode>
                    </el-form-item> -->
                    <el-form-item label="获取验证码：" prop="code" :rules="[{ required: true, message: '验证码不能为空!', trigger: 'blur' }]">
                        <TigInput classType="tig-form-input" v-model="formState.code">
                            <template #append>
                                <div v-if="ableSend" class="code-btn" @click.stop="onCode">{{ btnText }}</div>
                                <div v-if="!ableSend" class="code-text">{{ codeText }}</div>
                            </template>
                        </TigInput>
                    </el-form-item>
                    <el-form-item label="旧密码：" prop="oldPassword" :rules="[{ required: true, message: '旧密码不能为空!', trigger: 'blur' }]">
                        <TigInput classType="tig-form-input" type="password" v-model="formState.oldPassword" />
                    </el-form-item>
                    <el-form-item label="新密码：" prop="password" :rules="[{ required: true, message: '请输入新密码', trigger: 'blur' }]">
                        <TigInput classType="tig-form-input" type="password" v-model="formState.password" />
                    </el-form-item>
                    <el-form-item label="确认密码：" prop="pwdConfirm" :rules="[{ required: true, validator: validatePwd, trigger: 'blur' }]">
                        <TigInput classType="tig-form-input" type="password" v-model="formState.pwdConfirm" />
                    </el-form-item>
                </el-form>
                <Verify ref="verify" mode="pop" captchaType="blockPuzzle" :imgSize="{ width: '310px', height: '155px' }" @okCallback="okCallback"></Verify>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {onMounted, ref, shallowRef, computed} from "vue"
import {useRouter} from 'vue-router'
import {message} from "ant-design-vue";
import { MobileCode } from "@/components/form";
import { AccountPassWordEditingFormState } from "@/types/authority/accountEditing";
import { modifyManageAccounts, getAdminCode } from "@/api/authority/accountEditing";
import Verify from "@/components/verifition/Verify.vue";
const emit = defineEmits(["submitCallback", "update:confirmLoading", "close"]);
import { useUserStore } from "@/store/user";
const { logout } = useUserStore();
const props = defineProps({
    id: {
        type: Number,
        default: 0
    },
    form: {
        type: Object,
        default: {}
    },
    isDialog: Boolean
});
const formRef = shallowRef();
const formState = ref<AccountPassWordEditingFormState>({
    mobile: props.form.mobile,
    code: "",
    oldPassword: "",
    password: "",
    pwdConfirm: "",
});
const btnText = ref('获取验证码')
const ableSend = ref(true)
const countdown = ref(60)
const verify = ref();
const verifyToken = ref(null);
const okCallback = (e: any) => {
    verifyToken.value = e.verifyToken;
    onCode();
};
// 获取验证码
const onCode = async () => {
    if (!verifyToken.value) {
        verify.value.show();
        return;
    }
    try {
        const result = await getAdminCode({ type: 'code', ...formState.value, verifyToken: verifyToken.value });
        message.success("验证码发送成功");
        ableSend.value = false
        startCountdown()
    } catch (error:any) {
        message.error(error.message);
    }
};
const validatePwd = (rule: any, value: any, callback: any) => {
    if (!value) {
        callback(new Error('确认密码不能为空'))
        return;
    }
    // 判断是否符合国际手机号格式
    if (formState.value.password == value) {
        callback()
    } else {
        callback('两次密码输入不一致')
    }
}
const codeText = computed(() => {
    return countdown.value + '秒后重发'
})
const timer = ref();
const startCountdown = () => {
    timer.value = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
            clearInterval(timer.value);
            ableSend.value = true
            countdown.value = 60
        }
    }, 1000);
};
// 表单通过验证后提交
const onSubmit = async () => {
    await formRef.value.validate();
    try {
        emit('update:confirmLoading', true);
        const result = await modifyManageAccounts({modifyType: 2, ...formState.value});
        emit('submitCallback', result);
        message.success("修改成功");
        logout()
    } catch (error:any) {
        message.error(error.message);
    } finally {
        emit('update:confirmLoading', false);
    }
};
// 表单提交
const onFormSubmit = () => {
    onSubmit()
};
const errorMessage = ref("");
const mobileErrorCallback = (e: any) => {
    errorMessage.value = e;
};

defineExpose({ onFormSubmit });
</script>
