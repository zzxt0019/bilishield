import "arrive";
import React from "react";
import {createRoot, Root} from "react-dom/client";
import {Box} from './view/box';
import * as STATIC from './main-static'
import {displayType} from './main-static'
import antdStyle from 'antd/dist/antd.css';
import boxStyle from './style/main.less';
import displayStyle from './style/display/display.less';
import debugStyle from './style/display/debug.less';
import {readFiles} from "@/test/read-system-file";
import {Page} from '@/config/page/page';

const postcssJs = require('postcss-js')
const postcss = require('postcss')

init()

async function init() {
    let pageMap = readFiles();
    createReact(pageMap)();  // 创建box
    initAntdStyle().then(antdStyle => createStyle(STATIC.ANTD_STYLE_ID, antdStyle, window.document)())  // 读取antd css; 创建样式(监听防消失)
    initBoxStyle().then(boxStyle => createStyle(STATIC.BOX_STYLE_ID, boxStyle, window.document)())  // 读取box css; 创建样式(监听防消失)
    initDisplay().then(data => {
        createDisplayStyle(data, 'display', window.document)()
        iframes({displayStyle: data.display, pageMap: pageMap})
    })
    // 油猴菜单展示/隐藏配置
    GM_registerMenuCommand('配置', () => {
        let main = document.querySelector('.' + STATIC.MAIN_CLASS) as HTMLDivElement
        main.style.setProperty('display', main.style?.getPropertyValue('display') === 'none' ? '' : 'none')
    })
}

/**
 * 创建div 添加react组件
 * @returns root
 */

function createReact(pageMap: Map<string, Page>, root: { root?: Root } = {root: undefined}) {
    if (root.root) {
        root.root.unmount();
    }
    for (const page of pageMap.values()) {
        page.arrive(window);
    }
    let div: Element
    if (!document.getElementById(STATIC.APP_ID)) {
        div = document.createElement('div')
        div.setAttribute("id", STATIC.APP_ID);
        document.body.appendChild(div);
    }
    root.root = createRoot(document.getElementById(STATIC.APP_ID) as Element)
    root.root.render(<Box mainClass={STATIC.MAIN_CLASS} boxClass={STATIC.BOX_CLASS} pageMap={pageMap}/>)
    return () => {
        document.leave('#' + STATIC.APP_ID, {
            fireOnAttributesModification: true,
            onceOnly: false,
            existing: false
        }, function () {
            createReact(pageMap, root);
        })
    };
}


/**
 * 读取antd.css
 * 添加.mainClass .boxClass 防止影响页面其他元素
 */
async function initAntdStyle(): Promise<string> {
    return new Promise<string>((res) => {
        let oldObj = postcssJs.objectify(postcss.parse(antdStyle))
        let newObj: any = {}
        Object.keys(oldObj).forEach(key => {
            newObj['.' + STATIC.MAIN_CLASS + ' .' + STATIC.BOX_CLASS + ' ' + key] = oldObj[key]
        })
        postcss().process(newObj, {parser: postcssJs}).then((result: any) => {
            res(result.css)
        })
    })
}

/**
 * 读取main.css
 * 替换._main ._box 防止与页面其他class重复
 */
async function initBoxStyle(): Promise<string> {
    return new Promise<string>((res) => {
        let oldObj = postcssJs.objectify(postcss.parse(boxStyle))
        let newObj: any = {}
        Object.keys(oldObj).forEach(key => {
            newObj[key.replace('_main', STATIC.MAIN_CLASS).replace('_box', STATIC.BOX_CLASS)] = oldObj[key]
        })
        postcss().process(newObj, {parser: postcssJs}).then((result: any) => {
            res(result.css)
        })
    })
}

/**
 * 创建样式返回监听方法
 * @param id
 * @param style
 * @param document
 */
function createStyle(id: string, style: string, document: Document) {
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
        }, function () {
            createStyle(id, style, document)
        })
    }
}

/**
 * 读取display.css
 * 替换._display 防止页面其他元素重复
 */
async function initDisplay(): Promise<{ display: string, debug: string }> {
    let displayObj = postcssJs.objectify(postcss.parse(displayStyle));
    let newDisplayObj: any = {};
    Object.keys(displayObj).forEach(key => {
        newDisplayObj[key.replace('_display', STATIC.DISPLAY_CLASS)] = displayObj[key];
    })
    let debugObj = postcssJs.objectify(postcss.parse(debugStyle));
    let newDebugObj: any = {};
    Object.keys(debugObj).forEach(key => {
        newDebugObj[key.replace('_display', STATIC.DISPLAY_CLASS)] = debugObj[key];
    })
    return new Promise((res) => {
        Promise.all([
            postcss().process(newDisplayObj, {parser: postcssJs}),
            postcss().process(newDebugObj, {parser: postcssJs}),
        ]).then(result => {
            STATIC.CSS_INNER_HTML.display = result[0].css
            STATIC.CSS_INNER_HTML.debug = result[1].css
            res({display: result[0].css, debug: result[1].css})
        })
    })
}

/**
 * 创建displayStyle
 * 返回监听方法
 * @param data
 * @param type
 * @param document
 */
function createDisplayStyle(data: { display: string, debug: string }, type: displayType, document: Document) {
    if (!document.getElementById(STATIC.DISPLAY_STYLE_ID)) {
        let element = document.createElement('style')
        element.setAttribute('id', STATIC.DISPLAY_STYLE_ID)
        element.setAttribute('type', 'text/css')
        element.setAttribute('displayType', type)
        element.innerHTML = data[type]
        document.body.appendChild(element)
    }
    return () => {
        document.leave('#' + STATIC.DISPLAY_STYLE_ID, {
            fireOnAttributesModification: true,
            onceOnly: false,
            existing: false
        }, function () {
            createDisplayStyle(data, (this.getAttribute('displayType') ?? 'display') as displayType, document)
        })
    }
}

function iframes(data: { displayStyle: string, pageMap: Map<string, Page> }) {
    interface FrameData {
        frame: Window,
        document?: Document,
    }

    let framesData: FrameData[] = [];
    setInterval(() => {
        for (let i = 0; i < window.frames.length; i++) {
            let frame = window.frames[i];
            // 第一次
            if (!framesData[i] || framesData[i].frame !== frame) {
                let frameData: Partial<FrameData> = {};
                framesData[i] = frameData as FrameData;
                frameData.frame = frame;
            }
            // 不跨域且dom改变了
            try {
                if (frame.document && framesData[i].document !== frame.document) {
                    framesData[i].document = frame.document;
                    createDisplayStyle({display: data.displayStyle, debug: ''}, 'display', frame.document)
                    for (const page of data.pageMap.values()) {
                        page.stop()
                        page.start()
                    }
                }
            } catch (ignore) {
            }
        }
    }, 500);
}