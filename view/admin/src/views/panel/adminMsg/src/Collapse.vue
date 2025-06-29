<template>
    <div class="collapse" :class="show ? 'show' : 'hide'">
        <div class="loading-box" v-if="loading">
            <div class="loading-inner">
                <a-spin size="small" :indicator="indicator" />
            </div>
        </div>
        <div class="cell" :class="item.isReaded == 0 ? 'unread' : ''" @click="expand(item)">
            <div class="left">
                <div class="badge"></div>
                <div class="text">
                    {{ item.title }}
                </div>
            </div>
            <div class="right">
                <div class="time">
                    {{ item.sendTime }}
                </div>
                <div class="icon">
                    <i class="nav-icon iconfont icon-xiala"></i>
                </div>
            </div>
        </div>
        <div class="content_box" :class="show ? 'show' : 'hide'">
            <div style="margin: 10px">
                <div v-if="orderInfo">
                    <div class="item" v-if="'items' in orderInfo">
                        <div class="product_info" v-for="info in orderInfo.items">
                            <div class="info">
                                <Image width="60" :src="imageFormat(info.picThumb)" fit="contain" />
                                <p>{{ info.productName }}</p>
                            </div>
                            <div class="txt">
                                <p>¥{{ info.price }}</p>
                                <p>x {{ info.quantity }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="money_box" v-if="'totalAmount' in orderInfo">
                        <div>
                            订单金额：¥{{ orderInfo.totalAmount }} <span>(含运费：{{ orderInfo.shippingFee }})</span>
                        </div>
                    </div>
                    <div class="more">
                        <DetailBtn :item="item" :orderSn="orderInfo.orderSn" />
                    </div>
                </div>
                <div v-else>
                    <div class="item" v-html="item.content"></div>
                    <div class="more">
                        <DetailBtn :item="item" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Image } from "@/components/image";
import { imageFormat } from "@/utils/format";
import { ref } from "vue";
import { getAdminMsgSetReaded } from "@/api/panel/adminMsg";
import { useRouter } from "vue-router";
import { getOrder } from "@/api/order/order";
import DetailBtn from "./DetailBtn.vue";
import { OrderFormState } from "@/types/order/order.d";
import { getAftersales } from "@/api/order/aftersales";
import { message } from "ant-design-vue";
import { LoadingOutlined } from "@ant-design/icons-vue";
import { FormState } from "@/types/order/aftersales";
import { h } from "vue";
const indicator = h(LoadingOutlined, {
    spin: true
});
const loading = ref(false);
const router = useRouter();
const props = defineProps({
    item: { type: Object, default: {} }
});
const emit = defineEmits(["setReadedCallback", "close"]);
const show = ref(false);
const isUnread = ref(true);
const orderInfo = ref<OrderFormState | FormState>();
const expand = async (item: any) => {
    if (!item.isReaded) {
        await getAdminMsgSetReaded({ msgId: item.msgId });
        item.isReaded = 1;
        emit("setReadedCallback", true);
    }
    if (!show.value && item.relatedData.aftersaleId) {
        await fetchAftersale(item.relatedData.aftersaleId);
        return;
    }
    if (!show.value && item.relatedData.orderId) {
        await fetchOrder(item.relatedData.orderId);
        return;
    }
    show.value = !show.value;
    isUnread.value = false;
};
const fetchOrder = async (id: number) => {
    loading.value = true;
    try {
        const result = await getOrder("detail", { id });
        orderInfo.value = result;
        show.value = true;
    } catch (error: any) {
        message.error(error.message);
        emit("close");
    } finally {
        loading.value = false;
    }
};
const fetchAftersale = async (id: number) => {
    loading.value = true;
    try {
        const result = await getAftersales("detail", { id });
        orderInfo.value = result;
        show.value = true;
    } catch (error: any) {
        message.error(error.message);
        emit("close");
    } finally {
        loading.value = false;
    }
};
</script>

<style lang="less" scoped>
.collapse {
    position: relative;
    .loading-box {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.04);
        .loading-inner {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding-left: 3px;
        }
    }
    .cell {
        border: 1px solid rgba(0, 0, 0, 0.15);
        margin-top: 10px;
        position: relative;
        background: rgba(0, 0, 0, 0.04);
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        line-height: 30px;

        .left {
            display: flex;
            align-items: center;
            .badge {
                background: rgba(0, 0, 0, 0);
                width: 5px;
                height: 5px;
                border-radius: 100px;
                margin: 0 8px;
            }
            .text {
                width: 410px;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: normal;
            }
        }
        .right {
            display: flex;
            align-items: center;
            .time {
                font-size: 12px;
                color: rgba(0, 0, 0, 0.45);
            }
            .icon {
                i {
                    display: inline-block;
                    color: #bbb;
                    font-size: 22px;
                    line-height: 26px;
                    margin-right: 10px;
                    margin-top: 3px;
                }
            }
        }
    }
    .unread {
        background: #fff;
        .left {
            .badge {
                background-color: #fa4350;
            }
        }
    }
    .content_box {
        max-height: 0;
        overflow: hidden;
        transition: all 0.4s;
        line-height: 22px;
        border: 1px solid rgba(0, 0, 0, 0);
        border-top: none;
        .more {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            cursor: pointer;
            color: var(--tig-primary);
            .iconfont-admin {
                font-size: 12px;
            }
        }
        .product_info {
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #eee;
            &:last-child {
                border: none;
            }
            .info {
                display: flex;
                width: 85%;
                p {
                    margin-top: 10px;
                    margin-left: 5px;
                }
            }
            .txt {
                text-align: end;
            }
        }
        .money_box {
            font-size: 13px;
            text-align: end;
            span {
                color: #999;
            }
        }
    }
}
.show {
    .cell {
        background: rgba(0, 0, 0, 0.04);
        .left {
            .badge {
                background: rgba(0, 0, 0, 0);
            }
        }
        .right {
            .icon {
                i {
                    transform: rotate(-180deg);
                    transition: transform ease 0.4s;
                }
            }
        }
    }
    .content_box {
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-top: none;
        max-height: 1000px;
    }
}
.hide {
    .cell {
        .right {
            .icon {
                i {
                    transform: rotate(0deg);
                    transition: transform ease 0.4s;
                }
            }
        }
    }
}
@media only screen and (max-width: 767px) {
    .collapse .cell {
        padding: 10px 0;
    }
    .collapse .cell .left .text {
        width: auto;
        -webkit-line-clamp: inherit;
    }
    .collapse .cell .right .time {
        text-align: right;
    }
}
</style>
