import { Checker } from './checker';
import { DoRuleN } from './do-rule';
import { Rule } from './rule';
/**
 * 页面配置
 */
export class Page {
    key: string  // 页面key yaml的key 相当于id
    name: string  // 页面名称 用于展示
    regexp: RegExp  // 正则表达式 真实页面是否匹配配置页面
    constructor(page: PageOptions) {
        this.key = page.key
        this.name = page.name ?? page.key
        this.regexp = new RegExp(page.regexp.pattern, page.regexp.modifiers)
    }
    working = false
    checkerMap: Map<string, Checker[]> = new Map()
    insert(rule: Rule) {
        let _checkers = this.checkerMap.get(rule.mainSelector);
        let checkers = _checkers ? _checkers : []
        checkers.push(rule.checker)
        if (!_checkers) {
            this.checkerMap.set(rule.mainSelector, checkers)
        }
    }
    rules() {
        let arr: DoRuleN[] = []
        this.checkerMap.forEach((checkers, mainSelector) => {
            arr.push(new DoRuleN(mainSelector, checkers))
        })
        return arr;
    }
    start() {
        for (const rule of this.rules()) {
            document.arrive(rule.mainSelector, {
                fireOnAttributesModification: true,
                onceOnly: false,
                existing: true
            }, (element: Element) => {
                rule.display(element)
            })
        }
        this.working = true
    }
    stop() {
        for (const rule of this.rules()) {
            document.unbindArrive(rule.mainSelector);
            let elements = document.querySelectorAll('.testtest')
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                (element as any).style.setProperty('background-color', '')
                element.classList.remove('testtest')
            }
        }
        this.working = false
    }
}
interface PageOptions {
    key: string
    name?: string
    regexp: {
        pattern: string  // 正则表达式"//"中间的部分
        modifiers?: string  // 正则表达式"//"后边的部分(一般没有)
    }
}