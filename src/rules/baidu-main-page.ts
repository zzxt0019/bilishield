import { Page } from "./base/base-pages";
/**
 * 测试百度
 */
export class BaiduMainPage extends Page {
    url = /baidu.com/
    init() {
        this.registerRule({
            mainSelector: '.c-title a'
        })
        return this;
    }
}