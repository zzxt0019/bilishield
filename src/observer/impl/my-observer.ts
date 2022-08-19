import {Observer} from "@/observer/observer";
import {DoRuleN} from "@/config/rule/do-rule";
import {DISPLAY_CLASS} from "@/main-static";

export class MyObserver extends Observer {
    observerMap: Map<string, MutationObserver> = new Map()

    start(rule: DoRuleN, window: Window, windowKey: number) {
        if (!this.observerMap.has(windowKey + ':' + rule.mainSelector)) {
            let mains = window.document.querySelectorAll(rule.mainSelector + ':not(.' + DISPLAY_CLASS + ')');
            for (let i = 0; i < mains.length; i++) {
                rule.display(mains[i])
            }
            let observer = new MutationObserver(() => {
                let mains = window.document.querySelectorAll(rule.mainSelector + ':not(.' + DISPLAY_CLASS + ')');
                for (let i = 0; i < mains.length; i++) {
                    rule.display(mains[i])
                }
            });
            observer.observe(window.document, {childList: true, subtree: true})
            this.observerMap.set(windowKey + ':' + rule.mainSelector, observer);
        }
    }

    stop(rule: DoRuleN, window: Window, windowKey: number) {
        this.observerMap.get(windowKey + ':' + rule.mainSelector)?.disconnect();
        this.observerMap.delete(windowKey + ':' + rule.mainSelector);
    }
}