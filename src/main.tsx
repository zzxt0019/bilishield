import _antdStyle from 'antd/dist/antd.css';
import "arrive";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import boxStyle from './main.raw.css';
import { Box } from './view/box';
const postcssJs = require('postcss-js')
const postcss = require('postcss')
let antdStyle: string = ''
init()
async function init() {
     await (async () => {
          let oldObj = postcssJs.objectify(postcss.parse(_antdStyle))
          let newObj: any = {}
          Object.keys(oldObj).forEach(key => {
               newObj['._main ._box ' + key] = oldObj[key]
          })
          postcss().process(newObj, { parser: postcssJs }).then((res: any) => {
               antdStyle = res.css
          })
     })()
     let root = createReact();
     createAntdStyle()
     createBoxStyle()
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
     document.leave('#ANTD_STYLE_ID', {
          fireOnAttributesModification: true,
          onceOnly: false,
          existing: false
     }, () => {
          createAntdStyle()
     })
     // 监听STYLE_ID
     document.leave('#BOX_STYLE_ID', {
          fireOnAttributesModification: true,
          onceOnly: false,
          existing: false
     }, () => {
          createBoxStyle()
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
function createAntdStyle() {
     if (!document.getElementById('ANTD_STYLE_ID')) {
          let style = document.createElement('style')
          style.setAttribute('id', 'ANTD_STYLE_ID')
          style.setAttribute('type', "text/css")
          style.innerHTML = antdStyle
          document.body.appendChild(style)
     }
}
/**
 * 添加样式
 */
function createBoxStyle() {
     if (!document.getElementById('BOX_STYLE_ID')) {
          let style = document.createElement('style')
          style.setAttribute('id', 'BOX_STYLE_ID')
          style.setAttribute('type', "text/css")
          style.innerHTML = boxStyle
          document.body.appendChild(style)
     }
}
