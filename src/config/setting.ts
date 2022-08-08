/**
 * 数据配置
 */
export class Setting {
    key: string
    name: string
    data: string[]
    constructor(setting: Setting) {
        this.key = setting.key
        this.name = setting.name
        this.data = setting.data
    }
}
import * as yaml from "yaml"
import settingText from '../yaml/setting.yaml'
export class Settings {
    static settings: any
    static {
        Settings.settings = yaml.parse(settingText)
    }
    static getSetting(key: string): string[] {
        // return this.settings[key].data
        return GM_getValue('settings.'+key, {data:[]}).data
    }
}