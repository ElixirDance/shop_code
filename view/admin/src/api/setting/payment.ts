import request from "@/utils/request";
import type {PaymentFormState} from "@/types/setting/payment.d";

export const getPaymentSettings = () => {
    return request<PaymentFormState>({
        url: 'setting/config/paySettings',
        method: 'get'
    });
}

export const updatePaymentSettings = (data: PaymentFormState) => {
    return request({
        url: 'setting/config/savePay',
        method: 'post',
        data
    });
}

export const createPlatformCertificate = () => {
    return request({
        url: "setting/config/createPlatformCertificate",
        method: "post"
    });
};