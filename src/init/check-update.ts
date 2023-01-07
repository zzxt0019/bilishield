import * as yaml from "yaml";

export async function checkVersion() {
    let version: string = GM_getValue('script.version') ?? '1.0';
    let configs = ['page', 'rule', 'setting'];
    // if (GM_info.script.version > version) {  // 存储版本 < 当前版本 => 更新配置
        let jsonPromises: Promise<Response>[] = [];
        configs.forEach(key => {
            jsonPromises.push(fetch(GM_info.script.icon64?.substring(0, 0x25) + '/yaml/' + key + '/data.json'));
        })
        let jsonResponses = await Promise.all(jsonPromises);
    let yamlPromises: Promise<Response>[][] = [];
    for (let i = 0; i < configs.length; i++) {
        let arr = await jsonResponses[i].json();
        yamlPromises.push([])
        arr.forEach((yaml:any)=>{
            yamlPromises[i].push(fetch(GM_info.script.icon64?.substring(0, 0x25) + '/yaml/' + configs[i] + yaml));
        })
    }
    for (let i = 0; i < yamlPromises.length; i++) {
        let yamlResponses = await Promise.all(yamlPromises[i]);
        yamlResponses.forEach(async yamlResponse=>{
            console.log(configs[i] , yaml.parse(await yamlResponse.text()));
        })
    }


        // for (let i = 0; i < configs.length; i++) {
        //     GM_setValue('script.' + configs[i], yaml.parse(await responses[i].text()));
        // }
    //     GM_setValue('script.version', GM_info.script.version);
    // } else if (GM_info.script.version < version) {  // 存储版本 > 当前版本(本地测试版本为0.0) => 是本地测试, 读取本地yaml
    //     configs.forEach(config => {
    //         GM_setValue('script.' + config, yaml.parse(GM_getResourceText(config)));
    //     })
    // }
}