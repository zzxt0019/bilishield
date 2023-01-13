import {Observer} from "@/observer/observer";
import {DoRuleN} from "@/config/rule/do-rule";
import {DisplayClass} from "@/main-static";

export class MyObserver extends Observer {
    private observerMap: Map<string, MutationObserver> = new Map()

    start(rule: DoRuleN, window: Window) {
        let key = this.wrKey(rule, window);
        if (!this.observerMap.has(key)) {
            this.handle(rule, window);  // start处理(第一次)
            let observer = new MutationObserver(() => {
                this.handle(rule, window);  // 变化后处理
            });
            observer.observe(window.document, {childList: true, subtree: true})
            this.observerMap.set(key, observer);
        }
    }

    private handle(rule: DoRuleN, window: Window) {
        let mains = window.document.querySelectorAll(rule.mainSelector + ':not(.' + DisplayClass + ')');
        for (let i = 0; i < mains.length; i++) {
            rule.display(mains[i])
        }
    }

    stop(rule: DoRuleN, window: Window) {
        let key = this.wrKey(rule, window);
        this.observerMap.get(key)?.disconnect();
        this.observerMap.delete(key);
    }
}