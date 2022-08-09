import { Setting } from "./setting"

export class DefaultSettings {
    /*******************
     *   原始的4个配置方法
     *******************/
    // 原始的获取配置值
    static _getSettingValue(param: string | Setting): string[] {
        let key = typeof param === 'string' ? param : param.key
        return GM_getValue('settings.' + key, [])
    }
    // 原始的设置配置值
    static _setSettingValue(param: string | Setting, data: string[]): void {
        let key = typeof param === 'string' ? param : param.key
        GM_setValue('settings.' + key, data)
    }
    // 原始的添加配置值
    static _addSettingValue(param: string | Setting, data: string | string[]): void {
        let oldData = DefaultSettings._getSettingValue(param)
        oldData.push(...typeof data === 'string' ? [data] : data)
        DefaultSettings._setSettingValue(param, [...new Set(oldData)])
    }
    // 原始的删除配置值
    static _delSettingValue(param: string | Setting, data: string | string[]): void {
        let delSet: Set<string> = new Set(typeof data === 'string' ? [data] : data)
        DefaultSettings._setSettingValue(param, DefaultSettings._getSettingValue(param).filter(item => !delSet.has(item)))
    }
}