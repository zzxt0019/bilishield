import { Settings } from '../setting/setting';
import { Checker } from "./checker";

/**
 * 执行的规则
 */
export abstract class DoRule {
    private static readonly DISPLAYED_CLASS = 'testtest'
    constructor(public mainSelector: string) {

    }
    /**
     * 主体是否中奖
     * @param mainElement 主体元素
     */
    abstract bingo(mainElement: Element): Promise<boolean>
    /**
     * 隐藏主体元素
     * @param mainElement 主体元素
     */
    async display(mainElement: Element) {
        if (await this.bingo(mainElement)) {
            (mainElement as any).style.setProperty('background-color', 'yellow');
            mainElement.classList.add(DoRule.DISPLAYED_CLASS)
        }
    }
    /**
     * 显示主体元素
     */
    show() {
        let elements = document.querySelectorAll(this.mainSelector + '.' + DoRule.DISPLAYED_CLASS)
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            (element as any).style.setProperty('background-color', '')
            element.classList.remove(DoRule.DISPLAYED_CLASS)
        }
    }

}
/**
 * 执行的多规则
 */
export class DoRuleN extends DoRule {
    constructor(public mainSelector: string, public checkers: Checker[]) {
        super(mainSelector)
    }
    async bingo(mainElement: Element): Promise<boolean> {
        // 所有检查器之中满足一个即为中奖
        for (const checker of this.checkers) {
            if (checker.innerSelector) {
                // 有内部选择器, 选择所有内部元素判断, 满足一个即为中奖
                let elements = mainElement.querySelectorAll(checker.innerSelector)
                for (let i = 0; i < elements.length; i++) {
                    const element = elements[i];
                    if (await this.bingo0(element, checker)) {
                        return true;
                    }
                }
            } else {
                // 没有内部选择器, 即为当前元素, 判断
                let element = mainElement
                if (await this.bingo0(element, checker)) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * 判断当前一个元素是否中奖
     * @param element 当前元素
     * @param checker 内部检查器
     * @returns 是否中奖
     */
    async bingo0(element: Element, checker: Checker): Promise<boolean> {
        if (checker.bingo) {
            return checker.bingo(element)
        }
        // 如果是always 中奖
        if (checker.always) {
            return true;
        }
        // 是innerHTML 判断innerHTML是否在data的范围
        if (checker.innerHTML && checker.setting) {
            for (const settingData of await Settings.getSettingValue(checker.setting)) {
                if (element.innerHTML.includes(settingData)) {
                    return true;
                }
            }
        }
        // 有attribute 判断attribute的value是否在data的范围
        if (checker.attribute && checker.setting) {
            for (const settingData of await Settings.getSettingValue(checker.setting)) {
                if (element.getAttribute(checker.attribute)?.includes(settingData)) {
                    return true;
                }
            }
        }
        return false;
    }
}