import * as STATIC from "@/main-static";

export function globalInit() {
    // 取消插件内部的浏览器右键菜单事件
    document.oncontextmenu = event => {
        if (event.target && event.target instanceof Node) {
            return !document.getElementById(STATIC.AppId)?.contains(event.target);
        }
        return false;
    };
}