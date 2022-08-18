import {Checker} from '../rule/checker';
import {DoRuleN} from '../rule/do-rule';
import {Rule} from '../rule/rule';
import {SpecialRule} from '../rule/special/special-rule';
import {SpecialRules} from './../rule/special/special-rules';
import {MyObserver} from "@/observer/impl/my-observer";

/**
 * 页面配置
 */
export class Page {
    key: string  // 页面key yaml的key 相当于id
    name: string  // 页面名称 用于展示
    regexp: RegExp  // 正则表达式 真实页面是否匹配配置页面
    observer = new MyObserver()

    constructor(page: PageOptions) {
        this.key = page.key
        this.name = page.name ?? page.key
        this.regexp = new RegExp(page.regexp.pattern, page.regexp.modifiers)
        // 添加特殊规则 特殊规则优先处理
        if (SpecialRules.sp.has(this.key)) {
            let specialRule = SpecialRules.sp.get(this.key) as SpecialRule
            specialRule.spCheckers.forEach(spChecker => {
                this.insert({
                    name: '',
                    key: '',
                    mainSelector: spChecker.mainSelector,
                    checker: {
                        bingo: spChecker.bingo
                    }
                })
            })
        }
    }

    isCurrent(): boolean {
        return this.regexp.test(location.href)
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
            this.observer.start(rule, window, -1);
            // document.arrive(rule.mainSelector, {
            //     fireOnAttributesModification: true,
            //     onceOnly: false,
            //     existing: true
            // }, (element: Element) => {
            //     rule.display(element)
            // });
            for (let i = 0; i < window.frames.length; i++) {
                try {
                    let frame = window.frames[i];
                    this.observer.start(rule, frame, i);
                } catch (ignore) {
                }
            }
            // iframe里执行start()
            // ((unsafeWindow as any).iframeDocuments as Set<any>).forEach(document => {
            //     document.arrive(rule.mainSelector, {
            //         fireOnAttributesModification: true,
            //         onceOnly: false,
            //         existing: true
            //     }, (element: Element) => {
            //         rule.display(element)
            //     })
            // })
        }
        this.working = true
    }

    stop() {
        for (const rule of this.rules()) {
            this.observer.stop(rule, window, -1);
            // document.unbindArrive(rule.mainSelector);
            rule.show();
            // iframe里执行stop()
            for (let i = 0; i < window.frames.length; i++) {
                try {
                    let frame = window.frames[i];
                    this.observer.stop(rule, frame, i);
                    rule.show(frame.document)
                } catch (ignore) {
                }
            }
            // ((unsafeWindow as any).iframeDocuments as Set<any>).forEach(document => {
            //     document.unbindArrive(rule.mainSelector);
            //     rule.show(document);
            // });
        }
        this.working = false
    }

    /**
     * 初始化start
     * @param window0
     */
    arrive(window0: Window) {
        if (this.isCurrent()) {
            for (let rule of this.rules()) {
                let windowKey = -1;
                if (window0 !== window) {
                    for (let i = 0; i < window.frames.length; i++) {
                        if (window0 === window.frames[i]) {
                            windowKey = i;
                        }
                    }
                }

                this.observer.start(rule, window0, windowKey);
                document.arrive(rule.mainSelector, {
                    fireOnAttributesModification: true,
                    onceOnly: false,
                    existing: true
                }, (element: Element) => {
                    rule.display(element)
                })
            }
            if (document === window.document) {
                this.working = true;
            }
        }
    }

    /**
     * dom离开时stop
     * @param window0
     */
    leave(window0: Window) {
        if (this.isCurrent()) {
            for (let rule of this.rules()) {
                let windowKey = -1;
                if (window0 !== window) {
                    for (let i = 0; i < window.frames.length; i++) {
                        if (window0 === window.frames[i]) {
                            windowKey = i;
                        }
                    }
                }
                this.observer.stop(rule, window0, windowKey);
            }
        }
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