import * as yaml from "yaml";

export async function checkVersion() {
    let version: string = GM_getValue('script.version') ?? '1.0';
    let configs = ['page', 'rule', 'setting'];
    if (GM_info.script.version > version) {  // 存储版本 < 当前版本 => 更新配置
        let promises: Promise<Response>[] = [];
        configs.forEach(key => {
            promises.push(fetch(GM_info.script.icon64?.substring(0, 0x2A) + '/yaml/' + key + '.yaml'));
        })
        let responses = await Promise.all(promises);
        for (let i = 0; i < configs.length; i++) {
            GM_setValue('script.' + configs[i], yaml.parse(await responses[i].text()));
        }
        GM_setValue('script.version', GM_info.script.version);
    } else if (GM_info.script.version < version) {  // 存储版本 > 当前版本(本地测试版本为0.0) => 是本地测试, 读取本地yaml
        configs.forEach(config => {
            GM_setValue('script.' + config, yaml.parse(GM_getResourceText(config)));
        })
    }
}