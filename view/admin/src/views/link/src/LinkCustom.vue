<template>
    <div class="div2">
        <div class="notice-warp">
            <p>提示：</p>
            <p>您可以输入任意有效的链接地址，例如：https://xxx.xxx.xxx</p>
            <p>输入PC端自定义链接时，需要正确填写完整的地址，需要以/开头，否则将无法正常访问；（例：/join/inro）</p>
            <p>注意事项：在移动端配置外部链接时，请确保已在相应的小程序平台上添加该域名至白名单，否则链接可能无法正常访问</p>
        </div>
        <div class="info">
            <div class="item">
                <div class="title-width">PC端链接：</div>
                <TigInput v-model="link" width="100%" placeholder="请输入链接" @keyup.enter="onChange" :validate-event="false"></TigInput>
            </div>

            <div class="item">
                <div class="title-width">移动端链接：</div>
                <TigInput v-model="appLink" width="100%" placeholder="请输入H5/小程序/App路径" @keyup.enter="onChange"></TigInput>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const linkSelectData = defineModel("linkSelectData");
const link = ref("");
const appLink = ref("");
const onChange = () => {
    if (link.value != "" && appLink.value != "") {
        linkSelectData.value = {
            path: "custom",
            label: "自定义链接",
            name: link.value ? link.value : appLink.value,
            link: link.value,
            appLink: appLink.value
        };
    } else {
        linkSelectData.value = {};
    }
};
</script>
<style lang="less" scoped>
.extra {
    color: #999;
    padding-left: 10px;
}

.div2 {
    .info {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .item {
            display: flex;
            flex-direction: row;

            .title-width {
                width: 120px;
                display: flex;
                justify-content: end;
                align-items: center;
            }
        }
    }
}
</style>
