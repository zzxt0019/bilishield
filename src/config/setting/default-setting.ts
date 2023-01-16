import {SettingData} from "@/config/setting/setting-data";

export class DefaultSettings {
    /*******************
     *   原始的4个配置方法
     *******************/
    // 原始的获取配置值
    static _selectSettingData(paramKey: string): SettingData[] {
        return GM_getValue('settings.' + paramKey, []);
    }

    // 原始的设置配置值
    static _resetSettingData(paramKey: string, data: SettingData[]): void {
        GM_setValue('settings.' + paramKey, data);
    }

    // 原始的添加配置值
    static _insertSettingData(paramKey: string, newData: SettingData[]): void {
        let oldData = DefaultSettings._selectSettingData(paramKey);
        let oldKeys = new Set(oldData.map(sd => sd.key));
        oldData.push(...newData.filter(sd => !oldKeys.has(sd.key)));
        DefaultSettings._resetSettingData(paramKey, oldData);
    }

    static _updateSettingData(paramKey: string, newData: SettingData[]): void {
        let oldData = DefaultSettings._selectSettingData(paramKey);
        let newMap = new Map<string, SettingData>();
        newData.forEach(sd => newMap.set(sd.key, sd));
        oldData.forEach(sd => {
            if (newMap.has(sd.key)) {
                sd.hide = newMap.get(sd.key)!.hide;
                sd.expireTime = newMap.get(sd.key)!.expireTime;
            }
        })
        DefaultSettings._resetSettingData(paramKey, oldData);
    }

    // 原始的删除配置值
    static _deleteSettingData(paramKey: string, key: string[]): void {
        let delKeys: Set<string> = new Set(key)
        DefaultSettings._resetSettingData(paramKey, DefaultSettings._selectSettingData(paramKey).filter(item => !delKeys.has(item.key)));
    }
}