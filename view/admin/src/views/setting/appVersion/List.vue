<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-form-table">
                <a-spin :spinning="loading" style="width:100%;margin-top:100px">
                    <el-form ref="formRef" :model="formState" label-width="auto">
                        <el-form-item label="Android版本号" prop="androidVersion">
                            <TigInput v-model="formState.androidVersion" type="text"/>
                        </el-form-item>
                        <el-form-item label="Android下载链接" prop="androidLink">
                            <div class="link-wrapper">
                                <TigInput v-model="formState.androidLink" :class="{'wide-input': formState.androidLink}" class="dynamic-input" disabled type="text"/>
                                <el-button @click="upload('android')">上传</el-button>
                                <div class="right-text">{{ formState.androidLink ? '当前已存在安装包，上传即替换之前安装包' : '未存在安装包' }}</div>
                            </div>
                        </el-form-item>
                        <el-form-item label="iOS版本号" prop="iosVersion">
                            <TigInput v-model="formState.iosVersion" type="text"/>
                        </el-form-item>
                        <el-form-item label="iOS下载链接" prop="iosLink">
                            <div class="link-wrapper">
                                <TigInput v-model="formState.iosLink" :class="{'wide-input': formState.iosLink}" class="dynamic-input" disabled type="text"/>
                                <el-button @click="upload('ios')">上传</el-button>
                                <div class="right-text">{{ formState.iosLink ? '当前已存在安装包，上传即替换之前安装包' : '未存在安装包' }}</div>
                            </div>
                        </el-form-item>
                        <el-form-item label="热更新文件链接" prop="iosLink">
                            <div class="link-wrapper">
                                <TigInput v-model="formState.iosLink" :class="{'wide-input': formState.iosLink}" class="dynamic-input" disabled type="text"/>
                                <el-button @click="upload('ios')">上传</el-button>
                                <div class="right-text">{{ formState.iosLink ? '当前已存在安装包，上传即替换之前安装包' : '未存在安装包' }}</div>
                            </div>
                        </el-form-item>
                        <el-form-item label="更新方式" prop="hotUpdateType">
                            <el-radio-group v-model="formState.hotUpdateType">
                                <el-radio :value="1">热更新</el-radio>
                                <el-radio :value="2">应用市场更新（未安装则热更新）</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="版本说明" prop="templateSubject">
                            <p>
                                1.热更新只需上传热更新文件，并选择热更新方式; <br/>
                                2.整包更新安装包只需上传对应的安装包并选择整包更新方式;<br/>
                                3.热更新或整包更新都需要修改对应版本号；<br/>
                                4.ios上架审核期间不要进行热更新操作，否则会被拒；<br/>
                            </p>
                        </el-form-item>
                    </el-form>
                    <div class="selected-action-warp">
                        <div class="selected-action" style="padding-left: 80px;">
                            <el-button :loading="confirmLoading" class="form-submit-btn" size="large" type="primary" @click="onSubmit">提 交</el-button>
                        </div>
                    </div>
                </a-spin>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import '@/style/css/list.less'
import {onMounted, ref, shallowRef} from "vue"
import {message} from "ant-design-vue";
import {getAppVersion, updateAppVersionLinks} from "@/api/setting/appVersion";
import type {AppVersionFormState} from "@/types/setting/appVersion.d";


// 父组件回调
const emit = defineEmits(["submitCallback", "update:confirmLoading", "close"]);
const confirmLoading = ref(false);
const formState = ref<AppVersionFormState>({});
const loading = ref<boolean>(true);
const formRef = shallowRef();

// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getAppVersion();
        Object.assign(
          formState.value,
          result
        )
    } catch (error:any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }

}

const upload = (name:string) => {
  console.log(name);
}
onMounted(() => {
    // 获取详情数据
    loadFilter();
});

// 表单通过验证后提交
const onSubmit = async () => {
    await formRef.value.validate();
    try {
        emit('update:confirmLoading', true);
        const result = await updateAppVersionLinks({...formState.value});
        emit('submitCallback', result);
        message.success("操作成功");
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

defineExpose({onFormSubmit});
</script>
<style lang="less" scoped>
.notice-warp {
    background-color: #eef2ff;
    border-radius: 9px;
    padding: 15px;
    margin-bottom: 20px;
    line-height: 24px;
}

.link-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    white-space: nowrap; /* 防止换行 */
}

.dynamic-input {
    flex-grow: 1; /* 允许input根据需要伸缩 */
}

.wide-input {
    flex-grow: 2; /* 当有更多文本时，input更宽 */
}

.el-button {
    margin: 0 8px; /* 按钮和input之间的间距 */
}

.right-text {
    /* 添加所需的样式，如字体大小、颜色等 */
}

</style>
