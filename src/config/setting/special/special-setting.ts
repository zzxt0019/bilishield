import {CheckType} from "@/config/rule/checker";
import {SettingData} from "@/config/setting/setting-data";
import {SpecialKeys} from "@/config/setting/special/special-settings";

export abstract class SpecialSetting {
    abstract select<T extends SpecialKeys>(key: T): Promise<SettingData<T>[]>

    abstract reset(key: SpecialKeys, data: any): void

    abstract insert(key: SpecialKeys, data: any): void

    abstract update(key: SpecialKeys, data: any): void

    abstract delete(key: SpecialKeys, data: any): void

    abstract type(key: SpecialKeys): CheckType
}