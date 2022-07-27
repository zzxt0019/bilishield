export type RemoveAction = 'remove' | 'display'
/**
 * 规则接口
 */
export interface Rule {
    /**
     * 主选择器
     */
    mainSelector: string
    removeAction: RemoveAction
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
export class OrRule implements Rule {
    constructor(public mainSelector: string, public checkers: Checker[], public removeAction: RemoveAction) {
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