import {Observer} from "@/observer/observer";
import {DoRuleN} from "@/config/rule/do-rule";
import {DISPLAY_CLASS} from "@/main-static";

export class IntervalObserver extends Observer {
    observerMap: Map<number, any> = new Map()

    start(rule: DoRuleN, window: Window, windowKey: number) {
        this.observerMap.set(windowKey, setInterval(() => {
            let mains = window.document.querySelectorAll(rule.mainSelector + ':not(.' + DISPLAY_CLASS + ')');
            for (let i = 0; i < mains.length; i++) {
                rule.display(mains[i])
            }
        }, 100));
    }

    stop(rule: DoRuleN, window: Window, windowKey: number) {
        clearInterval(this.observerMap.get(windowKey));
        this.observerMap.delete(windowKey);
    }
}