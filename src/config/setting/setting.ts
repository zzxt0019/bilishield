import * as yaml from "yaml";
import settingText from '../yaml/setting.yaml';
import { DefaultSettings } from "./default-setting";
import { SpecialSetting } from "./special/special-setting";
import { UidUsername } from './special/uid-username';
/**
 * 数据配置
 */
export class Setting {
    key: string
    name: string
    constructor(setting: Setting) {
        this.key = setting.key
        this.name = setting.name
    }
}
export class Settings {
    static settingMap: Map<string, Setting>
    static {  // 解析settingText到settingMap
        let obj = yaml.parse(settingText)
        Settings.settingMap = new Map()
        Object.keys(obj).forEach(key => {
            Settings.settingMap.set(key, { key, name: obj[key] })
        })
    }
    static sp: Map<string, SpecialSetting> = new Map()
    static {  // 初始化特殊配置
        Settings.sp.set('uid', new UidUsername())
        Settings.sp.set('username', Settings.sp.get('uid') as UidUsername)

    }
    static getSystemSettings(): Map<string, Setting> {
        return Settings.settingMap
    }

    // 加入特殊配置后的获取配置值
    static getSettingValue(param: string | Setting): string[] {
        let key = typeof param === 'string' ? param : param.key
        if (Settings.sp.has(key)) {
            return (Settings.sp.get(key) as SpecialSetting).get(key)()
        } else {
            return DefaultSettings._getSettingValue(param)
        }
    }
    // 加入特殊配置后的设置配置值
    static setSettingValue(param: string | Setting, data: string[]): void {
        let key = typeof param === 'string' ? param : param.key
        if (Settings.sp.has(key)) {
            return (Settings.sp.get(key) as SpecialSetting).set(key)(data)
        } else {
            DefaultSettings._setSettingValue(param, data)
        }
    }
    // 加入特殊配置后的添加配置值
    static addSettingValue(param: string | Setting, data: string | string[]): void {
        let key = typeof param === 'string' ? param : param.key
        if (Settings.sp.has(key)) {
            return (Settings.sp.get(key) as SpecialSetting).add(key)(data)
        } else {
            DefaultSettings._addSettingValue(param, data)
        }
    }
    // 加入特殊配置后的删除配置值
    static delSettingValue(param: string | Setting, data: string | string[]): void {
        let key = typeof param === 'string' ? param : param.key
        if (Settings.sp.has(key)) {
            return (Settings.sp.get(key) as SpecialSetting).del(key)(data)
        } else {
            DefaultSettings._delSettingValue(param, data)
        }
    }
}