import { createRouter, createWebHistory } from "vue-router";
import { processRoutes } from "@/utils/authorize";
const { VITE_BASE_DIR } = import.meta.env;
import NotFound from "@/layouts/blank/blank.vue";
// 白名单应该包含基本静态路由
const WHITE_NAME_LIST: string[] = [];
const router = createRouter({
    history: createWebHistory(VITE_BASE_DIR ?? ""),
    routes: [
        {
            path: "/",
            name: "index",
            meta: { title: "首页" },
            redirect: "/panel/index",
            children: [
                {
                    path: "panel",
                    name: "panel",
                    redirect: "/panel/index",
                    component: () => import("@/layouts/base/index.vue"),
                    meta: { title: "面板" },
                    children: [
                        {
                            path: "index",
                            name: "consoleManage",
                            meta: { title: "控制台" },
                            component: () => import("@/views/panel/Index.vue")
                        },
                        {
                            path: "statistics_order/list/",
                            name: "statisticsOrder",
                            meta: { title: "销售统计" },
                            component: () => import("@/views/panel/statisticsOrder/List.vue")
                        },
                        {
                            path: "statistics_sale/list/",
                            name: "statisticsSale",
                            meta: { title: "销售明细" },
                            component: () => import("@/views/panel/statisticsSale/List.vue")
                        },
                        {
                            path: "sale_targets/list/",
                            name: "saleTargets",
                            meta: { title: "销售指标" },
                            component: () => import("@/views/panel/saleTargets/List.vue")
                        },
                        {
                            path: "statistics_goods/list/",
                            name: "statisticsGoods",
                            meta: { title: "销售排行" },
                            component: () => import("@/views/panel/statisticsGoods/List.vue")
                        },
                        {
                            path: "statistics_user/list/",
                            name: "statisticsUser",
                            meta: { title: "用户统计" },
                            component: () => import("@/views/panel/statisticsUser/List.vue")
                        },
                        {
                            path: "statistics_access/list/",
                            name: "statisticsAccess",
                            meta: { title: "访问统计" },
                            component: () => import("@/views/panel/statisticsAccess/List.vue")
                        },
                        {
                            path: "consumer_ranking/list/",
                            name: "consumerRanking",
                            meta: { title: "消费排行" },
                            component: () => import("@/views/panel/consumerRanking/List.vue")
                        },
                        {
                            path: "new_members/list/",
                            name: "newMembers",
                            meta: { title: "新增会员" },
                            component: () => import("@/views/panel/newMembers/List.vue")
                        },
                        {
                            path: "/:pathMatch(.*)",
                            meta: { is404: true },
                            component: NotFound
                        }
                    ]
                },
                {
                    path: "promotion",
                    name: "promotion",
                    redirect: "/promotion/manage/list",
                    component: () => import("@/layouts/base/index.vue"),
                    meta: { title: "营销" },
                    children: [
                        {
                            path: "manage/list",
                            name: "promotionManage",
                            meta: { title: "营销管理" },
                            component: () => import("@/views/promotion/manage/List.vue")
                        },
                        {
                            path: "coupon/list",
                            name: "couponManage",
                            meta: { title: "优惠券列表" },
                            component: () => import("@/views/promotion/coupon/List.vue")
                        },
                        {
                            path: "seckill/list",
                            name: "seckillManage",
                            meta: { title: "限时秒杀列表" },
                            component: () => import("@/views/promotion/seckill/List.vue")
                        },
                        // {
                        //     path: "product_activity/list",
                        //     name: "productActivityManage",
                        //     meta: { title: "优惠活动列表" },
                        //     component: () => import("@/views/promotion/productActivity/List.vue")
                        // },
                        {
                            path: "points_exchange/list",
                            name: "pointsExchangeManage",
                            meta: { title: "积分商品列表" },
                            component: () => import("@/views/promotion/pointsExchange/List.vue")
                        },
                        {
                            path: "sign_in_setting/list",
                            name: "signInSettingManage",
                            meta: { title: "签到设置列表" },
                            component: () => import("@/views/promotion/signInSetting/List.vue")
                        },
                        {
                            path: "recharge_setting/list",
                            name: "rechargeSettingManage",
                            meta: { title: "充值余额列表" },
                            component: () => import("@/views/promotion/rechargeSetting/List.vue")
                        },
                        {
                            path: "full_reduction/list",
                            name: "fullReductionManage",
                            meta: { title: "满减活动" },
                            component: () => import("@/views/promotion/productActivity/fullReduction/List.vue")
                        },
                        {
                            path: "reward_gift/list",
                            name: "rewardGiftManage",
                            meta: { title: "满赠活动" },
                            component: () => import("@/views/promotion/productActivity/rewardGift/List.vue")
                        },
                        {
                            path: "limitdiscount_gift/list",
                            name: "limitdiscountManage",
                            meta: { title: "限时折扣" },
                            component: () => import("@/views/promotion/productActivity/limitdiscount/List.vue")
                        },
                        {
                            path: "product_gift/list",
                            name: "productGiftManage",
                            meta: { title: "活动赠品" },
                            component: () => import("@/views/promotion/productGift/List.vue")
                        },
                        {
                            path: "live/list",
                            name: "liveManage",
                            meta: { title: "微信直播" },
                            component: () => import("@/views/promotion/live/List.vue")
                        },
                        {
                            path: "e_card/list",
                            name: "eCardManage",
                            meta: { title: "电子卡券组" },
                            component: () => import("@/views/promotion/eCard/List.vue")
                        }
                    ]
                },
                {
                    path: "finance",
                    name: "finance",
                    redirect: "/finance/account_panel/list",
                    component: () => import("@/layouts/base/index.vue"),
                    meta: { title: "财务" },
                    children: [
                        {
                            path: "account_panel/list",
                            name: "accountPanelManage",
                            meta: { title: "账户总览" },
                            component: () => import("@/views/finance/accountPanel/List.vue")
                        },
                        {
                            path: "user_withdraw_apply/list",
                            name: "userWithdrawApplyManage",
                            meta: { title: "提现申请" },
                            component: () => import("@/views/finance/userWithdrawApply/List.vue")
                        },
                        {
                            path: "user_recharge_order/list",
                            name: "userRechargeOrderManage",
                            meta: { title: "充值记录" },
                            component: () => import("@/views/finance/userRechargeOrder/List.vue")
                        },
                        {
                            path: "user_balance_log/list",
                            name: "userBalanceLogManage",
                            meta: { title: "余额日志" },
                            component: () => import("@/views/finance/userBalanceLog/List.vue")
                        },
                        {
                            path: "",
                            name: "userInvoice",
                            meta: { title: "发票管理" },
                            redirect: "/finance/user_invoice/list/",
                            children: [
                                {
                                    path: "user_invoice/list/",
                                    name: "userInvoiceManage",
                                    meta: { title: "发票资质管理" },
                                    component: () => import("@/views/finance/userInvoice/List.vue")
                                },
                                {
                                    path: "order_invoice/list/",
                                    name: "orderInvoiceManage",
                                    meta: { title: "发票申请" },
                                    component: () => import("@/views/finance/orderInvoice/List.vue")
                                },
                            ]
                        },
                        {
                            path: "refund_apply/list",
                            name: "refundApplyManage",
                            meta: { title: "退款申请" },
                            component: () => import("@/views/finance/refundApply/List.vue")
                        },
                        {
                            path: "refund_log/list",
                            name: "refundLogManage",
                            meta: { title: "退款记录" },
                            component: () => import("@/views/finance/refundLog/List.vue")
                        },
                        {
                            path: "paylog/list",
                            name: "payLogManage",
                            meta: { title: "交易日志" },
                            component: () => import("@/views/finance/payLog/List.vue")
                        }
                    ]
                },
                {
                    path: "adminMerchant",
                    name: "adminMerchant",
                    redirect: "/adminMerchant/apply/list",
                    component: () => import("@/layouts/base/index.vue"),
                    meta: { title: "商户" },
                    children: [
                        {
                            path: "apply/list",
                            name: "applyManage",
                            meta: { title: "入驻申请" },
                            component: () => import("@/views/adminMerchant/apply/List.vue")
                        },
                        {
                            path: "list",
                            name: "adminMerchantManage",
                            meta: { title: "商户管理" },
                            component: () => import("@/views/adminMerchant/merchant/List.vue")
                        },
                        {
                            path: "merchantSettings/info",
                            name: "adminMerchantSettingsManage",
                            meta: { title: "商户设置" },
                            component: () => import("@/views/adminMerchant/merchantSettings/Info.vue")
                        },
                        {
                            path: "investment",
                            name: "investmentManage",
                            meta: { title: "招商内容" },
                            component: () => import("@/views/adminMerchant/investment/Info.vue")
                        }
                    ]
                },
                {
                    path: "order",
                    name: "order",
                    redirect: "/order/list",
                    component: () => import("@/layouts/base/index.vue"),
                    meta: { title: "订单" },
                    children: [
                        {
                            path: "list",
                            name: "orderManage",
                            meta: { title: "订单列表" },
                            component: () => import("@/views/order/order/List.vue")
                        },
                        {
                            path: "info",
                            name: "orderInfoManage",
                            meta: { title: "订单详情" },
                            component: () => import("@/views/order/order/Info.vue")
                        },
                        {
                            path: "exchange_order/list",
                            name: "exchangeOrderManage",
                            meta: { title: "积分订单", queryParam: "isExchangeOrder" },
                            component: () => import("@/views/order/orderExchange/List.vue")
                        },
                        // {
                        //     path: '/order/add',
                        //     name: 'add_order',
                        //     meta: { title: '代会员下单' },
                        //     component: () => import('@/views/addOrder/List.vue'),
                        // },
                        {
                            path: "aftersales/list",
                            name: "aftersalesManage",
                            meta: { title: "售后申请" },
                            component: () => import("@/views/order/aftersales/List.vue")
                        },
                        {
                            path: "order_export/list",
                            name: "orderExportManage",
                            meta: { title: "订单导出" },
                            component: () => import("@/views/order/orderExport/List.vue")
                        }
                    ]
                },
                {
                    path: "shop",
                    name: "shop",
                    redirect: "/shop/list",
                    component: () => import("@/layouts/base/index.vue"),
                    meta: { title: "店铺" },
                    children: [
                        {
                            path: "list",
                            name: "shopManage",
                            meta: { title: "店铺管理" },
                            component: () => import("@/views/shop/shop/List.vue")
                        },
                        {
                            path: "shopAccount/list",
                            name: "shopAccountManage",
                            meta: { title: "资金概览" },
                            component: () => import("@/views/shop/account/List.vue")
                        },
                        {
                            path: "shopFunds/list",
                            name: "shopFundsManage",
                            meta: { title: "店铺资金" },
                            component: () => import("@/views/shop/shopFunds/List.vue")
                        },
                        {
                            path: "financialLog/list",
                            name: "financialLogManage",
                            meta: { title: "资金日志" },
                            component: () => import("@/views/shop/financialLog/List.vue")
                        },
                        {
                            path: "shopAccountRaply/list",
                            name: "shopAccountRaplyManage",
                            meta: { title: "店铺提现申请列表" },
                            component: () => import("@/views/shop/shopAccountRaply/List.vue")
                        },
                        {
                            path: "shopSettings/info",
                            name: "shopSettingsManage",
                            meta: { title: "店铺设置" },
                            component: () => import("@/views/shop/shopSettings/Info.vue")
                        }
                    ]
                },
                {
                    path: "capitalfund",
                    name: "capitalfund",
                    redirect: "/capitalfund/dashboard/index",
                    component: () => import("@/layouts/base/index.vue"),
                    meta: { title: "资产" },
                    children: [
                        {
                            path: "dashboard/index",
                            name: "dashboardManage",
                            meta: { title: "资产总览" },
                            component: () => import("@/views/merchant/capitalfund/dashboard/Index.vue")
                        },
                        {
                            path: "account/list",
                            name: "accountManage",
                            meta: { title: "账户列表" },
                            component: () => import("@/views/merchant/capitalfund/account/List.vue")
                        },
                        {
                            path: "balance/list",
                            name: "balanceManage",
                            meta: { title: "店铺余额" },
                            component: () => import("@/views/merchant/capitalfund/balance/List.vue")
                        },
                        {
                            path: "withdraw/index",
                            name: "withdrawManage",
                            meta: { title: "提现" },
                            component: () => import("@/views/merchant/capitalfund/withdraw/Index.vue")
                        }
                    ]
                },
                {
                    path: "user",
                    name: "user",
                    redirect: "/user/list",
                    component: () => import("@/layouts/base/index.vue"),
                    meta: { title: "会员" },
                    children: [
                        {
                            path: "list",
                            name: "userManage",
                            meta: { title: "会员列表" },
                            component: () => import("@/views/user/user/List.vue")
                        },
                        {
                            path: "level_manage/list",
                            name: "levelManageManage",
                            meta: { title: "会员等级设置" },
                            component: () => import("@/views/user/levelManage/List.vue")
                        },
                        {
                            path: "level_manage_pro/list",
                            name: "userLevelProManage",
                            meta: { title: "会员等级设置" },
                            component: () => import("@/views/user/levelManagePro/List.vue")
                        },
                        {
                            path: "",
                            name: "userRight",
                            meta: { title: "会员权益" },
                            redirect: "/user/list",
                            children: [
                                {
                                    path: "user_type/list",
                                    name: "userTypeManage",
                                    meta: { title: "会员类型" },
                                    component: () => import("@/views/user/userType/List.vue")
                                },
                                {
                                    path: "user_right/list",
                                    name: "userRightManage",
                                    meta: { title: "会员权益" },
                                    component: () => import("@/views/user/userRight/List.vue")
                                },
                                {
                                    path: "agreement/list/",
                                    name: "agreementManage",
                                    meta: { title: "会员协议" },
                                    component: () => import("@/views/user/agreement/List.vue")
                                }
                            ]
                        },
                        {
                            path: "feedback/list",
                            name: "feedbackManage",
                            meta: { title: "会员留言" },
                            component: () => import("@/views/user/feedback/List.vue")
                        },
                        {
                            path: "message_log/list",
                            name: "messageLogManage",
                            meta: { title: "站内信" },
                            component: () => import("@/views/user/messageLog/List.vue")
                        },
                        {
                            path: "push_log/list",
                            name: "pushLogManage",
                            meta: { title: "APP消息推送" },
                            component: () => import("@/views/user/pushLog/List.vue")
                        },
                        {
                            path: "integral_log/list",
                            name: "integralLogManage",
                            meta: { title: "积分日志" },
                            component: () => import("@/views/user/integralLog/List.vue")
                        },
                        {
                            path: "user_certification/list",
                            name: "userCertificationManage",
                            meta: { title: "会员实名认证" },
                            component: () => import("@/views/user/userCertification/List.vue")
                        }
                    ]
                },
                {
                    path: "setting",
                    name: "setting",
                    redirect: "/setting/config/base",
                    component: () => import("@/layouts/base/index.vue"),
                    meta: { title: "设置" },
                    children: [
                        {
                            path: "config",
                            name: "config",
                            meta: { title: "系统设置" },
                            children: [
                                // {
                                //     path: "base",
                                //     name: "configManage",
                                //     meta: { title: "商城设置" },
                                //     component: () => import("@/views/setting/config/Base.vue")
                                // },
                                {
                                    path: "base",
                                    name: "configManage",
                                    meta: { title: "商城设置" },
                                    redirect: "/setting/config/base/base-basic",
                                    component: () => import("@/views/setting/config/base/Index.vue"),
                                    children: [
                                        {
                                            path: "base-basic",
                                            meta: { title: "基础设置" },
                                            component: () => import("@/views/setting/config/base/src/BasicSettings.vue")
                                        },
                                        {
                                            path: "base-product",
                                            meta: { title: "商品设置" },
                                            component: () => import("@/views/setting/config/base/src/ProductSettings.vue")
                                        },
                                        {
                                            path: "base-shopping",
                                            meta: { title: "购物设置" },
                                            component: () => import("@/views/setting/config/base/src/ShoppingSettings.vue")
                                        },
                                        {
                                            path: "base-notice",
                                            meta: { title: "通知设置" },
                                            component: () => import("@/views/setting/config/base/src/NoticeSettings.vue")
                                        },
                                        {
                                            path: "base-indicate",
                                            meta: { title: "显示设置" },
                                            component: () => import("@/views/setting/config/base/src/IndicateSettings.vue")
                                        },
                                        {
                                            path: "base-service",
                                            meta: { title: "客服设置" },
                                            component: () => import("@/views/setting/config/base/src/ServiceSettings.vue")
                                        },
                                        {
                                            path: "base-interface",
                                            meta: { title: "接口设置" },
                                            component: () => import("@/views/setting/config/base/src/InterfactSettings.vue")
                                        },
                                        {
                                            path: "base-authentication",
                                            meta: { title: "认证设置" },
                                            component: () => import("@/views/setting/config//base/src/AuthenticationSettings.vue")
                                        }
                                    ]
                                },
                                {
                                    path: "mail",
                                    name: "mailManage",
                                    meta: { title: "邮箱服务器设置" },
                                    component: () => import("@/views/setting/config/Mail.vue")
                                },
                                {
                                    path: "after_sales_service",
                                    name: "AfterSalesServiceManage",
                                    meta: { title: "售后服务设置" },
                                    component: () => import("@/views/setting/config/AfterSalesService.vue")
                                },
                                {
                                    path: "mail_template",
                                    name: "mailTemplateManage",
                                    meta: { title: "邮箱模板设置" },
                                    component: () => import("@/views/setting/config/MailTemplate.vue")
                                },
                                {
                                    path: "message_type/list",
                                    name: "messageTypeManage",
                                    meta: { title: "消息设置" },
                                    component: () => import("@/views/setting/config/messageType/List.vue")
                                },
                                {
                                    path: "payment",
                                    name: "paymentManage",
                                    meta: { title: "支付设置" },
                                    component: () => import("@/views/setting/config/Payment.vue")
                                },
                                {
                                    path: "logistics",
                                    name: "logisticsManage",
                                    meta: { title: "物流设置" },
                                    component: () => import("@/views/setting/config/BaseLogistics.vue")
                                }
                            ]
                        },
                        {
                            path: "shipping",
                            name: "shipping",
                            meta: { title: "配送/运费设置" },
                            children: [
                                {
                                    path: "logistics_company/list",
                                    name: "logisticsCompanyManage",
                                    meta: { title: "物流公司" },
                                    component: () => import("@/views/setting/logisticsCompany/List.vue")
                                },
                                {
                                    path: "shipping_type/list",
                                    name: "shippingTypeManage",
                                    meta: { title: "配送类型" },
                                    component: () => import("@/views/setting/shippingType/List.vue")
                                },
                                {
                                    path: "shipping_tpl/list",
                                    name: "shippingTplManage",
                                    meta: { title: "运费模板" },
                                    component: () => import("@/views/setting/shippingTpl/List.vue")
                                }
                            ]
                        },
                        {
                            path: "region/list",
                            name: "regionManage",
                            meta: { title: "地区列表" },
                            component: () => import("@/views/setting/region/List.vue")
                        },
                        {
                            path: "friend_links/list",
                            name: "friendLinksManage",
                            meta: { title: "友情链接" },
                            component: () => import("@/views/setting/friendLinks/List.vue")
                        },
                        {
                            path: "app_version/list",
                            name: "appVersionManage",
                            meta: { title: "APP版本" },
                            component: () => import("@/views/setting/appVersion/List.vue")
                        },
                        {
                            path: "licensed/index",
                            name: "licensed",
                            meta: { title: "授权管理" },
                            component: () => import("@/views/setting/licensed/Index.vue")
                        },
                        {
                            path: "multilingual",
                            name: "multilingual",
                            meta: { title: "多语言设置" },
                            children: [
                                {
                                    path: "languagesList/list",
                                    name: "languagesListManage",
                                    meta: { title: "语言列表" },
                                    component: () => import("@/views/setting/multilingual/languagesList/List.vue")
                                },
                                {
                                    path: "verbalAssociation/list",
                                    name: "verbalAssociationManage",
                                    meta: { title: "语言关联" },
                                    component: () => import("@/views/setting/multilingual/verbalAssociation/List.vue")
                                },
                                {
                                    path: "translationContent/list",
                                    name: "translationContentManage",
                                    meta: { title: "翻译内容" },
                                    component: () => import("@/views/setting/multilingual/translationContent/List.vue")
                                },
                                {
                                    path: "currencyManagement/list",
                                    name: "currencyManagementManage",
                                    meta: { title: "币种管理" },
                                    component: () => import("@/views/setting/multilingual/currencyManagement/List.vue")
                                },
                                {
                                    path: "areaCode/list",
                                    name: "areaCodeManage",
                                    meta: { title: "区号管理" },
                                    component: () => import("@/views/setting/multilingual/areaCode/List.vue")
                                }
                            ]
                        },
                    ]
                },
                {
                    path: "product",
                    name: "product",
                    redirect: "/product/list",
                    component: () => import("@/layouts/base/index.vue"),
                    meta: { title: "商品" },
                    children: [
                        {
                            path: "list",
                            name: "productManage",
                            meta: { title: "商品列表" },
                            component: () => import("@/views/product/product/List.vue")
                        },
                        {
                            path: "brand/list",
                            name: "brandManage",
                            meta: { title: "商品品牌" },
                            component: () => import("@/views/product/brand/List.vue")
                        },
                        {
                            path: "product_group/list",
                            name: "productGroupManage",
                            meta: { title: "商品分组" },
                            component: () => import("@/views/product/productGroup/List.vue")
                        },
                        {
                            path: "category/list",
                            name: "categoryManage",
                            meta: { title: "类目管理" },
                            component: () => import("@/views/product/category/List.vue")
                        },
                        {
                            path: "shop_product_category/list",
                            name: "shopProductCategoryManage",
                            meta: { title: "商品分类" },
                            component: () => import("@/views/product/shopProductCategory/List.vue")
                        },
                        {
                            path: "enquiry/list",
                            name: "enquiryManage",
                            meta: { title: "商品询价" },
                            component: () => import("@/views/product/enquiry/List.vue")
                        },
                        {
                            path: "product_batch",
                            name: "productBatch",
                            meta: { title: "商品批量处理" },
                            children: [
                                {
                                    path: "image/list",
                                    name: "productBatchImageManage",
                                    meta: { title: "图片批量处理" },
                                    component: () => import("@/views/product/productBatch/image/List.vue")
                                },
                                {
                                    path: "export/list",
                                    name: "productBatchExportManage",
                                    meta: { title: "商品批量导出" },
                                    component: () => import("@/views/product/productBatch/export/List.vue")
                                },
                                {
                                    path: "add/list",
                                    name: "productBatchAddManage",
                                    meta: { title: "商品批量上传" },
                                    component: () => import("@/views/product/productBatch/add/List.vue")
                                },
                                {
                                    path: "edit/list",
                                    name: "productBatchEditManage",
                                    meta: { title: "商品批量修改" },
                                    component: () => import("@/views/product/productBatch/edit/List.vue")
                                }
                            ]
                        },
                        {
                            path: "comment/list",
                            name: "commentManage",
                            meta: { title: "商品评论" },
                            component: () => import("@/views/product/comment/List.vue")
                        },
                        {
                            path: "product_services/list",
                            name: "productServicesManage",
                            meta: { title: "商品服务列表" },
                            component: () => import("@/views/product/productServices/List.vue")
                        },
                        {
                            path: "example/list",
                            name: "example",
                            meta: { title: "演示模型" },
                            component: () => import("@/views/product/example/List.vue")
                        },
                        // {
                        //     path: '/product/product_auto/list',
                        //     name: 'productAutoManage',
                        //     meta: { title: '商品自动上下架' },
                        //     component: () => import('@/views/product/productAuto/List.vue'),
                        // },
                        {
                            path: "product_inventory_log/list",
                            name: "productInventoryLogManage",
                            meta: { title: "商品库存日志" },
                            component: () => import("@/views/product/productInventoryLog/List.vue")
                        },
                        {
                            path: "/gallery/list",
                            name: "gallery",
                            meta: { title: "相册" },
                            component: () => import("@/views/gallery/Gallery.vue")
                        },
                        {
                            path: "product_attributes_tpl/list",
                            name: "productAttributesTplManage",
                            meta: { title: "属性模板" },
                            component: () => import("@/views/product/productAttributesTpl/List.vue")
                        }
                    ]
                },
                {
                    path: "decorate",
                    name: "decorate",
                    meta: { title: "装修" },
                    redirect: "/decorate/theme_style/info",
                    component: () => import("@/layouts/base/index.vue"),
                    children: [
                        {
                            path: "theme_style/info",
                            name: "themeStyleManage",
                            meta: { title: "主题风格" },
                            component: () => import("@/views/decorate/themeStyle/Info.vue")
                        },
                        {
                            path: "",
                            name: "mobileDecorate",
                            meta: { title: "移动端装修" },
                            redirect: "/decorate/theme_style/info",
                            children: [
                                {
                                    path: "mobile_decorate/list",
                                    name: "mobileDecorateManage",
                                    meta: { title: "页面管理" },
                                    component: () => import("@/views/decorate/mobileDecorate/List.vue")
                                },
                                {
                                    path: "mobile_cat_nav/list",
                                    name: "mobileCatNavManage",
                                    meta: { title: "首页分类栏" },
                                    component: () => import("@/views/decorate/mobileCatNav/List.vue")
                                },
                                {
                                    path: "mobile_decorate/nav",
                                    name: "mobileNavManage",
                                    meta: { title: "导航栏设置" },
                                    component: () => import("@/views/decorate/mobileDecorate/Nav.vue")
                                },
                                {
                                    path: "mobile_decorate/classify",
                                    name: "classifyManage",
                                    meta: { title: "分类页装修" },
                                    component: () => import("@/views/decorate/mobileDecorate/Classify.vue")
                                },
                                {
                                    path: "mobile_decorate/user",
                                    name: "mobileUserManage",
                                    meta: { title: "会员首页装修" },
                                    component: () => import("@/views/decorate/mobileDecorate/user/User.vue")
                                }
                            ]
                        },
                        {
                            path: "",
                            name: "pcDecorate",
                            meta: { title: "PC端装修" },
                            redirect: "/decorate/theme_style/info",
                            children: [
                                {
                                    path: "pc_decorate/list",
                                    name: "pcDecorateManage",
                                    meta: { title: "页面管理" },
                                    component: () => import("@/views/decorate/pcDecorate/List.vue")
                                },
                                {
                                    path: "pc_navigation/list",
                                    name: "pcNavigationManage",
                                    meta: { title: "PC导航栏" },
                                    component: () => import("@/views/decorate/pcNavigation/List.vue")
                                },
                                {
                                    path: "pc_cat_floor/list",
                                    name: "pcCatFloorManage",
                                    meta: { title: "PC分类抽屉" },
                                    component: () => import("@/views/decorate/pcCatFloor/List.vue")
                                },
                                {
                                    path: "pc_decorate/other",
                                    name: "pcDecorateOtherManage",
                                    meta: { title: "其它页面" },
                                    component: () => import("@/views/decorate/pcDecorate/Other.vue")
                                }
                            ]
                        }
                    ]
                },
                {
                    path: "merchant_setting",
                    name: "merchantSetting",
                    meta: { title: "设置" },
                    redirect: "/setting/mobile_shop_decorate",
                    component: () => import("@/layouts/base/index.vue"),
                    children: [
                        {
                            path: "mobile_shop_decorate",
                            name: "mobileShopDecorate",
                            meta: { title: "页面管理" },
                            component: () => import("@/views/merchant/setting/mobileShopDecorate/List.vue")
                        },
                        {
                            path: "shop_team",
                            name: "ShopTeamManage",
                            meta: { title: "店铺设置" },
                            component: () => import("@/views/merchant/setting/team/Index.vue")
                        },
                        {
                            path: "shop_info",
                            name: "ShopInfoManage",
                            meta: { title: "店铺信息" },
                            component: () => import("@/views/merchant/setting/shopInfo/Index.vue")
                        },
                        {
                            path: "employee/list/",
                            name: "EmployeeManagement",
                            meta: { title: "员工列表" },
                            component: () => import("@/views/authority/adminUser/ShopList.vue")
                        },
                        {
                            path: "employeeLog/list/",
                            name: "EmployeeLogManagement",
                            meta: { title: "员工操作日志" },
                            component: () => import("@/views/merchant/setting/employeeLog/List.vue")
                        },
                        {
                            path: "shop_role/list/",
                            name: "ShopRoleManage",
                            meta: { title: "角色管理" },
                            component: () => import("@/views/authority/adminRole/List.vue")
                        },
                        {
                            path: "shop_shipping",
                            name: "shopShipping",
                            meta: { title: "配送/运费设置" },
                            children: [
                                {
                                    path: "shop_shipping_type/list",
                                    name: "shopShippingTypeManage",
                                    meta: { title: "配送类型" },
                                    component: () => import("@/views/setting/shippingType/List.vue")
                                },
                                {
                                    path: "shop_shipping_tpl/list",
                                    name: "shopShippingTplManage",
                                    meta: { title: "运费模板" },
                                    component: () => import("@/views/setting/shippingTpl/List.vue")
                                }
                            ]
                        },
                        {
                            path: "shop_multilingual",
                            name: "shopMultilingual",
                            meta: { title: "多语言设置" },
                            children: [
                                {
                                    path: "shop_translationContent/list",
                                    name: "shopTranslationContentManage",
                                    meta: { title: "翻译内容" },
                                    component: () => import("@/views/setting/multilingual/translationContent/List.vue")
                                }
                            ]
                        }
                    ]
                },
                {
                    path: "decorate",
                    name: "decorateEdit",
                    component: () => import("@/layouts/decorate/index.vue"),
                    meta: { title: "装修" },
                    children: [
                        {
                            path: "index",
                            name: "mobileDecorateEdit",
                            meta: { title: "装修" },
                            component: () => import("@/views/decorate/decorate/Index.vue")
                        },
                        {
                            path: "pc",
                            name: "pcDecorateEdit",
                            meta: { title: "PC首页装修" },
                            component: () => import("@/views/decorate/decorate/Pc.vue")
                        }
                    ]
                },
                {
                    path: "content",
                    name: "content",
                    redirect: "/content/article/list",
                    component: () => import("@/layouts/base/index.vue"),
                    meta: { title: "内容" },
                    children: [
                        {
                            path: "article/list",
                            name: "articleManage",
                            meta: { title: "文章列表" },
                            component: () => import("@/views/content/article/List.vue")
                        },
                        {
                            path: "article_category/list",
                            name: "articleCategoryManage",
                            meta: { title: "文章分类" },
                            component: () => import("@/views/content/articleCategory/List.vue")
                        }
                    ]
                },
                {
                    path: "authority",
                    name: "authority",
                    redirect: "/authority/list",
                    component: () => import("@/layouts/base/index.vue"),
                    meta: { title: "权限" },
                    children: [
                        {
                            path: "list",
                            name: "authorityManage",
                            meta: { title: "权限目录" },
                            component: () => import("@/views/authority/authority/List.vue")
                        },
                        {
                            path: "admin_user/list",
                            name: "adminUserManage",
                            meta: { title: "管理员列表" },
                            component: () => import("@/views/authority/adminUser/List.vue")
                        },
                        {
                            path: "admin_role/list",
                            name: "adminRoleManage",
                            meta: { title: "角色列表" },
                            component: () => import("@/views/authority/adminRole/List.vue")
                        },
                        {
                            path: "admin_log/list",
                            name: "adminLogManage",
                            meta: { title: "管理员日志" },
                            component: () => import("@/views/authority/adminLog/List.vue")
                        },
                        {
                            path: "suppliers/list",
                            name: "suppliersManage",
                            meta: { title: "供应商列表" },
                            component: () => import("@/views/authority/suppliers/List.vue")
                        },
                        {
                            path: "",
                            name: "developTool",
                            meta: { title: "开发工具" },
                            redirect: "/authority/code_file/index",
                            children: [
                                {
                                    path: "code_file/index",
                                    name: "codeFileManage",
                                    meta: { title: "代码生成" },
                                    component: () => import("@/views/authority/codeFile/Index.vue")
                                }
                            ]
                        },
                        {
                            path: "account_editing/index",
                            name: "accountEditingManage",
                            meta: { title: "个人中心" },
                            component: () => import("@/views/authority/accountEditing/Index.vue")
                        }
                    ]
                },
                // {
                //     path: "salesman",
                //     name: "salesman",
                //     redirect: "/salesman/index",
                //     component: () => import("@/layouts/base/index.vue"),
                //     meta: { title: "分销" },
                //     children: [
                //         {
                //             path: "index",
                //             name: "overviewManage",
                //             meta: { title: "分销概览", isShowInHeader: true },
                //             component: () => import("@/views/salesman/overview/Index.vue")
                //         },
                //         {
                //             path: "promoteMode/list",
                //             name: "promoteModeManage",
                //             meta: { title: "分销模式" },
                //             component: () => import("@/views/salesman/promoteMode/List.vue")
                //         },
                //         {
                //             path: "",
                //             name: "salesmanProduct",
                //             meta: { title: "分销商品" },
                //             redirect: "/salesman/product/list",
                //             children: [
                //                 {
                //                     path: "product/list",
                //                     name: "salesmanProductManage",
                //                     meta: { title: "商品佣金管理" },
                //                     component: () => import("@/views/salesman/product/List.vue")
                //                 },
                //                 {
                //                     path: "overview/analysisTable",
                //                     name: "AnalysisTableManage",
                //                     meta: { title: "商品成交分析" },
                //                     component: () => import("@/views/salesman/overview/src/AnalysisTable.vue")
                //                 },
                //             ]
                //         },
                //         {
                //             path: "",
                //             name: "salesmanManage",
                //             meta: { title: "分销员管理" },
                //             redirect: "/salesman/promoter/list",
                //             children: [
                //                 {
                //                     path: "promoter/list",
                //                     name: "promoterManage",
                //                     meta: { title: "分销员列表" },
                //                     component: () => import("@/views/salesman/promoter/List.vue")
                //                 },
                //                 {
                //                     path: "subgroup/list",
                //                     name: "subgroupManage",
                //                     meta: { title: "分销员分组" },
                //                     component: () => import("@/views/salesman/subgroup/List.vue")
                //                 },
                //                 {
                //                     path: "overview/rankingTable",
                //                     name: "RankingTableManage",
                //                     meta: { title: "分销员排行" },
                //                     component: () => import("@/views/salesman/overview/src/RankingTable.vue")
                //                 },
                //                 {
                //                     path: "salesmanDetailed/list",
                //                     name: "salesmanDetailedManage",
                //                     meta: { title: "分销员明细" },
                //                     component: () => import("@/views/salesman/salesmanDetailed/List.vue")
                //                 },
                //             ]
                //         },
                //         {
                //             path: "",
                //             name: "performanceSettlement",
                //             meta: { title: "分销结算" },
                //             redirect: "/salesman/performanceSettlement/setting/index",
                //             children: [
                //                 {
                //                     path: "performanceSettlement/setting/index",
                //                     name: "performanceSettlementSettingManage",
                //                     meta: { title: "结算方案设置" },
                //                     component: () => import("@/views/salesman/performanceSettlement/setting/Index.vue")
                //                 },
                //                 {
                //                     path: "performanceSettlement/list",
                //                     name: "performanceSettlementManage",
                //                     meta: { title: "业绩结算" },
                //                     component: () => import("@/views/salesman/performanceSettlement/performanceSettlement/List.vue")
                //                 },
                //             ]
                //         },
                //         {
                //             path: "",
                //             name: "noticeManage",
                //             meta: { title: "内容管理" },
                //             redirect: "/salesman/notice/list",
                //             children: [
                //                 {
                //                     path: "notice/list",
                //                     name: "salesmanNoticeManage",
                //                     meta: { title: "分销攻略" },
                //                     component: () => import("@/views/salesman/notice/List.vue")
                //                 },
                //                 {
                //                     path: "materialCategory/list",
                //                     name: "materialCategoryManage",
                //                     meta: { title: "素材分类" },
                //                     component: () => import("@/views/salesman/category/List.vue")
                //                 },
                //                 {
                //                     path: "material/list",
                //                     name: "materialManage",
                //                     meta: { title: "素材管理" },
                //                     component: () => import("@/views/salesman/material/List.vue")
                //                 }
                //             ]
                //         }
                //     ]
                // },
                {
                    path: "print",
                    name: "print",
                    component: () => import("@/layouts/blank/index.vue"),
                    meta: { title: "打印" },
                    children: [
                        {
                            path: "orderPrint",
                            name: "orderPrintManage",
                            meta: { title: "订单打印" },
                            component: () => import("@/views/print/orderPrint/List.vue")
                        },
                        {
                            path: "waybill",
                            name: "waybillManage",
                            meta: { title: "面单打印" },
                            component: () => import("@/views/print/orderPrint/Waybill.vue")
                        }
                    ]
                },
                {
                    path: "login",
                    name: "login",
                    component: () => import("@/layouts/blank/index.vue"),
                    meta: { title: "登录" },
                    redirect: "/login/index",
                    children: [
                        {
                            path: "/login/index",
                            name: "loginIndex",
                            meta: { title: "登录" },
                            component: () => import("@/views/login/Login.vue")
                        }
                    ]
                },
                {
                    path: "im",
                    name: "im",
                    component: () => import("@/layouts/im/index.vue"),
                    meta: { title: "客服" },
                    redirect: "/im/index",
                    children: [
                        {
                            path: "index",
                            name: "imChart",
                            meta: { title: "即时会话" },
                            component: () => import("@/views/im/Index.vue")
                        },
                        {
                            path: "history",
                            name: "history",
                            meta: { title: "历史会话" },
                            component: () => import("@/views/im/History.vue")
                        },
                        {
                            path: "systemSetting",
                            name: "systemSetting",
                            meta: { title: "系统设置" },
                            children: [
                                {
                                    path: "autoReply",
                                    name: "autoReply",
                                    meta: { title: "客服自动回复" },
                                    component: () => import("@/views/im/AutoReply.vue")
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});

// 修改路由标题 是否授权  - powered by tigshop
processRoutes(router.getRoutes());

// reset router
export function resetRouter() {
    router.getRoutes().forEach((route) => {
        const { name } = route;
        if (name && !WHITE_NAME_LIST.includes(name as string)) {
            router.hasRoute(name) && router.removeRoute(name);
        }
    });
}

export default router;
