// 获取详情返回参数类型

export interface BaseFormResult {
    item?: BaseFormState;
    countrys: Regions[];
}
export interface Regions {
    regionId: number;
    regionName: string;
}
export interface BaseFormState {
    base: BaseConfig;
    baseApiAppPay: BaseApiAppPayConfig;
    baseApiCollection: BaseApiCollectionConfig;
    baseApiIcon: BaseApiIconConfig;
    baseApiMiniProgram: BaseApiMiniProgramConfig;
    baseApiStorage: BaseApiStorageConfig;
    baseApiWechat: BaseApiWechatConfig;
    baseApiWechatMerchant: BaseApiWechatMerchantConfig;
    baseDisplay: BaseDisplayConfig;
    baseKefu: BaseKefuConfig;
    baseMailbox: BaseMailboxConfig;
    baseProduct: BaseProductConfig;
    baseShopping: BaseShoppingConfig;
    baseSms: BaseSmsConfig;
    baseApiCompanyData: {
        type: number;
        smsNote: number;
        tips: string;
    };
    baseApiLang: {
        langOn?: number;
        langType?: number;
        langVolcengineAccessKey?: string;
        langVolcengineSecret?: string;
    };
}

interface GrowUpSetting {
    buyGoods: number;
    buyGoodsMoney: number;
    buyGoodsGrowth: number;
    buyOrder: number;
    buyOrderNumber: number;
    buyOrderGrowth: number;
    evpi: number;
    evpiGrowth: number;
    bindPhone: number;
    bindPhoneGrowth: number;
}

interface BaseConfig {
    shopName: string;
    kefuAddress: string;
    pcDomain: string;
    h5Domain: string;
    adminDomain: string;
    autoRedirect: number;
    uploadMaxSize: number;
    isOpenMobileAreaCode: number;
    shopTitle: string;
    shopTitleSuffix: string;
    shopKeywords: string;
    shopDesc: string;
    uploadSaveFullDomain?: number;
    shopLogo: string;
    defaultAvatar: string;
    icoImg: string;
    usernamePrefix: string;
    shopIcpNo: string;
    shopIcpNoUrl: string;
    shop110No: string;
    shop110Link: string;
    shopRegClosed: number;
    closeOrder: number;
    openWechatRegister: number;
    wechatRegisterBindPhone: number;
    openWechatOauth: number;
    autoDeliveryDays: number;
    autoReturnGoods: number;
    autoReturnGoodsDays: number;
    afterSalesLimitDays: number;
    googleLoginOn: number;
    googleClientId: string;
    googleClientSecret: string;
    facebookLoginOn: number;
    facebookClientId: string;
    facebookClientSecret: string;
}

interface BaseApiAppPayConfig {
    wechatPayAppId: string;
    wechatPayAppSecret: string;
}

interface BaseApiCollectionConfig {
    oneboundKey: string;
    oneboundSecret: string | number;
}

interface BaseApiIconConfig {
    icoTigCss: string;
    icoDefinedCss: string;
}

interface BaseApiMiniProgramConfig {
    wechatMiniProgramAppId: string;
    wechatMiniProgramSecret: string;
}

interface BaseApiStorageConfig {
    storageType: number;
    storageLocalUrl: string;
    storageOssUrl: string;
    storageOssAccessKeyId: string;
    storageOssAccessKeySecret: string;
    storageOssBucket: string;
    storageOssRegion: string;
    storageCosUrl: string;
    storageCosSecretId: string;
    storageCosSecretKey: string;
    storageCosBucket: string;
    storageCosRegion: string;
    storageSaveFullPath: number;
}

interface BaseApiWechatConfig {
    wechatOauth: number;
    wechatAppId: string;
    wechatAppSecret: string;
    wechatServerUrl: string;
    wechatServerToken: string;
    wechatServerSecret: string;
}

interface BaseApiWechatMerchantConfig {
    wechatPayMchidType: string;
    wechatPayMchid: string;
    wechatPaySubMchid: string;
    wechatPayKey: string;
}

