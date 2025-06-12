// 获取详情返回参数类型

export interface MailFormResult {
    license: string;
}
export interface LicensedFormState {
	license: string;
	shopCompany: string;
	licensedType: string;
	licensedTypeName: string;
	deCopyright: number;
	isEnterprise: number;
	authorizedDomain: string;
	releaseTime: string;
	expirationTime: string;
	adminLightLogo: string;
	adminDarkLogo: string;
	poweredBy: string;
	licensedId: number[];
	poweredByStatus: number;
	versionInfoHidden: number;
	versionType: string;
	version: string;
}
export interface BaseLicensedData {
	shopCompany: string;
	adminLightLogo: string;
	adminDarkLogo: string;
	poweredBy: string;
	poweredByStatus: number;
	versionInfoHidden: number;
}