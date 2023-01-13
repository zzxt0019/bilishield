import {Settings} from '../setting/setting';
import {Checker, CheckType} from "./checker";
import {DisplayClass} from "@/main-static";


/**
 * 执行的规则
 */
export abstract class DoRule {

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
        if (await this.bingo(mainElement) && !mainElement.classList.contains(DisplayClass)) {
            mainElement.classList.add(DisplayClass)
        }
    }

    /**
     * 显示主体元素
     */
    show(document: Document = window.document) {
        let elements = document.querySelectorAll(this.mainSelector + '.' + DisplayClass)
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove(DisplayClass)
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
                if (await this.bingo0(mainElement, checker)) {
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
            return await checker.bingo(element)
        }
        // 如果是always 中奖
        if (checker.always) {
            return true;
        }
        // 是innerHTML 判断innerHTML是否在data的范围
        if (checker.innerHTML && checker.setting) {
            for (const settingData of await Settings.getSettingValue(checker.setting)) {
                let type: CheckType = checker.type ?? Settings.getCheckType(checker.setting);
                switch (type) {
                    case 'equal':
                        if (element.innerHTML === settingData) {
                            return true;
                        }
                        break;
                    case 'like':
                        if (element.innerHTML.includes(settingData)) {
                            return true;
                        }
                        break;
                    case 'regexp':
                        if (new RegExp(settingData, 'i').test(element.innerHTML)) {
                            return true;
                        }
                        break;
                }
            }
        }
        // 有attribute 判断attribute的value是否在data的范围  元素有这个属性
        if (checker.attribute && checker.setting && element.hasAttribute(checker.attribute)) {
            for (const settingData of await Settings.getSettingValue(checker.setting)) {
                let type: CheckType = checker.type ?? Settings.getCheckType(checker.setting);
                let value: string = element.getAttribute(checker.attribute) as string
                switch (type) {
                    case 'equal':
                        if (value === settingData) {
                            return true;
                        }
                        break;
                    case 'like':
                        if (value.includes(settingData)) {
                            return true;
                        }
                        break;
                    case 'regexp':
                        if (new RegExp(settingData, 'i').test(value)) {
                            return true;
                        }
                        break;
                }
            }
        }
        return false;
    }
}