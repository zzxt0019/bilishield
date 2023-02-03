import {SpecialSetting} from "./special-setting";
import {UidUsername} from "./impl/uid-username";
import {Setting} from "@/config/setting/setting";

export const Specials: Record<SpecialKeys, SpecialSetting> = {
    uid: new UidUsername(),
    username: new UidUsername(),
}
const SpecialKeySet: Set<string> = new Set(Object.keys(Specials))

export function isSpecialKeys(key: string): boolean {
    return SpecialKeySet.has(key);
}

export function specialSetting(key: SpecialKeys) {
    return new Setting({
        key: key,
        name: key,
        type: Specials[key].type(key)
    });
}

export type SpecialKeys = 'uid' | 'username';  // 有额外参数