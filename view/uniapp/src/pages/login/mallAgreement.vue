<template>
    <tig-layout title="用户服务协议">
        <view class="mall-agreement">
            <view class="mall-agreement-item">
                <view class="mall-agreement-item-title"> 第一条 用户注册与账号管理 </view>
                <view class="mall-agreement-item-content">
                    <text class="mall-agreement-item-text">
                        1.1 用户承诺在注册时提供真实、有效的个人信息，并保持信息的及时更新。平台有权对用户信息进行审核，必要时要求用户提供额外的身份验证资料。
                    </text>
                    <text> 1.2 用户对其账号及密码的安全负全部责任，任何通过其账号进行的操作均视为用户本人行为。如发现账号被盗用，应立即通知平台。 </text>
                </view>
            </view>
            <view class="mall-agreement-item">
                <view class="mall-agreement-item-title"> 第二条 商品信息与交易 </view>
                <view class="mall-agreement-item-content">
                    <text class="mall-agreement-item-text">
                        2.1 平台展示的商品信息包括价格、规格、库存等，均以购买时网站公布的为准。商品图片仅供参考，以实物为准。
                    </text>
                    <text> 2.2 用户下单即视为同意购买，应按照平台指示完成支付。平台保留取消异常订单的权利。 </text>
                </view>
            </view>
            <view class="mall-agreement-item">
                <view class="mall-agreement-item-title"> 第三条 支付与退款 </view>
                <view class="mall-agreement-item-content">
                    <text class="mall-agreement-item-text"> 3.1 平台支持多种支付方式，用户应确保支付账户的合法性和有效性。 </text>
                    <text> 3.2 如需退款，用户需通过平台规定的流程申请，退款将退至原支付渠道。具体退款政策依据商品类别和促销活动可能有所不同。 </text>
                </view>
            </view>
            <view class="mall-agreement-item">
                <view class="mall-agreement-item-title"> 第四条 配送与收货 </view>
                <view class="mall-agreement-item-content">
                    <text class="mall-agreement-item-text">
                        4.1 平台将按照用户选择的配送方式安排发货。配送时间受物流状况影响，平台不承担因物流延误造成的损失。
                    </text>
                    <text> 4.2 用户应在收货时当场验货，如有问题应及时联系平台客服。 </text>
                </view>
            </view>
            <view class="mall-agreement-item">
                <view class="mall-agreement-item-title"> 第五条 售后服务</view>
                <view class="mall-agreement-item-content">
                    <text class="mall-agreement-item-text"> 5.1 用户享有商品退换货权利，具体依据国家法律法规及平台退换货政策执行。 </text>
                    <text> 5.2 对于商品质量问题，用户需在规定时间内提出，并提供相应证据。 </text>
                </view>
            </view>
            <view class="mall-agreement-item">
                <view class="mall-agreement-item-title"> 第六条 知识产权</view>
                <view class="mall-agreement-item-content">
                    <text class="mall-agreement-item-text">
                        6.1 平台上所有内容，包括但不限于文字、图像、商标等，均受知识产权法律保护，未经许可，不得擅自使用。
                    </text>
                </view>
            </view>
            <view class="mall-agreement-item">
                <view class="mall-agreement-item-title"> 第七条 责任限制 </view>
                <view class="mall-agreement-item-content">
                    <text class="mall-agreement-item-text"> 7.1 除法律规定或本协议明确约定外，平台不对任何间接、偶然、特殊或后果性的损害承担责任。 </text>
                </view>
            </view>
            <view class="mall-agreement-item">
                <view class="mall-agreement-item-title"> 第八条 争议解决 </view>
                <view class="mall-agreement-item-content">
                    <text class="mall-agreement-item-text"> 8.1 本协议的解释、效力及纠纷解决，适用中华人民共和国法律。 </text>
                    <text>
                        8.2 因本协议引起的或与本协议有关的任何争议，双方应首先通过友好协商解决；协商不成时，可提交平台所在地有管辖权的人民法院诉讼解决。
                    </text>
                </view>
            </view>
            <view class="mall-agreement-item">
                <view class="mall-agreement-item-title"> 第九条 协议变更与通知 </view>
                <view class="mall-agreement-item-content">
                    <text class="mall-agreement-item-text">
                        9.1 平台有权根据需要不时修改本协议，修改后的协议将在平台上公告，用户继续使用服务即视为接受修改内容。
                    </text>
                    <text> 9.2 重要通知将以网站公告、电子邮件、站内信等形式送达用户。 </text>
                </view>
            </view>
            <view class="mall-agreement-item">
                <view class="mall-agreement-item-title"> 第十条 其他 </view>
                <view class="mall-agreement-item-content">
                    <text class="mall-agreement-item-text">
                        10.1 本协议构成双方就本服务之全部协议，并取代双方之前就该等事项作出的任何口头或书面的沟通、声明或协议。
                    </text>
                    <text> 10.2 如本协议中任何条款被认定为无效或不可执行，不影响其他条款的效力。 </text>
                </view>
            </view>
        </view>
    </tig-layout>
</template>

<script setup lang="ts"></script>

<style>
page {
    background-color: #fff;
}
</style>

<style lang="scss" scoped>
.mall-agreement {
    padding: 20rpx;

    .mall-agreement-item {
        padding-bottom: 20rpx;

        .mall-agreement-item-title {
            font-size: 30rpx;
            font-weight: bold;
            padding-bottom: 20rpx;
        }

        .mall-agreement-item-content {
            font-size: 28rpx;
            color: #666;
            line-height: 45rpx;
            .mall-agreement-item-text {
                display: block;
                padding-bottom: 10rpx;
            }
        }
    }
}
</style>
