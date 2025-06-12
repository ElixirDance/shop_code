export interface PaymentFormState {
    basicPaySettings: {
        useSurplus: number;
        usePoints: number;
        useCoupon: number;
    },
    wechatPaySettings: {
        useWechat: number;
        wechatMchidType: number;
        wechatPayMchid: string;
        wechatPaySubMchid: number;
        wechatPayKey: string;
        wechatPaySerialNo: string;
        wechatPayCertificate: number;
        wechatPayPrivateKey: number;
        wechatPayCheckType: number;
        wechatPayPlatformCertificate: number;
        wechatPayPublicKeyId: number;
        wechatPayPublicKey: number;
    }
    aliPaySettings: {
        useAlipay: number;
        alipayAppid: string;
        alipayRsaPrivateKey: string;
        alipayRsaPublicKey: string;
    }
    yaBandPaySettings: {
        useYabanpay: number;
        useYabanpayWechat: number;
        useYabanpayAlipay: number;
        yabanpayCurrency: string;
        yabandpayUid: string;
        yabandpaySecretKey: string;
        yabanpayCurrencyList?: YaBandPayCurrency[];
    }
    offlinePaySettings: {
        useOffline: number;
        offlinePayBank: string;
        offlinePayCompany: string;
    }
    payPalSettings: {
        usePaypal: number;
        paypalCurrency: string;
        paypalClientId: string;
        paypalSecret: string;
        paypalCurrencyList?: PayPalCurrency[];
    }
    yunPaySettings: {
        useYunpay: number;
        yunpayUid: string;
        yunpaySecretKey: string;
    }
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