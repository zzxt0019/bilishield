import {SettingData, SettingDataType} from "@/config/setting/setting-data";

export class DefaultSettings {
    /*******************
     *   原始的4个配置方法
     *******************/
    // 原始的获取配置值
    static _selectSettingData<T extends SettingDataType = undefined>(paramKey: string): SettingData<T>[] {
        let data: SettingData<T>[] = GM_getValue('settings.' + paramKey, []);
        const now = Date.now();
        let checkedData = data.filter(datum => !datum.expireTime || datum.expireTime > now);
        if (checkedData.length !== data.length) {
            GM_setValue('setting.' + paramKey, checkedData);
        }
        return checkedData;
    }

    // 原始的设置配置值
    static _resetSettingData(paramKey: string, data: SettingData[]): void {
        GM_setValue('settings.' + paramKey, data);
    }

    // 原始的添加配置值
    static _insertSettingData(paramKey: string, newData: SettingData[]): void {
        let oldData = DefaultSettings._selectSettingData(paramKey);
        let oldKeys = new Set(oldData.map(datum => datum.key));
        oldData.push(...newData.filter(datum => !oldKeys.has(datum.key)));
        DefaultSettings._resetSettingData(paramKey, oldData);
    }

    static _updateSettingData(paramKey: string, newData: SettingData[]): void {
        let oldData = DefaultSettings._selectSettingData(paramKey);
        let newMap = new Map<string, SettingData>();
        newData.forEach(datum => newMap.set(datum.key, datum));
        oldData.forEach(datum => {
            if (newMap.has(datum.key)) {
                datum.hide = newMap.get(datum.key)!.hide;
                datum.expireTime = newMap.get(datum.key)!.expireTime;
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