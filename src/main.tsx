import _antdStyle from 'antd/dist/antd.css';
import "arrive";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import boxStyle from './main.raw.css';
import { Box } from './view/box';
const postcssJs = require('postcss-js')
const postcss = require('postcss')
init()
async function initAntdStyle(): Promise<string> {
     return new Promise<string>((res) => {
          let oldObj = postcssJs.objectify(postcss.parse(_antdStyle))
          let newObj: any = {}
          Object.keys(oldObj).forEach(key => {
               newObj['._main ._box ' + key] = oldObj[key]
          })
          postcss().process(newObj, { parser: postcssJs }).then((result: any) => {
               res(result.css)
          })
     })
}
async function init() {
     let antdStyle: string = await initAntdStyle()
     let root = createReact();
     createStyle('ANTD_STYLE_ID', antdStyle)()
     createStyle('BOX_STYLE_ID', boxStyle)()
     // 监听APP_ID
     document.leave('#APP_ID', {
          fireOnAttributesModification: true,
          onceOnly: false,
          existing: false
     }, () => {
          root.unmount()
          root = createReact()
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
function createStyle(id: string, style: string) {
     if (!document.getElementById(id)) {
          let element = document.createElement('style')
          element.setAttribute('id', id)
          element.setAttribute('type', "text/css")
          element.innerHTML = style
          document.body.appendChild(element)
     }
     return () => {
          document.leave('#' + id, {
               fireOnAttributesModification: true,
               onceOnly: false,
               existing: false
          }, () => {
               createStyle(id, style)
          })
     }
}
