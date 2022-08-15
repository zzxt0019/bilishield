import {SpecialSetting} from "./special-setting";
import {UidUsername} from "./impl/uid-username";

export class SpecialSettings {
    static sp: Map<string, SpecialSetting> = new Map()
    static {
        this.sp.set('uid', new UidUsername())
        this.sp.set('username', this.sp.get('uid') as UidUsername)
    }
}