import request from "@/utils/request";
// 老手机获得验证码
export const sendMobileCodeByMobileValidate = (data: object) => {
    return request({
        url: "user/user/sendMobileCodeByMobileValidate",
        method: "post",
        data
    });
};
// 修该手机老手机验证码验证
export const mobileValidate = (data: object) => {
    return request({
        url: "user/user/mobileValidate",
        method: "post",
        data
    });
};
// 新手机获得验证码
export const sendMobileCodeByMobileMobile = (data: object) => {
    return request({
        url: "user/user/sendMobileCodeByModifyMobile",
        method: "post",
        data
    });
};
// 新手机验证码验证
export const mobileMobile = (data: object) => {
    return request({
        url: "user/user/modifyMobile",
        method: "post",
        data
    });
};

// 修改密码获得验证码
export const sendMobileCodeByMobilePassword = (data: object) => {
    return request({
        url: "user/user/sendMobileCodeByModifyPassword",
        method: "post",
        data
    });
};

export const checkModifyPasswordMobileCode = (data: object) => {
    return request({
        url: "user/user/checkModifyPasswordMobileCode",
        method: "post",
        data
    });
};
