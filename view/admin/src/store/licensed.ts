import { defineStore } from "pinia";
import { getLicensed } from "@/api/setting/licensed";
import type { LicensedFormState } from "@/types/setting/licensed";
interface State {
    licensedData: LicensedFormState;
}

export const useLicensedStore = defineStore("licensed", {
    state: (): State => {
        return <State>{
            licensedData: {
                license: "",
                licensedType: "",
                licensedTypeName: "",
                deCopyright: 0,
                isEnterprise: -1,
                authorizedDomain: "",
                releaseTime: "",
                expirationTime: "",
                licensedId: [],
                adminLightLogo: "",
                adminDarkLogo: "",
                shopCompany: "",
                poweredBy: "",
                poweredByStatus: 0,
                versionInfoHidden: 0,
                versionType: "",
                version: ""
            }
        };
    },
    actions: {
        _getLicensed() {
            getLicensed().then(result => {
                if (result.poweredByStatus == null) {
                    result.poweredByStatus = 0;
                }
                if (result.adminLightLogo == null) {
                    result.adminLightLogo = "";
                }
                if (result.adminDarkLogo == null) {
                    result.adminDarkLogo = "";
                }
                this.licensedData = Object.assign(this.licensedData, result);
                this.licensedData.poweredBy = result.poweredBy;
                if (result.deCopyright == 1) {
                    this.licensedData.shopCompany = result.shopCompany;
                } else {
                    this.licensedData.shopCompany = result.shopCompany || "Copyright © 2024 Tigshop. All Rights Reserved";
                }
                localStorage.setItem("licensedData", JSON.stringify(this.licensedData));
            });
        }
    }
});
