import request from "@/utils/request";
// 获取未完成编辑
export const loadDraftData = (id: number) => {
    return request<any>({
        url: "decorate/decorate/loadDraftData",
        method: "get",
        params: {
            id,
        },
    });
};

export const saveDraft = (data: object) => {
    return request({
        url: "decorate/decorate/saveDraft",
        method: "post",
        data,
    });
};
