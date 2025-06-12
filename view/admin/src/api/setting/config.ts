import request from "@/utils/request";
import type { BaseFormResult, BaseFormState, AdminConfigState } from "@/types/setting/config";

export const getIcon = () => {
    return request<any>({
        url: "setting/config/getIcon",
        method: "get"
    });
};

export const getConfig = (params: object) => {
    return request<BaseFormResult>({
        url: "setting/config/getBase",
        method: "get",
        params
    });
};

// export const getBasicConfig = () => {
//     return request<BaseFormResult>({
//         url: "setting/config/basicConfig",
//         method: "get"
//     });
// };
export const saveBasicConfig = (params: object) => {
    return request<BaseFormState>({
        url: "setting/config/saveBasic",
        method: "post",
        data: params
    });
};

// export const saveConfig = (params: object) => {
//     return request<BaseFormState>({
//         url: "setting/config/save",
//         method: "post",
//         data: params
//     });
// };
export const createPlatformCertificate = () => {
    return request({
        url: "setting/config/createPlatformCertificate",
        method: "post"
    });
};
// export const updateConfig = (params: object) => {
//     return request<BaseFormState>({
//         url: "setting/config/update",
//         method: "post",
//         data: params
//     });
// };
export const getAdminConfig = () => {
    return request<AdminConfigState>({
        url: "setting/config/getAdmin",
        method: "get"
    });
};


import type { BaseTheme, PaymentFormState, BaseThemeStyle, BaseCategoryDecorate, BaseAuthenticationSettings,BaseInterfactSettings, BaseKefuConfig, BaseConfig, BaseProductConfig, BaseShoppingConfig, BaseNotice, BaseDisplayConfig } from "@/types/setting/config";
//获取基础配置
export const getConfigBasic = () => {
    return request<BaseConfig>({
        url: "setting/config/basicSettings",
        method: "get"
    });
};
export const saveConfigBasic = (data: BaseConfig) => {
    return request({
        url: "setting/config/saveBasic",
        method: "post",
        data
    });
};

//获取商品配置
export const getConfigProduct = () => {
    return request<BaseProductConfig>({
        url: "setting/config/productSettings",
        method: "get"
    });
};
export const saveConfigProduct = (data: BaseProductConfig) => {
    return request({
        url: "setting/config/saveProduct",
        method: "post",
        data
    });
};

//获取购物配置
export const getConfigShopping = () => {
    return request<BaseShoppingConfig>({
        url: "setting/config/shoppingSettings",
        method: "get"
    });
};
export const saveConfigShopping = (data: BaseShoppingConfig) => {
    return request({
        url: "setting/config/saveShopping",
        method: "post",
        data
    });
};

//获取通知配置
export const getConfigNotify = () => {
    return request<BaseNotice>({
        url: "setting/config/notifySettings",
        method: "get"
    });
};
export const saveConfigNotify = (data: BaseNotice) => {
    return request({
        url: "setting/config/saveNotify",
        method: "post",
        data
    });
};

//获取显示配置
export const getConfigShow = () => {
    return request<BaseDisplayConfig>({
        url: "setting/config/showSettings",
        method: "get"
    });
};
export const saveConfigShow = (data: BaseDisplayConfig) => {
    return request({
        url: "setting/config/saveShow",
        method: "post",
        data
    });
};

//获取客服配置
export const getConfigKefu = () => {
    return request<BaseKefuConfig>({
        url: "setting/config/kefuSettings",
        method: "get"
    });
};
export const saveConfigKefu = (data: BaseKefuConfig) => {
    return request({
        url: "setting/config/saveKefu",
        method: "post",
        data
    });
};

//获取接口配置
export const getConfigApi = () => {
    return request<BaseInterfactSettings>({
        url: "setting/config/apiSettings",
        method: "get"
    });
};
export const saveConfigApi = (data: BaseInterfactSettings) => {
    return request({
        url: "setting/config/saveApi",
        method: "post",
        data
    });
};

//获取接口配置
export const getConfigAuth = () => {
    return request<BaseAuthenticationSettings>({
        url: "setting/config/authSettings",
        method: "get"
    });
};
export const saveConfigAuth = (data: BaseAuthenticationSettings) => {
    return request({
        url: "setting/config/saveAuth",
        method: "post",
        data
    });
};

//获取分类页装修配置
export const getConfigCategoryDecorate = () => {
    return request<BaseCategoryDecorate>({
        url: "setting/config/categoryDecorateSettings",
        method: "get"
    });
};
export const saveConfigCategoryDecorate = (data: BaseCategoryDecorate) => {
    return request({
        url: "setting/config/saveCategoryDecorate",
        method: "post",
        data
    });
};


//获取主题风格配置
export const getConfigThemeStyle = () => {
    return request<BaseThemeStyle>({
        url: "setting/config/themeStyleSettings",
        method: "get"
    });
};
export const saveConfigThemeStyle = (data: BaseThemeStyle) => {
    return request({
        url: "setting/config/saveThemeStyle",
        method: "post",
        data
    });
};



//获取店铺配置
export const getConfigShopSetting = () => {
    return request<PaymentFormState>({
        url: "setting/config/shopSettings",
        method: "get"
    });
};
export const saveConfigShopSetting = (data: PaymentFormState) => {
    return request({
        url: "setting/config/saveShop",
        method: "post",
        data
    });
};

//获取主题切换配置
export const getConfigLayoutThemeSwitch = () => {
    return request<BaseTheme>({
        url: "setting/config/layoutThemeSwitchSettings",
        method: "get"
    });
};
export const saveConfigLayoutThemeSwitch = (data: BaseTheme) => {
    return request({
        url: "setting/config/saveLayoutThemeSwitch",
        method: "post",
        data
    });
};


//获取商户配置
export const getConfigMerchantSetting = () => {
    return request<PaymentFormState>({
        url: "setting/config/merchantSettings",
        method: "get"
    });
};
export const saveConfigMerchantSetting = (data: PaymentFormState) => {
    return request({
        url: "setting/config/saveMerchant",
        method: "post",
        data
    });
};