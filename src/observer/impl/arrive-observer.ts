import {Observer} from "@/observer/observer";
import {DoRuleN} from "@/config/rule/do-rule";

export class ArriveObserver extends Observer {

    start(rule: DoRuleN, window: Window, windowKey: number) {
        window.document.arrive(rule.mainSelector, {
            fireOnAttributesModification: true,
            existing: true,
        }, (mainElement: Element) => {
            rule.display(mainElement);
        })
    }

    stop(rule: DoRuleN, window: Window, windowKey: number) {
        window.document.unbindArrive(rule.mainSelector);
    }
}