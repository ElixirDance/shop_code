<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-form-table">
                <a-spin :spinning="loading">
                    <div class="theme-style-info">
                        <div class="left">
                            <h3>主题配色</h3>
                            <div class="color-list">
                                <div
                                    v-for="item in ColorList"
                                    :style="{ border: item.check ? '1px solid #0080f9' : '1px solid transparent' }"
                                    class="color-card"
                                    @click="selectItem(item.themeId)"
                                >
                                    <div :style="{ background: item['--main-bg'] }"></div>
                                    <div :style="{ background: item['--vice-bg'] }"></div>
                                </div>
                            </div>
                            <el-button :loading="confirmLoading" class="form-submit-btn" type="primary" @click="onSubmit">保存</el-button>
                        </div>
                        <div class="right">
                            <h3>预览效果</h3>
                            <div class="example">
                                <div class="card info">
                                    <div class="info-item1">
                                        <p :style="{ color: formState['--price'] }" class="text">{{ priceFormat(amount) }}</p>
                                    </div>
                                    <div class="info-item2">
                                        <p :style="{ color: formState['--price'] }" class="text">由Tigshop配送并提供售后服务</p>
                                    </div>
                                    <div class="info-item3">
                                        <div :style="{ color: formState['--vice-text'], background: formState['--vice-bg'] }" class="cu-card">9折</div>
                                        <div :style="{ color: formState['--vice-text'], background: formState['--vice-bg'] }" class="cu-card">满100-10</div>
                                        <div :style="{ color: formState['--vice-text'], background: formState['--vice-bg'] }" class="cu-card">满300-40</div>
                                    </div>
                                    <div class="info-item4">
                                        <p :style="{ color: formState['--price'] }" class="text">商品介绍</p>
                                    </div>
                                    <div class="info-item5">
                                        <p :style="{ color: formState['--main-text'], background: formState['--main-bg'] }" class="text">3</p>
                                    </div>
                                    <div class="info-item6">
                                        <div>
                                            <div :style="{ color: formState['--vice-text'], background: formState['--vice-bg'] }">加入购物车</div>
                                            <div :style="{ color: formState['--main-text'], background: formState['--main-bg'] }">立即购买</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card buy">
                                    <div class="buy-item1">
                                        <p :style="{ color: formState['--price'] }" class="text">{{ priceFormat(amount) }}</p>
                                    </div>
                                    <div class="buy-item2">
                                        <div :style="{ color: formState['--general'], borderColor: formState['--main-bg'] }" class="cu-card">金色</div>
                                    </div>
                                    <div class="buy-item3">
                                        <div :style="{ color: formState['--general'], borderColor: formState['--main-bg'] }" class="cu-card">XS</div>
                                    </div>
                                    <div class="buy-item4">
                                        <p :style="{ color: '#39bf3e' }" class="text">充足</p>
                                    </div>
                                    <div class="buy-item5">
                                        <div>
                                            <div :style="{ color: formState['--vice-text'], background: formState['--vice-bg'] }">加入购物车</div>
                                            <div :style="{ color: formState['--main-text'], background: formState['--main-bg'] }">立即购买</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card check">
                                    <div class="check-item1">
                                        <p :style="{ color: '#fff', background: formState['--main-bg'] }" class="text">自营</p>
                                    </div>
                                    <div class="check-item2">
                                        <p :style="{ color: formState['--price'] }" class="text">{{ priceFormat(amount) }}</p>
                                    </div>
                                    <div class="check-item3">
                                        <p :style="{ color: formState['--price'] }" class="text">{{ points }}</p>
                                    </div>
                                    <div class="check-item4">
                                        <p :style="{ color: formState['--price'] }" class="text">{{ balance }}</p>
                                    </div>
                                    <div class="check-item5">
                                        <p :style="{ color: formState['--price'] }" class="text">{{ priceFormat(amountOu) }}</p>
                                    </div>
                                    <div class="check-item6">
                                        <div>
                                            <div :style="{ color: formState['--main-text'], background: formState['--main-bg'] }">提交</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a-spin>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import "@/style/css/list.less";
