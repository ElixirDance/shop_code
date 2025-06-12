import { defineStore } from "pinia";
import type { MainMenu } from "@/types/common/common.d";
import { getAllAuthority } from "@/api/authority/authority";
export interface useMenus {
    mainMenu: MainMenu[] | null;
    menuActive: boolean;
    childMenuShow: boolean;
}

export const useMenusStore = defineStore("menus", {
    state: () => {
        return <useMenus>{
            mainMenu: [],
            menuActive: false,
            childMenuShow: true
        };
    },
    actions: {
        setMenus(data: any) {
            this.mainMenu = data;
        }
    },
    persist: {
        enabled: true,
        strategies: [
            // { storage: sessionStorage, paths: [] }, //用sessionStorage存储
            { storage: localStorage, paths: ["mainMenu"] } // 用 localstorage存储（长效）
        ]
    }
});
