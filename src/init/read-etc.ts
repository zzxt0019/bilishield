import {SpecialPages} from "@/config/page/special/special-pages";
import {Rule} from "@/config/rule/rule";
import {Settings} from "@/config/setting/setting";
import {Page} from '@/config/page/page';

export function readEtc() {
    let pageData: any = GM_getValue('script.page');
    let pageMap: Map<string, Page> = new Map()
    Object.keys(pageData).forEach(pageKey => {
        pageData[pageKey].key = pageKey
        pageMap.set(pageKey, new Page(pageData[pageKey]))
    })
    // 特殊页面配置
    SpecialPages.sp.forEach((page, key) => {
        pageMap.set(key, page)
    })
    let ruleData: any = GM_getValue('script.rule')
    Object.keys(ruleData).forEach(ruleKey => {
        let rule0 = ruleData[ruleKey]
        rule0.key = ruleKey
        if (rule0.checker?.setting) {
            rule0.checker.setting = Settings.getSystemSettings().get(rule0.checker.setting);
        }
        pageMap.get(rule0.page)?.insert(new Rule(rule0))
    })
    return pageMap
}