import request from "@/utils/request";

export const userSignin = (data: any) => {
    return request({
        url: "user/login/signin",
        method: "post",
        data
    });
};
export const userLogout = () => {
    return request({
        url: "user/login/logout",
        method: "post"
    });
};

export const sendMobileCode = (data: any) => {
    return request({
        url: "user/login/sendMobileCode",
        method: "post",
        data
    });
};

export const getWechartMobile = (data: any) => {
    return request({
        url: "user/login/getMobile",
        method: "post",
        data
    });
};

export const setMiniProgramOpenid = (data: any) => {
    return request({
        url: "user/login/updateUserOpenid",
        method: "post",
        data
    });
};

export const getOauthUrl = (data: any) => {
    return request({
        url: "user/login/getWxLoginUrl",
        method: "get",
        data
    });
};

export const getOauthInfo = (data: any) => {
    return request({
        url: "user/login/getWxLoginInfoByCode",
        method: "get",
        data
    });
};

export const bindWechat = (data: any) => {
    return request({
        url: "user/login/bindWechat",
        method: "post",
        data
    });
};

export const unbindWechat = () => {
    return request({
        url: "user/login/unbindWechat",
        method: "get"
    });
};

export const checkMobile = (data: AnyObject) => {
    return request({
        url: "user/login/checkMobile",
        method: "post",
        data
    });
};

export const getOauth = (path: string, redirectUri: string) => {
    return request({
        url: `user/oauth/render/${path}?redirectUri=${redirectUri}`,
        method: "get"
    });
};

export const getOauthCallback = (path: string, redirectUri: string, data: object) => {
    return request({
        url: `user/oauth/callback/${path}?redirectUri=${redirectUri}`,
        method: "post",
        data
    });
};
