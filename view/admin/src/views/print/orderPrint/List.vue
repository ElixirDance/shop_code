<template>
    <div class="container" v-for="order in formState">
        <div class="order-info">
            <ul>
                <li class="item">
                    <div class="label">
                        购 货 人：
                    </div>
                    <div class="value">
                        {{ order.user.username || '-' }}
                    </div>
                </li>
                <li class="item">
                    <div class="label">
                        付款时间：
                    </div>
                    <div class="value">
                        {{ order.payTime || '-' }}
                    </div>
                </li>
            </ul>
            <ul>
                <li class="item">
                    <div class="label">
                        下单时间：
                    </div>
                    <div class="value">
                        {{ order.addTime || '-' }}
                    </div>
                </li>
                <li class="item">
                    <div class="label">
                        发货时间：
                    </div>
                    <div class="value">
                        {{ order.shippingTime || '-' }}
                    </div>
                </li>
            </ul>
            <ul>
                <li class="item">
                    <div class="label">
                        支付方式：
                    </div>
                    <div class="value">
                        {{ order.payTypeId === 1 ? "在线支付" : order.payTypeId === 2 ? "货到付款" : "线下支付" }}
                    </div>
                </li>
                <li class="item">
                    <div class="label">
                        配送方式：
                    </div>
                    <div class="value">
                        {{ order.shippingTypeName || '-' }}
                    </div>
                </li>
            </ul>
            <ul>
                <li class="item">
                    <div class="label">
                        订单编号：
                    </div>
                    <div class="value">
                        {{ order.orderSn || '-' }}
                    </div>
                </li>
                <li class="item">
                    <div class="label">
                        发货单号：
                    </div>
                    <div class="value">
                        {{ order.trackingNo || '-' }}
                    </div>
                </li>
            </ul>
        </div>
        <div class="order-info">
            <ul>
                <li class="item">
                    <div class="label">
                        收货地址：
                    </div>
                    <div class="value">
                        {{ order.userAddress || '-' }}
                    </div>
                    <div class="label">
                        收货人：
                    </div>
                    <div class="value">
                        {{ order.consignee || '-' }}
                    </div>
                    <div class="label">
                        手机：
                    </div>
                    <div class="value">
                        {{ order.mobile || '-' }}
                    </div>
                    <div class="label">
                        订单来源：
                    </div>
                    <div class="value">
                        {{ order.orderSource || '-' }}
                    </div>
                    <div class="label" v-if="order.shop && order.shop.shopTitle">
                        下单店铺：
                    </div>
                    <div class="value" v-if="order.shop && order.shop.shopTitle">
                        {{ order.shop.shopTitle || '-' }}
                    </div>
                </li>
            </ul>
        </div>
        <table border="1">
            <tbody>
                <tr align="center" class="firstRow">
                    <td align="center">
                        <span>编号</span>
                    </td>
                    <td align="center">
                        <span>商品名称</span>
                    </td>
                    <td align="center">
                        <span>商品编号</span>
                    </td>
                    <td align="center">
                        <span>商品货号</span>
                    </td>
                    <td align="center">
                        <span>商品属性</span>
                    </td>
                    <td align="center">
                        <span>价格 </span>
                    </td>
                    <td align="center">
                        <span>数量</span>
                    </td>
                    <td align="center">
                        <span>小计</span>
                    </td>
                </tr>
                <tr v-for="(item,index) in order.items">
                    <td align="center">
                        {{ index + 1 }}
                    </td>
                    <td>
                        <span>&nbsp;{{ item.productName }}</span>
                    </td>
                    <td align="center">
                        <span>{{ item.productSn }} </span>
                    </td>
                    <td align="center">
                        <span style="font-size: 12px;">
                            {{ item.skuSn || '-' }}
                        </span>
                    </td>
                    <td align="center">
                        <span>
                            {{ item.skuValue || '无属性' }}
                        </span>
                    </td>
                    <td align="center">
                        <span style="font-weight: 700;">
                            {{ priceFormat(item.price) }}
                        </span>
                    </td>
                    <td align="center">
                        <span>{{ item.quantity }}</span>
                    </td>
                    <td align="center">
                        <span style="font-weight: 700;">
                            {{ priceFormat(item.subtotal) }}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: right;" colspan="9">
                        商品总金额：
                        <span style="padding-right: 10px;font-weight: 700;">
                            {{ priceFormat(order.productAmount) }}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="total_num">
            <p>+ 商品总金额: <span style="font-weight: 700;">{{ priceFormat(order.productAmount) }}</span> + 订单运费: <span style="font-weight: 700;">{{ priceFormat(order.shippingFee) }}</span> + 附加费用: <span style="font-weight: 700;">{{ priceFormat(order.serviceFee) }}</span> - 优惠券: <span style="font-weight: 700;">{{ priceFormat(order.couponAmount) }}</span></p>
            <p>= 订单总金额: <span style="font-weight: 700;">{{ priceFormat(order.totalAmount) }}</span></p>
        </div>
        <div class="tips">
            {{ order.shopName }} {{ order.host }} 打印时间：{{ order.printTime }}
        </div>
    </div>
</template>

<script setup lang="ts">
import '@/style/css/list.less'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue'
import { priceFormat } from "@/utils/format";
import { OrderPrintFormResult } from '@/types/order/order.d';
import { getOrderPrint } from "@/api/order/order";
const query = useRouter().currentRoute.value.query;
// 基本参数定义
const loading = ref<boolean>(true);
const formState = ref<OrderPrintFormResult[]>([])
// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getOrderPrint({ids: query.ids});
        formState.value = result;
    } catch (error:any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
}
onMounted(() => {
    loadFilter();
});
const geTel = (tel:any) => {
    if(tel){
        var reg = /^(\d{3})\d{4}(\d{4})$/;  
        return tel.replace(reg, "$1****$2")
    }
}
</script>
<style>
@page {
    size: 420mm 594mm;
}
</style>
<style scoped lang="less">
.container{
    padding: 15px;
}
.order-info {
    display: flex;
    justify-content: space-between;
    padding-right: 15%;
    ul {
        .item {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            .label {
                font-size: 12px;
                font-weight: 700;
            }
            .value {
                margin-right: 20px;
            }
        }
    }

}
table{
    width: 100%;
    border-color: #000 !important;
    border-collapse:collapse;
    tr,td{
        height: 40px;line-height: 40px;
        border-color: #000 !important;
    }
    .firstRow{
        td{
            background-color: #f1f1f1;
        }
    }
}
.total_num{
    padding: 10px 5px;
    padding-bottom: 20px;
    text-align: right;
    line-height: 20px;
    border-bottom: 1px solid #f1f1f1;
}
.tips{
    padding-top: 40px;
    text-align: center;
}
</style>
