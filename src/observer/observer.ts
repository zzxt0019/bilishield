import {DoRuleN} from "@/config/rule/do-rule";

export abstract class Observer {

    abstract start(rule: DoRuleN, window: Window, windowKey: number): void

    abstract stop(rule: DoRuleN, window: Window, windowKey: number): void
}