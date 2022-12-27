import {DefaultSettings} from "./default-setting";
import {SpecialSetting} from "./special/special-setting";
import {SpecialSettings} from './special/special-settings';
import {CheckType} from "@/config/rule/checker";

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

    // 加入特殊配置后的获取配置值
    static async getSettingValue(param: string | Setting): Promise<string[]> {
        let key = typeof param === 'string' ? param : param.key
        if (SpecialSettings.sp.has(key)) {
            return (SpecialSettings.sp.get(key) as SpecialSetting).get(key)()
        } else {
            return DefaultSettings._getSettingValue(param)
        }
    }

    // 加入特殊配置后的设置配置值
    static setSettingValue(param: string | Setting, data: string[]): void {
        let key = typeof param === 'string' ? param : param.key
        if (SpecialSettings.sp.has(key)) {
            return (SpecialSettings.sp.get(key) as SpecialSetting).set(key)(data)
        } else {
            DefaultSettings._setSettingValue(param, data)
        }
    }

    // 加入特殊配置后的添加配置值
    static addSettingValue(param: string | Setting, data: string | string[]): void {
        let key = typeof param === 'string' ? param : param.key
        if (SpecialSettings.sp.has(key)) {
            return (SpecialSettings.sp.get(key) as SpecialSetting).add(key)(data)
        } else {
            DefaultSettings._addSettingValue(param, data)
        }
    }

    // 加入特殊配置后的删除配置值
    static delSettingValue(param: string | Setting, data: string | string[]): void {
        let key = typeof param === 'string' ? param : param.key
        if (SpecialSettings.sp.has(key)) {
            return (SpecialSettings.sp.get(key) as SpecialSetting).del(key)(data)
        } else {
            DefaultSettings._delSettingValue(param, data)
        }
    }

    static getCheckType(param: string | Setting): CheckType {
        let key = typeof param === 'string' ? param : param.key
        if (SpecialSettings.sp.has(key)) {
            return (SpecialSettings.sp.get(key) as SpecialSetting).type(key)()
        } else {
            return (Settings.getSystemSettings().get(key) as Setting).type
        }
    }
}