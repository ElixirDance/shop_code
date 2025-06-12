import { defineStore } from "pinia";
import { getAdminConfig } from "@/api/setting/config";
import type { AdminConfigState } from "@/types/setting/config";
interface State {
    config: AdminConfigState;
    loaded: boolean;
    isStoreAdmin: boolean;
    domain: string;
}

export const useConfigStore = defineStore("config", {
    state: (): State => ({
        config: {
            pageSize: 15,
            icoDefinedCss: "//at.alicdn.com/t/c/font_400590_7he137t8862",
            dollarSign: "¥",
            amountUnit: "元",
            storageType: 0,
            storageUrl: "",
            pcDomain: "",
            h5Domain: "",
            versionType:"",
            uploadMaxSize: 100,
        },
        loaded: false,
        isStoreAdmin: false,
        domain: ""
    }),
    getters: {
        icoDefinedCss: (state: State): string => {
            return "https:" + state.config.icoDefinedCss + ".css";
        },
        pageSize: (state: State): number => {
            return Number(state.config.pageSize);
        }
    },
    actions: {
        updateConfig() {
            try {
                const result = getAdminConfig();
                result.then((result) => {
                    this.config = Object.assign({}, this.config, result);
                });
            } catch (error) {
            } finally {
            }
        },
        setConfig(data: Partial<AdminConfigState>) {
            this.config = Object.assign({}, this.config, data);
        },
        getConfig(key: keyof AdminConfigState): AdminConfigState[keyof AdminConfigState] {
            return this.config[key];
        },
        // getConfig的简写方法
        get(key: keyof AdminConfigState): AdminConfigState[keyof AdminConfigState] {
            return this.config[key] as AdminConfigState[keyof AdminConfigState];
        }
    },
    persist: {
        enabled: true,
        strategies: [{ storage: localStorage, paths: ["config"] }]
    }
});