interface BaseDisplayConfig {
    searchKeywords: string;
    msgHackWord: string;
    isOpenPscws: string;
    selfStoreName: string;
    shopDefaultRegions: string;
    defaultCountry: number;
    showCatLevel: number;
    countries?: Regions[];
}

interface GeneralSettingConfig {
    searchKeywords: string;
    msgHackWord: string;
    isOpenPscws: string;
    selfStoreName: string;
}

interface RegionSettingConfig {
    shopDefaultRegions: number[];
    defaultCountry: number;
}

interface BaseKefuConfig {
    kefuType: number;
    kefuYzfType: number;
    kefuYzfSign: string;
    kefuWorkwxId: string;
    kefuCode: string;
    kefuCodeBlank: number;
    corpId: string;
    kefuPhone: string;
    kefuTime: string;
}

interface KefuSettingConfig {
    kefuType: number;
    kefuYzfType: number;
    kefuYzfSign: string;
    kefuWorkwxId: string;
    kefuCode: string;
    kefuCodeBlank: number;
    kefuJavascript: string;
    wapKefuJavascript: string;
    corpId: string;
}

interface KefuInfoConfig {
    kefuPhone: string;
    kefuTime: string;
}

interface BaseMailboxConfig {
    serviceEmail: string;
    sendConfirmEmail: number;
    orderPayEmail: number;
    sendServiceEmail: number;
    sendShipEmail: number;
}

interface BaseProductConfig {
    dollarSign: string;
    dollarSignCn: string;
    snPrefix: string;
    showSelledCount: number;
    showMarketprice: number;
    marketPriceRate: number;
}

interface BasicProductConfig {
    dollarSign: string;
    dollarSignCn: string;
    snPrefix: string;
    priceFormat: number;
    defaultStorage: number;
    goodsUrlType: number;
}

interface ShowRelatedConfig {
    isShowPriceTrend: number;
    showSelledCount: number;
    showMarketprice: number;
    isSpeGoodsNumber: number;
    speGoodsNumber1: number;
    speGoodsNumber2: number;
    speGoodsNumber3: number;
    pageSize: number;
    historyNumber: number;
    lyBrandType: string;
    commentDefaultTag: string;
}

interface BaseShoppingConfig {
    childAreaNeedRegion: number;
    autoCancelOrderMinute: number;
    integralName: string;
    integralScale: string;
    orderSendPoint: string;
    integralPercent: string;
    commentSendPoint: string;
    showSendPoint: string;
    useQiandaoPoint: number;
    canInvoice: number;
    invoiceAdded: number;
    returnConsignee: string;
    returnMobile: string;
    returnAddress: string;
}

interface ShoppingGlobalConfig {
    autoSplitPaidOrder: number;
    childAreaNeedRegion: number;
}

interface SettlementSettingConfig {
    useBonus: number;
    useSurplus: number;
}

interface PointsSettingConfig {
    useIntegral: number;
    integralName: string;
    integralScale: number;
    integralPercent: number;
    commentSendPoint: number;
    showSendPoint: number;
    useQiandaoPoint: number;
    orderSendPoint: number;
}

interface InvoiceSettingConfig {
    canInvoice: number;
    invoiceContent: string;
    invoiceAdded: number;
}

interface ActivitySettingConfig {
    lotteryClosed: number;
    lotteryPoint: number;
    isOpenPin: number;
    isOpenBargain: number;
}

interface AfterSalesSettingConfig {
    returnConsignee: string;
    returnMobile: number;
    returnAddress: string;
}

interface BaseSmsConfig {
    smsKeyId: string;
    smsKeySecret: string;
    smsSignName: string;
    smsShopMobile: string;
}

