<template>
    <div class="index-m_preferenceSwitch_1TP3q">
        <div class="index-m_header_2mdaa"><span class="index-m_title_180SF">首句欢迎语</span>
            <el-switch
                class="switch-pl"
                v-model="formState.activate"
            />
        </div>
        <div class="index-m_desc_Erwpt">当买家发送的第一条消息分配到人工接待时，会发送这个回复。相同内容一天内只会对一个买家发送一次</div>
    </div>
    <div class="zent-block-header  ">
        <div class="zent-block-header__title zent-block-header__title-ribbon"><h3>回复内容</h3></div>
        <div class="zent-block-header__content">(若都勾选则自动回复文字消息+微信二维码名片)</div>
    </div>
    <div class="info-box">
        <div class="right-box">
            <el-form ref="formRef" :model="formState" label-width="auto">
                <el-form-item label="" prop="brandLogo">
                    <el-checkbox style="width: 100%" v-model="formState.sendText">
                        <span style="font-size: 14px">发送文字消息</span>
                    </el-checkbox>
                    <div style="width: 100%;padding-left: 25px;font-size: 14px">
                        <div style="display: flex;flex-direction: column">
                            <div style="display: flex">
                                <div style="min-width: 70px">回复内容：</div>
                                <div v-if="!editText" v-html="formState.replyContent"></div>
                                <div v-else style="width: 100%">
                                    <TextEditor v-model:html="formStateText.replyContentTemp" height="300px"></TextEditor>
                                </div>
                            </div>
                            <div style="display: flex">
                                <div style="width: 70px"></div>
                                <div v-if="!editText">
                                    <el-button @click="openEdit()" style="font-size: 14px;" type="primary" link>编辑</el-button>
                                </div>
                                <div style="margin-top: 14px" v-else>
                                    <el-button @click="saveEdit()" style="font-size: 14px;" type="primary">保存</el-button>
                                    <el-button @click="editText=false" style="font-size: 14px;">取消</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="" prop="brandLogo">
                    <el-checkbox style="width: 100%" v-model="formState.sendWechat">
                        <span style="font-size: 14px">发送微信二维码名片</span>
                    </el-checkbox>
                    <div v-if="formState.sendWechat" style="width: 100%;padding-left: 25px">
                        <FormAddGallery v-model:photo="formState.wechatImage"></FormAddGallery>
                    </div>
                    <div class="extra">系统自动发送微信二维码名片，引导买家添加客服微信，提升加粉效率</div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import { FormAddGallery } from "@/components/gallery";
import { Editor } from "@/components/editor";
import { imageFormat } from "@/utils/format";
import TextEditor from "@/views/im/src/TextEditor.vue";
import { getBrand } from "@/api/product/brand";
import { message } from "ant-design-vue";
import { getImConfig, saveImConfig } from "@/api/im/config";

const editText = ref(false);
const formState: any = ref({
    activate: false,
    sendText: false,
    sendWechat: false,
    wechatImage: "",
    replyContent: "你好，欢迎光临！"
});
const formStateText: any = ref({
    replyContentTemp: ""
});


const openEdit = () => {
    formStateText.value.replyContentTemp = formState.value.replyContent;
    editText.value = true;
};
const saveEdit = () => {
    formState.value.replyContent = formStateText.value.replyContentTemp;
    editText.value = false;

};
const isFetching = ref(false);
// 表单通过验证后提交
const onSubmit = async () => {
    try {
        const result = await saveImConfig({ code: "welcome", data: formState.value });
    } catch (error: any) {
        message.error(error.message);
    }
};


// 在数据变化时调用的方法
const handleFormStateChange = () => {
    if (isFetching.value) { // 如果不是因为fetchData引起的变更
        onSubmit(); // 调用onSubmit方法
    }
    if(!isFetching.value){
        isFetching.value = true
    }
};
// 使用watch监听formState的变化
watch(() => formState.value, () => {

    handleFormStateChange();
}, { deep: true });

const fetchData = async () => {
    try {

        const result = await getImConfig({ code: "welcome" });
        if(result){
            Object.assign(
                formState.value,
                result
            );
        }else{
            isFetching.value = true
        }

    } catch (error: any) {
        message.error(error.message);
    }
};
onMounted(() => {
    fetchData();
});
</script>
<style scoped lang="less">
.index-m_preferenceSwitch_1TP3q {
    padding: 16px;
    background-color: #f8f8f8;
    margin-bottom: 12px;

    .index-m_header_2mdaa {
        display: flex;
        align-items: center;

        .index-m_title_180SF {
            font-size: 16px;
            line-height: 20px;
            vertical-align: middle;
        }

        .switch-pl {
            margin-left: 10px;
        }
    }

    .index-m_desc_Erwpt {
        padding-top: 10px;
        font-size: 14px;
        color: #999;
        line-height: 21px;
    }
}

.zent-block-header {
    display: -webkit-box;
    display: flex;
    -webkit-box-pack: start;
    justify-content: flex-start;
    align-content: center;
    margin-bottom: 16px;
    padding: 10px 12px;
    min-height: 40px;
    box-sizing: border-box;
    margin-top: 10px;
    background-color: #f7f8fa;

    .zent-block-header__title-ribbon:before {
        background-color: #155bd4;
        content: "";
        width: 3px;
        height: 14px;
        margin-right: 8px;
    }

    .zent-block-header__title {
        display: flex;
        -webkit-box-align: center;
        align-items: center;
    }

    .zent-block-header__content {
        margin-left: 8px;
        align-items: center;
        -webkit-box-align: center;
        display: flex;
    }
}

.info-box {
    display: flex;
    justify-content: space-between;
    gap: 25px;



    .right-box {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 25px;

        .index-m_checkbox_3P6dm {
            margin: 20px 15px 15px;

            .zent-checkbox-wrap {
                display: flex;
                cursor: pointer;
                padding: 0;
                margin: 0 24px 0 0;
                align-items: center;
                vertical-align: middle;
                font-size: 14px;
            }

            .index-m_desc_6F0Tr {
                color: #999;
                font-size: 12px;
                line-height: 1.5;
                margin-left: 24px;
                padding-top: 8px;
                padding-bottom: 5px;
            }
        }
    }
}
</style>
