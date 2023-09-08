import "arrive";
import * as MainStatic from './main-static'
import {createBox} from "@/init/create-box";
import {globalInit} from "@/init/global";
import {createStyle} from "@/init/create-style";

(async () => {
    // 全局配置
    globalInit();
    // 检查版本是否更新 更新配置
    // await checkVersion();
    // // 读取配置生成 PageMap
    // let pageMap = readEtc();
    // // 创建ui-box
    createBox()();
    // // 创建隐藏元素的style标签
    createStyle('hide', window.document)();
    // // 追加页面iframe内部屏蔽
    // iframes(pageMap);
    // 油猴菜单展示/隐藏配置
    GM_registerMenuCommand('脚本配置', () => {
        let main = document.querySelector(`#${MainStatic.AppId}>div`) as HTMLDivElement;
        main.style.setProperty('display', main.style?.getPropertyValue('display') === 'none' ? '' : 'none');
    });
})();