import { onMounted, ref } from "vue";
import { message } from "ant-design-vue";
import type { ColorList, ThemeStyleFormState } from "@/types/decorate/themeStyle.d";
import { getConfigThemeStyle, saveConfigThemeStyle } from "@/api/setting/config";
import { priceFormat } from "@/utils/format";
// 父组件回调
const emit = defineEmits(["submitCallback", "update:confirmLoading", "close"]);
const confirmLoading = ref(false);
const amount = ref(395);
const points = ref(6666);
const balance = ref(29999.0);
const amountOu = ref(231.1);
const loading = ref<boolean>(true);
const formState = ref<ThemeStyleFormState>({
    themeId: 0
});
const ColorList = ref<ColorList[]>([
    {
        check: false,
        themeId: 1,
        "--general": "#4a90e2",
        "--main-bg": "#4a90e2",
        "--main-bg-gradient": "#4a90e2",
        "--main-text": "#ffffff",
        "--vice-bg": "#D6E9FC",
        "--vice-text": "#0080FF",
        "--icon": "#0080FF",
        "--price": "#0080FF",
        "--tag-text": "#0080FF",
        "--tag-bg": "#E5F2FF",
        "--primary-light-3": "#4a90e2db",
        "--primary-light-5": "#a5c8f1",
        "--primary-light-7": "#c9def6",
        "--primary-light-8": "#dbe9f9",
        "--primary-light-9": "#edf4fc",
        "--primary-dark-2": "#3b73b5",
        "--ump-main-bg": "#4a90e2",
        "--ump-main-text": "#ffffff",
        "--ump-vice-bg": "#D6E9FC",
        "--ump-vice-text": "#0080FF",
        "--ump-icon": "#0080FF",
        "--ump-price": "#0080FF",
        "--ump-tag-text": "#0080FF",
        "--ump-tag-bg": "#E5F2FF",
        "--ump-coupon-bg": "#F2F8FF",
        "--ump-border": "#CCE4FF",
        "--ump-start-bg": "#00B8FF",
        "--ump-end-bg": "#0078EF"
    },
    {
        check: false,
        themeId: 2,
        "--general": "#ff4444",
        "--main-bg": "#ff4444",
        "--main-bg-gradient": "#ff4444",
        "--main-text": "#ffffff",
        "--vice-bg": "#ff8855",
        "--vice-text": "#fff",
        "--icon": "#FC0000",
        "--price": "#FC0000",
        "--tag-text": "#CF0000",
        "--tag-bg": "#FFF2F2",
        "--primary-light-3": "#ff7c7c",
        "--primary-light-5": "#ffa2a2",
        "--primary-light-7": "#ffc7c7",
        "--primary-light-8": "#ffdada",
        "--primary-light-9": "#ffecec",
        "--primary-dark-2": "#cc3636",
        "--ump-main-bg": "#ff4444",
        "--ump-main-text": "#ffffff",
        "--ump-vice-bg": "#ff8855",
        "--ump-vice-text": "#fff",
        "--ump-icon": "#FC0000",
        "--ump-price": "#FC0000",
        "--ump-tag-text": "#CF0000",
        "--ump-tag-bg": "#FFF2F2",
        "--ump-coupon-bg": "#FFF2F2",
        "--ump-border": "#FFCCCC",
        "--ump-start-bg": "#F86F30",
        "--ump-end-bg": "#E91717"
    },
    {
        check: false,
        themeId: 3,
        "--general": "#ff5e15",
        "--main-bg": "#ff5e15",
        "--main-bg-gradient": "#ff5e15",
        "--main-text": "#ffffff",
        "--vice-bg": "#FF9300",
        "--vice-text": "#ffffff",
        "--icon": "#ff5e15",
        "--price": "#ff5e15",
        "--tag-text": "#ff5e15",
        "--tag-bg": "#FFEDE6",
        "--primary-light-3": "#ff8e5b",
        "--primary-light-5": "#ffaf8a",
        "--primary-light-7": "#ffcfb9",
        "--primary-light-8": "#ffdfd0",
        "--primary-light-9": "#ffefe8",
        "--primary-dark-2": "#cc4b11",
        "--ump-main-bg": "#ff5e15",
        "--ump-main-text": "#ffffff",
        "--ump-vice-bg": "#FF9300",
        "--ump-vice-text": "#ffffff",
        "--ump-icon": "#ff5e15",
        "--ump-price": "#ff5e15",
        "--ump-tag-text": "#ff5e15",
        "--ump-tag-bg": "#FFEDE6",
        "--ump-coupon-bg": "#FFF6F2",
        "--ump-border": "#FFDCCC",
        "--ump-start-bg": "#FF8C20",
        "--ump-end-bg": "#FF4300"
    },
    {
        check: false,
        themeId: 4,
        "--general": "#ff547b",
        "--main-bg": "#ff547b",
        "--main-bg-gradient": "#ff547b",
        "--main-text": "#ffffff",
        "--vice-bg": "#FFE6E8",
        "--vice-text": "#ff547b",
        "--icon": "#ff547b",
        "--price": "#ff547b",
        "--tag-text": "#ff547b",
        "--tag-bg": "#FFF2F5",
        "--primary-light-3": "#ff87a3",
        "--primary-light-5": "#ffaabd",
        "--primary-light-7": "#ffccd7",
        "--primary-light-8": "#ffdde5",
        "--primary-light-9": "#ffeef2",
        "--primary-dark-2": "#cc4362",
        "--ump-main-bg": "#ff547b",
        "--ump-main-text": "#ffffff",
        "--ump-vice-bg": "#FFE6E8",
        "--ump-vice-text": "#ff547b",
        "--ump-icon": "#ff547b",
        "--ump-price": "#ff547b",
        "--ump-tag-text": "#ff547b",
        "--ump-tag-bg": "#FFF2F5",
        "--ump-coupon-bg": "#FFF2F5",
        "--ump-border": "#FFCCD8",
        "--ump-start-bg": "#FF44A3",
        "--ump-end-bg": "#FF4063"
    },
    {
        check: false,
        themeId: 5,
        "--general": "#FF4444",
        "--main-bg": "#FF4444",
        "--main-bg-gradient": "#FF4444",
        "--main-text": "#ffffff",
        "--vice-bg": "#555555",
        "--vice-text": "#ffffff",
        "--icon": "#FC0000",
        "--price": "#FC0000",
        "--tag-text": "#CF0000",
        "--tag-bg": "#FFF2F2",
        "--primary-light-3": "#ff7c7c",
        "--primary-light-5": "#ffa2a2",
        "--primary-light-7": "#ffc7c7",
        "--primary-light-8": "#ffdada",
        "--primary-light-9": "#ffecec",
        "--primary-dark-2": "#cc3636",
        "--ump-main-bg": "#FF4444",
        "--ump-main-text": "#ffffff",
        "--ump-vice-bg": "#555555",
        "--ump-vice-text": "#ffffff",
        "--ump-icon": "#FC0000",
        "--ump-price": "#FC0000",
        "--ump-tag-text": "#CF0000",
        "--ump-tag-bg": "#FFF2F2",
        "--ump-coupon-bg": "#FFF2F2",
        "--ump-border": "#FFCCCC",
        "--ump-start-bg": "#FF8544",
        "--ump-end-bg": "#FF2E2E"
    },
    {
        check: false,
        themeId: 6,
        "--general": "#FCC600",
        "--main-bg": "#FCC600",
        "--main-bg-gradient": "#FCC600",
        "--main-text": "#ffffff",
        "--vice-bg": "#1D262E",
        "--vice-text": "#ffffff",
        "--icon": "#FCC600",
        "--price": "#FCC600",
        "--tag-text": "#FCC600",
        "--tag-bg": "#FFF4CD",
        "--primary-light-3": "#fdd74d",
        "--primary-light-5": "#fee380",
        "--primary-light-7": "#feeeb3",
        "--primary-light-8": "#fef4cc",
        "--primary-light-9": "#fff9e6",
        "--primary-dark-2": "#ca9e00",
        "--ump-main-bg": "#FCC600",
        "--ump-main-text": "#ffffff",
        "--ump-vice-bg": "#1D262E",
        "--ump-vice-text": "#ffffff",
        "--ump-icon": "#FCC600",
        "--ump-price": "#FCC600",
        "--ump-tag-text": "#FCC600",
        "--ump-tag-bg": "#FFF4CD",
        "--ump-coupon-bg": "#FFFCF2",
        "--ump-border": "#FFF3CC",
        "--ump-start-bg": "#FF5B00",
        "--ump-end-bg": "#FFBF25"
    },
    {
        check: false,
        themeId: 7,
        "--general": "#65c4aa",
        "--main-bg": "#65c4aa",
        "--main-bg-gradient": "#65c4aa",
        "--main-text": "#ffffff",
        "--vice-bg": "#D9F6EF",
        "--vice-text": "#65c4aa",
        "--icon": "#65c4aa",
        "--price": "#65c4aa",
        "--tag-text": "#65c4aa",
        "--tag-bg": "#F2FFFC",
        "--primary-light-3": "#93d6c4",
        "--primary-light-5": "#b2e2d5",
        "--primary-light-7": "#d1ede6",
        "--primary-light-8": "#e0f3ee",
        "--primary-light-9": "#f0f9f7",
        "--primary-dark-2": "#519d88",
        "--ump-main-bg": "#65c4aa",
        "--ump-main-text": "#ffffff",
        "--ump-vice-bg": "#D9F6EF",
        "--ump-vice-text": "#65c4aa",
        "--ump-icon": "#65c4aa",
        "--ump-price": "#65c4aa",
        "--ump-tag-text": "#65c4aa",
        "--ump-tag-bg": "#F2FFFC",
        "--ump-coupon-bg": "#FFFCF2",
        "--ump-border": "#CCFFF3",
        "--ump-start-bg": "#00D1C9",
        "--ump-end-bg": "#00BB87"
    },
    {
        check: false,
        themeId: 8,
        "--general": "#09bb07",
        "--main-bg": "#09bb07",
        "--main-bg-gradient": "#09bb07",
        "--main-text": "#ffffff",
        "--vice-bg": "#383838",
        "--vice-text": "#ffffff",
        "--icon": "#09BB07",
        "--price": "#09BB07",
        "--tag-text": "#09BB07",
        "--tag-bg": "#E6F8E6",
        "--primary-light-3": "#53cf51",
        "--primary-light-5": "#84dd83",
        "--primary-light-7": "#b5ebb5",
        "--primary-light-8": "#cef1cd",
        "--primary-light-9": "#e6f8e6",
        "--primary-dark-2": "#079606",
        "--ump-main-bg": "#09bb07",
        "--ump-main-text": "#ffffff",
        "--ump-vice-bg": "#383838",
        "--ump-vice-text": "#ffffff",
        "--ump-icon": "#09BB07",
        "--ump-price": "#09BB07",
        "--ump-tag-text": "#09BB07",
        "--ump-tag-bg": "#E6F8E6",
        "--ump-coupon-bg": "#F2FFF2",
        "--ump-border": "#CCFFCC",
        "--ump-start-bg": "#10C80E",
        "--ump-end-bg": "#00A630"
    },
    {
        check: false,
        themeId: 9,
        "--general": "#63be72",
        "--main-bg": "#63be72",
        "--main-bg-gradient": "#63be72",
        "--main-text": "#ffffff",
        "--vice-bg": "#E1F4E3",
        "--vice-text": "#6CBE72",
        "--icon": "#6CBE72",
        "--price": "#6CBE72",
        "--tag-text": "#6CBE72",
        "--tag-bg": "#F0F8F0",
        "--primary-light-3": "#92d29c",
        "--primary-light-5": "#b1dfb9",
        "--primary-light-7": "#d0ecd5",
        "--primary-light-8": "#e0f2e3",
        "--primary-light-9": "#eff9f1",
        "--primary-dark-2": "#4f985b",
        "--ump-main-bg": "#63be72",
        "--ump-main-text": "#ffffff",
        "--ump-vice-bg": "#E1F4E3",
        "--ump-vice-text": "#6CBE72",
        "--ump-icon": "#6CBE72",
        "--ump-price": "#6CBE72",
        "--ump-tag-text": "#6CBE72",
        "--ump-tag-bg": "#F0F8F0",
        "--ump-coupon-bg": "#F2FFF4",
        "--ump-border": "#CCFFD4",
        "--ump-start-bg": "#57D8AE",
        "--ump-end-bg": "#4CBA54"
    },
    {
        check: false,
        themeId: 10,
        "--general": "#c3a769",
        "--main-bg": "#c3a769",
        "--main-bg-gradient": "#c3a769",
        "--main-text": "#ffffff",
        "--vice-bg": "#F3EEE1",
        "--vice-text": "#C3A769",
        "--icon": "#C3A769",
        "--price": "#C3A769",
        "--tag-text": "#C3A769",
        "--tag-bg": "#F9F6F0",
        "--primary-light-3": "#d5c196",
        "--primary-light-5": "#e1d3b4",
        "--primary-light-7": "#ede5d2",
        "--primary-light-8": "#f3ede1",
        "--primary-light-9": "#f9f6f0",
        "--primary-dark-2": "#9c8654",
        "--ump-main-bg": "#c3a769",
        "--ump-main-text": "#ffffff",
        "--ump-vice-bg": "#F3EEE1",
        "--ump-vice-text": "#C3A769",
        "--ump-icon": "#C3A769",
        "--ump-price": "#C3A769",
        "--ump-tag-text": "#C3A769",
        "--ump-tag-bg": "#F9F6F0",
        "--ump-coupon-bg": "#FFFBF2",
        "--ump-border": "#FFEFCC",
        "--ump-start-bg": "#B18836",
        "--ump-end-bg": "#DEB155"
    },
    {
        check: false,
        themeId: 11,
        "--general": "#2f2f34",
        "--main-bg": "#2f2f34",
        "--main-bg-gradient": "#2f2f34",
        "--main-text": "#ffffff",
        "--vice-bg": "#EBECF2",
        "--vice-text": "#2F2F34",
        "--icon": "#2F2F34",
        "--price": "#2F2F34",
        "--tag-text": "#2F2F34",
        "--tag-bg": "#EAEAEA",
        "--primary-light-3": "#6d6d71",
        "--primary-light-5": "#97979a",
        "--primary-light-7": "#c1c1c2",
        "--primary-light-8": "#d5d5d6",
        "--primary-light-9": "#eaeaeb",
        "--primary-dark-2": "#26262a",
        "--ump-main-bg": "#2f2f34",
        "--ump-main-text": "#ffffff",
        "--ump-vice-bg": "#EBECF2",
        "--ump-vice-text": "#2F2F34",
        "--ump-icon": "#2F2F34",
        "--ump-price": "#2F2F34",
        "--ump-tag-text": "#2F2F34",
        "--ump-tag-bg": "#EAEAEA",
        "--ump-coupon-bg": "#F2F2FF",
        "--ump-border": "#CCCCFF",
        "--ump-start-bg": "#383D46",
        "--ump-end-bg": "#2E333D"
    },
    {
        check: false,
        themeId: 12,
        "--general": "#884cff",
        "--main-bg": "#884cff",
        "--main-bg-gradient": "#884cff",
        "--main-text": "#ffffff",
        "--vice-bg": "#EFE6FF",
        "--vice-text": "#884cff",
        "--icon": "#884cff",
        "--price": "#884cff",
        "--tag-text": "#884cff",
        "--tag-bg": "#F3EDFF",
        "--primary-light-3": "#ac82ff",
        "--primary-light-5": "#c4a6ff",
        "--primary-light-7": "#dbc9ff",
        "--primary-light-8": "#e7dbff",
        "--primary-light-9": "#f3edff",
        "--primary-dark-2": "#6d3dcc",
        "--ump-main-bg": "#884cff",
        "--ump-main-text": "#ffffff",
        "--ump-vice-bg": "#EFE6FF",
        "--ump-vice-text": "#884cff",
        "--ump-icon": "#884cff",
        "--ump-price": "#884cff",
        "--ump-tag-text": "#884cff",
        "--ump-tag-bg": "#F3EDFF",
        "--ump-coupon-bg": "#F7F2FF",
        "--ump-border": "#E0CCFF",
        "--ump-start-bg": "#CF4BF6",
        "--ump-end-bg": "#5F35EB"
    },
    {
        check: false,
        themeId: 13,
        "--general": "#EE0A24",
        "--main-bg": "#EE0A24",
        "--main-bg-gradient": "#EE0A24",
        "--main-text": "#ffffff",
        "--vice-bg": "#FF9518FF",
        "--vice-text": "#ffffff",
        "--icon": "#EE0A24",
        "--price": "#EE0A24",
        "--tag-text": "#EE0A24",
        "--tag-bg": "#FDE6E9",
        "--primary-light-3": "#f35466",
        "--primary-light-5": "#f78592",
        "--primary-light-7": "#fab6bd",
        "--primary-light-8": "#fcced3",
        "--primary-light-9": "#fde7e9",
        "--primary-dark-2": "#be081d",
        "--ump-main-bg": "#EE0A24",
        "--ump-main-text": "#ffffff",
        "--ump-vice-bg": "linear-gradient(to right, #FFD01E, #FF8917)",
        "--ump-vice-text": "#ffffff",
        "--ump-icon": "#EE0A24",
        "--ump-price": "#EE0A24",
        "--ump-tag-text": "#EE0A24",
        "--ump-tag-bg": "#FDE6E9",
        "--ump-coupon-bg": "#FFF2F4",
        "--ump-border": "#FCCED3",
        "--ump-start-bg": "#FF6034",
        "--ump-end-bg": "#EE0A24"
    }
]);
const selectItem = (themeId: number) => {
    ColorList.value.forEach((item) => {
        // 如果当前项是被点击的项，则将其 check 设置为 true
        // 否则，将其他项的 check 设置为 false
        if (item.themeId === themeId) {
            Object.assign(formState.value, item);
            item.check = true;
        } else {
            item.check = false;
        }
    });
};

