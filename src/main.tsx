import "arrive";
import React from "react";
import * as STATIC from './main-static'
import {readEtc} from "@/init/read-etc";
import {checkVersion} from "@/init/check-update";
import {createBox} from "@/init/create-box";
import {createDisplayStyle} from "@/init/create-display-style";
import {iframes} from "@/init/iframes";
import {globalInit} from "@/init/global";

(async () => {
    // 全局配置
    globalInit();
    // 检查版本是否更新 更新配置
    await checkVersion();
    // 读取配置生成 PageMap
    let pageMap = readEtc();
    // 创建ui-box
    createBox(pageMap)();
    // 创建隐藏元素的style标签
    createDisplayStyle('hide', window.document)();
    // 追加页面iframe内部屏蔽
    iframes(pageMap);
    // 油猴菜单展示/隐藏配置
    GM_registerMenuCommand('配置', () => {
        let main = document.querySelector('#' + STATIC.APP_ID + ' div') as HTMLDivElement;
        main.style.setProperty('display', main.style?.getPropertyValue('display') === 'none' ? '' : 'none');
    });
})();