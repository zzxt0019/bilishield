import * as yaml from "yaml";

export async function checkVersion() {
    let version: string = GM_getValue('script.version') ?? '1.0';
    if (GM_info.script.version > version) {  // 存储版本 < 当前版本 => 更新配置
        let promises: Promise<Response>[] = [];
        yamlSources.forEach(yamlSource => {
            promises.push(fetch(yamlSource.url));
        });

        let responses = await Promise.all(promises);
        for (let i = 0; i < yamlSources.length; i++) {
            GM_setValue('script.' + yamlSources[i].key, yaml.parse(await responses[i].text()));
        }
        GM_setValue('script.version', GM_info.script.version);
    } else if (GM_info.script.version < version) {  // 存储版本 > 当前版本(本地测试版本为0.0) => 是本地测试, 读取本地yaml
        yamlSources.forEach(yamlSource => {
            GM_setValue('script.' + yamlSource.key, yaml.parse(GM_getResourceText(yamlSource.key)));
        })
    }
}

/**
 * 配置源
 */
const yamlSources: YamlSource[] = [
    {
        key: 'page',
        url: 'https://zzxt0019.github.io/bilishield/page.yaml'
    },
    {
        key: 'rule',
        url: 'https://zzxt0019.github.io/bilishield/rule.yaml'
    }, {
        key: 'setting',
        url: 'https://zzxt0019.github.io/bilishield/setting.yaml'
    },
]

interface YamlSource {
    key: 'page' | 'rule' | 'setting'
    url: string
}