const loadFilter = async () => {
    try {
        const result = await getConfigThemeStyle();
        formState.value = JSON.parse(result.themeStyle as any)
        selectItem(Number(formState.value.themeId));
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    // 获取详情数据
    loadFilter();
});

// 表单通过验证后提交
const onSubmit = async () => {
    try {
        emit("update:confirmLoading", true);
        delete formState.value.check;
        const result = await saveConfigThemeStyle({ themeStyle: JSON.stringify(formState.value) });
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

defineExpose({ onFormSubmit });
</script>
<style lang="less" scoped>
.theme-style-info {
    display: flex;
    flex-direction: row;
    gap: 20px;

    .left {
        width: 30%;
        padding: 0 20px;
        box-sizing: border-box;
        border-right: 1px solid #e0e0e0;

        .form-submit-btn {
            margin-top: 50px;
            padding: 0 25px;
            height: 40px;
            font-size: 14px;
        }

        .color-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;

            .color-card {
                display: flex;
                box-sizing: border-box;
                padding: 2px;
                cursor: pointer;

                & > div {
                    height: 24px;
                    width: 24px;
                    flex: 1;
                }
            }
        }
    }

    .right {
        flex: 1;
        padding: 0 20px;

        .example {
            margin-top: 10px;
            display: flex;
            flex-direction: row;
            gap: 10px;
            flex-wrap: wrap;

            .bg-card {
                font-size: 8px;
                display: inline-block;
                height: 8px;
                padding: 2px;
                border-radius: 8px;
            }

            .card {
                width: 225px;
                height: 460px;
                border: 0.1px solid #e0e0e0;
                position: relative; /* 设置父容器为相对定位 */
            }

            .info {
                background-image: url("@/style/images/decorate/themeStyle/temp1.jpg");
                background-position: center center;
                background-size: cover;

                .info-item1 {
                    position: absolute;
                    left: 9px;
                    top: 245px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    .text {
                        font-size: 10px;
                        font-weight: bold;
                    }
                }

                .info-item2 {
                    position: absolute; /* 设置绝对定位，相对于最近的相对定位父容器 */
                    left: 40px;
                    top: 350px;
                    display: flex;
                    overflow: hidden;

                    .text {
                        font-size: 6px;
                        font-weight: 500;
                    }
                }

                .info-item3 {
                    position: absolute; /* 设置绝对定位，相对于最近的相对定位父容器 */
                    left: 32px;
                    top: 385px;
                    display: flex;
                    overflow: hidden;
                    gap: 4px;

                    .cu-card {
                        padding: 2px 6px;
                        font-size: 6px;
                    }
                }

                .info-item4 {
                    position: absolute; /* 设置绝对定位，相对于最近的相对定位父容器 */
                    left: 40px;
                    top: 418px;
                    display: flex;
                    overflow: hidden;

                    .text {
                        font-size: 7.5px;
                        font-weight: 500;
                    }
                }

                .info-item5 {
                    position: absolute; /* 设置绝对定位，相对于最近的相对定位父容器 */
                    left: 54px;
                    top: 433px;
                    display: flex;
                    overflow: hidden;

                    .text {
                        padding: 0 1px;
                        border-radius: 50%;
                        font-size: 7px;
                        font-weight: 500;
                    }
                }

                .info-item6 {
                    position: absolute; /* 设置绝对定位，相对于最近的相对定位父容器 */
                    bottom: 4px;
                    right: 4px;
                    display: flex;
                    border-radius: 18px;
                    overflow: hidden;

                    & > div {
                        display: flex;

                        & > div {
                            padding: 6px 20px;
                            font-size: 8px;
                        }
                    }
                }
            }

            .buy {
                background: url("@/style/images/decorate/themeStyle/temp2.jpg") center center;
                background-size: cover;

                .buy-item1 {
                    position: absolute;
                    left: 66px;
                    top: 176px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    .text {
                        font-size: 10px;
                        font-weight: bold;
                    }
                }

                .buy-item2 {
                    position: absolute;
                    left: 76px;
                    top: 267px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    & > div {
                        border: 0.5px solid;
                        padding: 3.5px 6px;
                        font-size: 7.7px;
                        border-radius: 2px;
                        font-weight: 500;
                        background-color: #f7f8fa;
                    }
                }

                .buy-item3 {
                    position: absolute;
                    left: 9px;
                    top: 360.5px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    & > div {
                        border: 0.5px solid;
                        padding: 3.5px 6px;
                        font-size: 7.7px;
                        border-radius: 2px;
                        font-weight: 500;
                        background-color: #f7f8fa;
                    }
                }

                .buy-item4 {
                    position: absolute;
                    right: 5px;
                    top: 398px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    .text {
                        font-size: 7px;
                        font-weight: bold;
                    }
                }

                .buy-item5 {
                    position: absolute; /* 设置绝对定位，相对于最近的相对定位父容器 */
                    bottom: 4px;
                    right: 2px;
                    display: flex;
                    border-radius: 18px;
                    overflow: hidden;

                    & > div {
                        display: flex;

                        & > div {
                            padding: 6px 37px;
                            font-size: 8px;
                        }
                    }
                }
            }

            .check {
                background: url("@/style/images/decorate/themeStyle/temp3.jpg") center center;
                background-size: cover;

                .check-item1 {
                    position: absolute;
                    left: 5px;
                    top: 102px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    .text {
                        padding: 1px 2px;
                        border-radius: 2px;
                        font-size: 7px;
                    }
                }

                .check-item2 {
                    position: absolute;
                    left: 58px;
                    top: 155.5px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    .text {
                        font-size: 8px;
                    }
                }

                .check-item3 {
                    position: absolute;
                    left: 74px;
                    top: 254.5px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    .text {
                        font-size: 8px;
                    }
                }

                .check-item4 {
                    position: absolute;
                    left: 74px;
                    top: 277.5px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    .text {
                        font-size: 8px;
                    }
                }

                .check-item5 {
                    position: absolute;
                    left: 6px;
                    bottom: 6px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    .text {
                        font-size: 10px;
                        font-weight: bold;
                    }
                }

                .check-item6 {
                    position: absolute;
                    right: 8px;
                    bottom: 3px;
                    display: flex;
                    border-radius: 18px;
                    overflow: hidden;

                    & > div {
                        display: flex;

                        & > div {
                            padding: 6px 20px;
                            font-size: 8px;
                        }
                    }
                }
            }
        }
    }
}
</style>
