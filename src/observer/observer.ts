import {DoRuleN} from "@/config/rule/do-rule";

export abstract class Observer {
    protected windowKey(window0: Window): number {
        if (window0 === window) {
            return -1;
        }
        for (let i = 0; i < window.frames.length; i++) {
            if (window0 === window.frames[i]) {
                return i;
            }
        }
        return -1;  // 都没有是错的, 默认-1为主window(然后不做处理)
    }

    protected wrKey(rule: DoRuleN, window0: Window): string {
        return this.windowKey(window0) + ':' + rule.mainSelector;
    }

    abstract start(rule: DoRuleN, window: Window, windowKey: number): void

    abstract stop(rule: DoRuleN, window: Window, windowKey: number): void
}