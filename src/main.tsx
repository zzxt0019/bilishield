import "arrive";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import styleText from './main.raw.css';
import { Box } from "./view/box";
init();
function init() {
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
     // 油猴菜单展示/隐藏配置
     GM_registerMenuCommand('配置', () => {
          let main = document.querySelector('._main') as HTMLDivElement
          main.style.setProperty('display', main.style?.getPropertyValue('display') === 'none' ? '' : 'none')
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
