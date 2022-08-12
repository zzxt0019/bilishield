import { BaiduPage } from './impl/baidu-page';
import { SpecialPage } from "./spceial-page";

export class SpecialPages {
    static sp: Map<string, SpecialPage> = new Map()
    static init(specialPage: SpecialPage) {
        this.sp.set(specialPage.key, specialPage)
    }
    static {
        this.init(new BaiduPage())
    }
}