import { Checker, OrRule, RemoveAction, Rule } from "./base-rules";

/**
 * 页面抽象类
 */
export abstract class Page {
    abstract url: RegExp
    checkerMap: Map<string, Checker[]> = new Map()
    registerRule(params: {
        mainSelector: string
        innerSelector?: string
        bingo?: (element: Element) => boolean
        removeAction?: RemoveAction
    }): void {
        let { mainSelector, innerSelector, bingo = () => true, removeAction = 'display' } = params
        let _checkers = this.checkerMap.get(JSON.stringify({ mainSelector, removeAction }));
        let checkers = _checkers ? _checkers : []
        checkers.push(new Checker(innerSelector, bingo))
        if (!_checkers) {
            this.checkerMap.set(JSON.stringify({ mainSelector, removeAction }), checkers)
        }
    }
    abstract init(): typeof this
    rules(): Rule[] {
        let orRules: OrRule[] = []
        this.checkerMap.forEach((checkers: Checker[], key: string) => {
            let { mainSelector, removeAction } = JSON.parse(key)
            orRules.push(new OrRule(
                mainSelector,
                checkers,
                removeAction
            ))
        })
        return orRules
    }
    working: boolean = false
    startRule() {
        for (const rule of this.rules()) {
            document.arrive(rule.mainSelector, {
                fireOnAttributesModification: true,
                onceOnly: false,
                existing: true
            }, (element: Element) => {
                rule.run(element)
            })
        }
        this.working = true
    }
    stopRule() {
        for (const rule of this.rules()) {
            document.unbindArrive(rule.mainSelector);
        }
        this.working = false
    }
}