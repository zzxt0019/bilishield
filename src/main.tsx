import "arrive";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import styleText from './main.raw.css';
import { Box } from "./view/box";
init();
function init(): void {
     console.log(GM_listValues())
     GM_listValues().forEach(key => {
          console.log(key, GM_getValue(key))
     })
     GM_deleteValue('settings.undefined')
     // console.log(GM_setValue('settings', ['baidu_setting']))
     // console.log(GM_setValue('settings.baidu_setting', {key:'baidu_setting',name:'百度配置',data:['ts']}))
     let root = createReact();
     createStyle()
     // 监听APP_ID
     document.leave('#APP_ID', {
          fireOnAttributesModification: true,
          onceOnly: false,
          existing: false
     }, () => {
          root.unmount()
          root = createReact()
     })
     // 监听STYLE_ID
     document.leave('#STYLE_ID', {
          fireOnAttributesModification: true,
          onceOnly: false,
          existing: false
     }, () => {
          createStyle()
     })
}
/**
 * 创建div 添加react组件
 * @returns root
 */
function createReact(): Root {
     let div: Element
     if (!document.getElementById('APP_ID')) {
          div = document.createElement('div')
          div.setAttribute("id", 'APP_ID');
          document.body.appendChild(div);
     }
     let root = createRoot(document.getElementById('APP_ID') as Element)
     root.render(<Box />)
     return root;
}
/**
 * 添加样式
 */
function createStyle() {
     if (!document.getElementById('STYLE_ID')) {
          let style = document.createElement('style')
          style.setAttribute('id', 'STYLE_ID')
          style.setAttribute('type', "text/css")
          style.innerHTML = styleText
          document.body.appendChild(style)
     }
}
