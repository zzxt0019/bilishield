import { initLivePage } from "./live-page-rules";
import { initMainPage } from "./main-page-rules";
import { initVideoPage } from "./video-page-rules";
type removeAction = 'remove' | 'display'
/**
 * 规则接口
 */
export interface Rule {
    /**
     * 主选择器
     */
    mainSelector: string
    removeAction: removeAction
    /**
     * 是否移除
     * @param mainElement 主对象
     * @returns {boolean} 是否移除
     */
    ifRemove(mainElement: Element): boolean
    /**
     * 执行规则
     * @param mainElement 主对象 
     */
    run(mainElement: Element): void
}
/**
 * 检查器
 */
export class Checker {
    /**
     * 
     * @param innerSelector 内部选择器
     * @param bingo 内部对象是否符合删除标准
     */
    constructor(public innerSelector: string | undefined, public bingo: (element: Element) => boolean) {
    }
    /**
     * 
     * @param mainElement 主对象
     * @returns {boolean} 是否移除
     */
    check(mainElement: Element): boolean {
        if (this.innerSelector) {
            let elements = mainElement.querySelectorAll(this.innerSelector)
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                if (this.bingo(element)) {
                    return true;
                }
            }
        } else {
            if (this.bingo(mainElement)) {
                return true;
            }
        }
        return false;
    }
}
/**
 * OR规则
 * 满足任意一个检查器 即删除
 */
class OrRule implements Rule {
    constructor(public mainSelector: string, public checkers: Checker[], public removeAction: removeAction = 'remove') {
    }
    ifRemove(element: Element): boolean {
        for (const checker of this.checkers) {
            if (checker.check(element)) {
                return true;
            }
        }
        return false;
    }
    run(element: Element): void {
        if (this.ifRemove(element)) {
            switch (this.removeAction) {
                case 'remove':
                    element.remove()
                    break;
                case 'display':
                    (element as any).style.setProperty('display', 'none', 'important')
                    break;
            }
        }
    }
}
/**
 * 注册进来的检查器集合
 * key: { mainSelector, removeAction }
 */
let checkerMap: Map<string, Checker[]> = new Map()

export function registerRule(params: {
    mainSelector: string
    innerSelector?: string
    bingo?: (element: Element) => boolean
    removeAction?: removeAction
}): void {
    let { mainSelector, innerSelector, bingo, removeAction } = params
    let _checkers = checkerMap.get(JSON.stringify({ mainSelector, removeAction }));
    let checkers = _checkers ? _checkers : []
    checkers.push(new Checker(innerSelector, bingo ?? (() => true)))
    if (!_checkers) {
        checkerMap.set(JSON.stringify({ mainSelector, removeAction }), checkers)
    }
}
/**
 * 初始化规则
 * @returns 规则
 */
export function initRules(): Rule[] {
    initMainPage()
    initVideoPage()
    initLivePage()
    let orRules: OrRule[] = []
    checkerMap.forEach((checkers: Checker[], key: string) => {
        let { mainSelector, removeAction } = JSON.parse(key)
        orRules.push(new OrRule(
            mainSelector,
            checkers,
            removeAction
        ))
    })
    return orRules
}