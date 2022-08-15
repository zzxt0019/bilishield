import antdStyle from 'antd/dist/antd.css';
import "arrive";
import React from "react";
import {createRoot, Root} from "react-dom/client";
import boxStyle from './main.css';
import {Box} from './view/box';
import {v4 as uuidV4} from "uuid";

const postcssJs = require('postcss-js')
const postcss = require('postcss')
const BOX_CLASS: string = 'b' + uuidV4().replaceAll('-', '')
const MAIN_CLASS: string = 'm' + uuidV4().replaceAll('-', '')
const APP_ID: string = 'a' + uuidV4().replaceAll('-', '')
const BOX_STYLE_ID: string = 'b' + uuidV4().replaceAll('-', '')
const ANTD_STYLE_ID: string = 'b' + uuidV4().replaceAll('-', '')
init()


async function init() {
    let root = createReact();
    initAntdStyle().then(antdStyle => createStyle(ANTD_STYLE_ID, antdStyle)())
    initBoxStyle().then(boxStyle => createStyle(BOX_STYLE_ID, boxStyle)())
    // 监听APP_ID
    document.leave('#' + APP_ID, {
        fireOnAttributesModification: true,
        onceOnly: false,
        existing: false
    }, () => {
        root.unmount()
        root = createReact()
    })
    // 油猴菜单展示/隐藏配置
    GM_registerMenuCommand('配置', () => {
        let main = document.querySelector('.' + MAIN_CLASS) as HTMLDivElement
        main.style.setProperty('display', main.style?.getPropertyValue('display') === 'none' ? '' : 'none')
    })
}

/**
 * 创建div 添加react组件
 * @returns root
 */

function createReact(): Root {
    let div: Element
    if (!document.getElementById(APP_ID)) {
        div = document.createElement('div')
        div.setAttribute("id", APP_ID);
        document.body.appendChild(div);
    }
    let root = createRoot(document.getElementById(APP_ID) as Element)
    root.render(<Box mainClass={MAIN_CLASS} boxClass={BOX_CLASS}/>)
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

async function initAntdStyle(): Promise<string> {
    return new Promise<string>((res) => {
        let oldObj = postcssJs.objectify(postcss.parse(antdStyle))
        let newObj: any = {}
        Object.keys(oldObj).forEach(key => {
            newObj['.' + MAIN_CLASS + ' .' + BOX_CLASS + ' ' + key] = oldObj[key]
        })
        postcss().process(newObj, {parser: postcssJs}).then((result: any) => {
            res(result.css)
        })
    })
}

async function initBoxStyle(): Promise<string> {
    return new Promise<string>((res) => {
        let oldObj = postcssJs.objectify(postcss.parse(boxStyle))
        let newObj: any = {}
        Object.keys(oldObj).forEach(key => {
            newObj[key.replace('_main', MAIN_CLASS).replace('_box', BOX_CLASS)] = oldObj[key]
        })
        postcss().process(newObj, {parser: postcssJs}).then((result: any) => {
            res(result.css)
        })
    })
}
