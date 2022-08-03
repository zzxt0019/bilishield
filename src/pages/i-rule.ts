import { IPage } from './i-page';
import { ISetting } from './i-setting';
export class IRule {
    key: string
    page: IPage
    mainSelector: string
    innerSelector: string
    condition: Condition
    setting: ISetting
    constructor(obj: IRule) {
        this.key = obj.key
        this.page = obj.page
        this.mainSelector = obj.mainSelector
        this.innerSelector = obj.innerSelector
        this.condition = obj.condition
        this.setting = obj.setting
    }
}
export class Condition {
    attribute?: string
    innerHTML?: boolean
    constructor(obj: Condition) {
        this.attribute = obj.attribute
        this.innerHTML = obj.innerHTML
    }
}