import { defineStore } from "pinia";
import router from "@/router";
import { useMenusStore } from "@/store/menu";
import { getMineInfo, getShopInfo } from "@/api/authority/accountEditing";
import type { UserInfo } from "@/types/authority/accountEditing.d";

interface State {
    userInfo: UserInfo;
    shopInfo: any;
    messageCount: number;
    accessToken: string;
}
export const useUserStore = defineStore("user", {
    state: (): State => {
        return {
            userInfo: {
                userId: 0,
                adminId: 0,
                avatar: "",
                username: "",
                authList: "",
                shopId: "",
                parentId: "",
                suppliersId: "",
                lastTime: ""
            },
            shopInfo:{},
            messageCount: 0,
            accessToken: ""
        };
    },
    getters: {
        getAccessToken(state) {
            return state.accessToken;
        }
    },
    actions: {
        updateUserInfo() {
            try {
                const result = getMineInfo();
                result.then((result) => {
                    this.userInfo = result as UserInfo;
                });
                if(localStorage.getItem("adminType")=='shop'){
                    const result2 = getShopInfo();
                    result2.then((result) => {
                        this.shopInfo = result as any;
                    });
                }
            } catch (error) {
            } finally {
            }
        },
        logout(jump = true) {
            localStorage.clear();
            this.messageCount = 0;
            if (jump == true) router.push("/login/");
        },
        setUserInfo(data: any) {
            this.userInfo = data;
        },
        setShopInfo(data: any) {
            this.shopInfo = data;
        },
        clearCache() {
            // 清除菜单栏的缓存，刷新页面后会自动更新
            const menus = useMenusStore();
            menus.mainMenu = null;
        },
        setAccessToken(token: string) {
            this.accessToken = token;
        }
    },
    persist: {
        enabled: true,
        strategies: [
            { storage: sessionStorage, paths: ["details", "messageCount"] }, //用sessionStorage存储
            { storage: localStorage, paths: ["accessToken", "userInfo", "shopInfo"] } // 用 localstorage存储
        ]
    }
});
