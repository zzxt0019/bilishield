export class SettingDataBase {
    key!: string;
    hide?: boolean;
    expireTime?: number;

    constructor(settingData: SettingDataBase) {
        this.key = settingData.key;
        this.hide = settingData.hide;
        this.expireTime = settingData.expireTime;
    }
}

export type SettingDataType = Exclude<string | undefined, 'key' | 'hide' | 'expireTime'>;
export type SettingData<T extends Exclude<string | undefined, 'key' | 'hide' | 'expireTime'> = undefined> =
    T extends undefined ? SettingDataBase : (SettingDataBase & Record<Extract<T, string>, string>);