export interface PaymentFormState {
    useSurplus?: number;
    useCod?: number;
    usePoints?: number;
    useCoupon?: number;
    useWechat?: number;
    useAlipay?: number;
    maxShopCount?: number;
    useOffline?: number;
    useYabanpay?: number;
    useYabanpayWechat?: number;
    useYabanpayAlipay?: number;
    yabanpayCurrency?: string;
    yabanpayCurrencyList?: YaBandPayCurrency[];
    personApplyEnabled?: number;
    merchantApplyNeedCheck?: number;
    shopProductNeedCheck?: number;
    enabledCommissionOrder?: number;
    wechatMchidType?: number;
    wechatPayMchid?: string;
    shopAgreement?: string;
    shopRankDateRage?: string;
    maxRecommendProductCount?: string;
    defaultAdminPrefix?: string;
    wechatPaySubMchid?: string;
    wechatPayKey?: string;
    wechatPaySerialNo?: string;
    maxSubAdministrator?: string;
    alipayAppid?: string;
    alipayRsaPrivateKey?: string;
    alipayRsaPublicKey?: string;
    offlinePayBank?: string;
    offlinePayCompany?: string;
    wechatPayCertificate?: number;
    wechatPayPrivateKey?: number;
    wechatPayPlatformCertificate?: number;
    yabandpayUid?: string;
    yabandpaySecretKey?: number;
    usePaypal?: number;
    paypalClientId?: string;
    paypalSecret?: string;
    paypalCurrency?: string;
    paypalCurrencyList?: PayPalCurrency[];
    defaultShopName?: string;
    useYunpay?: number;
    yunpayUid?: string;
    yunpaySecretKey?: string;
    wechatPayCheckType?: number;
    wechatPayPublicKey?: number;
    wechatPayPublicKeyId?: string;
}

export interface AdminConfigState {
    pageSize: number;
    icoDefinedCss: string;
    dollarSign: string;
    storageType: number;
    uploadMaxSize: number;
    storageUrl: string;
    pcDomain: string;
    h5Domain: string;
    versionType: string;
    amountUnit: string;
}

export interface YaBandPayCurrency {
    id: number;
    name: string;
    value: string;
}

export interface PayPalCurrency {
    id: number;
    name: string;
    value: string;
}

export interface BaseLogistics {
    address?: string;
    areaName?: string;
    cityName?: string;
    kdniaoApiKey?: string;
    kdniaoBusinessId?: string;
    logisticsType?: string;
    mobile?: string;
    provinceName?: string;
    sender?: string;
}



export interface BaseNotice {
    smsKeyId: string;
    smsKeySecret: string;
    smsSignName: string;
    smsShopMobile: string;
    serviceEmail: string;
    sendConfirmEmail: number;
    orderPayEmail: number;
    sendServiceEmail: number;
    sendShipEmail: number;
}

export interface BaseInterfactSettings {
    wechatOauth: number;
    wechatAppId: string;
    wechatAppSecret: string;
    wechatServerUrl: string;
    wechatServerToken: string;
    wechatServerSecret: string;
    wechatMiniProgramAppId: string;
    wechatMiniProgramSecret: string;
    wechatPayAppId: string;
    wechatPayAppSecret: string;
    icoTigCss: string;
    icoDefinedCss: string;
    storageType: number;
    storageSaveFullPath: number;
    storageLocalUrl: string;
    storageOssUrl: string;
    storageOssAccessKeyId: string;
    storageOssAccessKeySecret: string;
    storageOssBucket: string;
    storageOssRegion: string;
    storageCosUrl: string;
    storageCosSecretId: string;
    storageCosSecretKey: string;
    storageCosBucket: string;
    storageCosRegion: string;
    langOn: number;
    langType: number;
    langVolcengineAccessKey: string;
    langVolcengineSecret: string;
}

export interface BaseAuthenticationSettings {
    type: number;
    smsNote: number;
    tips: string;
    isIdentity: number;
    isEnquiry: number;
}


export interface BaseAuthenticationSettings {
    type: number;
    smsNote: number;
    tips: string;
    isIdentity: number;
    isEnquiry: number;
}

export interface BaseCategoryDecorate {
    productCategoryDecorateType: number;
}

export interface BaseThemeStyle {
    themeId: number;
}

export interface BaseTheme {
    layout: layoutType;
    navTheme: navThemeType;
    primaryColor: ColorType;
    uniqueOpened: boolean;
    isMultiLabel: boolean;
}
type layoutType = "default" | "side" | "top" | "mix";
type navThemeType = "light" | "dark" | "realDark";
type ColorType = "blue" | "red" | "green" | "orange" | "purple";