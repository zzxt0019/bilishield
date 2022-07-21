import { initMainPage } from "./main-page-rules";
import { initVideoPage } from "./video-page-rules";
export interface Rule {
    mainSelector: string
    ifRemove(element: Element): boolean
}
export class Checker {
    constructor(public innerSelector: string | undefined, public bingo: (element: Element) => boolean) {
    }
    check(mainElement: Element): boolean {
        if (this.innerSelector) {
            let elements = mainElement.querySelectorAll(this.innerSelector)
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                if (this.bingo(element)) {
                    return true;
                }
            }
        }
        return false;
    }
}
export class BaseRule implements Rule {
    mainSelector: string;
    checker: Checker;
    constructor(mainSelector: string, innerSelector: string, bingo: (element: Element) => boolean) {
        this.mainSelector = mainSelector
        this.checker = new Checker(innerSelector, bingo)
    }
    ifRemove(element: Element): boolean {
        return this.checker.check(element)
    }
}
class OrRule implements Rule {
    ifRemove(element: Element): boolean {
        for (const checker of this.checkers) {
            if (checker.check(element)) {
                return true;
            }
        }
        return false;
    }
    constructor(public mainSelector: string, public checkers: Checker[]) {
    }
}
export let baseRules: BaseRule[] = []
export function initRules(): OrRule[] {
    initMainPage()
    initVideoPage()
    console.log(baseRules.length)
    let map: Map<string, BaseRule[]> = new Map()
    for (const baseRule of baseRules) {
        let arr0 = map.get(baseRule.mainSelector)
        let arr = arr0 ? arr0 : []
        arr.push(baseRule)
        map.set(baseRule.mainSelector, arr)
    }
    let orRules: OrRule[] = []
    map.forEach((baseRules: BaseRule[], mainSelector: string) => {
        orRules.push(new OrRule(
            mainSelector,
            baseRules.map(baseRule => baseRule.checker)
        ))
    })
    console.log(orRules)
    return orRules
}