import { initLivePage } from "./live-page-rules";
import { initMainPage } from "./main-page-rules";
import { initVideoPage } from "./video-page-rules";
/**
 * 规则接口
 */
export interface Rule {
    /**
     * 主选择器
     */
    mainSelector: string
    /**
     * 是否移除
     * @param mainElement 主对象
     * @returns {boolean} 是否移除
     */
    ifRemove(mainElement: Element): boolean
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
    constructor(public mainSelector: string, public checkers: Checker[]) {
    }
    ifRemove(element: Element): boolean {
        for (const checker of this.checkers) {
            if (checker.check(element)) {
                return true;
            }
        }
        return false;
    }
}
/**
 * 注册进来的检查器集合
 */
let checkerMap: Map<string, Checker[]> = new Map()
/**
 * 注册检查器
 * @param mainSelector 主选择器 
 * @param innerSelector 内部选择器
 * @param bingo 内部对象是否符合删除标准
 */
export function registerRule(mainSelector: string, innerSelector: string | undefined, bingo: (element: Element) => boolean): void {
    let _checkers = checkerMap.get(mainSelector);
    let checkers = _checkers ? _checkers : []
    checkers.push(new Checker(innerSelector, bingo))
    if (!_checkers) {
        checkerMap.set(mainSelector, checkers)
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
    checkerMap.forEach((checkers: Checker[], mainSelector: string) => {
        orRules.push(new OrRule(
            mainSelector,
            checkers
        ))
    })
    return orRules
}