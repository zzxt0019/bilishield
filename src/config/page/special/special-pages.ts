import {SpecialPage} from "./spceial-page";

// import {BaiduPage} from "@/config/page/special/impl/baidu-page";

export class SpecialPages {
    static sp: Map<string, SpecialPage> = new Map()

    static init(specialPage: SpecialPage) {
        this.sp.set(specialPage.key, specialPage)
    }

    static {
        // this.init(new BaiduPage())  // 测试使用
    }
}