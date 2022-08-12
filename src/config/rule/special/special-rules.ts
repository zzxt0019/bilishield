import { BaiduTest } from "./impl/baidu-test";
import { LivePageRule } from './impl/live-page';
import { SpecialRule } from "./special-rule";

export class SpecialRules {
    static sp = new Map()
    static init(specialRule: SpecialRule): void {
        this.sp.set(specialRule.pageKey, specialRule)
    }
    static {
        this.init(new BaiduTest())
        this.init(new LivePageRule())
    }
}