/**
 * 总规则
 */
export interface Rule {
    mainSelector: string
    ifRemove(element: Element): boolean
}
export abstract class HasRule implements Rule {
    abstract mainSelector: string
    abstract innerSelector: string | undefined
    bingo(innerElement: Element) {
        return false;
        // return inCard(innerElement.outerHTML)
    }
    ifRemove(element: Element) {
        if (this.innerSelector === undefined) {
            // undefined 本层
            if (this.bingo(element)) {
                return true;
            }
        } else {
            // string 下层
            let elements = element.querySelectorAll(this.innerSelector)
            for (let i = 0; i < elements.length; i++) {
                const ele = elements[i];
                if (this.bingo(ele)) {
                    return true;
                }
            }
        }
        return false;
    }
}