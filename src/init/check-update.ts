import * as yaml from "yaml";

export async function checkVersion() {
    let version = GM_getValue('script.version');
    if (GM_info.script.version === version) {
        let promises: Promise<Response>[] = [];
        yamlSources.forEach(yamlSource => {
            promises.push(fetch(yamlSource.url));
        });

        let responses = await Promise.all(promises);
        for (let i = 0; i < yamlSources.length; i++) {
            let str = await responses[i].text();
            let uint8Array = new TextEncoder().encode(str);
            console.log(new TextDecoder('gbk').decode(uint8Array));
            // GM_setValue('script.' + yamlSources[i].key, yaml.parse(await responses[i].text()));
        }
        // GM_setValue('script.version', GM_info.script.version);
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