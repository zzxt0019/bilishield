import * as yaml from "yaml";

export async function checkVersion() {
    let version: string = GM_getValue('script.version') ?? '1.0';
    if (GM_info.script.version > version) {  // 存储版本 < 当前版本 => 更新配置
        let dataJsonRes = await fetch(GM_info.script.icon64?.substring(0, 0x25) + '/data.json');
        let yamlJson = (await dataJsonRes.json()).yaml;
        let promises: Promise<any>[] = [];
        let keys: { key: string, fileName: string }[] = []
        Object.entries(yamlJson).forEach(([key, value]) => {
            Object.keys(value as any).forEach(fileName => {
                keys.push({key, fileName})
                promises.push(fetch(GM_info.script.icon64?.substring(0, 0x25) + '/yaml/' + key + '/' + fileName));
            });
        });
        let data: any = {};
        let responses = await Promise.all(promises)
        for (let i = 0; i < responses.length; i++) {
            let res = responses[i];
            let text = await res.text()
            let key = keys[i];
            if (key.key === 'rule') {
                data[key.key] = {...data[key.key], ...ruleKey(yaml.parse(text), key.fileName.substring(0, key.fileName.lastIndexOf('.')))};
            } else {
                data[key.key] = {...data[key.key], ...yaml.parse(text)};
            }
        }
        Object.entries(data).forEach(([key, value]) => {
            GM_setValue('script.' + key, value);
        });
        GM_setValue('script.version', GM_info.script.version);
    } else if (GM_info.script.version < version) {  // 存储版本 > 当前版本(本地测试版本为0.0) => 是本地测试, 读取本地yaml
        let dataJson = GM_getResourceText('data.json');
        let yamlJson = JSON.parse(dataJson).yaml;
        let data: any = {page: {}, rule: {}, setting: {}};
        Object.entries(yamlJson).forEach(([key, value]) => {
            Object.keys(value as any).forEach(fileName => {
                data[key] = {...data[key], ...yaml.parse(GM_getResourceText(key + '-' + fileName))};
            })
        });
        Object.entries(data).forEach(([key, value]) => {
            GM_setValue('script.' + key, value);
        });
    }
}

function ruleKey(oldJson: any, key: string) {
    let newJson: any = {};
    Object.entries(oldJson).forEach(([_key, _value]) => {
        newJson[key + '-' + _key] = _value;
    })
    return newJson;
}