import router, { resetRouter } from "./router";
import { useAppStore } from "@/store/app";
import { setDocumentTitle } from "@/utils/domUtils";
import { useMenusStore } from "@/store/menu";
const allowList = ["login", "merchantLogin"]; // 免登录名单
const loginRoutePath = "/login/index"; // 确保与路由配置一致
let isLoggingOut = false; // 标志位，避免重复执行登出逻辑
router.beforeEach((to, from, next) => {
    // 设置文档标题
    if (to.meta?.title) {
        setDocumentTitle(`${to.meta.title}`);
    }
    const appStore = useAppStore();
    appStore.setHeaderTitle(to.meta.title as string);
    const shopId = localStorage.getItem("shopId");

    // 处理登出逻辑
    if (to.path === loginRoutePath && to.query.logout === "1" && !isLoggingOut) {
        isLoggingOut = true;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("shopId");
        resetRouter();
        next({ path: loginRoutePath, query: {} });
        // 刷新页面
        setTimeout(() => {
            location.reload();
        }, 300);
        return;
    }
    // 处理登录状态
    if (shopId) {
        if (to.path === loginRoutePath) {
            const store = <any>useMenusStore();
            // 跳转至第一个页面
            next({ path: store.mainMenu[0].routeLink });
        } else {
            next();
        }
    } else {
        // 用户未登录的处理逻辑
        if (allowList.includes(<string>to.name) || to.path === loginRoutePath) {
            next(); // 在免登录名单，或已在登录页，继续
        } else {
            // 未登录状态，重定向到登录页
            next({ path: loginRoutePath, query: { redirect: to.fullPath } });
        }
    }
    isLoggingOut = false; // 清理标志位
});

router.afterEach(() => { });
