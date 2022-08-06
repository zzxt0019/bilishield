import { DoRuleN } from "@/config/do-rule";
import { Rule } from "@/config/rule";
import * as yaml from "yaml";
import { Page } from '../config/page';
import pageText from '../yaml/page.yaml';
import ruleText from '../yaml/rule.yaml';
export function readFiles() {
    let pageData = yaml.parse(pageText);
    let pageMap: Map<string, Page> = new Map()
    Object.keys(pageData).forEach(pageKey => {
        pageData[pageKey].key = pageKey
        pageMap.set(pageKey, new Page(pageData[pageKey]))
    })
    let ruleData = yaml.parse(ruleText)
    Object.keys(ruleData).forEach(ruleKey => {
        let rule0 = ruleData[ruleKey]
        rule0.key = ruleKey
        pageMap.get(rule0.page)?.insert(new Rule(rule0))
    })
    console.log(pageMap)
    pageMap.forEach(v => {
        if (v.regexp.test(location.href)) {
            v.start()
        }
    })
    return pageMap
}