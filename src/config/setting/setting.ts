import {DefaultSettings} from "./default-setting";
import {isSpecialKeys, SpecialKeys, Specials} from './special/special-settings';
import {CheckType} from "@/config/rule/checker";
import {SettingData, SettingDataBase} from "@/config/setting/setting-data";

/**
 * 数据配置
 */
export class Setting {
    key: string
    name: string
    type: CheckType

    constructor(setting: Setting) {
        this.key = setting.key
        this.name = setting.name
        this.type = setting.type
    }
}

export class Settings {
    static settingMap: Map<string, Setting>

    static getSystemSettings(): Map<string, Setting> {
        if (!Settings.settingMap) {
            let obj: any = GM_getValue('script.setting');
            Settings.settingMap = new Map()
            Object.keys(obj).forEach(key => {
                let setting = obj[key]
                setting.key = key
                Settings.settingMap.set(key, setting)
            })
        }
        return Settings.settingMap
    }

    static toSettingData(data: string | string[] | SettingData | SettingData[]): SettingData[] {
        if (Array.isArray(data)) {
            if (data.length === 0) {
                return [];
            } else {
                if (typeof data[0] === 'string') {
                    return (data as string[]).map(str => new SettingDataBase({key: str}));
                } else {
                    return data as SettingData[];
                }
            }
        } else {
            if (typeof data === 'string') {
                return [{key: data}];
            } else {
                return [data];
            }
        }
    }

    static toSettingKey(data: string | string[] | SettingData | SettingData[]): string[] {
        if (Array.isArray(data)) {
            if (data.length === 0) {
                return [];
            } else {
                if (typeof data[0] === 'string') {
                    return data as string[];
                } else {
                    return (data as SettingData[]).map(datum => datum.key);
                }
            }
        } else {
            if (typeof data === 'string') {
                return [data];
            } else {
                return [data.key];
            }
        }
    }

    // 加入特殊配置后的获取配置值
    static async selectSettingData<T extends (Exclude<string, SpecialKeys> | SpecialKeys)>(paramKey: T)
        : Promise<(T extends SpecialKeys ? SettingData<T> : SettingData)[]> {
        if (isSpecialKeys(paramKey)) {
            return await Specials[paramKey as SpecialKeys].select(paramKey as SpecialKeys) as any
        } else {
            return DefaultSettings._selectSettingData(paramKey as string) as any
        }
    }

    static async selectSettingDataString<T extends Exclude<string, SpecialKeys> | SpecialKeys>(paramKey: string)
        : Promise<string[]> {
        if (isSpecialKeys(paramKey)) {
            return (await this.selectSettingData(paramKey)).map(item => (item as any)[paramKey]);
        } else {
            return (await this.selectSettingData(paramKey)).map(item => item.key);
        }
    }

    // 加入特殊配置后的设置配置值
    static resetSettingData(paramKey: string, data: SettingData[] | string[]): void {
        let settingData = this.toSettingData(data);
        if (isSpecialKeys(paramKey)) {
            return Specials[paramKey as SpecialKeys].reset(paramKey as SpecialKeys, settingData);
        } else {
            DefaultSettings._resetSettingData(paramKey, settingData);
        }
    }

    // 加入特殊配置后的添加配置值
    static insertSettingData(paramKey: string, data: SettingData | SettingData[] | string | string[]): void {
        let settingData = this.toSettingData(data);
        if (isSpecialKeys(paramKey)) {
            return Specials[paramKey as SpecialKeys].insert(paramKey as SpecialKeys, settingData);
        } else {
            DefaultSettings._insertSettingData(paramKey, settingData)
        }
    }

    // 加入特殊配置后的修改配置值
    static updateSettingData(paramKey: string, data: SettingData | SettingData[] | string | string[]): void {
        let settingData = this.toSettingData(data);
        if (isSpecialKeys(paramKey)) {
            return Specials[paramKey as SpecialKeys].update(paramKey as SpecialKeys, settingData);
        } else {
            DefaultSettings._updateSettingData(paramKey, settingData)
        }
    }

    // 加入特殊配置后的删除配置值
    static deleteSettingData(paramKey: string, data: SettingData | SettingData[] | string | string[]): void {
        let settingKey = this.toSettingKey(data);
        if (isSpecialKeys(paramKey)) {
            return Specials[paramKey as SpecialKeys].delete(paramKey as SpecialKeys, settingKey);
        } else {
            DefaultSettings._deleteSettingData(paramKey, settingKey);
        }
    }

    static getCheckType(paramKey: string): CheckType {
        if (isSpecialKeys(paramKey)) {
            return Specials[paramKey as SpecialKeys].type(paramKey as SpecialKeys);
        } else {
            return (Settings.getSystemSettings().get(paramKey) as Setting).type;
        }
    }
}