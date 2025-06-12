<template>
    <div class="mobile" v-if="mobileValue!='--'">
        {{ mobileValue }}
        <i v-if="mobileValue" @click="toggleVisibility" class="iconfont-admin icon-cu" :class="[showMobile ? 'icon-yanjing-kai' : 'icon-yanjing-guan']"></i>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { message } from "ant-design-vue";

const props = defineProps<{ mobile: string | undefined }>();

const showMobile = ref(false);

const isDemo = ref(import.meta.env.VITE_IS_DEMO || 0);

const toggleVisibility = () => {
    if(isDemo.value == 1){
        console.log("====",isDemo.value);
        message.error('您无权限查看');
    }else{
        showMobile.value = !showMobile.value;

    }
};

const mobileValue = computed(() => {
    console.log(showMobile.value);
    if (showMobile.value) {
        console.log(props.mobile);
        return props.mobile;
    } else {
        if (typeof props.mobile == "string") {
            if (props.mobile == "") {
                return "--";
            } else {
                return props.mobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
            }
        } else {
            return "--";
        }
    }
});
</script>

<style scoped lang="less">

.mobile {
    display: inline-flex;
    flex-direction: row;
    gap: 6px;
    align-items: center;

    .icon-cu {
        cursor: pointer;
    }
}
</style>

