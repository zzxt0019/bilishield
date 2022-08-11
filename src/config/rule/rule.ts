import { Checker } from './checker';
import { BaiduTest } from './special/impl/baidu-test';
/**
 * 规则配置
 */
export class Rule {
    key: string  // 规则key yaml的key 相当于id
    name: string  // 规则名称 用于展示
    mainSelector: string  // 主选择器 目标的主体
    checker: Checker  // 选择器 判断条件
    constructor(rule: Rule) {
        this.key = rule.key
        this.name = rule.name
        this.mainSelector = rule.mainSelector
        this.checker = rule.checker
        if (this.checker.bingo) {
            // 普通规则没有bingo
            delete this.checker.bingo
        }
    }
}