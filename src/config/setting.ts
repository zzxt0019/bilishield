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
import * as yaml from "yaml"
import settingText from '../yaml/setting.yaml'
export class Settings {
    static settingMap: Map<string, Setting>
    static {
        // 解析settingText到settingMap
        let obj = yaml.parse(settingText)
        Settings.settingMap = new Map()
        Object.keys(obj).forEach(key => {
            Settings.settingMap.set(key, { key, name: obj[key] })
        })
    }
    static getSystemSettings(): Map<string, Setting> {
        return Settings.settingMap
    }
    static getSettingValue(param: string | Setting): string[] {
        // return this.settings[key].data
        let key = typeof param === 'string' ? param : param.key
        return GM_getValue('settings.' + key, [])
    }
    static setSettingValue(param: string | Setting, data: string[]): void {
        let key = typeof param === 'string' ? param : param.key
        GM_setValue('settings.' + key, data)
    }
    static addSettingValue(param: string | Setting, data: string | string[]): void {
        console.log('param',param,'data',data)
        let oldData = Settings.getSettingValue(param)
        oldData.push(...typeof data === 'string' ? [data] : data)
        Settings.setSettingValue(param, [...new Set(oldData)])
    }
    static delSettingValue(param: string | Setting, data: string | string[]): void {
        let delSet: Set<string> = new Set(typeof data === 'string' ? [data] : data)
        Settings.setSettingValue(param, Settings.getSettingValue(param).filter(item => !delSet.has(item)))
    }
}